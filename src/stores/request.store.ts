import requestService from '../services/request.service';
import type { PDFRequest, RequestState } from '../types/request.types';
import { defineStore } from 'pinia';

export const useRequestStore = defineStore('request', {
  state: (): RequestState => ({
    requests: [],
    currentRequest: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    pendingRequests: (state) => state.requests.filter((r) => r.status === 'pending'),
    completedRequests: (state) => state.requests.filter((r) => r.status === 'completed'),
    failedRequests: (state) => state.requests.filter((r) => r.status === 'failed'),
  },

  actions: {
    async fetchRequests(page = 1, limit = 10) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await requestService.getRequests(page, limit);
        if (page === 1) {
          this.requests = response.data;
        } else {
          this.requests = [...this.requests, ...response.data];
        }
        return response;
      } catch (error) {
        this.error = (error as Error).message;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchAllRequests(limit = 10) {
      let page = 1;
      let allRequests = [...this.requests];
      let hasMore = true;

      while (hasMore) {
        try {
          const response = await this.fetchRequests(page, limit);
          if (response.data.length === 0) {
            hasMore = false;
          } else {
            allRequests = [...allRequests, ...response.data];
            page++;
          }
        } catch (error) {
          console.error('Error fetching page', page, error);
          hasMore = false;
        }
      }

      this.requests = allRequests;
      return allRequests;
    },

    async fetchRequestById(id: string) {
      this.isLoading = true;
      this.error = null;
      try {
        const request = await requestService.getRequestById(id);
        this.currentRequest = request;
        return request;
      } catch (error) {
        this.error = (error as Error).message;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async createRequest(file: File, options?: Record<string, unknown>) {
      this.isLoading = true;
      this.error = null;
      try {
        const request = await requestService.createRequest({ file, options });
        this.requests.unshift(request);
        return request;
      } catch (error) {
        this.error = (error as Error).message;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteRequest(id: string) {
      this.isLoading = true;
      this.error = null;
      try {
        await requestService.deleteRequest(id);
        this.requests = this.requests.filter((r) => r.id !== id);
      } catch (error) {
        this.error = (error as Error).message;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    updateRequestStatus(id: string, status: PDFRequest['status']) {
      const request = this.requests.find((r) => r.id === id);
      if (request) {
        request.status = status;
      }
      if (this.currentRequest?.id === id) {
        this.currentRequest.status = status;
      }
    },

    clearCurrentRequest() {
      this.currentRequest = null;
    },
  },
});

export default useRequestStore;