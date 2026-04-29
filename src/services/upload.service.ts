import type { UploadProgress } from '@/types/api.types'
import apiClient from './apiClient'
import clientNotificationService from './clientNotification.service'

export interface UploadedFileResponse {
  fileId: string
  filename?: string
}

export const uploadService = {
  async uploadFile(
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadedFileResponse> {
    const formData = new FormData()
    formData.append('file', file)

    // Start upload notification
    const notificationId = await clientNotificationService.showProgress(
      `Uploading ${file.name}`,
      0
    )

    try {
      const response = await apiClient.post('/file/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: async (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            onProgress({
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage,
            })
            
            // Update notification progress
            await clientNotificationService.updateProgress(notificationId, percentage)
          }
        },
      })

      // Complete upload notification
      await clientNotificationService.completeProgress(
        notificationId,
        'Upload Complete!',
        `${file.name} ready for processing`
      )

      const payload = response.data?.data ?? response.data ?? {}

      return {
        fileId: payload.file_id ?? payload.fileId,
        filename: payload.filename ?? payload.file_name ?? file.name,
      }
    } catch (error) {
      // Show error notification
      await clientNotificationService.showError(
        'Upload Failed',
        `Failed to upload ${file.name}`,
        { tag: notificationId }
      )
      throw error
    }
  },

  async deleteFile(fileId: string): Promise<void> {
    await apiClient.delete('/file/delete', {
      data: {
        file_id: fileId,
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

