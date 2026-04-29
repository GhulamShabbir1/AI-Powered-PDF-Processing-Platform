/**
 * API Request Notification Middleware
 * Provides automatic notifications for API calls:
 * - Loading states
 * - Error notifications
 * - Success notifications
 * - Request categorization
 */

import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { useToast } from 'vue-toastification';
import { notificationLogger } from '../utils/notification-utils';

export enum RequestType {
  UPLOAD = 'upload',
  DOWNLOAD = 'download',
  PROCESSING = 'processing',
  AUTH = 'auth',
  SYNC = 'sync',
  OTHER = 'other',
}

export interface NotificationConfig {
  showLoading?: boolean;
  showSuccess?: boolean;
  showError?: boolean;
  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
  requestType?: RequestType;
  timeout?: number;
}

// Default config per request type
const DEFAULT_CONFIGS: Record<RequestType, NotificationConfig> = {
  [RequestType.UPLOAD]: {
    showLoading: false, // Upload has its own progress tracking
    showSuccess: false,
    showError: true,
    errorMessage: 'Upload failed',
  },
  [RequestType.DOWNLOAD]: {
    showLoading: false,
    showSuccess: false,
    showError: true,
    errorMessage: 'Download failed',
  },
  [RequestType.PROCESSING]: {
    showLoading: false, // Processing has its own status tracking
    showSuccess: false,
    showError: true,
    errorMessage: 'Processing failed',
  },
  [RequestType.AUTH]: {
    showLoading: false, // Auth is quick
    showSuccess: false,
    showError: true,
    errorMessage: 'Authentication failed',
  },
  [RequestType.SYNC]: {
    showLoading: false,
    showSuccess: false,
    showError: true,
    errorMessage: 'Sync failed',
  },
  [RequestType.OTHER]: {
    showLoading: false,
    showSuccess: false,
    showError: true,
    errorMessage: 'Request failed',
  },
};

interface RequestMetadata {
  url: string;
  method: string;
  type: RequestType;
  config: NotificationConfig;
  startTime: number;
  toastId?: string;
}

let toast: ReturnType<typeof useToast> | null = null;

function getToast() {
  if (!toast) {
    try {
      toast = useToast();
    } catch {
      return null;
    }
  }
  return toast;
}

/**
 * Categorize API endpoint into a request type
 */
function categorizeRequest(url: string, method: string): RequestType {
  const urlLower = url.toLowerCase();

  if (urlLower.includes('/upload') || urlLower.includes('/file/upload')) {
    return RequestType.UPLOAD;
  }
  if (urlLower.includes('/download') || urlLower.includes('/file/download')) {
    return RequestType.DOWNLOAD;
  }
  if (urlLower.includes('/service/') || urlLower.includes('/process')) {
    return RequestType.PROCESSING;
  }
  if (urlLower.includes('/auth/') || urlLower.includes('/login') || urlLower.includes('/register')) {
    return RequestType.AUTH;
  }
  if (urlLower.includes('/sync') || urlLower.includes('/fetch')) {
    return RequestType.SYNC;
  }

  return RequestType.OTHER;
}

/**
 * Extract notification config from request
 */
function getNotificationConfig(config: AxiosRequestConfig): NotificationConfig {
  // Check if custom config is attached
  const customConfig = (config as any).notificationConfig as NotificationConfig | undefined;

  if (customConfig) {
    return {
      ...DEFAULT_CONFIGS[RequestType.OTHER],
      ...customConfig,
    };
  }

  // Auto-categorize based on URL and method
  const requestType = categorizeRequest(config.url || '', config.method || 'GET');
  return DEFAULT_CONFIGS[requestType];
}

/**
 * Request interceptor - Add loading notifications
 */
export function setupRequestInterceptor(apiClient: any) {
  apiClient.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      const notificationConfig = getNotificationConfig(config);
      const requestType = categorizeRequest(config.url || '', config.method || 'GET');

      // Store metadata for response handler
      const metadata: RequestMetadata = {
        url: config.url || '',
        method: config.method || 'GET',
        type: requestType,
        config: notificationConfig,
        startTime: Date.now(),
      };

      (config as any)._notificationMetadata = metadata;

      // Show loading notification if configured
      if (notificationConfig.showLoading) {
        const toastService = getToast();
        if (toastService) {
          const loadingMsg = notificationConfig.loadingMessage || `${config.method} ${config.url}...`;
          const toastId = toastService.info(loadingMsg, {
            timeout: false,
            closeButton: false,
          });
          metadata.toastId = toastId;
          notificationLogger.debug('Request loading notification shown', {
            url: config.url,
            message: loadingMsg,
          });
        }
      }

      notificationLogger.debug(`API Request: ${config.method} ${config.url}`);
      return config;
    },
    (error) => {
      notificationLogger.error('Request interceptor error', { error: error.message });
      return Promise.reject(error);
    }
  );
}

/**
 * Response interceptor - Add success/error notifications
 */
export function setupResponseInterceptor(apiClient: any) {
  apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
      const metadata = (response.config as any)._notificationMetadata as RequestMetadata | undefined;

      if (metadata) {
        const duration = Date.now() - metadata.startTime;

        // Clear loading toast
        if (metadata.toastId) {
          const toastService = getToast();
          if (toastService) {
            toastService.dismiss(metadata.toastId);
          }
        }

        // Show success notification if configured
        if (metadata.config.showSuccess) {
          const toastService = getToast();
          if (toastService) {
            const successMsg = metadata.config.successMessage || `${metadata.method} successful`;
            toastService.success(successMsg, {
              timeout: 3000,
            });
          }
        }

        notificationLogger.debug(`API Response: ${metadata.method} ${metadata.url}`, {
          status: response.status,
          durationMs: duration,
        });
      }

      return response;
    },
    (error: AxiosError) => {
      const metadata = (error.config as any)?._notificationMetadata as RequestMetadata | undefined;

      if (metadata) {
        const duration = Date.now() - metadata.startTime;

        // Clear loading toast
        if (metadata.toastId) {
          const toastService = getToast();
          if (toastService) {
            toastService.dismiss(metadata.toastId);
          }
        }

        // Show error notification if configured
        if (metadata.config.showError) {
          const toastService = getToast();
          if (toastService) {
            const status = error.response?.status || 'unknown';
            const errorMsg =
              metadata.config.errorMessage ||
              `${metadata.method} failed (${status})`;

            toastService.error(errorMsg, {
              timeout: 5000,
            });
          }
        }

        notificationLogger.warn(`API Error: ${metadata.method} ${metadata.url}`, {
          status: error.response?.status,
          durationMs: duration,
          message: error.message,
        });
      }

      return Promise.reject(error);
    }
  );
}

/**
 * Helper to attach custom notification config to a request
 * Usage: apiClient.get('/endpoint', { notificationConfig: { showSuccess: true } })
 */
export function withNotificationConfig(
  config: AxiosRequestConfig,
  notificationConfig: NotificationConfig
): AxiosRequestConfig {
  (config as any).notificationConfig = notificationConfig;
  return config;
}

/**
 * Install notification middleware into API client
 */
export function installNotificationMiddleware(apiClient: any) {
  notificationLogger.info('Installing notification middleware into API client');
  setupRequestInterceptor(apiClient);
  setupResponseInterceptor(apiClient);
}

export default {
  RequestType,
  setupRequestInterceptor,
  setupResponseInterceptor,
  withNotificationConfig,
  installNotificationMiddleware,
  DEFAULT_CONFIGS,
};
