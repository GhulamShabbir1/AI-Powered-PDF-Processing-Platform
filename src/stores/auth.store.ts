import { defineStore } from 'pinia';
import type { AuthState, User } from '@/types/auth.types';
import authService from '@/services/auth.service';

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
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
      this.isLoading = true;
      try {
        const response = await authService.login({ email, password });
        this.token = response.token;
        this.user = response.user;
        this.isAuthenticated = true;
        authService.setToken(response.token);
      } finally {
        this.isLoading = false;
      }
    },

    async register(name: string, email: string, password: string) {
      this.isLoading = true;
      try {
        const response = await authService.register({ name, email, password, confirmPassword: password });
        this.token = response.token;
        this.user = response.user;
        this.isAuthenticated = true;
        authService.setToken(response.token);
      } finally {
        this.isLoading = false;
      }
    },

    async logout() {
      try {
        await authService.logout();
      } finally {
        this.token = null;
        this.user = null;
        this.isAuthenticated = false;
        authService.removeToken();
      }
    },

    async fetchUser() {
      if (!this.token) return;
      this.isLoading = true;
      try {
        const user = await authService.getCurrentUser();
        this.user = user;
      } catch {
        this.logout();
      } finally {
        this.isLoading = false;
      }
    },
  },
});

export default useAuthStore;