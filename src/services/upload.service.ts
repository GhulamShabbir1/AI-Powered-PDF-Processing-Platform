import apiClient from './apiClient'
import type { UploadProgress } from '@/types/api.types'

export interface UploadedFileResponse {
  fileId: string
  filename?: string
}

export const uploadService = {
  async uploadFile(
    file: File,
    userId: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadedFileResponse> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('user_id', userId)

    const response = await apiClient.post('/file/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress({
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage,
          })
        }
      },
    })

    const payload = response.data?.data ?? response.data ?? {}

    return {
      fileId: payload.file_id ?? payload.fileId,
      filename: payload.filename ?? payload.file_name ?? file.name,
    }
  },

  async deleteFile(fileId: string, userId: string): Promise<void> {
    await apiClient.delete('/file/delete', {
      data: {
        file_id: fileId,
        user_id: userId,
      },
    })
  },

  validateFile(file: File): { valid: boolean; error?: string } {
    const MAX_SIZE = 20 * 1024 * 1024
    const ALLOWED_TYPES = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
    ]

    if (!ALLOWED_TYPES.includes(file.type)) {
      return { valid: false, error: 'Only PDF, PNG, JPG, or JPEG files are allowed' }
    }

    if (file.size > MAX_SIZE) {
      return { valid: false, error: 'File size exceeds 20MB limit' }
    }

    return { valid: true }
  },
}

export default uploadService
