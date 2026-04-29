/**
 * Represents the data structure inside an FCM message payload.
 */
export interface FcmNotificationPayload {
  title?: string;
  body?: string;
  icon?: string;
  image?: string;
  click_action?: string;
  [key: string]: any;
}

/**
 * Represents the standard FCM message payload.
 */
export interface FcmMessagePayload {
  notification?: FcmNotificationPayload;
  data?: Record<string, string>;
  from?: string;
  collapseKey?: string;
  messageId?: string;
}

/**
 * Represents the backend payload when saving an FCM token.
 */
export interface SaveFcmTokenPayload {
  token: string;
  userId?: string;
  deviceInfo?: string;
}

/**
 * Reactive state shape for the useNotifications composable.
 */
export interface NotificationState {
  isSupported: boolean;
  permission: NotificationPermission | 'default' | 'denied' | 'granted';
  isSubscribed: boolean;
  hasSentTokenToBackend: boolean;
}

/**
 * Shape returned by the notification service.
 */
export interface NotificationServiceInterface {
  requestPermission: () => Promise<boolean>;
  getAndSaveToken: () => Promise<string | null>;
  sendTokenToBackend: (token: string) => Promise<void>;
  unregisterToken: () => Promise<void>;
  deleteToken: () => Promise<void>;
  initPushNotifications: () => Promise<void>;
  isSupported: () => boolean;
  getCurrentToken: () => Promise<string | null>;
}

/**
 * Client-side notification types (foreground operations)
 */
export type NotificationPermission = 'default' | 'granted' | 'denied';

export interface ClientNotificationOptions {
  tag?: string;
  requireInteraction?: boolean;
  icon?: string;
  image?: string;
  actions?: Array<{ action: string; title: string }>;
}

