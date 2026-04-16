import apiClient from './apiClient';
import type { PDFRequest, RequestListResponse, CreateRequestData } from '@/types/request.types';

export const requestService = {
  async getRequests(page = 1, limit = 10): Promise<RequestListResponse> {
    const response = await apiClient.get<RequestListResponse>('/requests', {
      params: { page, limit },
    });
    return response.data;
  },

  async getRequestById(id: string): Promise<PDFRequest> {
    const response = await apiClient.get<PDFRequest>(`/requests/${id}`);
    return response.data;
  },

  async createRequest(data: CreateRequestData): Promise<PDFRequest> {
    const formData = new FormData();
    formData.append('file', data.file);
    if (data.options) {
      formData.append('options', JSON.stringify(data.options));
    }
    const response = await apiClient.post<PDFRequest>('/requests', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async deleteRequest(id: string): Promise<void> {
    await apiClient.delete(`/requests/${id}`);
  },

  async getRequestStatus(id: string): Promise<PDFRequest> {
    const response = await apiClient.get<PDFRequest>(`/requests/${id}/status`);
    return response.data;
  },
};

export default requestService;