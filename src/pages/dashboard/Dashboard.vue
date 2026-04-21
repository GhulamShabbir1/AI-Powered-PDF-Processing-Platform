<template><v-container fluid class="pa-4 pa-lg-6 pb-12 dashboard-container fill-height">
    <DashboardHero />
    <DashboardQuickActions /><v-row class="gap-8">
      <v-col cols="12" lg="8">
        <RecentActivity />
      </v-col><v-col cols="12" lg="4">
        <SystemAnalytics />
      </v-col></v-row>
  </v-container></template>

<script setup lang="ts">
import DashboardHero from '../../components/dashboard/DashboardHero.vue';
import DashboardQuickActions from '../../components/dashboard/DashboardQuickActions.vue';
import RecentActivity from '../../components/dashboard/RecentActivity.vue';
import SystemAnalytics from '../../components/dashboard/SystemAnalytics.vue';
</script>
