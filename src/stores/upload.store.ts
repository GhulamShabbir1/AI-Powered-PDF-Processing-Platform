import { defineStore } from 'pinia';
import type { UploadProgress } from '../types/api.types';
import uploadService from '../services/upload.service';

interface UploadState {
  currentFile: File | null;
  fileId: string | null;
  progress: UploadProgress | null;
  isUploading: boolean;
  error: string | null;
}

export const useUploadStore = defineStore('upload', {
  state: (): UploadState => ({
    currentFile: null,
    fileId: null,
    progress: null,
    isUploading: false,
    error: null,
  }),

  getters: {
    hasFile: (state) => !!state.currentFile,
    uploadProgress: (state) => state.progress?.percentage ?? 0,
  },

  actions: {
    async uploadFile(file: File, userId: string) {
      const validation = uploadService.validateFile(file);
      if (!validation.valid) {
        this.error = validation.error || 'Invalid file';
        throw new Error(this.error || 'Invalid file');
      }

      this.currentFile = file;
      this.isUploading = true;
      this.error = null;
      this.progress = { loaded: 0, total: file.size, percentage: 0 };

      try {
        const uploadedFile = await uploadService.uploadFile(file, userId, (progress: UploadProgress) => {
          this.progress = progress;
        });
        this.fileId = uploadedFile.fileId;
        return uploadedFile;
      } catch (error) {
        this.error = (error as Error).message;
        throw error;
      } finally {
        this.isUploading = false;
      }
    },

    reset() {
      this.currentFile = null;
      this.fileId = null;
      this.progress = null;
      this.isUploading = false;
      this.error = null;
    },
  },
});

export default useUploadStore;
