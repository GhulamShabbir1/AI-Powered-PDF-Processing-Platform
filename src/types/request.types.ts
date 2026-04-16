export type RequestStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface PDFRequest {
  id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  status: RequestStatus;
  uploadedAt: string;
  completedAt?: string;
  result?: string;
  error?: string;
}

export interface CreateRequestData {
  file: File;
  options?: RequestOptions;
}

export interface RequestOptions {
  outputFormat?: 'json' | 'text' | 'csv';
  extractImages?: boolean;
  extractTables?: boolean;
}

export interface RequestState {
  requests: PDFRequest[];
  currentRequest: PDFRequest | null;
  isLoading: boolean;
  error: string | null;
}

export interface RequestListResponse {
  data: PDFRequest[];
  total: number;
  page: number;
  limit: number;
}