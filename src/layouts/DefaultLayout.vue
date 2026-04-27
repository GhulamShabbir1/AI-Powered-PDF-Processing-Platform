<template>
  <div class="default-layout">
    <v-main class="default-main">
      <slot />
    </v-main>
  </div>
</template>

<script setup lang="ts">
// Default Layout for non-dashboard pages
</script>

<style scoped>
.default-layout {
  width: 100%;
  min-height: 100vh;
}

.default-main {
  min-height: 100vh;
}
</style>
