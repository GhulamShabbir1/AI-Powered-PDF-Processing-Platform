import { ref, computed } from 'vue';
import { useUploadStore } from '@/stores';
import uploadService from '@/services/upload.service';
import type { UploadProgress } from '@/types/api.types';

export function useUpload() {
  const uploadStore = useUploadStore();
  const selectedFile = ref<File | null>(null);
  const validationError = ref<string | null>(null);

  const isUploading = computed(() => uploadStore.isUploading);
  const progress = computed(() => uploadStore.progress);
  const error = computed(() => uploadStore.error);

  function selectFile(file: File) {
    validationError.value = null;
    selectedFile.value = file;

    const validation = uploadService.validateFile(file);
    if (!validation.valid) {
      validationError.value = validation.error || 'Invalid file';
      selectedFile.value = null;
    }
  }

  async function upload(onProgress?: (progress: UploadProgress) => void) {
    if (!selectedFile.value) {
      throw new Error('No file selected');
    }

    if (validationError.value) {
      throw new Error(validationError.value);
    }

    const uploadId = await uploadStore.uploadFile(selectedFile.value);
    
    if (onProgress) {
      uploadStore.$subscribe((mutation, state) => {
        if (state.progress) {
          onProgress(state.progress);
        }
      });
    }

    return uploadId;
  }

  function clearFile() {
    selectedFile.value = null;
    validationError.value = null;
    uploadStore.reset();
  }

  return {
    selectedFile,
    validationError,
    isUploading,
    progress,
    error,
    selectFile,
    upload,
    clearFile,
  };
}

export default useUpload;