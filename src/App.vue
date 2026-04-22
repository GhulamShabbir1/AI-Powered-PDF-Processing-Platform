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
import DefaultLayout from './layouts/DefaultLayout.vue'

const route = useRoute()

const layoutComponent = computed(() => {
  return DefaultLayout
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

