import type { UploadProgress } from '@/types/api.types'
import apiClient from './apiClient'
import clientNotificationService from './clientNotification.service'
import { notificationLogger } from '../utils/notification-utils'

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

    notificationLogger.info(`Starting file upload: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`)

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
            
            notificationLogger.debug(`Upload progress: ${file.name}`, { percentage })
          }
        },
      })

      // Complete upload notification
      await clientNotificationService.completeProgress(
        notificationId,
        '✅ Upload Complete!',
        `${file.name} is ready for processing`
      )

      const payload = response.data?.data ?? response.data ?? {}

      const fileId = payload.file_id ?? payload.fileId
      const filename = payload.filename ?? payload.file_name ?? file.name

      notificationLogger.info('✅ File upload completed successfully', {
        fileId,
        filename,
        sizeKB: Math.round(file.size / 1024),
      })

      return {
        fileId,
        filename,
      }
    } catch (error) {
      const errorMsg = (error as Error).message || 'Unknown error'
      
      // Show error notification
      await clientNotificationService.showError(
        '❌ Upload Failed',
        `Failed to upload ${file.name}: ${errorMsg}`,
        { tag: notificationId }
      )

      notificationLogger.error('File upload failed', {
        filename: file.name,
        error: errorMsg,
      })

      throw error
    }
  },

  async deleteFile(fileId: string): Promise<void> {
    try {
      notificationLogger.debug('Deleting file', { fileId })
      
      await apiClient.delete('/file/delete', {
        data: {
          file_id: fileId,
        },
      })

      notificationLogger.info('✅ File deleted successfully', { fileId })
    } catch (error) {
      notificationLogger.error('Failed to delete file', {
        fileId,
        error: (error as Error).message,
      })
      throw error
    }
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
      const error = 'Only PDF, PNG, JPG, or JPEG files are allowed'
      notificationLogger.warn('File validation failed: invalid type', {
        filename: file.name,
        fileType: file.type,
      })
      return { valid: false, error }
    }

    if (file.size > MAX_SIZE) {
      const error = 'File size exceeds 20MB limit'
      notificationLogger.warn('File validation failed: too large', {
        filename: file.name,
        sizeMB: (file.size / 1024 / 1024).toFixed(2),
      })
      return { valid: false, error }
    }

    notificationLogger.debug('File validation passed', {
      filename: file.name,
      sizeMB: (file.size / 1024 / 1024).toFixed(2),
      type: file.type,
    })

    return { valid: true }
  },
}

export default uploadService

