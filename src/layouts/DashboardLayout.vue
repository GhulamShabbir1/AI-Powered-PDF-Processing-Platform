<template>
  <v-app>
    <!-- App Bar -->
    <DashboardAppbar />

    <!-- Main Content -->
    <v-main>
      <div class="dashboard-content pa-2 pa-md-4 pa-lg-6">
        <slot />
      </div>
    </v-main>

    <!-- Footer -->
    <DashboardFooter />
  </v-app>
</template>

<script setup lang="ts">
import DashboardAppbar from '../components/dashboard/DashboardAppbar.vue'
import DashboardFooter from '../components/dashboard/DashboardFooter.vue'
</script>

<style scoped>
/* Clean spacing */
</style>

