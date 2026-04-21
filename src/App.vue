<template>
  <v-app shadow>
<component :is="layoutComponent">
    <router-view />
  </component>
  </v-app>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DashboardLayout from './layouts/DashboardLayout.vue'
import DefaultLayout from './layouts/DefaultLayout.vue'

const route = useRoute()

const layoutComponent = computed(() => {
  const layout = route.meta.layout as string || 'default'
  return layout === 'dashboard' ? DashboardLayout : DefaultLayout
  // or LandingLayout for home
})
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}
</style>

