// src/stores/auth.store.ts

import { defineStore } from 'pinia'
import type { AuthState } from '@/types/auth.types'
import authService from '@/services/auth.service'

const storedUser = localStorage.getItem('user')
const parsedUser = storedUser ? JSON.parse(storedUser) : null

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

        const organizationName = (data.user as any).organization_name || (data.user as any).organization || ''
        if (organizationName) {
          localStorage.setItem('organization_name', organizationName)
        }
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
        localStorage.setItem('organization_name', organization)
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
        await authService.logout()
      } finally {
        this.token = null
        this.user = null
        this.isAuthenticated = false
        authService.removeToken()
        localStorage.removeItem('user')
        localStorage.removeItem('user_id')
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
