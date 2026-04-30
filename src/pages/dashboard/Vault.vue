<template>
  <div class="history-page">
    <v-container class="py-4 py-md-6">

      <!-- 🔷 Header -->
      <div class="history-header d-flex flex-column flex-sm-row align-start align-sm-center justify-space-between mb-4 mb-md-6 ga-2">
        <div>
          <h1 class="text-h5 text-md-h4 font-weight-bold mb-1">History</h1>
          <p class="text-body-2 text-medium-emphasis">
            All processed files ({{ filteredRequestCount }})
          </p>
        </div>

        <v-btn
          color="primary"
          variant="flat"
          prepend-icon="mdi-arrow-left"
          :to="{ name: 'Dashboard' }"
          class="rounded-lg"
        >
          Back
        </v-btn>
      </div>

      <!-- 🔍 Filters -->
      <v-card class="filters-card mb-6 pa-4" elevation="1">
        <div class="d-flex flex-wrap ga-4 align-end">
          <!-- Service Type Filter -->
          <div class="filter-group">
            <label class="text-caption font-weight-medium mb-2 d-block">Service</label>
            <v-select
              v-model="selectedServiceType"
              :items="serviceTypeOptions"
              item-title="text"
              item-value="value"
              label="All Services"
              variant="outlined"
              density="compact"
              clearable
              class="filter-select"
              @update:model-value="applyFilters"
            />
          </div>

          <!-- Status Filter -->
          <div class="filter-group">
            <label class="text-caption font-weight-medium mb-2 d-block">Status</label>
            <v-select
              v-model="selectedStatus"
              :items="statusOptions"
              item-title="text"
              item-value="value"
              label="All Status"
              variant="outlined"
              density="compact"
              clearable
              class="filter-select"
              @update:model-value="applyFilters"
            />
          </div>

          <!-- Date From Filter -->
          <div class="filter-group">
            <label class="text-caption font-weight-medium mb-2 d-block">From Date</label>
            <v-text-field
              v-model="dateFrom"
              type="date"
              variant="outlined"
              density="compact"
              class="filter-select"
              @update:model-value="applyFilters"
            />
          </div>

          <!-- Date To Filter -->
          <div class="filter-group">
            <label class="text-caption font-weight-medium mb-2 d-block">To Date</label>
            <v-text-field
              v-model="dateTo"
              type="date"
              variant="outlined"
              density="compact"
              class="filter-select"
              @update:model-value="applyFilters"
            />
          </div>

          <!-- Reset Filters Button -->
          <v-btn
            v-if="hasActiveFilters"
            variant="text"
            color="primary"
            size="medium"
            prepend-icon="mdi-close-circle-outline"
            @click="resetFilters"
            class="mt-6"
          >
            Clear Filters
          </v-btn>
        </div>
      </v-card>

      <!-- 🔄 Loading -->
      <div v-if="requestStore.isLoading">
        <v-skeleton-loader type="table" />
      </div>

      <!-- 📭 Empty State -->
      <div v-else-if="filteredRequests.length === 0" class="empty-state">
        <v-icon icon="mdi-file-document-outline" size="90" class="mb-4 empty-icon" />

        <h3 class="text-h6 mb-2">{{ hasActiveFilters ? 'No files match your filters' : 'No files uploaded yet' }}</h3>

        <p class="text-body-2 text-medium-emphasis mb-5">
          {{ hasActiveFilters ? 'Try adjusting your filters' : 'Process your first PDF to see it here' }}
        </p>

        <v-btn color="primary" size="large" class="rounded-lg" :to="{ name: 'Dashboard' }">
          {{ hasActiveFilters ? 'Clear Filters' : 'Upload Document' }}
        </v-btn>
      </div>

      <!-- 📊 Table -->
      <v-card
        v-else
        class="history-card overflow-x-auto"
        elevation="0"
      >
        <v-data-table
          :headers="headers"
          :items="filteredRequests"
          item-value="id"
          density="comfortable"
          class="history-table"
        >

          <!-- 📄 File -->
          <template #item.filename="{ item }">
            <div class="d-flex align-center ga-3">
              <v-avatar color="primary" size="40" class="file-avatar">
                <v-icon icon="mdi-file-pdf" />
              </v-avatar>

              <div>
                <div class="font-weight-medium line-clamp-1">
                  {{ item.filename || item.id.slice(-8) }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  {{ formatDate(item.createdAt) }}
                </div>
              </div>
            </div>
          </template>

          <!-- ⚡ Status -->
          <template #item.status="{ item }">
            <v-chip
              :color="getStatusColor(item.status)"
              size="small"
              variant="flat"
              class="font-weight-medium"
            >
              {{ capitalize(item.status) }}
            </v-chip>
          </template>

          <!-- ⚙️ Actions -->
          <template #item.actions="{ item }">
            <div class="d-flex ga-2">
              <v-btn
                icon="mdi-refresh"
                size="small"
                variant="text"
                color="primary"
                class="action-btn"
                @click="refreshRequest(item)"
              />

              <v-btn
                icon="mdi-download-outline"
                size="small"
                variant="text"
                color="success"
                class="action-btn"
                :href="item.downloadUrl || undefined"
                :disabled="!item.downloadUrl"
              />

              <v-btn
                icon="mdi-delete-outline"
                size="small"
                variant="text"
                color="error"
                class="action-btn"
                @click="removeFile(item)"
              />
            </div>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../../stores'
import { useRequestStore } from '../../stores/request.store'
import type { PDFRequest } from '../../types/request.types'
import { computed, onMounted, ref } from 'vue'

const authStore = useAuthStore()
const requestStore = useRequestStore()

// Filter states
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
  () =>
    toSafeText(authStore.currentUser?.organization_id) ||
    toSafeText(localStorage.getItem('organization_id')) ||
    ''
)

