import { defineStore } from 'pinia';
import type { UploadProgress } from '@/types/api.types';
import uploadService from '@/services/upload.service';

interface UploadState {
  currentFile: File | null;
  uploadId: string | null;
  progress: UploadProgress | null;
  isUploading: boolean;
  error: string | null;
}

export const useUploadStore = defineStore('upload', {
  state: (): UploadState => ({
    currentFile: null,
    uploadId: null,
    progress: null,
    isUploading: false,
    error: null,
  }),

  getters: {
    hasFile: (state) => !!state.currentFile,
    uploadProgress: (state) => state.progress?.percentage ?? 0,
  },

  actions: {
    async uploadFile(file: File) {
      const validation = uploadService.validateFile(file);
      if (!validation.valid) {
        this.error = validation.error || 'Invalid file';
        throw new Error(this.error);
      }

      this.currentFile = file;
      this.isUploading = true;
      this.error = null;
      this.progress = { loaded: 0, total: file.size, percentage: 0 };

      try {
        const uploadId = await uploadService.uploadFile(file, (progress) => {
          this.progress = progress;
        });
        this.uploadId = uploadId;
        return uploadId;
      } catch (error) {
        this.error = (error as Error).message;
        throw error;
      } finally {
        this.isUploading = false;
      }
    },

    async checkUploadStatus(uploadId: string) {
      const status = await uploadService.getUploadStatus(uploadId);
      return status;
    },

    reset() {
      this.currentFile = null;
      this.uploadId = null;
      this.progress = null;
      this.isUploading = false;
      this.error = null;
    },
  },
});

export default useUploadStore;