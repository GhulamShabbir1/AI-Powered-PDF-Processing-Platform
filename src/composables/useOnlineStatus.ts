/**
 * Offline/Online State Management Composable
 * Tracks network connectivity and provides real-time status
 */

import { computed, onMounted, ref, onUnmounted } from 'vue';
import { onlineDetector } from '../utils/notification-utils';

let unsubscribe: (() => void) | null = null;

export function useOnlineStatus() {
  const status = ref<'online' | 'offline'>(navigator.onLine ? 'online' : 'offline');

  const isOnline = computed(() => status.value === 'online');
  const isOffline = computed(() => status.value === 'offline');

  onMounted(() => {
    // Subscribe to online detector
    unsubscribe = onlineDetector.subscribe((online) => {
      status.value = online ? 'online' : 'offline';
    });

    // Also set up direct listeners as backup
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
  });

  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe();
    }
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  });

  function handleOnline() {
    status.value = 'online';
  }

  function handleOffline() {
    status.value = 'offline';
  }

  return {
    status,
    isOnline,
    isOffline,
  };
}

export default useOnlineStatus;
