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
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from './layouts/DefaultLayout.vue'
import DashboardLayout from './layouts/DashboardLayout.vue'

const route = useRoute()

const isDefaultLayout = computed(() => route.meta.layout === 'default')
const isDashboardLayout = computed(() => route.meta.layout === 'dashboard')
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
