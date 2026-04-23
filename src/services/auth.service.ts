// src/services/auth.service.ts

import apiClient from './apiClient';
import type { LoginCredentials, RegisterData, AuthResponseData } from '@/types/auth.types';
import type { ApiResponse } from '@/types/api.types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponseData> {
    // Hits /api/auth/login [cite: 1362]
    const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/login', credentials);
    return response.data.data;
  },

  async register(data: RegisterData): Promise<AuthResponseData> {
    // Hits /api/auth/signup and maps camelCase to snake_case 
    const payload = {
      name: data.name,
      organization: data.organization,
      email: data.email,
      password: data.password,
      confirm_password: data.confirmPassword 
    };
    const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/signup', payload);
    return response.data.data;
  },
  // Add this inside authService
  async verifySignup(email: string, token: string): Promise<void> {
    await apiClient.post('/auth/verify-signup', { email, token });
  },

  async logout(): Promise<void> {
    // Hits /api/auth/logout [cite: 1363]
    await apiClient.post('/auth/logout');
    this.removeToken();
  },

  async forgotPassword(email: string): Promise<void> {
    // Hits /api/auth/forgot-password [cite: 1363]
    await apiClient.post('/auth/forgot-password', { email });
  },
  async resetPassword(payload: { token: string; password: string; confirm_password: string }): Promise<void> {
    await apiClient.post('/auth/reset-password', payload);
  },

  setToken(token: string): void {
    localStorage.setItem('token', token);
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  removeToken(): void {
    localStorage.removeItem('token');
  }
};

export default authService;