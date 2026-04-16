import { ref } from 'vue';
import apiClient from '@/services/apiClient';
import type { ApiResponse, ApiRequestConfig } from '@/types/api.types';

export function useApi() {
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function request<T>(config: ApiRequestConfig): Promise<T> {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiClient.request<T>(config);
      return response.data;
    } catch (e) {
      error.value = (e as Error).message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    return request<T>({ method: 'GET', url, params });
  }

  async function post<T>(url: string, data?: unknown): Promise<T> {
    return request<T>({ method: 'POST', url, data });
  }

  async function put<T>(url: string, data?: unknown): Promise<T> {
    return request<T>({ method: 'PUT', url, data });
  }

  async function del<T>(url: string): Promise<T> {
    return request<T>({ method: 'DELETE', url });
  }

  return {
    isLoading,
    error,
    request,
    get,
    post,
    put,
    del,
  };
}

export default useApi;