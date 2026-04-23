// src/types/auth.types.ts

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  organization?: string;
  organization_name?: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  organization: string; // 👈 New field added
  email: string;
  password: string;
  confirmPassword: string; 
}

// 👇 Updated to match Postman's response.data structure
export interface AuthResponseData {
  access_token: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
