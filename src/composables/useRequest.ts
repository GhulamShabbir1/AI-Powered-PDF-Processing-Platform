import { computed } from 'vue';
import { useRequestStore } from '@/stores';
import requestService from '@/services/request.service';
import type { CreateRequestData, PDFRequest, RequestListFilters } from '@/types/request.types';

export function useRequest() {
  const requestStore = useRequestStore();

  const requests = computed(() => requestStore.requests);
  const currentRequest = computed(() => requestStore.currentRequest);
  const isLoading = computed(() => requestStore.isLoading);
  const error = computed(() => requestStore.error);

  async function fetchRequests(userId: string, organizationName: string, filters?: RequestListFilters) {
    return requestStore.fetchRequests(userId, organizationName, filters);
  }

  async function fetchRequestById(fileId: string, userId: string, serviceType?: PDFRequest['serviceType']) {
    return requestStore.fetchRequestById(fileId, userId, serviceType);
  }

  async function createRequest(payload: CreateRequestData) {
    return requestStore.createRequest(payload);
  }

  async function deleteRequest(fileId: string, userId: string) {
    return requestStore.deleteRequest(fileId, userId);
  }

  async function checkStatus(
    fileId: string,
    userId: string,
    serviceType?: PDFRequest['serviceType']
  ): Promise<PDFRequest | null> {
    return requestService.getRequestStatus({ fileId, userId }, serviceType);
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
