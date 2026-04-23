<template>
  <v-app-bar
    app
    color="white"
    flat
    height="64"
    elevation="2"
    class="px-2 px-sm-4 px-md-6"
  >
    <v-container fluid class="d-flex align-center pa-0">

      <!-- Logo / Title -->
      <v-toolbar-title class="text-h6 font-weight-bold text-primary">
        AI PDF <span class="text-gradient">Tools</span>
      </v-toolbar-title>

      <v-spacer />

      <!-- Desktop Actions -->
      <div class="d-none d-sm-flex align-center ga-3">

        <!-- Vault Button -->
        <v-btn
          to="/dashboard/vault"
          color="primary"
          prepend-icon="mdi-history"
          rounded="lg"
          variant="flat"
        >
          Vault
        </v-btn>

        <!-- User Info -->
        <div v-if="authStore.isLoggedIn" class="d-flex align-center ga-2">

          <div class="text-right d-none d-md-block">
            <div class="text-body-2 font-weight-medium">
              {{ authStore.currentUser?.name || 'User' }}
            </div>
            <div class="text-caption text-medium-emphasis">
              {{ authStore.currentUser?.email }}
            </div>
          </div>

          <!-- Avatar -->
          <v-avatar size="36">
            <v-icon>mdi-account</v-icon>
          </v-avatar>

          <!-- Logout -->
          <v-btn
            icon
            variant="tonal"
            color="error"
            @click="handleLogout"
          >
            <v-icon>mdi-logout</v-icon>
          </v-btn>
        </div>

        <!-- Guest -->
        <div v-else class="text-caption text-medium-emphasis">
          Guest
        </div>
      </div>

      <!-- Mobile Menu -->
      <div class="d-flex d-sm-none">
        <v-menu>
          <template #activator="{ props }">
            <v-btn icon v-bind="props">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item to="/dashboard/vault">
              <v-list-item-title>Vault</v-list-item-title>
            </v-list-item>

            <v-list-item v-if="authStore.isLoggedIn" @click="handleLogout">
              <v-list-item-title class="text-error">Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>
