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
import DashboardLayout from './layouts/DashboardLayout.vue'
import DefaultLayout from './layouts/DefaultLayout.vue'
import notificationService from './services/notification.service'
import { useAuthStore } from './stores/auth.store'
import { notificationLogger, checkServiceWorkerHealth } from './utils/notification-utils'
import useServiceWorker from './composables/useServiceWorker'

const route = useRoute()
const authStore = useAuthStore()
const { isRegistered, ping } = useServiceWorker()

const isDefaultLayout = computed(() => route.meta.layout === 'default')
const isDashboardLayout = computed(() => route.meta.layout === 'dashboard')

onMounted(async () => {
  notificationLogger.info('App mounted - initializing notification system')

  // Wait a bit for Service Worker to register
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Check service worker health
  const swHealth = await checkServiceWorkerHealth()
  notificationLogger.debug('Service Worker health check', swHealth)

  // Ping Service Worker to check if it's alive
  if (isRegistered.value) {
    const swPing = await ping()
    notificationLogger.debug('Service Worker ping', { response: swPing })
  }

  // Initialize push notifications if authenticated
  if (authStore.isAuthenticated) {
    try {
      await notificationService.initPushNotifications()
      notificationLogger.info('✅ Push notifications initialized on app mount')
    } catch (e) {
      notificationLogger.error('Failed to initialize push notifications on app mount', { 
        error: (e as Error).message 
      })
    }
  }

  // Listen to notification events for logging/analytics
  const unsubscribeInit = notificationService.on('init-success', () => {
    notificationLogger.info('✅ Notification service initialized successfully')
  })

  const unsubscribeInitFailed = notificationService.on('init-failed', (data) => {
    notificationLogger.warn('❌ Notification initialization failed', data)
  })

  const unsubscribeTokenSent = notificationService.on('token-sent', (data) => {
    notificationLogger.info('✅ FCM token sent to backend', data)
  })

  const unsubscribeTokenFailed = notificationService.on('token-backend-failed', (data) => {
    notificationLogger.warn('⚠️  FCM token backend send failed', data)
  })

  const unsubscribeOnline = notificationService.on('app-online', () => {
    notificationLogger.info('✅ App came online - will retry failed operations')
  })

  const unsubscribeOffline = notificationService.on('app-offline', () => {
    notificationLogger.warn('⚠️  App went offline')
  })

  const unsubscribeMessage = notificationService.on('message-received-foreground', (payload) => {
    notificationLogger.debug('📬 Foreground message received', {
      title: payload.notification?.title,
      hasData: !!payload.data,
    })
  })

  // Store cleanup functions
  const unsubscribers = [
    unsubscribeInit,
    unsubscribeInitFailed,
    unsubscribeTokenSent,
    unsubscribeTokenFailed,
    unsubscribeOnline,
    unsubscribeOffline,
    unsubscribeMessage,
  ]

  onUnmounted(() => {
    notificationLogger.info('App unmounting, cleaning up...')
    unsubscribers.forEach((unsub) => unsub?.())
  })
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
