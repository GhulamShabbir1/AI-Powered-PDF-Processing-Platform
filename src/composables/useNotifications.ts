// src/composables/useNotifications.ts
import { computed, onMounted, ref } from 'vue';
import { notificationService } from '../services/notification.service';
import type { NotificationState } from '../types/notification.types';

const state = ref<NotificationState>({
  isSupported: true,
  permission: 'default',
  isSubscribed: false,
  hasSentTokenToBackend: false,
});

function refreshState() {
  state.value.permission = Notification.permission;
  state.value.isSubscribed = notificationService.isSubscribed();
  state.value.hasSentTokenToBackend = localStorage.getItem('fcm_token_sent') === 'true';
}

export function useNotifications() {
  onMounted(async () => {
    state.value.isSupported = await notificationService.isSupported();
    refreshState();
  });

  const isSupported = computed(() => state.value.isSupported);
  const permission = computed(() => state.value.permission);
  const isSubscribed = computed(() => state.value.isSubscribed);
  const hasSentToken = computed(() => state.value.hasSentTokenToBackend);

  const canSubscribe = computed(() => {
    return state.value.isSupported && state.value.permission !== 'denied';
  });

  async function requestPermission(): Promise<boolean> {
    const granted = await notificationService.requestPermission();
    refreshState();
    return granted;
  }

  async function enableNotifications(): Promise<boolean> {
    const granted = await notificationService.enableNotifications();
    refreshState();
    return granted;
  }

  async function unregister(): Promise<void> {
    await notificationService.unregisterToken();
    refreshState();
  }

  return {
    isSupported,
    permission,
    isSubscribed,
    hasSentToken,
    canSubscribe,
    requestPermission,
    enableNotifications,
    unregister,
    refreshState,
  };
}

export default useNotifications;

