// src/services/notification.service.ts
import { deleteToken as firebaseDeleteToken, getToken, onMessage } from 'firebase/messaging';
import { useToast } from 'vue-toastification';
import { getMessagingInstance, isMessagingSupported } from '../config/firebase';
import type { FcmMessagePayload } from '../types/notification.types';
import {
  notificationLogger,
  retryWithBackoff,
  saveTokenMetadata,
  markTokenSentToBackend,
  isTokenExpired,
  getTokenAge,
  getDeviceInfo,
  onlineDetector,
  notificationDeduplicator,
} from '../utils/notification-utils';
import apiClient from './apiClient';

const VAPID_KEY =
  import.meta.env.VITE_FIREBASE_VAPID_KEY ||
  'BFUxGl5lgDKrdGlsCNwKTpW3jjvTsy5I3up_XaBixFb3KB8ZVBTKbKNaBav80gZ-nZLGRyH365sgVFqr-ok4Ab4';

const TOKEN_SENT_KEY = 'fcm_token_sent';
const TOKEN_VALUE_KEY = 'fcm_token_value';
const INIT_FLAG_KEY = 'fcm_initialized';
const NOTIFICATIONS_ENABLED_KEY = 'notifications_enabled';
const TOKEN_REFRESH_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

class NotificationService {
  private toast: ReturnType<typeof useToast> | null = null;
  private activeToastId: string | number | null = null;
  private foregroundHandlerBound = false;
  private initialized = false;
  private tokenRefreshTimer: ReturnType<typeof setInterval> | null = null;
  private backgroundCheckTimer: ReturnType<typeof setInterval> | null = null;
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

  private dismissActiveToast() {
    const toast = this.getToast();
    if (toast) {
      toast.dismiss();
    }
    if (this.activeToastId !== null) {
      this.activeToastId = null;
    }
  }

  isEnabled(): boolean {
    const stored = localStorage.getItem(NOTIFICATIONS_ENABLED_KEY);
    if (stored === null) {
      return (
        Notification.permission === 'granted' &&
        localStorage.getItem(TOKEN_SENT_KEY) === 'true'
      );
    }
    return stored === 'true';
  }

