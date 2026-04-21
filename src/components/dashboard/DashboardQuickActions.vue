<template>
  <v-container fluid class="pa-0 mb-12">
    <v-row dense>
      <!-- OCR Request -->
      <v-col cols="12" md="4">
        <v-card
          class="glass-panel pa-8 rounded-xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 ambient-shadow"
          elevation="0"
          rounded="xl"
        >
          <div class="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all" />
          <div class="mb-6 w-14 h-14 rounded-xl bg-primary-container/20 d-flex align-center justify-center">
            <v-icon icon="mdi:document-scanner" color="primary" size="x-large" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">New OCR Request</h3>
          <p class="text-body2 text-slate-400 mb-6 leading-relaxed">Extract high-fidelity text from low-resolution scans with 99.9% accuracy.</p>
          <v-btn
            color="primary"
            variant="text"
            class="font-weight-bold text-caption group-hover:ml-2 transition-all"
            prepend-icon="mdi:arrow-right"
            size="small"
          >
            Initialize Engine
          </v-btn>
        </v-card>
      </v-col>

      <!-- Summarize Document -->
      <v-col cols="12" md="4">
        <v-card
          class="glass-panel pa-8 rounded-xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 ambient-shadow"
          elevation="0"
          rounded="xl"
        >
          <div class="absolute -right-4 -top-4 w-24 h-24 bg-secondary/10 rounded-full blur-2xl group-hover:bg-secondary/20 transition-all" />
          <div class="mb-6 w-14 h-14 rounded-xl bg-secondary-container/20 d-flex align-center justify-center">
            <v-icon icon="mdi:auto-stories" color="secondary" size="x-large" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">Summarize Document</h3>
          <p class="text-body2 text-slate-400 mb-6 leading-relaxed">Condense complex technical papers into executive briefs using LLM insight.</p>
          <v-btn
            color="secondary"
            variant="text"
            class="font-weight-bold text-caption group-hover:ml-2 transition-all"
            prepend-icon="mdi:arrow-right"
            size="small"
          >
            Generate Brief
          </v-btn>
        </v-card>
      </v-col>

      <!-- Translate PDF -->
      <v-col cols="12" md="4">
        <v-card
          class="glass-panel pa-8 rounded-xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 ambient-shadow"
          elevation="0"
          rounded="xl"
        >
          <div class="absolute -right-4 -top-4 w-24 h-24 bg-tertiary/10 rounded-full blur-2xl group-hover:bg-tertiary/20 transition-all" />
          <div class="mb-6 w-14 h-14 rounded-xl bg-tertiary-container/20 d-flex align-center justify-center">
            <v-icon icon="mdi:translate" color="tertiary" size="x-large" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">Translate PDF</h3>
          <p class="text-body2 text-slate-400 mb-6 leading-relaxed">Preserve layout and formatting while translating across 40+ languages.</p>
          <v-btn
            color="tertiary"
            variant="text"
            class="font-weight-bold text-caption group-hover:ml-2 transition-all"
            prepend-icon="mdi:arrow-right"
            size="small"
          >
            Begin Translation
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// Dashboard Quick Actions
</script>

<style scoped>
/* Scoped styles will be added later via overrides */
</style>

