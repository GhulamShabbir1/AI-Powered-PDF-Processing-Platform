// src/stores/auth.store.ts


const storedUser = localStorage.getItem('user')
const parsedUser = storedUser ? JSON.parse(storedUser) : null

import { defineStore } from 'pinia';
import authService from '../services/auth.service';
import notificationService from '../services/notification.service';
import type { AuthState } from '../types/auth.types';



export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: parsedUser,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated && !!state.user,
    currentUser: (state) => state.user,
  },

  actions: {
    async login(email: string, password: string) {
      this.isLoading = true
      try {
        const data = await authService.login({ email, password })

        this.token = data.access_token
        this.user = data.user
        this.isAuthenticated = true
        authService.setToken(data.access_token)
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('user_id', data.user.id)
        if ((data.user as any).organization_id) {
          localStorage.setItem('organization_id', (data.user as any).organization_id)
        }

        const organizationName = (data.user as any).organization_name || (data.user as any).organization || ''
        if (organizationName) {
          localStorage.setItem('organization_name', organizationName)
        }

        // Initialize push notifications (fire-and-forget, non-blocking)
        notificationService.initPushNotifications().catch((e) => {
          console.warn('Push notification init failed after login:', e)
        })

      } finally {
        this.isLoading = false
      }
    },

    async register(name: string, email: string, organization: string, password: string) {
      this.isLoading = true
      try {
        const data = await authService.register({
          name,
          email,
          organization,
          password,
          confirmPassword: password,
        })

        this.token = data.access_token
        this.user = data.user
        this.isAuthenticated = true
        authService.setToken(data.access_token)
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('user_id', data.user.id)
        if ((data.user as any).organization_id) {
          localStorage.setItem('organization_id', (data.user as any).organization_id)
        }
        localStorage.setItem('organization_name', organization)

        // Initialize push notifications (fire-and-forget, non-blocking)
        notificationService.initPushNotifications().catch((e) => {
          console.warn('Push notification init failed after register:', e)
        })
      } finally {
        this.isLoading = false
      }
    },

    async verifyAccount(email: string, token: string) {
      this.isLoading = true
      try {
        await authService.verifySignup(email, token)
      } finally {
        this.isLoading = false
      }
    },

    async resendOtp(email: string) {
      this.isLoading = true
      try {
        await authService.resendOtp(email)
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      this.isLoading = true
      try {
        // Unregister FCM token so the server stops sending pushes to this device
        try {
          await notificationService.unregisterToken()
          await notificationService.cleanup()
        } catch (e) {
          console.warn('FCM token cleanup failed during logout:', e)
        }

        await authService.logout()
      } finally {
        this.token = null
        this.user = null
        this.isAuthenticated = false
        authService.removeToken()
        localStorage.removeItem('user')
        localStorage.removeItem('user_id')
        localStorage.removeItem('organization_id')
        localStorage.removeItem('organization_name')
        this.isLoading = false
      }
    },

    async forgotPassword(email: string) {
      this.isLoading = true
      try {
        await authService.forgotPassword(email)
      } finally {
        this.isLoading = false
      }
    },

    async resetPassword(token: string, password: string, confirmPassword: string) {
      this.isLoading = true
      try {
        await authService.resetPassword({
          token,
          password,
          confirm_password: confirmPassword,
        })
      } finally {
        this.isLoading = false
      }
    },
  },
})

export default useAuthStore
