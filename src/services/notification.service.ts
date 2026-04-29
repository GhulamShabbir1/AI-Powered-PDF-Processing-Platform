// src/services/notification.service.ts
import { deleteToken as firebaseDeleteToken, getToken, onMessage } from 'firebase/messaging';
import { useToast } from 'vue-toastification';
import { getMessagingInstance, isMessagingSupported } from '../config/firebase';
import type { FcmMessagePayload } from '../types/notification.types';
import apiClient from './apiClient';
import {
  notificationLogger,
  retryWithBackoff,
  saveTokenMetadata,
  getTokenMetadata,
  markTokenSentToBackend,
  isTokenExpired,
  getTokenAge,
  getDeviceInfo,
  onlineDetector,
  notificationDeduplicator,
} from '../utils/notification-utils';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || 'BFUxGl5lgDKrdGlsCNwKTpW3jjvTsy5I3up_XaBixFb3KB8ZVBTKbKNaBav80gZ-nZLGRyH365sgVFqr-ok4Ab4';

const TOKEN_SENT_KEY = 'fcm_token_sent';
const TOKEN_VALUE_KEY = 'fcm_token_value';
const INIT_FLAG_KEY = 'fcm_initialized';
const TOKEN_REFRESH_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
const BACKGROUND_FOCUS_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

class NotificationService {
  private toast: ReturnType<typeof useToast> | null = null;
  private foregroundHandlerBound = false;
  private initialized = false;
  private tokenRefreshTimer: NodeJS.Timeout | null = null;
  private backgroundCheckTimer: NodeJS.Timeout | null = null;
  private visibilityChangeListener: (() => void) | null = null;
  private eventListeners: Map<string, Set<(data: any) => void>> = new Map();

  private getToast() {
    if (!this.toast) {
      try {
        this.toast = useToast();
      } catch {
        return null;
      }
    }
    return this.toast;
  }

  /**
   * Event system for notification lifecycle
   */
  on(event: string, listener: (data: any) => void): () => void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(listener);
    notificationLogger.debug(`Listener added for event: ${event}`);

