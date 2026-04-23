// src/stores/auth.store.ts

import { defineStore } from 'pinia';
import type { AuthState } from '@/types/auth.types';
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
        const data = await authService.login({ email, password });
    
        this.token = data.access_token; // 👈 Pulls access_token from Postman response
        this.user = data.user;
        this.isAuthenticated = true;
        authService.setToken(data.access_token);
      } finally {
        this.isLoading = false;
      }
    },

   // 👇 Added organization parameter
   // 1. Ensure it accepts 4 arguments in this exact order:
   async register(name: string, email: string, organization: string, password: string) {
    this.isLoading = true;
    try {
      // 2. Ensure organization is passed in this object:
      const data = await authService.register({ 
        name, 
        email, 
        organization, 
        password, 
        confirmPassword: password 
      });
      
      this.token = data.access_token;
      this.user = data.user;
      this.isAuthenticated = true;
      authService.setToken(data.access_token);
    } finally {
      this.isLoading = false;
    }
  },
  // Add this inside actions
  async verifyAccount(email: string, token: string) {
    this.isLoading = true;
    try {
      await authService.verifySignup(email, token);
    } finally {
      this.isLoading = false;
    }
  },

    async logout() {
      this.isLoading = true;
      try {
        await authService.logout();
      } finally {
        this.token = null;
        this.user = null;
        this.isAuthenticated = false;
        authService.removeToken();
        this.isLoading = false;
      }
    },

    async forgotPassword(email: string) {
      this.isLoading = true;
      try {
        await authService.forgotPassword(email);
      } finally {
        this.isLoading = false;
      }
    },
    async resetPassword(token: string, password: string, confirmPassword: string) {
      this.isLoading = true;
      try {
        await authService.resetPassword({
          token,
          password,
          confirm_password: confirmPassword
        });
      } finally {
        this.isLoading = false;
      }
    }
  },
});

export default useAuthStore;