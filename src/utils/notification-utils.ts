/**
 * Notification Utilities & Helpers
 * Provides logging, formatting, and helper functions for push notifications
 */

export enum NotificationLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export interface NotificationLogEntry {
  level: NotificationLevel;
  timestamp: string;
  message: string;
  data?: Record<string, any>;
}

// ============================================================================
// LOGGING UTILITIES
// ============================================================================

class NotificationLogger {
  private logs: NotificationLogEntry[] = [];
  private readonly MAX_LOGS = 100;
  private isDebugEnabled = import.meta.env.DEV || localStorage.getItem('DEBUG_NOTIFICATIONS') === 'true';

  private addLog(level: NotificationLevel, message: string, data?: Record<string, any>) {
    const entry: NotificationLogEntry = {
      level,
      timestamp: new Date().toISOString(),
      message,
      data,
    };

    this.logs.push(entry);
    if (this.logs.length > this.MAX_LOGS) {
      this.logs.shift();
    }

    // Console output
    const consoleMethod = this.getConsoleMethod(level);
    const prefix = `[Notifications/${level}]`;
    if (data) {
      console[consoleMethod](prefix, message, data);
    } else {
      console[consoleMethod](prefix, message);
    }
  }

  private getConsoleMethod(level: NotificationLevel): 'log' | 'warn' | 'error' | 'debug' {
    switch (level) {
      case NotificationLevel.DEBUG:
        return 'debug';
      case NotificationLevel.WARN:
        return 'warn';
      case NotificationLevel.ERROR:
        return 'error';
      default:
        return 'log';
    }
  }

  debug(message: string, data?: Record<string, any>) {
    if (this.isDebugEnabled) {
      this.addLog(NotificationLevel.DEBUG, message, data);
    }
  }

  info(message: string, data?: Record<string, any>) {
    this.addLog(NotificationLevel.INFO, message, data);
  }

  warn(message: string, data?: Record<string, any>) {
    this.addLog(NotificationLevel.WARN, message, data);
  }

  error(message: string, data?: Record<string, any>) {
    this.addLog(NotificationLevel.ERROR, message, data);
  }

  getLogs(): NotificationLogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }

  enableDebug() {
    this.isDebugEnabled = true;
    localStorage.setItem('DEBUG_NOTIFICATIONS', 'true');
  }

  disableDebug() {
    this.isDebugEnabled = false;
    localStorage.removeItem('DEBUG_NOTIFICATIONS');
  }
}

export const notificationLogger = new NotificationLogger();

// ============================================================================
// RETRY WITH EXPONENTIAL BACKOFF
// ============================================================================

export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
}

export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  operationName: string,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelayMs = 1000,
    maxDelayMs = 30000,
    backoffMultiplier = 2,
  } = options;

  let lastError: Error | null = null;
  let delay = initialDelayMs;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      notificationLogger.debug(`${operationName} attempt ${attempt + 1}/${maxRetries}`);
      return await operation();
    } catch (error) {
      lastError = error as Error;
      notificationLogger.warn(`${operationName} attempt ${attempt + 1} failed`, {
        error: (error as Error).message,
        willRetry: attempt < maxRetries - 1,
        nextRetryInMs: delay,
      });

      if (attempt < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay = Math.min(delay * backoffMultiplier, maxDelayMs);
      }
    }
  }

  throw lastError;
}

// ============================================================================
// TOKEN MANAGEMENT UTILITIES
// ============================================================================

export interface TokenMetadata {
  token: string;
  createdAt: string;
  sentToBackendAt?: string;
  deviceInfo: string;
  expiry?: string;
}

export function saveTokenMetadata(token: string, deviceInfo: string) {
  const metadata: TokenMetadata = {
    token,
    createdAt: new Date().toISOString(),
    deviceInfo,
  };
  localStorage.setItem('fcm_token_metadata', JSON.stringify(metadata));
  notificationLogger.debug('Token metadata saved');
}

