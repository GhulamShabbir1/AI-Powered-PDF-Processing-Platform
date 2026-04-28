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
import DefaultLayout from './layouts/DefaultLayout.vue'
import DashboardLayout from './layouts/DashboardLayout.vue'
import { useAuthStore } from './stores/auth.store'
import notificationService from './services/notification.service'

const route = useRoute()
const authStore = useAuthStore()

const isDefaultLayout = computed(() => route.meta.layout === 'default')
const isDashboardLayout = computed(() => route.meta.layout === 'dashboard')

onMounted(() => {
  if (authStore.isAuthenticated) {
    notificationService.initPushNotifications()
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
