import apiClient from './apiClient'
import type {
  CreateRequestData,
  PDFRequest,
  RequestListFilters,
  RequestListResponse,
  RequestReadParams,
  ServiceType,
} from '@/types/request.types'

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
    userId: string,
    organizationName: string,
    filters: RequestListFilters = {}
  ): Promise<RequestListResponse> {
    const response = await apiClient.get('/service/list', {
      params: {
        user_id: userId,
        organization_name: organizationName,
        ...(filters.type ? { type: filters.type } : {}),
        ...(filters.status ? { status: filters.status } : {}),
      },
    })

    const services = toArray(response.data).map(mapServiceRecord)
    return {
      data: services,
      total: services.length,
    }
  },

  async getRequestById(
    params: RequestReadParams,
    serviceType?: ServiceType
  ): Promise<PDFRequest | null> {
    const response = await apiClient.get('/service/read', {
      params: {
        file_id: params.fileId,
        user_id: params.userId,
      },
    })

    const services = toArray(response.data).map(mapServiceRecord)
    return pickMatchingService(services, serviceType)
  },

  async getServicesByFile(params: RequestReadParams): Promise<PDFRequest[]> {
    const response = await apiClient.get('/service/read', {
      params: {
        file_id: params.fileId,
        user_id: params.userId,
      },
    })

    return toArray(response.data).map(mapServiceRecord)
  },

  async createRequest(data: CreateRequestData): Promise<PDFRequest> {
    const payload = {
      user_id: data.userId,
      organization_name: data.organizationName,
      file_id: data.fileId,
      type: data.type,
      ...(data.targetLanguage ? { target_language: data.targetLanguage } : {}),
    }

    const response = await apiClient.post('/service/create', payload)
    const item = response.data?.data ?? response.data
    return mapServiceRecord(item)
  },

  async deleteRequest(fileId: string, userId: string): Promise<void> {
    await apiClient.delete('/file/delete', {
      data: {
        file_id: fileId,
        user_id: userId,
      },
    })
  },

  async getRequestStatus(
    params: RequestReadParams,
    serviceType?: ServiceType
  ): Promise<PDFRequest | null> {
    return this.getRequestById(params, serviceType)
  },
}

export default requestService
