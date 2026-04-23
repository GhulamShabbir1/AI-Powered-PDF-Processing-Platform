import requestService from '../services/request.service'
import type { PDFRequest, RequestListFilters, RequestState } from '../types/request.types'
import { defineStore } from 'pinia'

export const useRequestStore = defineStore('request', {
  state: (): RequestState => ({
    requests: [],
    currentRequest: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    pendingRequests: (state) => state.requests.filter((r: PDFRequest) => r.status === 'pending'),
    completedRequests: (state) => state.requests.filter((r: PDFRequest) => r.status === 'completed'),
    failedRequests: (state) => state.requests.filter((r: PDFRequest) => r.status === 'failed'),
  },

  actions: {
    async fetchRequests(userId: string, organizationName: string, filters: RequestListFilters = {}) {
      this.isLoading = true
      this.error = null
      try {
        const response = await requestService.getRequests(userId, organizationName, filters)
        this.requests = response.data
        return response
      } catch (error) {
        this.error = (error as Error).message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async fetchAllRequests(userId: string, organizationName: string, filters: RequestListFilters = {}) {
      const response = await this.fetchRequests(userId, organizationName, filters)
      return response.data
    },

    async fetchRequestById(fileId: string, userId: string, serviceType?: PDFRequest['serviceType']) {
      this.isLoading = true
      this.error = null
      try {
        const request = await requestService.getRequestById({ fileId, userId }, serviceType)
        this.currentRequest = request
        return request
      } catch (error) {
        this.error = (error as Error).message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async createRequest(payload: {
      userId: string
      organizationName: string
      fileId: string
      type: PDFRequest['serviceType']
      targetLanguage?: string
    }) {
      this.isLoading = true
      this.error = null
      try {
        const request = await requestService.createRequest(payload)
        this.requests = [request, ...this.requests.filter((item: PDFRequest) => item.id !== request.id)]
        return request
      } catch (error) {
        this.error = (error as Error).message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async deleteRequest(fileId: string, userId: string) {
      this.isLoading = true
      this.error = null
      try {
        await requestService.deleteRequest(fileId, userId)
        this.requests = this.requests.filter((r: PDFRequest) => r.fileId !== fileId)
      } catch (error) {
        this.error = (error as Error).message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    updateRequestStatus(id: string, status: PDFRequest['status']) {
      const request = this.requests.find((r: PDFRequest) => r.id === id)
      if (request) {
        request.status = status
      }
      if (this.currentRequest?.id === id) {
        this.currentRequest.status = status
      }
    },

    clearCurrentRequest() {
      this.currentRequest = null
    },
  },
})

export default useRequestStore
