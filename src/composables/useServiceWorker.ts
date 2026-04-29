/**
 * Service Worker Registration & Management Composable
 * Handles SW registration, updates, and client-SW communication
 */

import { onMounted, ref, onUnmounted } from 'vue';
import { notificationLogger } from '../utils/notification-utils';

const isServiceWorkerSupported = () => 'serviceWorker' in navigator;

let registration: ServiceWorkerRegistration | null = null;

export function useServiceWorker() {
  const isRegistered = ref(false);
  const hasUpdate = ref(false);
  const error = ref<string | null>(null);

  async function register() {
    if (!isServiceWorkerSupported()) {
      notificationLogger.warn('Service Worker not supported');
      return;
    }

    try {
      notificationLogger.info('Registering Service Worker...');

      registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
        scope: '/',
      });

      notificationLogger.info('✅ Service Worker registered successfully', {
        scope: registration.scope,
        active: !!registration.active,
        installing: !!registration.installing,
      });

      isRegistered.value = true;

      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration?.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              notificationLogger.info('New Service Worker available');
              hasUpdate.value = true;
            }
          });
        }
      });

      // Periodic update check every hour
      setInterval(() => {
        registration?.update().catch((err) => {
          notificationLogger.warn('SW update check failed', { error: err.message });
        });
      }, 60 * 60 * 1000);

      return true;
    } catch (err) {
      const errorMsg = (err as Error).message;
      notificationLogger.error('Service Worker registration failed', { error: errorMsg });
      error.value = errorMsg;
      isRegistered.value = false;
      return false;
    }
  }

  async function unregister() {
    if (!registration) return;

    try {
      const success = await registration.unregister();
      if (success) {
        notificationLogger.info('Service Worker unregistered');
        isRegistered.value = false;
      }
    } catch (err) {
      notificationLogger.error('Failed to unregister Service Worker', {
        error: (err as Error).message,
      });
    }
  }

  async function updateServiceWorker() {
    if (!registration) return;

    try {
      await registration.update();
      notificationLogger.info('Service Worker update check performed');
    } catch (err) {
      notificationLogger.error('SW update failed', { error: (err as Error).message });
    }
  }

  async function skipWaiting() {
    const worker = registration?.waiting;
    if (worker) {
      worker.postMessage({ type: 'SKIP_WAITING' });
      notificationLogger.info('Skip waiting requested');
    }
  }

  async function ping(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!navigator.serviceWorker.controller) {
        resolve(false);
        return;
      }

      const channel = new MessageChannel();
      const timeout = setTimeout(() => {
        resolve(false);
      }, 5000);

      channel.port1.onmessage = (event) => {
        clearTimeout(timeout);
        notificationLogger.debug('SW ping response received', event.data);
        resolve(event.data.swReady === true);
      };

      navigator.serviceWorker.controller.postMessage(
        { type: 'PING' },
        [channel.port2]
      );
    });
  }

  onMounted(() => {
    register();
  });

  onUnmounted(() => {
    // Don't unregister on unmount - keep SW active
  });

  return {
    isRegistered,
    hasUpdate,
    error,
    register,
    unregister,
    updateServiceWorker,
    skipWaiting,
    ping,
  };
}

export default useServiceWorker;