  private setEnabledState(enabled: boolean) {
    localStorage.setItem(NOTIFICATIONS_ENABLED_KEY, String(enabled));
    this.emit('notifications-toggled', { enabled });
  }

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
      notificationLogger.debug(
        `Emitting event: ${event}`,
        data ? { dataKeys: Object.keys(data) } : undefined
      );
      listeners.forEach((listener) => {
        try {
          listener(data);
        } catch (error) {
          notificationLogger.error(`Error in event listener for ${event}`, {
            error: (error as Error).message,
          });
        }
      });
    }
  }

  async isSupported(): Promise<boolean> {
    return isMessagingSupported();
  }

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
      notificationLogger.error('Error requesting notification permission', {
        error: (error as Error).message,
      });
      return false;
    }
  }

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
        async () =>
          await getToken(messaging, {
            vapidKey: VAPID_KEY !== 'YOUR_PUBLIC_VAPID_KEY_HERE' ? VAPID_KEY : undefined,
          }),
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

  async getAndSaveToken(): Promise<string | null> {
    const currentToken = await this.getCurrentToken();

    if (!currentToken) {
      notificationLogger.warn('No registration token available. Request permission to generate one.');
      return null;
    }

    const previouslySent = localStorage.getItem(TOKEN_VALUE_KEY);
    const wasSuccessfullySent = localStorage.getItem(TOKEN_SENT_KEY) === 'true';

    if (previouslySent === currentToken && wasSuccessfullySent) {
      const tokenAge = getTokenAge();
      if (tokenAge < TOKEN_REFRESH_INTERVAL) {
        notificationLogger.debug('FCM token unchanged and valid', {
          tokenAgeMins: Math.round(tokenAge / 60000),
        });
        return currentToken;
      }

      notificationLogger.info('FCM token needs refresh (expired)', {
        tokenAgeDays: Math.round(tokenAge / (24 * 60 * 60 * 1000)),
      });
    }

    const success = await this.sendTokenToBackend(currentToken);

    if (success) {
      localStorage.setItem(TOKEN_VALUE_KEY, currentToken);
      localStorage.setItem(TOKEN_SENT_KEY, 'true');
      saveTokenMetadata(currentToken, getDeviceInfo().fullInfo);
      markTokenSentToBackend();
      this.emit('token-sent', { token: `${currentToken.substring(0, 20)}...` });
      notificationLogger.info('Token saved to backend successfully');
    } else {
      notificationLogger.warn('Token NOT saved to backend. Will retry on next init.');
    }

    return currentToken;
  }

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
        async () =>
          await apiClient.post(endpoint, {
            token,
            userId,
            deviceInfo: deviceInfo.fullInfo,
          }),
        `Send token to ${endpoint}`,
        { maxRetries: 3, initialDelayMs: 1000 }
      );

      notificationLogger.info('Token sent to backend successfully', {
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
            'Expected payload: { token: string, userId?: string, deviceInfo?: string }'
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

  async unregisterToken(): Promise<void> {
    notificationLogger.info('Unregistering notification token locally');
    await this.deleteToken();
    this.emit('token-unregistered', { method: 'local' });
  }

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

  async initPushNotifications(): Promise<void> {
    if (!this.isEnabled()) {
      notificationLogger.debug('Push notifications disabled by user preference, skipping init');
      return;
    }

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

    if (!this.foregroundHandlerBound) {
      this.foregroundHandlerBound = true;

      onMessage(messaging, (payload: FcmMessagePayload) => {
        this.handleForegroundMessage(payload);
      });

      notificationLogger.debug('Foreground message listener attached');
    }

    this.setupVisibilityChangeListener();
    this.setupOnlineOfflineListeners();

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
    notificationLogger.info('Push notifications initialized successfully');
  }

  private handleForegroundMessage(payload: FcmMessagePayload) {
    try {
      if (!this.isEnabled()) {
        notificationLogger.debug('Foreground message ignored because notifications are disabled');
        return;
      }

      notificationLogger.debug('Foreground message received', {
        messageId: payload.messageId,
        hasNotification: !!payload.notification,
        hasData: !!payload.data,
      });

      const notificationTag = payload.data?.notification_tag || payload.messageId || 'notification';
      if (notificationDeduplicator.isDuplicate(notificationTag)) {
        notificationLogger.debug('Duplicate notification detected, skipping');
        return;
      }
      notificationDeduplicator.markAsShown(notificationTag);

      const notificationType = payload.data?.notification_type || payload.data?.type || '';
      const isProgressUpdate =
        notificationType === 'progress' ||
        notificationType === 'processing-progress' ||
        notificationTag.startsWith('progress-');

      if (payload.notification && document.visibilityState === 'visible' && !isProgressUpdate) {
        const { title, body } = payload.notification;
        const message = `${title || 'Notification'}: ${body || ''}`;

        const toast = this.getToast();
        if (toast) {
          this.dismissActiveToast();
          this.activeToastId = toast.info(message, {
            timeout: 7000,
            closeOnClick: true,
            pauseOnHover: true,
          });
        } else {
          notificationLogger.warn('Toast service not available');
        }
      } else if (isProgressUpdate) {
        notificationLogger.debug('Foreground progress push suppressed', {
          notificationTag,
          notificationType,
        });
      }

      this.emit('message-received-foreground', payload);
    } catch (error) {
      notificationLogger.error('Error handling foreground message', {
        error: (error as Error).message,
      });
    }
  }

  private setupVisibilityChangeListener() {
    if (this.visibilityChangeListener) return;

    this.visibilityChangeListener = () => {
      if (document.visibilityState === 'visible') {
        notificationLogger.debug('App brought to foreground');
        this.emit('app-foreground', {});

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

  private setupOnlineOfflineListeners() {
    const unsubscribe = onlineDetector.subscribe((isOnline) => {
      if (isOnline) {
        notificationLogger.info('App came back online');
        this.emit('app-online', {});

        if (!localStorage.getItem(TOKEN_SENT_KEY) && this.isEnabled()) {
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

    (this as any).onlineDetectorUnsubscribe = unsubscribe;
  }

  async enableNotifications(): Promise<boolean> {
    try {
      const granted = await this.requestPermission();
      if (granted) {
        this.setEnabledState(true);
        notificationLogger.info('User enabled notifications');
        await this.getAndSaveToken();
        await this.initPushNotifications();
        this.emit('notifications-enabled', {});
      }
      return granted;
    } catch (error) {
      notificationLogger.error('Error enabling notifications', {
        error: (error as Error).message,
      });
      return false;
    }
  }

  isSubscribed(): boolean {
    return (
      this.isEnabled() &&
      Notification.permission === 'granted' &&
      localStorage.getItem(TOKEN_SENT_KEY) === 'true'
    );
  }

  async disableNotifications(): Promise<void> {
    this.setEnabledState(false);
    this.dismissActiveToast();
    await this.unregisterToken();
    await this.cleanup();
    this.emit('notifications-disabled', {});
  }

  async cleanup(): Promise<void> {
    notificationLogger.info('Cleaning up push notification service');

    if (this.tokenRefreshTimer) clearInterval(this.tokenRefreshTimer);
    if (this.backgroundCheckTimer) clearInterval(this.backgroundCheckTimer);

    if (this.visibilityChangeListener) {
      document.removeEventListener('visibilitychange', this.visibilityChangeListener);
      this.visibilityChangeListener = null;
    }

    if ((this as any).onlineDetectorUnsubscribe) {
      (this as any).onlineDetectorUnsubscribe();
      (this as any).onlineDetectorUnsubscribe = null;
    }

    this.initialized = false;
    this.foregroundHandlerBound = false;
    localStorage.removeItem(INIT_FLAG_KEY);

    notificationLogger.info('Push notification service cleanup complete');
    this.emit('cleanup-complete', {});
  }
}

export const notificationService = new NotificationService();
export default notificationService;
