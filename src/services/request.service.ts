import type {
  CreateRequestData,
  PDFRequest,
  RequestListFilters,
  RequestListResponse,
  RequestReadParams,
  ServiceType,
} from '@/types/request.types'
import apiClient from './apiClient'
import clientNotificationService from './clientNotification.service'

const toArray = (payload: unknown): Record<string, any>[] => {
  if (Array.isArray(payload)) return payload as Record<string, any>[]

  if (payload && typeof payload === 'object') {
    const data = payload as Record<string, any>

    if (data.data && typeof data.data === 'object') {
      if (data.data.service && typeof data.data.service === 'object') {
        return [data.data.service]
      }

      if (Array.isArray(data.data.services)) return data.data.services
      if (Array.isArray(data.data.items)) return data.data.items
      if (Array.isArray(data.data.results)) return data.data.results
      if (data.data.service_id || data.data.id) return [data.data]
    }

    if (Array.isArray(data.data)) return data.data
    if (Array.isArray(data.services)) return data.services
  }

  return []
}

const normalizeServiceType = (value: unknown): ServiceType => {
  if (value === 'translation' || value === 'summarization' || value === 'ocr') {
    return value
  }
  return 'ocr'
}

const extractServiceResult = (item: Record<string, any>): unknown => {
  const rawResult = item.result ?? item.output ?? item.response ?? null

  if (!rawResult || typeof rawResult !== 'object') {
    return rawResult
  }

  const record = rawResult as Record<string, any>
  const nestedData = record.data

  if (nestedData && typeof nestedData === 'object') {
    const nestedRecord = nestedData as Record<string, any>

    if (
      nestedRecord.summarized_text ||
      nestedRecord.translated_text ||
      nestedRecord.extracted_text ||
      nestedRecord.ocr_text ||
      nestedRecord.text ||
      nestedRecord.summary
    ) {
      return nestedData
    }
  }

  return rawResult
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
  result: extractServiceResult(item),
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
    organizationId: string,
    filters: RequestListFilters = {}
  ): Promise<RequestListResponse> {
    const response = await apiClient.get('/service/list', {
      params: {
        organization_id: organizationId,
        ...(filters.search ? { search: filters.search } : {}),
        ...(filters.type ? { type: filters.type } : {}),
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.dateFrom ? { date_from: filters.dateFrom } : {}),
        ...(filters.dateTo ? { date_to: filters.dateTo } : {}),
        ...(filters.targetLanguage ? { target_language: filters.targetLanguage } : {}),
      },
    })

    const services = toArray(response.data).map(mapServiceRecord)
    return { data: services, total: services.length }
  },

  async getRequestById(
    params: RequestReadParams,
    serviceType?: ServiceType
  ): Promise<PDFRequest | null> {
    const response = await apiClient.get('/service/read', {
      params: {
        service_id: (params as any).serviceId || params.fileId,
      },
    })

    const services = toArray(response.data).map(mapServiceRecord)
    return pickMatchingService(services, serviceType)
  },

  async getServicesByFile(params: RequestReadParams): Promise<PDFRequest[]> {
    const response = await apiClient.get('/service/read', {
      params: {
        service_id: (params as any).serviceId || params.fileId,
      },
    })

    return toArray(response.data).map(mapServiceRecord)
  },

  async createRequest(data: CreateRequestData): Promise<PDFRequest> {
    try {
      const payload = {
        file_id: data.fileId,
        type: data.type,
        target_language: data.targetLanguage ?? '',
      }

      const response = await apiClient.post('/service/create', payload)
      await clientNotificationService.showStatus(
        'Processing Started',
        `Converting document using ${data.type}...`
      )

      const item = response.data?.data ?? response.data
      return mapServiceRecord(item)
    } catch (error) {
      const errorMsg = (error as Error).message
      await clientNotificationService.showError(
        'Processing Failed',
        `Could not start processing: ${errorMsg}`
      )
      throw error
    }
  },

  async deleteRequest(fileId: string): Promise<void> {
    await apiClient.delete('/file/delete', {
      data: {
        file_id: fileId,
        service_id: fileId,
      },
    })
  },

  async getRequestStatus(
    params: RequestReadParams,
    serviceType?: ServiceType
  ): Promise<PDFRequest | null> {
    return await this.getRequestById(params, serviceType)
  },
}

export default requestService