export function getTokenMetadata(): TokenMetadata | null {
  const stored = localStorage.getItem('fcm_token_metadata');
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function markTokenSentToBackend() {
  const metadata = getTokenMetadata();
  if (metadata) {
    metadata.sentToBackendAt = new Date().toISOString();
    localStorage.setItem('fcm_token_metadata', JSON.stringify(metadata));
  }
}

export function isTokenExpired(): boolean {
  const metadata = getTokenMetadata();
  if (!metadata || !metadata.expiry) return false;
  return new Date(metadata.expiry) < new Date();
}

export function getTokenAge(): number {
  const metadata = getTokenMetadata();
  if (!metadata) return 0;
  return Date.now() - new Date(metadata.createdAt).getTime();
}

// ============================================================================
// DEVICE DETECTION
// ============================================================================

export interface DeviceInfo {
  browser: string;
  os: string;
  device: string;
  platform: string;
  fullInfo: string;
}

export function getDeviceInfo(): DeviceInfo {
  const ua = navigator.userAgent;
  let browser = 'Unknown';
  let os = 'Unknown';
  let device = 'Desktop';
  let platform = navigator.platform;

  // Browser detection
  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edg')) browser = 'Edge';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';

  // OS detection
  if (ua.includes('Win')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'MacOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

  // Device type
  if (ua.includes('Mobile') || ua.includes('Android') || ua.includes('iPhone')) {
    device = 'Mobile';
  } else if (ua.includes('Tablet') || ua.includes('iPad')) {
    device = 'Tablet';
  }

  const fullInfo = `${browser} on ${os} (${device})`;

  return { browser, os, device, platform, fullInfo };
}

// ============================================================================
// NOTIFICATION STATE HELPERS
// ============================================================================

export function hasNotificationSupport(): boolean {
  return 'Notification' in window && 'ServiceWorkerContainer' in window;
}

export function getNotificationPermission(): NotificationPermission {
  if (!hasNotificationSupport()) return 'denied';
  return Notification.permission;
}

export function canRequestNotifications(): boolean {
  const permission = getNotificationPermission();
  return permission === 'default' || permission === 'denied';
}

export function isNotificationGranted(): boolean {
  return getNotificationPermission() === 'granted';
}

// ============================================================================
// OFFLINE/ONLINE DETECTION
// ============================================================================

export class OnlineDetector {
  private isOnline = navigator.onLine;
  private listeners: ((isOnline: boolean) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleOnlineChange(true));
      window.addEventListener('offline', () => this.handleOnlineChange(false));
    }
  }

  private handleOnlineChange(online: boolean) {
    if (this.isOnline !== online) {
      this.isOnline = online;
      notificationLogger.info(`Online status changed: ${online ? 'ONLINE' : 'OFFLINE'}`);
      this.listeners.forEach((listener) => listener(online));
    }
  }

  getStatus(): boolean {
    return this.isOnline;
  }

  subscribe(listener: (isOnline: boolean) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
}

export const onlineDetector = new OnlineDetector();

// ============================================================================
// SERVICE WORKER HEALTH CHECK
// ============================================================================

export async function checkServiceWorkerHealth(): Promise<{
  registered: boolean;
  active: boolean;
  controllingClient: boolean;
  error?: string;
}> {
  try {
    if (!('serviceWorker' in navigator)) {
      return {
        registered: false,
        active: false,
        controllingClient: false,
        error: 'Service Workers not supported',
      };
    }

    const registration = await navigator.serviceWorker.getRegistration();
    const controlling = navigator.serviceWorker.controller;

    if (!registration) {
      return {
        registered: false,
        active: false,
        controllingClient: !!controlling,
      };
    }

    const isActive = !!registration.active;

    return {
      registered: true,
      active: isActive,
      controllingClient: !!controlling,
    };
  } catch (error) {
    return {
      registered: false,
      active: false,
      controllingClient: false,
      error: (error as Error).message,
    };
  }
}

// ============================================================================
// NOTIFICATION CHANNEL MANAGEMENT
// ============================================================================

export enum NotificationChannel {
  GENERAL = 'general',
  UPDATES = 'updates',
  ERRORS = 'errors',
  SECURITY = 'security',
  PROGRESS = 'progress',
}

export function getChannelSettings(channel: NotificationChannel) {
  const channels: Record<NotificationChannel, Record<string, any>> = {
    [NotificationChannel.GENERAL]: {
      name: 'General Notifications',
      description: 'General updates and information',
      icon: '/icons-info.svg',
      badge: '/badge-info.svg',
    },
    [NotificationChannel.UPDATES]: {
      name: 'Processing Updates',
      description: 'Document processing status',
      icon: '/icons-update.svg',
      badge: '/badge-update.svg',
    },
    [NotificationChannel.ERRORS]: {
      name: 'Error Alerts',
      description: 'Important errors and warnings',
      icon: '/icons-error.svg',
      badge: '/badge-error.svg',
    },
    [NotificationChannel.SECURITY]: {
      name: 'Security Alerts',
      description: 'Login and security events',
      icon: '/icons-security.svg',
      badge: '/badge-security.svg',
    },
    [NotificationChannel.PROGRESS]: {
      name: 'Progress Notifications',
      description: 'Upload/download progress',
      icon: '/icons-progress.svg',
      badge: '/badge-progress.svg',
    },
  };

  return channels[channel];
}

// ============================================================================
// NOTIFICATION DEDUPLICATION
// ============================================================================

export class NotificationDeduplicator {
  private recentNotifications: Map<string, number> = new Map();
  private readonly DUPLICATE_WINDOW_MS = 5000; // 5 seconds

  isDuplicate(tag: string): boolean {
    const lastTime = this.recentNotifications.get(tag);
    if (!lastTime) return false;

    const timeSinceLastNotification = Date.now() - lastTime;
    return timeSinceLastNotification < this.DUPLICATE_WINDOW_MS;
  }

  markAsShown(tag: string) {
    this.recentNotifications.set(tag, Date.now());

    // Cleanup old entries
    const now = Date.now();
    for (const [key, time] of this.recentNotifications.entries()) {
      if (now - time > this.DUPLICATE_WINDOW_MS * 2) {
        this.recentNotifications.delete(key);
      }
    }
  }

  clear() {
    this.recentNotifications.clear();
  }
}

export const notificationDeduplicator = new NotificationDeduplicator();

// ============================================================================
// EXPORT EVERYTHING
// ============================================================================

export default {
  notificationLogger,
  retryWithBackoff,
  saveTokenMetadata,
  getTokenMetadata,
  markTokenSentToBackend,
  isTokenExpired,
  getTokenAge,
  getDeviceInfo,
  hasNotificationSupport,
  getNotificationPermission,
  canRequestNotifications,
  isNotificationGranted,
  onlineDetector,
  checkServiceWorkerHealth,
  getChannelSettings,
  notificationDeduplicator,
  NotificationLevel,
  NotificationChannel,
};
