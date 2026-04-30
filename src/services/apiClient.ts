import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';
import type { ApiError } from '../types/api.types';
import { installNotificationMiddleware } from '../middleware/notification-middleware';

const normalizeApiBaseUrl = (value: string): string => {
  const trimmed = value.replace(/\/$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const API_BASE_URL = normalizeApiBaseUrl(
  import.meta.env.VITE_API_BASE_URL || 'http://178.104.58.236:8085'
);

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json', 
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('user_id');
      localStorage.removeItem('organization_id');
      localStorage.removeItem('organization_name');

      window.dispatchEvent(new Event('auth-unauthorized'));
    }
    return Promise.reject(error);
  }
);

// Install notification middleware for automatic notifications on API calls
installNotificationMiddleware(apiClient);

export default apiClient;
