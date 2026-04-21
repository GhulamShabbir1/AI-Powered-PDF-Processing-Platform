<template>
  <v-app-bar
    location="top"
class="ml-[256px] bg-indigo-950/90 backdrop-blur-3xl"
    :height="80"
  >
    <v-container class="max-width-1920 px-8 py-4 d-flex align-center justify-space-between h-100">
      <!-- Left: Brand + Nav -->
      <div class="d-flex align-center gap-12">
        <h1 class="text-h4 font-weight-black gradient-text tracking-tight">\n          AI PDF Processor\n        </h1>
        <v-tabs v-model="tab" color="slate-300" class="d-none d-md-flex">
          <v-tab value="pricing" class="text-slate-300 hover:text-white font-medium tracking-tight">
            Pricing
          </v-tab>
          <v-tab value="docs" class="text-slate-300 hover:text-white font-medium tracking-tight">
            Documentation
          </v-tab>
          <v-tab value="api" class="text-slate-300 hover:text-white font-medium tracking-tight">
            API
          </v-tab>
        </v-tabs>
      </div>

      <!-- Right: Actions -->
      <div class="d-flex align-center gap-6">
        <div class="d-flex align-center gap-4 text-slate-300">
          <v-btn icon="mdi:bell" variant="text" size="small" class="hover:bg-white/5 rounded-full" />
          <v-btn icon="mdi:auto-awesome" variant="text" size="small" class="hover:bg-white/5 rounded-full" />
        </div>
        <v-avatar size="40" class="border-2 border-primary/30 rounded-full overflow-hidden">
          <v-img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkpcUadW-T_FJf5Uo4K7g8VNNK2rsNLssd_YuXSYbbU7NyERwG7OVwmYzRuVoFWoeacNsk0jmzBF4NUmllUVK2jS42ezDX2hUB00mTPFu76EWc56fKspbX2EihilZy24NYJ6hKvuCVYkc0HHDVtBCN0-YOkThbN7Vc-U_jTsytGJqVlBk1RR8V9iR74Nk2QwGFt2Mw5hWb_NlxpfKzkYbKJMX1pqUuz5Io-yTqYjUa1b5QeFk-_pQVZ9AJav8S589qhBj-9wVAg"
            alt="User avatar"
          />
        </v-avatar>
        <v-btn
          rounded="pill"
          color="primary-container"
          class="text-white font-weight-bold text-caption px-6 py-2 hover:scale-105"
        >
          Get Started
        </v-btn>
      </div>
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const tab = ref('pricing')
</script>

<style scoped>
.max-width-1920 {
  max-width: 1920px;
}
</style>

