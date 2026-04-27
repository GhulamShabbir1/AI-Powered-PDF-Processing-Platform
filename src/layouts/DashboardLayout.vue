<template>
  <div class="dashboard-layout">
    <DashboardAppbar />

    <v-main class="dashboard-main-shell">
      <div class="dashboard-content pa-2 pa-md-4 pa-lg-6">
        <slot />
      </div>
    </v-main>

    <DashboardFooter />
  </div>
</template>

<script setup lang="ts">
import DashboardAppbar from '../components/dashboard/DashboardAppbar.vue'
import DashboardFooter from '../components/dashboard/DashboardFooter.vue'
</script>

<style scoped>
.dashboard-layout {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
}

.dashboard-main-shell {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.dashboard-content {
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
  min-height: 0;
}
</style>
