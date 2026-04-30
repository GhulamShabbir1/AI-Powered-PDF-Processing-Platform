<template>
  <v-app>
    <DefaultLayout v-if="isDefaultLayout" class="app-shell">
      <router-view />
    </DefaultLayout>
    <DashboardLayout v-else-if="isDashboardLayout" class="app-shell">
      <router-view />
    </DashboardLayout>
    <div v-else class="app-shell">
      <router-view />
    </div>
  </v-app>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import useServiceWorker from './composables/useServiceWorker'
import DashboardLayout from './layouts/DashboardLayout.vue'
import DefaultLayout from './layouts/DefaultLayout.vue'
import notificationService from './services/notification.service'
import { useAuthStore } from './stores/auth.store'
import { checkServiceWorkerHealth, notificationLogger } from './utils/notification-utils'

const route = useRoute()
const authStore = useAuthStore()
const { isRegistered, ping } = useServiceWorker()
const unsubscribers: Array<() => void> = []

const isDefaultLayout = computed(() => route.meta.layout === 'default')
const isDashboardLayout = computed(() => route.meta.layout === 'dashboard')

onMounted(async () => {
  notificationLogger.info('App mounted - initializing notification system')

  if (!window.isSecureContext) {
    notificationLogger.warn(
      'Notifications disabled: Running in an insecure context (HTTP). Notifications require HTTPS or localhost.'
    )
    return
  }

  if (unsubscribers.length === 0) {
    unsubscribers.push(
      notificationService.on('init-success', () => {
        notificationLogger.info('Notification service initialized successfully')
      }),
      notificationService.on('init-failed', (data) => {
        notificationLogger.warn('Notification initialization failed', data)
      }),
      notificationService.on('token-sent', (data) => {
        notificationLogger.info('FCM token sent to backend', data)
      }),
      notificationService.on('token-backend-failed', (data) => {
        notificationLogger.warn('FCM token backend send failed', data)
      }),
      notificationService.on('app-online', () => {
        notificationLogger.info('App came online - will retry failed operations')
      }),
      notificationService.on('app-offline', () => {
        notificationLogger.warn('App went offline')
      }),
      notificationService.on('message-received-foreground', (payload) => {
        notificationLogger.debug('Foreground message received', {
          title: payload.notification?.title,
          hasData: !!payload.data,
        })
      })
    )
  }

  await new Promise((resolve) => setTimeout(resolve, 500))

  try {
    const swHealth = await checkServiceWorkerHealth()
    notificationLogger.debug('Service Worker health check', swHealth)

    if (isRegistered.value) {
      const swPing = await ping()
      notificationLogger.debug('Service Worker ping', { response: swPing })
    }

    if (authStore.isAuthenticated) {
      await notificationService.initPushNotifications()
      notificationLogger.info('Push notifications initialized on app mount')
    }
  } catch (error) {
    notificationLogger.error('Failed to initialize push notifications on app mount', {
      error: (error as Error).message,
    })
  }
})

onUnmounted(() => {
  notificationLogger.info('App unmounting, cleaning up...')
  unsubscribers.splice(0).forEach((unsubscribe) => unsubscribe())
})
</script>

<style>
html,
body,
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
}

.app-shell {
  width: 100%;
  min-height: 100vh;
}
</style>
