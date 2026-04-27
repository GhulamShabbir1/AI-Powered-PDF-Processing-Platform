export type RequestStatus = 'pending' | 'processing' | 'completed' | 'failed'
export type ServiceType = 'ocr' | 'summarization' | 'translation'

export interface PDFRequest {
  id: string
  fileId: string
  userId: string
  organizationName?: string
  filename: string
  status: RequestStatus
  serviceType: ServiceType
  createdAt: string
  updatedAt: string
  result?: unknown
  error?: string | null
  downloadUrl?: string | null
  targetLanguage?: string | null
}

export interface CreateRequestData {
  fileId: string
  type: ServiceType
  targetLanguage?: string
}

export interface RequestListFilters {
  search?: string
  type?: ServiceType
  status?: RequestStatus
  dateFrom?: string
  dateTo?: string
  targetLanguage?: string
}

export interface RequestReadParams {
  fileId: string
}

export interface RequestState {
  requests: PDFRequest[]
  currentRequest: PDFRequest | null
  isLoading: boolean
  error: string | null
}

export interface RequestListResponse {
  data: PDFRequest[]
  total: number
}
