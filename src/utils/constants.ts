export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  REQUESTS: {
    LIST: '/requests',
    DETAIL: (id: string) => `/requests/${id}`,
    STATUS: (id: string) => `/requests/${id}/status`,
    CREATE: '/requests',
    DELETE: (id: string) => `/requests/${id}`,
  },
  UPLOAD: {
    UPLOAD: '/upload',
    STATUS: (id: string) => `/upload/${id}/status`,
  },
};

export const ROUTES = {
  LANDING: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  UPLOAD: '/dashboard/upload',
  REQUESTS: '/dashboard/requests',
  REQUEST_DETAILS: (id: string) => `/requests/${id}`,
};

export const FILE_LIMITS = {
  MAX_SIZE: 50 * 1024 * 1024,
  ALLOWED_TYPES: ['application/pdf'],
};

export const POLLING_INTERVALS = {
  DEFAULT: 5000,
  FAST: 2000,
  SLOW: 10000,
};

export const STATUS_COLORS: Record<string, string> = {
  pending: 'warning',
  processing: 'info',
  completed: 'success',
  failed: 'error',
};