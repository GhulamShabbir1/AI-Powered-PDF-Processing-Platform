<template>
  <div class="history-page">
    
    <div class="d-flex align-center justify-space-between mb-6 flex-shrink-0">
      <div>
        <h1 class="text-h5 font-weight-bold text-grey-darken-4 mb-1">History</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          All processed files ({{ filteredRequestCount }})
        </p>
      </div>
      <v-btn
        color="primary"
        variant="tonal"
        prepend-icon="mdi-arrow-left"
        :to="{ name: 'Dashboard' }"
        class="text-none rounded-lg"
      >
        Back
      </v-btn>
    </div>

    <div class="d-flex flex-wrap align-center ga-3 mb-6 flex-shrink-0">
      <v-select
        v-model="selectedServiceType"
        :items="serviceTypeOptions"
        item-title="text"
        item-value="value"
        label="Service"
        variant="outlined"
        density="compact"
        hide-details
        class="filter-input bg-white"
        clearable
      />
      <v-select
        v-model="selectedStatus"
        :items="statusOptions"
        item-title="text"
        item-value="value"
        label="Status"
        variant="outlined"
        density="compact"
        hide-details
        class="filter-input bg-white"
        clearable
      />
      <v-text-field
        v-model="dateFrom"
        type="date"
        label="From Date"
        variant="outlined"
        density="compact"
        hide-details
        class="filter-input bg-white"
      />
      <v-text-field
        v-model="dateTo"
        type="date"
        label="To Date"
        variant="outlined"
        density="compact"
        hide-details
        class="filter-input bg-white"
      />

      <v-btn
        v-if="hasActiveFilters"
        variant="text"
        color="primary"
        prepend-icon="mdi-close-circle-outline"
        @click="resetFilters"
        class="text-none font-weight-bold tracking-normal"
        height="40"
      >
        CLEAR FILTERS
      </v-btn>
    </div>

    <v-card class="history-card" elevation="0">
      
      <div v-if="requestStore.isLoading" class="d-flex flex-grow-1 align-center justify-center">
        <v-progress-circular indeterminate color="primary" size="48" width="4"></v-progress-circular>
      </div>

      <div v-else-if="filteredRequests.length === 0" class="empty-state d-flex flex-column align-center justify-center flex-grow-1">
        <v-icon icon="mdi-file-document-outline" size="64" color="grey-lighten-2" class="mb-4" />
        <h3 class="text-h6 font-weight-medium text-grey-darken-3">
          {{ hasActiveFilters ? 'No files match your filters' : 'No files uploaded yet' }}
        </h3>
        <p class="text-body-2 text-medium-emphasis mb-5">
          {{ hasActiveFilters ? 'Try adjusting your filters' : 'Process your first PDF to see it here' }}
        </p>
        <v-btn color="primary" variant="tonal" class="text-none rounded-lg" :to="{ name: 'Dashboard' }">
          {{ hasActiveFilters ? 'Clear Filters' : 'Upload Document' }}
        </v-btn>
      </div>

      <v-data-table
        v-else
        :headers="headers"
        :items="filteredRequests"
        item-value="id"
        density="comfortable"
        fixed-header
        class="history-table"
      >
        <template #item.filename="{ item }">
          <div class="d-flex align-center ga-3 py-2">
            <v-avatar color="primary" size="36" class="file-avatar">
              <v-icon icon="mdi-file-pdf" size="20" />
            </v-avatar>
            <div>
              <div class="font-weight-medium text-body-2 line-clamp-1">
                {{ item.filename || item.id.slice(-8) }}
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ formatDate(item.createdAt) }}
              </div>
            </div>
          </div>
        </template>

        <template #item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            size="small"
            variant="flat"
            class="font-weight-medium text-capitalize"
          >
            {{ item.status }}
          </v-chip>
        </template>

        <template #item.updatedAt="{ item }">
          <span class="text-body-2 text-medium-emphasis">
            {{ formatDate(item.updatedAt) }}
          </span>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../../stores'
import { useRequestStore } from '../../stores/request.store'
import type { PDFRequest } from '../../types/request.types'
import { computed, onMounted, ref } from 'vue'

const authStore = useAuthStore()
const requestStore = useRequestStore()

const selectedServiceType = ref<string | null>(null)
const selectedStatus = ref<string | null>(null)
const dateFrom = ref<string>('')
const dateTo = ref<string>('')

const toSafeText = (value: unknown): string => {
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  return ''
}

