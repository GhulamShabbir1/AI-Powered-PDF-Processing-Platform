import { computed } from 'vue';
import { useRequestStore } from '@/stores';
import requestService from '@/services/request.service';
import type { PDFRequest, RequestOptions } from '@/types/request.types';

export function useRequest() {
  const requestStore = useRequestStore();

  const requests = computed(() => requestStore.requests);
  const currentRequest = computed(() => requestStore.currentRequest);
  const isLoading = computed(() => requestStore.isLoading);
  const error = computed(() => requestStore.error);

  async function fetchRequests(page = 1, limit = 10) {
    return requestStore.fetchRequests(page, limit);
  }

  async function fetchRequestById(id: string) {
    return requestStore.fetchRequestById(id);
  }

  async function createRequest(file: File, options?: RequestOptions) {
    return requestStore.createRequest(file, options);
  }

  async function deleteRequest(id: string) {
    return requestStore.deleteRequest(id);
  }

  async function checkStatus(id: string): Promise<PDFRequest> {
    return requestService.getRequestStatus(id);
  }

  function updateStatus(id: string, status: PDFRequest['status']) {
    requestStore.updateRequestStatus(id, status);
  }

  function clearCurrentRequest() {
    requestStore.clearCurrentRequest();
  }

  return {
    requests,
    currentRequest,
    isLoading,
    error,
    fetchRequests,
    fetchRequestById,
    createRequest,
    deleteRequest,
    checkStatus,
    updateStatus,
    clearCurrentRequest,
  };
}

export default useRequest;