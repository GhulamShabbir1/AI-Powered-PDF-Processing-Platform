import apiClient from './apiClient';
import type { LoginCredentials, RegisterData, AuthResponseData } from '@/types/auth.types';

type AuthResponseEnvelope = {
  data?: Partial<AuthResponseData>;
  access_token?: string;
  accessToken?: string;
  user?: AuthResponseData['user'];
};

const extractAuthData = (payload: unknown): AuthResponseData => {
  const response = (payload && typeof payload === 'object' ? payload : {}) as Record<string, any>;
  const data = response.data && typeof response.data === 'object' ? response.data : response;

  return {
    access_token: String(data.access_token ?? data.accessToken ?? response.access_token ?? response.accessToken ?? ''),
    user: (data.user ?? response.user) as AuthResponseData['user'],
  };
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponseData> {
    const response = await apiClient.post<AuthResponseEnvelope>('/auth/login', credentials);
    return extractAuthData(response.data);
  },

  async register(data: RegisterData): Promise<void> {
    const payload = {
      name: data.name,
      organization: data.organization,
      email: data.email,
      password: data.password,
      confirm_password: data.confirmPassword,
    };
    await apiClient.post('/auth/signup', payload);
  },

  async verifySignup(token: string): Promise<void> {
    await apiClient.post('/auth/verify-signup', { token });
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
    this.removeToken();
  },

  async forgotPassword(email: string): Promise<void> {
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