    return () => {
      this.eventListeners.get(event)?.delete(listener);
    };
  }

  private emit(event: string, data?: any) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      notificationLogger.debug(`Emitting event: ${event}`, data ? { dataKeys: Object.keys(data) } : undefined);
      listeners.forEach((listener) => {
        try {
          listener(data);
        } catch (error) {
          notificationLogger.error(`Error in event listener for ${event}`, { error: (error as Error).message });
        }
      });
    }
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
      notificationLogger.warn('Notifications not supported in this browser');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      notificationLogger.info(`Notification permission requested: ${permission}`);
      this.emit('permission-changed', { permission });
      return permission === 'granted';
    } catch (error) {
      notificationLogger.error('Error requesting notification permission', { error: (error as Error).message });
      return false;
    }
  }

  /**
   * Get the current FCM token. Returns null if unavailable.
   * Retries with exponential backoff on failure.
   */
  async getCurrentToken(): Promise<string | null> {
    const supported = await this.isSupported();
    if (!supported) {
      notificationLogger.debug('Messaging not supported, token retrieval skipped');
      return null;
    }

    const messaging = await getMessagingInstance();
    if (!messaging) {
      notificationLogger.warn('Could not get messaging instance');
      return null;
    }

    try {
      const currentToken = await retryWithBackoff(
        async () => {
          return await getToken(messaging, {
            vapidKey: VAPID_KEY !== 'YOUR_PUBLIC_VAPID_KEY_HERE' ? VAPID_KEY : undefined,
          });
        },
        'Get FCM Token',
        { maxRetries: 3, initialDelayMs: 500 }
      );

      if (!currentToken) {
        notificationLogger.warn('FCM returned empty token');
        return null;
      }

      notificationLogger.debug('FCM token retrieved successfully', {
        tokenLength: currentToken.length,
        tokenAge: getTokenAge(),
      });

      return currentToken;
    } catch (error) {
      notificationLogger.error('Failed to get FCM token after retries', {
        error: (error as Error).message,
      });
      return null;
    }
  }

  /**
   * Get token and send it to backend (only if it changed or not yet sent).
   * Only marks as "sent" if the backend actually succeeds.
   * Retries on failure with exponential backoff.
   */
  async getAndSaveToken(): Promise<string | null> {
    const currentToken = await this.getCurrentToken();

    if (!currentToken) {
      notificationLogger.warn('No registration token available. Request permission to generate one.');
      return null;
    }

    const previouslySent = localStorage.getItem(TOKEN_VALUE_KEY);
    const wasSuccessfullySent = localStorage.getItem(TOKEN_SENT_KEY) === 'true';

    // Check if token is still valid (hasn't expired)
    if (previouslySent === currentToken && wasSuccessfullySent) {
      const tokenAge = getTokenAge();
      if (tokenAge < TOKEN_REFRESH_INTERVAL) {
        notificationLogger.debug('FCM token unchanged and valid', { tokenAgeMins: Math.round(tokenAge / 60000) });
        return currentToken;
      } else {
        notificationLogger.info('FCM token needs refresh (expired)', { tokenAgeDays: Math.round(tokenAge / (24 * 60 * 60 * 1000)) });
      }
    }

    const success = await this.sendTokenToBackend(currentToken);

    if (success) {
      localStorage.setItem(TOKEN_VALUE_KEY, currentToken);
      localStorage.setItem(TOKEN_SENT_KEY, 'true');
      saveTokenMetadata(currentToken, getDeviceInfo().fullInfo);
      markTokenSentToBackend();
      this.emit('token-sent', { token: currentToken.substring(0, 20) + '...' });
      notificationLogger.info('Token saved to backend successfully');
    } else {
      notificationLogger.warn('Token NOT saved to backend. Will retry on next init.');
    }

    return currentToken;
  }

  /**
   * Send token to backend so the server can push to this device.
   * Returns true if the backend confirmed receipt (2xx), false otherwise.
   * Retries on network failures but not on client/auth errors.
   */
  async sendTokenToBackend(token: string): Promise<boolean> {
    const endpoint = import.meta.env.VITE_FCM_TOKEN_ENDPOINT || '/fcm/token';

    try {
      const deviceInfo = getDeviceInfo();
      const userId = localStorage.getItem('user_id') || undefined;

      notificationLogger.debug('Sending FCM token to backend', {
        endpoint,
        hasUserId: !!userId,
        device: deviceInfo.device,
        browser: deviceInfo.browser,
      });

      const response = await retryWithBackoff(
        async () => {
          return await apiClient.post(endpoint, {
            token,
            userId,
            deviceInfo: deviceInfo.fullInfo,
          });
        },
        `Send token to ${endpoint}`,
        { maxRetries: 3, initialDelayMs: 1000 }
      );

      notificationLogger.info('✅ Token sent to backend successfully', {
        status: response.status,
        endpoint,
      });

      this.emit('token-backend-success', { endpoint });
      return true;
    } catch (error: any) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message || (error as Error).message;
      const url = error?.config?.url || endpoint;

      notificationLogger.error('Failed to send token to backend', {
        status,
        url,
        message,
        errorType: error?.code,
      });

      if (status === 404) {
        notificationLogger.warn(
          `Backend endpoint not found. Implement POST ${url} on your server. ` +
          `Expected payload: { token: string, userId?: string, deviceInfo?: string }`
        );
      } else if (status === 401) {
        notificationLogger.warn('Unauthorized sending token. User may need to re-login.');
      } else if (status >= 500) {
        notificationLogger.warn('Backend server error. Will retry on next page load.');
      }

      this.emit('token-backend-failed', { status, endpoint, message });
      return false;
    }
  }

  /**
   * Unregister the current token from the backend on logout.
   * Tries DELETE first, falls back to POST if not supported.
   */
  async unregisterToken(): Promise<void> {
    const token = localStorage.getItem(TOKEN_VALUE_KEY);
    if (!token) {
      notificationLogger.debug('No token to unregister');
      return;
    }

    const endpoint = import.meta.env.VITE_FCM_TOKEN_ENDPOINT || '/fcm/token';
    let unregistered = false;

    try {
      // Try DELETE first
      await apiClient.delete(`${endpoint}?token=${encodeURIComponent(token)}`);
      notificationLogger.info('✅ Token unregistered via DELETE');
      unregistered = true;
      this.emit('token-unregistered', { method: 'DELETE' });
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 405) {
        notificationLogger.debug('DELETE not supported, trying POST fallback...');

        try {
          await apiClient.post(`${endpoint}/unregister`, { token });
          notificationLogger.info('✅ Token unregistered via POST fallback');
          unregistered = true;
          this.emit('token-unregistered', { method: 'POST' });
        } catch (fallbackError: any) {
          notificationLogger.warn('POST fallback also failed', {
            status: fallbackError?.response?.status,
          });
        }
      } else if (status === 404) {
        notificationLogger.warn(`Unregister endpoint not found. Token deleted locally only.`);
      } else {
        notificationLogger.warn('Error unregistering token', {
          status,
          error: (error as Error).message,
        });
      }
    }

    // Always clean up locally
    await this.deleteToken();
  }

  /**
   * Delete the token client-side and clear local tracking.
   */
  async deleteToken(): Promise<void> {
    const supported = await this.isSupported();
    if (!supported) {
      this.clearLocalTokenState();
      notificationLogger.debug('Token cleared locally (no support)');
      return;
    }

    const messaging = await getMessagingInstance();
    if (!messaging) {
      this.clearLocalTokenState();
      notificationLogger.debug('Token cleared locally (no messaging instance)');
      return;
    }

    try {
      await firebaseDeleteToken(messaging);
      notificationLogger.info('FCM token deleted from Firebase');
    } catch (error) {
      notificationLogger.error('Error deleting FCM token from Firebase', {
        error: (error as Error).message,
      });
    } finally {
      this.clearLocalTokenState();
    }
  }

  private clearLocalTokenState(): void {
    localStorage.removeItem(TOKEN_VALUE_KEY);
    localStorage.removeItem(TOKEN_SENT_KEY);
    localStorage.removeItem('fcm_token_metadata');
    this.emit('token-cleared', {});
  }

  /**
   * Initialize push notifications safely.
   * - Checks browser support
   * - Sets up foreground message listener (only once)
   * - Gets/saves token if permission granted
   * - Handles token refresh on visibility change
   * - Prevents duplicate initialization
   */
  async initPushNotifications(): Promise<void> {
    // Prevent duplicate initialization
    if (this.initialized) {
      notificationLogger.debug('Push notifications already initialized, skipping');
      return;
    }

    notificationLogger.info('Initializing push notifications...');

    const supported = await this.isSupported();
    if (!supported) {
      notificationLogger.warn('Push notifications not supported in this browser');
      this.emit('init-failed', { reason: 'browser-not-supported' });
      return;
    }

    const messaging = await getMessagingInstance();
    if (!messaging) {
      notificationLogger.warn('Failed to get messaging instance');
      this.emit('init-failed', { reason: 'no-messaging-instance' });
      return;
    }

    // Set up foreground message listener (only once)
    if (!this.foregroundHandlerBound) {
      this.foregroundHandlerBound = true;

      onMessage(messaging, (payload: FcmMessagePayload) => {
        this.handleForegroundMessage(payload);
      });

      notificationLogger.debug('Foreground message listener attached');
    }

    // Set up visibility change listener for token refresh
    this.setupVisibilityChangeListener();

    // Set up online/offline listeners
    this.setupOnlineOfflineListeners();

    // Get and save token if permission already granted
    if (Notification.permission === 'granted') {
      notificationLogger.debug('Permission already granted, getting token...');
      await this.getAndSaveToken();
    } else if (Notification.permission === 'default') {
      notificationLogger.debug('Notification permission not yet requested, waiting for user action');
    } else {
      notificationLogger.warn('Notification permission denied by user');
    }

    this.initialized = true;
    localStorage.setItem(INIT_FLAG_KEY, 'true');
    this.emit('init-success', {});
    notificationLogger.info('✅ Push notifications initialized successfully');
  }

  /**
   * Handle foreground message received from FCM.
   */
  private handleForegroundMessage(payload: FcmMessagePayload) {
    try {
      notificationLogger.debug('Foreground message received', {
        messageId: payload.messageId,
        hasNotification: !!payload.notification,
        hasData: !!payload.data,
      });

      // Check for duplicates
      const notificationTag = payload.data?.notification_tag || payload.messageId || 'notification';
      if (notificationDeduplicator.isDuplicate(notificationTag)) {
        notificationLogger.debug('Duplicate notification detected, skipping');
        return;
      }
      notificationDeduplicator.markAsShown(notificationTag);

      if (payload.notification) {
        const { title, body } = payload.notification;
        const message = `${title || 'Notification'}: ${body || ''}`;

        const toast = this.getToast();
        if (toast) {
          toast.info(message, {
            timeout: 7000,
            closeOnClick: true,
            pauseOnHover: true,
          });
        } else {
          notificationLogger.warn('Toast service not available');
        }
      }

      this.emit('message-received-foreground', payload);
    } catch (error) {
      notificationLogger.error('Error handling foreground message', {
        error: (error as Error).message,
      });
    }
  }

  /**
   * Set up listener for visibility change to refresh token when app comes to foreground.
   */
  private setupVisibilityChangeListener() {
    if (this.visibilityChangeListener) return;

    this.visibilityChangeListener = () => {
      if (document.visibilityState === 'visible') {
        notificationLogger.debug('App brought to foreground');
        this.emit('app-foreground', {});

        // Check if token needs refresh
        if (isTokenExpired()) {
          notificationLogger.info('Token expired, refreshing...');
          this.getAndSaveToken().catch((error) => {
            notificationLogger.error('Token refresh failed', { error: (error as Error).message });
          });
        }
      } else {
        notificationLogger.debug('App sent to background');
        this.emit('app-background', {});
      }
    };

    document.addEventListener('visibilitychange', this.visibilityChangeListener);
    notificationLogger.debug('Visibility change listener attached');
  }

  /**
   * Set up listeners for online/offline status changes.
   */
  private setupOnlineOfflineListeners() {
    const unsubscribe = onlineDetector.subscribe((isOnline) => {
      if (isOnline) {
        notificationLogger.info('App came back online');
        this.emit('app-online', {});

        // Retry token send if it failed before
        if (!localStorage.getItem(TOKEN_SENT_KEY)) {
          notificationLogger.debug('Retrying token send after coming online...');
          this.getAndSaveToken().catch((error) => {
            notificationLogger.error('Token send failed after online', { error: (error as Error).message });
          });
        }
      } else {
        notificationLogger.warn('App went offline');
        this.emit('app-offline', {});
      }
    });

    // Store unsubscribe function for cleanup
    (this as any).onlineDetectorUnsubscribe = unsubscribe;
  }

  /**
   * Re-initialize if the user explicitly enables notifications from UI.
   */
  async enableNotifications(): Promise<boolean> {
    try {
      const granted = await this.requestPermission();
      if (granted) {
        notificationLogger.info('User enabled notifications');
        await this.getAndSaveToken();
        await this.initPushNotifications();
        this.emit('notifications-enabled', {});
      }
      return granted;
    } catch (error) {
      notificationLogger.error('Error enabling notifications', { error: (error as Error).message });
      return false;
    }
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

  /**
   * Cleanup: call on logout or app destruction.
   */
  async cleanup(): Promise<void> {
    notificationLogger.info('Cleaning up push notification service');

    // Clear timers
    if (this.tokenRefreshTimer) clearInterval(this.tokenRefreshTimer);
    if (this.backgroundCheckTimer) clearInterval(this.backgroundCheckTimer);

    // Remove listeners
    if (this.visibilityChangeListener) {
      document.removeEventListener('visibilitychange', this.visibilityChangeListener);
    }

    // Unsubscribe from online detector
    if ((this as any).onlineDetectorUnsubscribe) {
      (this as any).onlineDetectorUnsubscribe();
    }

    // Mark as not initialized
    this.initialized = false;
    this.foregroundHandlerBound = false;
    localStorage.removeItem(INIT_FLAG_KEY);

    notificationLogger.info('Push notification service cleanup complete');
    this.emit('cleanup-complete', {});
  }

  private getDeviceInfo_OLD(): string {
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
