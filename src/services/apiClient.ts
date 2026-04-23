import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';
import type { ApiError } from '../types/api.types'; // Assuming you export this

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://172.16.110.76:8000/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json', // 👈 Added this so Laravel always sends JSON
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
      
      // 👈 Added this check: Only redirect if they ARE NOT already on the login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;