<template>
  <v-card
    class="glass-panel pa-8 rounded-xl ambient-shadow overflow-hidden sticky top-28"
    elevation="0"
    rounded="xl"
  >
    <div class="absolute top-0 right-0 pa-8 opacity-10">
      <v-icon icon="mdi:psychology" size="xx-large" />
    </div>
    <h3 class="text-h6 font-weight-bold mb-8">System Analytics</h3>
    
    <!-- Neural Load -->
    <div class="mb-8">
      <div class="d-flex align-center justify-space-between mb-3">
        <span class="text-caption text-slate-400 font-weight-bold text-uppercase tracking-wider">Neural Load</span>
        <span class="text-secondary font-weight-bold">42%</span>
      </div>
      <v-progress-linear
        :model-value="42"
        color="secondary"
        height="8"
        rounded
        bg-color="surface-container-highest"
      />
    </div>

    <!-- Storage Vault -->
    <div class="mb-8">
      <div class="d-flex align-center justify-space-between mb-3">
        <span class="text-caption text-slate-400 font-weight-bold text-uppercase tracking-wider">Storage Vault</span>
        <span class="text-primary font-weight-bold">8.2 / 10 GB</span>
      </div>
      <v-progress-linear
        :model-value="82"
        color="primary"
        height="8"
        rounded
        bg-color="surface-container-highest"
      />
    </div>

    <!-- Stats Grid -->
    <v-row dense class="pt-6 mb-6">
      <v-col cols="6">
        <v-card class="surface-container pa-4 rounded-xl" flat>
          <p class="text-caption text-slate-500 text-uppercase tracking-tight mb-1 font-weight-bold">Accuracy</p>
          <p class="text-h4 font-weight-black">99.8%</p>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card class="surface-container pa-4 rounded-xl" flat>
          <p class="text-caption text-slate-500 text-uppercase tracking-tight mb-1 font-weight-bold">Uptime</p>
          <p class="text-h4 font-weight-black">99.9%</p>
        </v-card>
      </v-col>
    </v-row>

    <!-- Pro Tip -->
    <v-card
      color="primary"
      class="pa-6 rounded-xl border border-primary/20"
      flat
    >
      <p class="text-primary text-caption font-weight-bold d-flex align-center gap-2 mb-2">
        <v-icon icon="mdi:bolt" size="large" />
        Pro Tip
      </p>
      <p class="text-body-small text-on-primary-container leading-relaxed">
        Enable "Predictive Buffering" in settings to reduce PDF summarization latency by up to 25%.
      </p>
    </v-card>
  </v-card>
</template>

<script setup lang="ts">
// System Analytics Panel
</script>

