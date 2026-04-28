// src/services/notification.service.ts
import { deleteToken as firebaseDeleteToken, getToken, onMessage } from 'firebase/messaging';
import { useToast } from 'vue-toastification';
import { getMessagingInstance, isMessagingSupported } from '../config/firebase';
import type { FcmMessagePayload } from '../types/notification.types';
import apiClient from './apiClient';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || 'BFUxGl5lgDKrdGlsCNwKTpW3jjvTsy5I3up_XaBixFb3KB8ZVBTKbKNaBav80gZ-nZLGRyH365sgVFqr-ok4Ab4';

const TOKEN_SENT_KEY = 'fcm_token_sent';
const TOKEN_VALUE_KEY = 'fcm_token_value';

class NotificationService {
  private toast: ReturnType<typeof useToast> | null = null;
  private initialized = false;

  private getToast() {
    if (!this.toast) {
      try {
        this.toast = useToast();
      } catch {
        // Toast may not be available during SSR or early init
        return null;
      }
    }
    return this.toast;
  }

  /**
   * Check whether the current browser supports Firebase Cloud Messaging.
   */
  async isSupported(): Promise<boolean> {
    return isMessagingSupported();
  }

  /**
   * Explicitly request notification permission from the user.
   * Call this from a user action (e.g. a button click) for best UX.
   * Returns true if permission was granted.
   */
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notifications.');
      return false;
    }

    const permission = await Notification.requestPermission();
    console.log(`Notification permission: ${permission}`);
    return permission === 'granted';
  }

  /**
   * Get the current FCM token. Returns null if unavailable.
   */
  async getCurrentToken(): Promise<string | null> {
    const supported = await this.isSupported();
    if (!supported) return null;

    const messaging = await getMessagingInstance();
    if (!messaging) return null;

    try {
      const currentToken = await getToken(messaging, {
        vapidKey: VAPID_KEY !== 'YOUR_PUBLIC_VAPID_KEY_HERE' ? VAPID_KEY : undefined,
      });
      return currentToken || null;
    } catch (err) {
      console.error('An error occurred while retrieving token:', err);
      return null;
    }
  }

  /**
   * Get token and send it to backend (only if it changed or not yet sent).
   */
  async getAndSaveToken(): Promise<string | null> {
    const currentToken = await this.getCurrentToken();

    if (!currentToken) {
      console.warn('No registration token available. Request permission to generate one.');
      return null;
    }

    const previouslySent = localStorage.getItem(TOKEN_VALUE_KEY);
    if (previouslySent === currentToken) {
      console.log('FCM token unchanged, skipping backend update.');
      return currentToken;
    }

    await this.sendTokenToBackend(currentToken);
    localStorage.setItem(TOKEN_VALUE_KEY, currentToken);
    localStorage.setItem(TOKEN_SENT_KEY, 'true');

    return currentToken;
  }

  /**
   * Send token to backend so the server can push to this device.
   */
  async sendTokenToBackend(token: string): Promise<void> {
    try {
      const endpoint = import.meta.env.VITE_FCM_TOKEN_ENDPOINT || '/fcm/token';
      const deviceInfo = this.getDeviceInfo();
      const userId = localStorage.getItem('user_id') || undefined;

      const response = await apiClient.post(endpoint, {
        token,
        userId,
        deviceInfo,
      });
      console.log('Token sent to backend successfully:', response.data);
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 404) {
        console.warn(
          `[Push Notifications] Backend endpoint "${error?.config?.url || '/fcm/token'}" not found (404). ` +
          'Please implement this endpoint on your server to receive FCM tokens. ' +
          'The app will continue to work normally without push notifications.'
        );
      } else if (status === 401) {
        console.warn('[Push Notifications] Unauthorized — token not sent. User may need to re-login.');
      } else {
        console.error('Error sending token to backend:', error?.message || error);
      }
    }
  }

  /**
   * Unregister the current token from the backend.
   * Call this on logout so the server stops sending pushes to this device.
   */
  async unregisterToken(): Promise<void> {
    const token = localStorage.getItem(TOKEN_VALUE_KEY);
    if (!token) return;

    try {
      const endpoint = import.meta.env.VITE_FCM_TOKEN_ENDPOINT || '/fcm/token';
      await apiClient.delete(`${endpoint}?token=${encodeURIComponent(token)}`);
      console.log('Token unregistered from backend successfully.');
    } catch (error) {
      // Non-blocking: backend may not have the endpoint yet
      console.warn('Failed to unregister token from backend:', error);
    } finally {
      await this.deleteToken();
    }
  }

  /**
   * Delete the token client-side and clear local tracking.
   */
  async deleteToken(): Promise<void> {
    const supported = await this.isSupported();
    if (!supported) {
      this.clearLocalTokenState();
      return;
    }

    const messaging = await getMessagingInstance();
    if (!messaging) {
      this.clearLocalTokenState();
      return;
    }

    try {
      await firebaseDeleteToken(messaging);
      console.log('FCM token deleted locally.');
    } catch (err) {
      console.error('Error deleting FCM token:', err);
    } finally {
      this.clearLocalTokenState();
    }
  }

  private clearLocalTokenState(): void {
    localStorage.removeItem(TOKEN_VALUE_KEY);
    localStorage.removeItem(TOKEN_SENT_KEY);
  }

  /**
   * Initialize push notifications safely.
   * - Checks browser support
   * - Handles foreground messages
   * - Requests permission + gets token only if already granted or not yet decided
   * - Prevents duplicate initialization
   */
  async initPushNotifications(): Promise<void> {
    if (this.initialized) {
      console.log('Push notifications already initialized.');
      return;
    }

    const supported = await this.isSupported();
    if (!supported) {
      console.warn('Push notifications are not supported in this browser.');
      return;
    }

    const messaging = await getMessagingInstance();
    if (!messaging) return;

    this.initialized = true;

    // Handle foreground messages
    onMessage(messaging, (payload: FcmMessagePayload) => {
      console.log('Message received in foreground:', payload);

      if (payload.notification) {
        const toast = this.getToast();
        if (toast) {
          const { title, body } = payload.notification;
          toast.info(`${title || 'Notification'}: ${body || ''}`, {
            timeout: 7000,
            closeOnClick: true,
            pauseOnHover: true,
          });
        }
      }
    });

    // If permission already granted → get token
    // If permission not yet decided → we wait for explicit user action (better UX)
    if (Notification.permission === 'granted') {
      await this.getAndSaveToken();
    } else if (Notification.permission === 'default') {
      console.log('Notification permission not yet requested; waiting for explicit user action.');
    } else {
      console.warn('Notification permission denied by user.');
    }
  }

  /**
   * Re-initialize if the user explicitly enables notifications from UI.
   */
  async enableNotifications(): Promise<boolean> {
    const granted = await this.requestPermission();
    if (granted) {
      await this.getAndSaveToken();
      await this.initPushNotifications();
    }
    return granted;
  }

  /**
   * Check whether the user is currently subscribed to push notifications.
   */
  isSubscribed(): boolean {
    return (
      Notification.permission === 'granted' &&
      localStorage.getItem(TOKEN_SENT_KEY) === 'true'
    );
  }

  private getDeviceInfo(): string {
    const ua = navigator.userAgent;
    let browser = 'unknown';
    let os = 'unknown';

    if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Edg')) browser = 'Edge';
    else if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Safari')) browser = 'Safari';

    if (ua.includes('Win')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'MacOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

    return `${browser} on ${os}`;
  }
}

export const notificationService = new NotificationService();
export default notificationService;
