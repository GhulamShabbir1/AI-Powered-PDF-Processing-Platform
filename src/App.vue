<template>
  <v-app>
    <DefaultLayout v-if="isDefaultLayout">
      <router-view />
    </DefaultLayout>
    <DashboardLayout v-else-if="isDashboardLayout">
      <router-view />
    </DashboardLayout>
    <router-view v-else />
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
html, body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}
</style>

