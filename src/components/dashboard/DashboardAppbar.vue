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
      <v-btn variant="text" class="brand-button text-none" @click="goToServices">
        <div class="text-h6 font-weight-bold text-primary">
          AI PDF <span class="text-gradient">Tools</span>
        </div>
      </v-btn>

      <v-spacer />

      <div class="d-none d-sm-flex align-center ga-3">
        <div v-if="authStore.isLoggedIn" class="d-flex align-center ga-2">
          <v-menu location="bottom end" offset="10">
            <template #activator="{ props }">
              <v-btn
                icon
                variant="tonal"
                color="primary"
                v-bind="props"
              >
                <v-avatar size="36" color="primary">
                  <span class="avatar-initial">
                    {{ userInitial }}
                  </span>
                </v-avatar>
              </v-btn>
            </template>

            <v-card min-width="280" class="profile-menu rounded-xl">
              <v-card-text class="pa-4">
                <div class="d-flex align-center ga-3 mb-3">
                  <v-avatar size="44" color="primary">
                    <span class="avatar-initial avatar-initial-lg">
                      {{ userInitial }}
                    </span>
                  </v-avatar>

                  <div>
                    <div class="text-body-1 font-weight-bold">
                      {{ authStore.currentUser?.name || 'User' }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ authStore.currentUser?.email || 'No email available' }}
                    </div>
                  </div>
                </div>

                <v-divider class="mb-2" />

                <v-list density="comfortable" nav class="py-0">
                  <v-list-item prepend-icon="mdi-view-grid-outline" @click="goToServices">
                    <v-list-item-title>Main Services</v-list-item-title>
                  </v-list-item>

                  <v-list-item prepend-icon="mdi-folder-outline" @click="goToHistory">
                    <v-list-item-title>History</v-list-item-title>
                  </v-list-item>

                  <v-list-item
                    prepend-icon="mdi-logout"
                    base-color="error"
                    :disabled="isLoggingOut"
                    @click="handleLogout"
                  >
                    <v-list-item-title>Logout</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-menu>
        </div>

        <div v-else class="text-caption text-medium-emphasis">
          Guest
        </div>
      </div>

      <div class="d-flex d-sm-none">
        <v-menu location="bottom end">
          <template #activator="{ props }">
            <v-btn icon v-bind="props">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item v-if="authStore.isLoggedIn">
              <template #prepend>
                <v-avatar size="32" color="primary">
                  <span class="avatar-initial">
                    {{ userInitial }}
                  </span>
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-medium">
                {{ authStore.currentUser?.name || 'User' }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ authStore.currentUser?.email || 'No email available' }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item @click="goToServices">
              <v-list-item-title>Main Services</v-list-item-title>
            </v-list-item>

            <v-list-item @click="goToHistory">
              <v-list-item-title>History</v-list-item-title>
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
import { computed, ref } from 'vue'
import { useAuthStore } from '../../stores/auth.store'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const isLoggingOut = ref(false)
const userInitial = computed(() => {
  const name = authStore.currentUser?.name?.trim()
  return name ? name.charAt(0).toUpperCase() : 'U'
})

const goToServices = () => {
  router.push({ name: 'Dashboard' })
}

const goToHistory = () => {
  router.push({ name: 'History' })
}

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

<style scoped>
.brand-button {
  padding-inline: 0 !important;
  min-width: 0 !important;
}

.avatar-initial {
  color: white;
  font-size: 0.9rem;
  font-weight: 700;
}

.avatar-initial-lg {
  font-size: 1rem;
}

.profile-menu {
  border: 1px solid rgba(15, 23, 42, 0.08);
}
</style>
