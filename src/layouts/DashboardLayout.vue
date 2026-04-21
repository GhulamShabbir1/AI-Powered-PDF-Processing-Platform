<template>
  <v-app>
    <DashboardNavbar />
    <div class="d-flex">
      <DashboardSidebar />
      <v-main class="dashboard-main flex-1">
        <slot />
      </v-main>
    </div>
  </v-app>
</template>

<script setup lang="ts">
</script>