// Service type options
const serviceTypeOptions = [
  { text: 'OCR', value: 'ocr' },
  { text: 'Summarization', value: 'summarization' },
  { text: 'Translation', value: 'translation' },
]

// Status filter options
const statusOptions = [
  { text: 'Pending', value: 'pending' },
  { text: 'Processing', value: 'processing' },
  { text: 'Completed', value: 'completed' },
  { text: 'Failed', value: 'failed' },
]

const allRequests = computed(() => requestStore.requests)

// Check if any filters are active
const hasActiveFilters = computed(() => {
  return selectedServiceType.value !== null || selectedStatus.value !== null || dateFrom.value || dateTo.value
})

// Filter logic
const filteredRequests = computed(() => {
  let filtered = allRequests.value

  // Filter by service type
  if (selectedServiceType.value) {
    filtered = filtered.filter((req: PDFRequest) => req.serviceType === selectedServiceType.value)
  }

  // Filter by status
  if (selectedStatus.value) {
    filtered = filtered.filter((req: PDFRequest) => req.status === selectedStatus.value)
  }

  // Filter by date range
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
const requestCount = computed(() => allRequests.value.length)

const headers = [
  { title: 'File', key: 'filename', sortable: false },
  { title: 'Service', key: 'serviceType', width: 140 },
  { title: 'Status', key: 'status', width: 130, sortable: false },
  { title: 'Processed', key: 'updatedAt', width: 160 },
  { title: '', key: 'actions', width: 100, sortable: false },
]

onMounted(async () => {
  if (organizationId.value) {
    await requestStore.fetchAllRequests(organizationId.value)
  }
})

const applyFilters = () => {
  // Filters are applied reactively through computed properties
}

const resetFilters = () => {
  selectedServiceType.value = null
  selectedStatus.value = null
  dateFrom.value = ''
  dateTo.value = ''
}

const refreshRequest = async (item: PDFRequest) => {
  const latest = await requestStore.fetchRequestById(item.fileId, item.serviceType)
  if (latest) {
    const index = requestStore.requests.findIndex((request: PDFRequest) => request.id === latest.id)
    if (index >= 0) {
      requestStore.requests[index] = latest
    }
  }
}

const removeFile = async (item: PDFRequest) => {
  await requestStore.deleteRequest(item.fileId)
}

const getStatusColor = (status: PDFRequest['status']) => {
  return {
    completed: 'success',
    processing: 'warning',
    pending: 'info',
    failed: 'error'
  }[status] || 'grey'
}

const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1)

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
</script>

<style scoped>

/* 🌫 Background */
.history-page {
  background: linear-gradient(135deg, #f8fafc, #eef2ff);
  min-height: 100vh;
}

/* 🔝 Header */
.history-header {
  padding: 0 4px;
}

/* � Filters */
.filters-card {
  border-radius: 14px;
  background: white;
  border: 1px solid rgba(79, 70, 229, 0.1);
}

.filter-group {
  min-width: 180px;
}

.filter-select {
  min-width: 180px;
}

/* 🔄 Loader */
.loader-wrapper {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 📭 Empty */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  color: #cbd5f5;
}

/* 📦 Card */
.history-card {
  border-radius: 18px;
  background: white;
  padding: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

/* 📊 Table */
.history-table :deep(.v-data-table-header__row) {
  background: #f8fafc !important;
}

.history-table :deep(.v-data-table-row) {
  transition: all 0.2s ease;
}

.history-table :deep(.v-data-table-row:hover) {
  background: #f1f5f9 !important;
}

/* 📄 File Avatar */
.file-avatar {
  box-shadow: 0 4px 10px rgba(79,70,229,0.3);
}

/* ⚙️ Actions */
.action-btn {
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: scale(1.15);
}

/* ✂️ Text Clamp */
.line-clamp-1 {
  display: -webkit-box;
  line-clamp: 1;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 📱 Mobile */
@media (max-width: 600px) {
  .history-card {
    border-radius: 12px;
    padding: 4px;
  }

  .filter-group {
    min-width: 100%;
  }

  .filter-select {
    min-width: 100%;
  }
}

</style>
