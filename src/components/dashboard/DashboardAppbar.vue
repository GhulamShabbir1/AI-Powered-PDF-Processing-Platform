<template>
  <v-app-bar
    app
    color="white"
    flat
    height="64"
    elevation="2"
    class="px-2 px-md-4"
  >
    <v-btn variant="text" class="brand-button text-none" @click="goToServices">
      <span class="text-subtitle-1 font-weight-bold text-black">AI PDF Tools</span>
    </v-btn>

    <v-spacer />

    <div class="d-none d-md-flex align-center ga-2">
      <v-menu location="bottom end" offset="10">
        <template #activator="{ props }">
          <v-btn v-bind="props" icon variant="text">
            <v-avatar color="red-darken-2" size="36">
              <span class="avatar-initial">{{ userInitial }}</span>
            </v-avatar>
          </v-btn>
        </template>

        <v-card min-width="260" class="profile-menu rounded-xl">
          <v-list class="py-2">
            <v-list-item
              :title="authStore.currentUser?.name || 'User'"
              :subtitle="authStore.currentUser?.email || ''"
            />

            <v-divider class="my-2" />

            <v-list-item prepend-icon="mdi-view-dashboard-outline" title="Main Services" @click="goToServices" />
            <v-list-item prepend-icon="mdi-history" title="History" @click="goToHistory" />

            <v-list-item
              v-if="showEnableNotifications"
              prepend-icon="mdi-bell-outline"
              title="Enable Notifications"
              :disabled="isEnablingNotifications"
              @click="handleEnableNotifications"
            />

            <v-list-item
              v-else-if="isSubscribed"
              prepend-icon="mdi-bell-check-outline"
              title="Notifications Enabled"
              disabled
            />

            <v-divider class="my-2" />

            <v-list-item
              prepend-icon="mdi-logout"
              title="Logout"
              :disabled="isLoggingOut"
              @click="handleLogout"
            />
          </v-list>
        </v-card>
      </v-menu>
    </div>

    <div class="d-flex d-md-none align-center">
      <v-menu location="bottom end" offset="10">
        <template #activator="{ props }">
          <v-btn v-bind="props" icon variant="text">
            <v-avatar color="red-darken-2" size="36">
              <span class="avatar-initial">{{ userInitial }}</span>
            </v-avatar>
          </v-btn>
        </template>

        <v-card min-width="240" class="profile-menu rounded-xl">
          <v-list class="py-2">
            <v-list-item
              :title="authStore.currentUser?.name || 'User'"
              :subtitle="authStore.currentUser?.email || ''"
            />

            <v-divider class="my-2" />

            <v-list-item
              prepend-icon="mdi-view-dashboard-outline"
              title="Main Services"
              @click="goToServices"
            />

            <v-list-item
              prepend-icon="mdi-history"
              title="History"
              @click="goToHistory"
            />

            <v-list-item
              v-if="showEnableNotifications"
              prepend-icon="mdi-bell-outline"
              title="Enable Notifications"
              :disabled="isEnablingNotifications"
              @click="handleEnableNotifications"
            />

            <v-list-item
              v-else-if="isSubscribed"
              prepend-icon="mdi-bell-check-outline"
              title="Notifications Enabled"
              disabled
            />

            <v-divider class="my-2" />

            <v-list-item
              prepend-icon="mdi-logout"
              title="Logout"
              :disabled="isLoggingOut"
              @click="handleLogout"
            />
          </v-list>
        </v-card>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useNotifications } from '../../composables/useNotifications'
import { useAuthStore } from '../../stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()
const isLoggingOut = ref(false)
const isEnablingNotifications = ref(false)
const { canSubscribe, isSubscribed, permission, enableNotifications, refreshState } = useNotifications()

const userInitial = computed(() => {
  const name = authStore.currentUser?.name?.trim()
  return name ? name.charAt(0).toUpperCase() : 'U'
})

const showEnableNotifications = computed(() => {
  return authStore.isLoggedIn && canSubscribe.value && !isSubscribed.value
})

const goToServices = () => {
  void router.push({ name: 'Dashboard' })
}

const goToHistory = () => {
  void router.push({ name: 'History' })
}

const handleEnableNotifications = async () => {
  isEnablingNotifications.value = true

  try {
    const granted = await enableNotifications()
    refreshState()

    if (granted) {
      toast.success('Push notifications enabled.')
      return
    }

    if (permission.value === 'denied') {
      toast.error('Notifications are blocked in this browser. Please allow them in site settings.')
    } else {
      toast.info('Notification permission was not granted.')
    }
  } catch (error) {
    console.error('Failed to enable notifications:', error)
    toast.error('Failed to enable notifications. Please try again.')
  } finally {
    isEnablingNotifications.value = false
  }
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
    await router.replace('/login')
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

.profile-menu {
  border: 1px solid rgba(15, 23, 42, 0.08);
}
</style>
