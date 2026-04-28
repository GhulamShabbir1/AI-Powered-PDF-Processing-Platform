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
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import DashboardLayout from './layouts/DashboardLayout.vue'
import DefaultLayout from './layouts/DefaultLayout.vue'
import notificationService from './services/notification.service'
import { useAuthStore } from './stores/auth.store'

const route = useRoute()
const authStore = useAuthStore()

const isDefaultLayout = computed(() => route.meta.layout === 'default')
const isDashboardLayout = computed(() => route.meta.layout === 'dashboard')

onMounted(async () => {
  if (authStore.isAuthenticated) {
    try {
      await notificationService.initPushNotifications()
    } catch (e) {
      console.error('Failed to initialize push notifications on app mount:', e)
    }
  }
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
