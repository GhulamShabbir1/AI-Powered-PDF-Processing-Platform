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

      <v-toolbar-title class="text-h6 font-weight-bold text-primary">
        AI PDF <span class="text-gradient">Tools</span>
      </v-toolbar-title>

      <v-spacer />

      <div class="d-none d-sm-flex align-center ga-3">

        <v-btn
          to="/dashboard/vault"
          color="primary"
          prepend-icon="mdi-history"
          rounded="lg"
          variant="flat"
        >
          Vault
        </v-btn>

        <div v-if="authStore.isLoggedIn" class="d-flex align-center ga-2">

          <div class="text-right d-none d-md-block">
            <div class="text-body-2 font-weight-medium">
              {{ authStore.currentUser?.name || 'User' }}
            </div>
            <div class="text-caption text-medium-emphasis">
              {{ authStore.currentUser?.email }}
            </div>
          </div>

          <v-avatar size="36">
            <v-icon>mdi-account</v-icon>
          </v-avatar>

          <v-btn
            icon
            variant="tonal"
            color="error"
            :loading="isLoggingOut"
            @click="handleLogout"
          >
            <v-icon>mdi-logout</v-icon>
          </v-btn>
        </div>

        <div v-else class="text-caption text-medium-emphasis">
          Guest
        </div>
      </div>

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

            <v-list-item v-if="authStore.isLoggedIn" @click="handleLogout" :disabled="isLoggingOut">
              <v-list-item-title class="text-error">Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth.store'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const isLoggingOut = ref(false)

const handleLogout = async () => {
  isLoggingOut.value = true
  
  try {
    await authStore.logout()
  } catch (error) {
    console.error('Logout API failed:', error)
  } finally {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('user_id')
    localStorage.removeItem('organization_id')
    localStorage.removeItem('organization_name')
    isLoggingOut.value = false
    router.replace('/login')
  }
}
</script> 
