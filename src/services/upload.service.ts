import apiClient from './apiClient';
import type { UploadProgress } from '@/types/api.types';

export const uploadService = {
  async uploadFile(
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<{ uploadId: string }>(
      '/upload',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress({
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage,
            });
          }
        },
      }
    );

    return response.data.uploadId;
  },

  async getUploadStatus(uploadId: string): Promise<{ status: string; progress: number }> {
    const response = await apiClient.get<{ status: string; progress: number }>(
      `/upload/${uploadId}/status`
    );
    return response.data;
  },

  validateFile(file: File): { valid: boolean; error?: string } {
    const MAX_SIZE = 50 * 1024 * 1024; // 50MB
    const ALLOWED_TYPES = ['application/pdf'];

    if (!ALLOWED_TYPES.includes(file.type)) {
      return { valid: false, error: 'Only PDF files are allowed' };
    }

    if (file.size > MAX_SIZE) {
      return { valid: false, error: 'File size exceeds 50MB limit' };
    }

    return { valid: true };
  },
};

export default uploadService;