const organizationId = computed(
  () => toSafeText(authStore.currentUser?.organization_id) || toSafeText(localStorage.getItem('organization_id')) || ''
)

const serviceTypeOptions = [
  { text: 'All Services', value: null },
  { text: 'OCR', value: 'ocr' },
  { text: 'Summarization', value: 'summarization' },
  { text: 'Translation', value: 'translation' },
]

const statusOptions = [
  { text: 'All Status', value: null },
  { text: 'Pending', value: 'pending' },
  { text: 'Processing', value: 'processing' },
  { text: 'Completed', value: 'completed' },
  { text: 'Failed', value: 'failed' },
]

const allRequests = computed(() => requestStore.requests)

const hasActiveFilters = computed(() => {
  return selectedServiceType.value !== null || selectedStatus.value !== null || dateFrom.value || dateTo.value
})

const filteredRequests = computed(() => {
  let filtered = allRequests.value

  if (selectedServiceType.value) {
    filtered = filtered.filter((req: PDFRequest) => req.serviceType === selectedServiceType.value)
  }

  if (selectedStatus.value) {
    filtered = filtered.filter((req: PDFRequest) => req.status === selectedStatus.value)
  }

  if (dateFrom.value) {
    const fromDate = new Date(dateFrom.value)
    fromDate.setHours(0, 0, 0, 0)
    filtered = filtered.filter((req: PDFRequest) => {
      const createdDate = new Date(req.createdAt)
      createdDate.setHours(0, 0, 0, 0)
      return createdDate >= fromDate
    })
  }

  if (dateTo.value) {
    const toDate = new Date(dateTo.value)
    toDate.setHours(23, 59, 59, 999)
    filtered = filtered.filter((req: PDFRequest) => {
      const createdDate = new Date(req.createdAt)
      return createdDate <= toDate
    })
  }

  return filtered
})

const filteredRequestCount = computed(() => filteredRequests.value.length)

// Actions column has been removed
const headers = [
  { title: 'File', key: 'filename', sortable: false },
  { title: 'Service', key: 'serviceType', width: 140 },
  { title: 'Status', key: 'status', width: 130, sortable: false },
  { title: 'Processed', key: 'updatedAt', width: 180 }
]

onMounted(async () => {
  if (organizationId.value) {
    await requestStore.fetchAllRequests(organizationId.value)
  }
})

const resetFilters = () => {
  selectedServiceType.value = null
  selectedStatus.value = null
  dateFrom.value = ''
  dateTo.value = ''
}

const getStatusColor = (status: PDFRequest['status']) => {
  return {
    completed: 'success',
    processing: 'warning',
    pending: 'info',
    failed: 'error'
  }[status] || 'grey'
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
/* 1. Exact viewport math: 
  100vh - Navbar (64px) - Footer (48px) - Padding (~48px) = ~160px.
  This completely destroys the universal scroll.
*/
.history-page {
  height: calc(100vh - 160px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 2. Container expands to fill remaining space but never overflows */
.history-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 12px;
  background: white;
  border: 1px solid rgba(15, 23, 42, 0.08);
}

/* 3. The table forces the inner body wrapper to scroll */
.history-table {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.history-table :deep(.v-table__wrapper) {
  flex: 1;
  overflow-y: auto;
}

.history-table :deep(.v-data-table-footer) {
  flex-shrink: 0; /* Keep the pagination locked at the bottom */
}

/* Filters */
.filter-input {
  min-width: 160px;
  max-width: 220px;
  flex: 1 1 auto;
}

/* Table Aesthetics */
.history-table :deep(.v-data-table-header__row) th {
  background: #f8fafc !important;
  font-weight: 600 !important;
  color: #475569 !important;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08) !important;
}

.history-table :deep(.v-data-table-row) {
  transition: background-color 0.2s ease;
}

.history-table :deep(.v-data-table-row:hover) {
  background: #f8fafc !important;
}

/* File Avatar */
.file-avatar {
  border-radius: 8px;
  background: rgba(79, 70, 229, 0.1) !important;
  color: #4F46E5 !important;
}

/* Text Truncation */
.line-clamp-1 {
  display: -webkit-box;
  line-clamp: 1;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Mobile Adjustments */
@media (max-width: 600px) {
  .history-page {
    height: calc(100vh - 120px); /* Tighter padding on mobile */
  }
  .filter-input {
    min-width: 100%;
    max-width: 100%;
  }
}
</style>