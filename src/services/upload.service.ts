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

    // Append identity data
    const userId = localStorage.getItem('user_id');
    const orgId = localStorage.getItem('organization_id');
    
    if (userId) formData.append('user_id', userId);
    if (orgId) formData.append('organization_id', orgId);

    notificationLogger.info(`Starting file upload: ${file.name}`)
    const notificationId = await clientNotificationService.showProgress(`Uploading ${file.name}`, 0)

    try {
      // 1. Grab the raw token from localStorage
      const rawToken = localStorage.getItem('token') || '';

      const response = await apiClient.post('/file/upload', formData, {
        headers: {
          // 2. Send the RAW token (no "Bearer ")
          'Authorization': rawToken 
        },
        // 3. THIS IS CRITICAL: Delete the global JSON header from apiClient.ts 
        // so the browser natively builds the multipart file boundary.
        transformRequest: [(data, headers) => {
          delete headers['Content-Type'];
          return data;
        }],
        onUploadProgress: async (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            onProgress({
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage,
            })
            await clientNotificationService.updateProgress(notificationId, percentage)
          }
        },
      })

      await clientNotificationService.completeProgress(
        notificationId,
        '✅ Upload Complete!',
        `${file.name} is ready for processing`
      )

      const payload = response.data?.data ?? response.data ?? {}

      return {
        fileId: payload.file_id ?? payload.fileId,
        filename: payload.filename ?? payload.file_name ?? file.name
      }
      
    } catch (error) {
      const errorMsg = (error as Error).message || 'Unknown error'
      await clientNotificationService.showError('❌ Upload Failed', `Failed to upload: ${errorMsg}`, { tag: notificationId })
      throw error
    }
  },

  async deleteFile(fileId: string): Promise<void> {
    try {
      await apiClient.delete('/file/delete', { data: { file_id: fileId } })
    } catch (error) {
      throw error
    }
  },

  validateFile(file: File): { valid: boolean; error?: string } {
    const MAX_SIZE = 20 * 1024 * 1024
    const ALLOWED_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg']

    if (!ALLOWED_TYPES.includes(file.type)) return { valid: false, error: 'Only PDF, PNG, JPG, or JPEG files are allowed' }
    if (file.size > MAX_SIZE) return { valid: false, error: 'File size exceeds 20MB limit' }

    return { valid: true }
  },
}

export default uploadService