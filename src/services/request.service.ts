import type {
  CreateRequestData,
  PDFRequest,
  RequestListFilters,
  RequestListResponse,
  RequestReadParams,
  ServiceType,
} from '@/types/request.types'
import apiClient from './apiClient'
import { notificationLogger } from '../utils/notification-utils'
import clientNotificationService from './clientNotification.service'

const toArray = (payload: unknown): Record<string, any>[] => {
  if (Array.isArray(payload)) return payload as Record<string, any>[]
  if (payload && typeof payload === 'object') {
    const data = payload as Record<string, any>
    if (Array.isArray(data.data)) return data.data
    if (Array.isArray(data.services)) return data.services
    if (data.data && typeof data.data === 'object') {
      if (Array.isArray(data.data.services)) return data.data.services
      if (Array.isArray(data.data.items)) return data.data.items
      if (Array.isArray(data.data.results)) return data.data.results
    }
  }
  return []
}

const normalizeServiceType = (value: unknown): ServiceType => {
  if (value === 'translation' || value === 'summarization' || value === 'ocr') {
    return value
  }
  return 'ocr'
}

const mapServiceRecord = (item: Record<string, any>): PDFRequest => ({
  id: String(item.service_id ?? item.id ?? item._id ?? item.file_id ?? crypto.randomUUID()),
  fileId: String(item.file_id ?? item.fileId ?? item.file?.id ?? ''),
  userId: String(item.user_id ?? item.userId ?? item.user?.id ?? ''),
  organizationName: item.organization_name ?? item.organizationName ?? item.organization,
  filename: item.filename ?? item.file_name ?? item.file?.filename ?? item.original_name ?? 'Untitled file',
  status: item.status ?? 'pending',
  serviceType: normalizeServiceType(item.type ?? item.service_type),
  createdAt: item.created_at ?? item.createdAt ?? new Date().toISOString(),
  updatedAt: item.updated_at ?? item.updatedAt ?? item.created_at ?? new Date().toISOString(),
  result: item.result ?? item.output ?? item.response ?? null,
  error: item.error ?? item.message ?? null,
  downloadUrl: item.download_url ?? item.downloadUrl ?? item.file_url ?? null,
  targetLanguage: item.target_language ?? item.targetLanguage ?? null,
})

const pickMatchingService = (
  services: PDFRequest[],
  serviceType?: ServiceType
): PDFRequest | null => {
  if (!services.length) return null
  if (!serviceType) return services[0]
  return services.find((service) => service.serviceType === serviceType) ?? null
}

export const requestService = {
  async getRequests(
    _organizationId?: string,
    _filters: RequestListFilters = {}
  ): Promise<RequestListResponse> {
    try {
      notificationLogger.debug('Fetching requests')

      const response = await apiClient.get('/service/list')

      const services = toArray(response.data).map(mapServiceRecord)

      notificationLogger.info('✅ Requests fetched successfully', {
        count: services.length,
      })

      return {
        data: services,
        total: services.length,
      }
    } catch (error) {
      notificationLogger.error('Failed to fetch requests', {
        error: (error as Error).message,
      })
      throw error
    }
  },

  async getRequestById(
    params: RequestReadParams,
    serviceType?: ServiceType
  ): Promise<PDFRequest | null> {
    try {
      notificationLogger.debug('Fetching request by ID', {
        serviceId: params.fileId,
        serviceType,
      })

      const response = await apiClient.get('/service/read', {
        data: {
          service_id: params.fileId,
          download_pdf: '1',
        },
      })

      const services = toArray(response.data).map(mapServiceRecord)
      const result = pickMatchingService(services, serviceType)

      if (result) {
        notificationLogger.info('✅ Request fetched successfully', {
          status: result.status,
          serviceType: result.serviceType,
        })
      } else {
        notificationLogger.warn('⚠️  No matching request found', {
          serviceId: params.fileId,
          serviceType,
        })
      }

      return result
    } catch (error) {
      notificationLogger.error('Failed to fetch request by ID', {
        serviceId: params.fileId,
        error: (error as Error).message,
      })
      throw error
    }
  },

  async getServicesByFile(params: RequestReadParams): Promise<PDFRequest[]> {
    try {
      notificationLogger.debug('Fetching services by file', { fileId: params.fileId })

      const response = await apiClient.get('/service/read', {
        data: {
          service_id: params.fileId,
          download_pdf: '1',
        },
      })

      const services = toArray(response.data).map(mapServiceRecord)

      notificationLogger.info('✅ Services fetched successfully', {
        count: services.length,
        fileId: params.fileId,
      })

      return services
    } catch (error) {
      notificationLogger.error('Failed to fetch services by file', {
        fileId: params.fileId,
        error: (error as Error).message,
      })
      throw error
    }
  },

  async createRequest(data: CreateRequestData): Promise<PDFRequest> {
    try {
      notificationLogger.info('Creating processing request', {
        serviceType: data.type,
        fileId: data.fileId,
      })

      // Show processing notification
      await clientNotificationService.showStatus(
        'Processing Started',
        `Converting document using ${data.type}...`
      )

      const payload = {
        file_id: data.fileId,
        type: data.type,
        target_language: data.targetLanguage ?? '',
      }

      const response = await apiClient.post('/service/create', payload)
      const item = response.data?.data ?? response.data
      const request = mapServiceRecord(item)

      notificationLogger.info('✅ Processing request created successfully', {
        requestId: request.id,
        status: request.status,
        serviceType: request.serviceType,
      })

      return request
    } catch (error) {
      const errorMsg = (error as Error).message

      await clientNotificationService.showError(
        '❌ Processing Failed',
        `Could not start processing: ${errorMsg}`
      )

      notificationLogger.error('Failed to create processing request', {
        error: errorMsg,
        serviceType: data.type,
      })

      throw error
    }
  },

  async deleteRequest(fileId: string): Promise<void> {
    try {
      notificationLogger.debug('Deleting request', { fileId })

      await apiClient.delete('/file/delete', {
        data: {
          file_id: fileId,
        },
      })

      notificationLogger.info('✅ Request deleted successfully', { fileId })
    } catch (error) {
      notificationLogger.error('Failed to delete request', {
        fileId,
        error: (error as Error).message,
      })
      throw error
    }
  },

  async getRequestStatus(
    params: RequestReadParams,
    serviceType?: ServiceType
  ): Promise<PDFRequest | null> {
    try {
      const status = await this.getRequestById(params, serviceType)

      if (status) {
        notificationLogger.debug('Request status retrieved', {
          fileId: params.fileId,
          status: status.status,
        })
      }

      return status
    } catch (error) {
      notificationLogger.error('Failed to get request status', {
        fileId: params.fileId,
        error: (error as Error).message,
      })
      throw error
    }
  },
}

export default requestService
