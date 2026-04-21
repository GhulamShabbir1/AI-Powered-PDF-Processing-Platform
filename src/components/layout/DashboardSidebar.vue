<template>
  <v-navigation-drawer 
    permanent
    location="left"
    width="256"
    class="h-screen pt-24 pb-8 bg-slate-950/90 backdrop-blur-2xl shadow-2xl"
    style="border-right: none;"
  >
    <!-- Workspace Info -->
    <div class="px-8 mb-8">
      <v-card class="glass-panel pa-4 rounded-2xl" flat>
        <div class="d-flex align-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary d-flex align-center justify-center">
            <v-icon icon="mdi:auto-awesome" color="white" />
          </div>
          <div>
            <p class="text-caption uppercase tracking-widest text-slate-400 mb-1">Workspace</p>
            <p class="text-body-2 font-weight-bold">Standard Plan</p>
          </div>
        </div>
      </v-card>
    </div>

    <!-- Navigation -->
    <v-list density="compact" nav class="flex-grow-1 px-6">
      <v-list-item
        value="dashboard"
        active
        :color="'cyan'"
        prepend-icon="mdi:dashboard"
        title="Dashboard"
        class="rounded-xl mb-1 px-4 py-4 text-sm uppercase tracking-widest font-inter text-cyan-400 border-r-4 border-cyan-500"
        rounded
      />
      <v-list-item
        value="process"
        prepend-icon="mdi:line-start"
        title="Process AI"
        class="rounded-xl mb-1 px-4 py-4 hover:translate-x-1"
        rounded
      />
      <v-list-item
        value="history"
        prepend-icon="mdi:history"
        title="History"
        class="rounded-xl mb-1 px-4 py-4 hover:translate-x-1"
        rounded
      />
      <v-list-item
        value="vault"
        prepend-icon="mdi:folder-managed"
        title="Vault"
        class="rounded-xl mb-1 px-4 py-4 hover:translate-x-1"
        rounded
      />
      <v-list-item
        value="settings"
        prepend-icon="mdi:account-cog"
        title="Settings"
        class="rounded-xl mb-1 px-4 py-4 hover:translate-x-1"
        rounded
      />
    </v-list>

    <!-- New Request Button -->
    <div class="px-6 py-4">
      <v-btn
        block
        size="large"
        rounded="xl"
        class="text-white font-weight-bold bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95"
      >
        <v-icon start icon="mdi:plus" />
        New Request
      </v-btn>
    </div>

    <!-- Bottom Links -->
    <div class="mt-auto space-y-1 px-6 py-4">
      <v-list-item
        prepend-icon="mdi:help-circle"
        title="Help Center"
        class="text-xs uppercase tracking-widest text-slate-500 py-3"
        rounded="none"
        density="compact"
      />
      <v-list-item
        prepend-icon="mdi:logout"
        title="Logout"
        class="text-xs uppercase tracking-widest text-slate-500 py-3"
        rounded="none"
        density="compact"
      />
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
// Dashboard Sidebar
</script>

<style scoped>
.v-list-item:hover {
  color: rgb(var(--v-theme-on-surface-variant));
  background-color: rgb(var(--v-theme-surface-container-high));
}

.font-inter {
  font-family: 'Inter', sans-serif;
}
</style>

