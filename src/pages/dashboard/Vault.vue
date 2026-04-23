<template>
  <div class="vault-page dashboard-page">
    <v-container fluid class="pa-0">

      <!-- Header -->
      <div class="vault-header d-flex align-center justify-space-between mb-6">
        <div>
          <h1 class="text-h5 text-md-h4 font-weight-bold mb-1">Vault</h1>
          <p class="text-body-2 text-medium-emphasis mb-0">
            All uploaded files ({{ requestCount }})
          </p>
        </div>

        <v-btn
          color="primary"
          :to="{ name: 'Dashboard' }"
          prepend-icon="mdi-arrow-left"
          variant="tonal"
        >
          Back
        </v-btn>
      </div>

      <!-- Loading -->
      <v-container
        v-if="requestStore.isLoading"
        class="d-flex justify-center align-center"
        style="height: 300px"
      >
        <v-progress-circular indeterminate color="primary" size="50" />
      </v-container>

      <!-- Empty -->
      <v-container
        v-else-if="allRequests.length === 0"
        class="text-center pa-8"
      >
        <v-icon size="80" color="grey-lighten-1" class="mb-4">
          mdi-file
        </v-icon>

        <h3 class="text-h6 mb-2">No files uploaded yet</h3>

        <p class="text-body-2 text-medium-emphasis mb-4">
          Process your first PDF to see it here
        </p>

        <v-btn color="primary" :to="{ name: 'Dashboard' }">
          Process Document
        </v-btn>
      </v-container>

      <!-- Table -->
      <v-container v-else fluid class="pa-0">

        <v-data-table
          :headers="headers"
          :items="allRequests"
          item-value="id"
          density="comfortable"
          class="vault-table"
        >

          <!-- File -->
          <template #item.filename="{ item }">
            <div class="d-flex align-center ga-3">
              <v-avatar color="primary" size="36">
                <v-icon>mdi-file-pdf</v-icon>
              </v-avatar>

              <div>
                <div class="font-weight-medium">
                  {{ item.filename || item.id.slice(-8) }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  {{ formatDate(item.createdAt) }}
                </div>
              </div>
            </div>
          </template>

          <!-- Status -->
          <template #item.status="{ item }">
            <v-chip
              :color="getStatusColor(item.status)"
              size="small"
              label
            >
              {{ capitalize(item.status) }}
            </v-chip>
          </template>

          <!-- Actions -->
          <template #item.actions="{ item }">
            <div class="d-flex ga-2">

              <v-btn
                icon="mdi-eye"
                size="small"
                variant="text"
                color="info"
                :to="`/request/${item.id}`"
              />

              <v-btn
                icon="mdi-download"
                size="small"
                variant="text"
                color="success"
                :href="item.downloadUrl"
                :disabled="!item.downloadUrl"
              />

            </div>
          </template>

        </v-data-table>

      </v-container>

    </v-container>
  </div>
</template>

<script setup lang="ts">
import { useRequestStore } from '@/stores/request.store'
import type { PDFRequest } from '@/types/request.types'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const requestStore = useRequestStore()
const router = useRouter()

const allRequests = computed(() => requestStore.requests)
const requestCount = computed(() => allRequests.value.length)

const headers = [
  { title: 'File', key: 'filename', sortable: false },
  { title: 'Service', key: 'serviceType', width: 120 },
  { title: 'Status', key: 'status', width: 120, sortable: false },
  { title: 'Processed', key: 'updatedAt', width: 140 },
  { title: '', key: 'actions', width: 100, sortable: false },
]

onMounted(async () => {
  await requestStore.fetchAllRequests()
})

const getStatusColor = (status: PDFRequest['status']) => {
  const colors: Record<string, string> = {
    completed: 'success',
    processing: 'warning',
    pending: 'info',
    failed: 'error'
  }
  return colors[status] || 'grey'
}

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

const formatDate = (dateString: string) => {
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
.vault-page {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100%;
}

.vault-header {
  padding: 0 1rem;
}

.vault-table {
  border-radius: 16px !important;
  overflow: hidden;
  background: white;
}

.vault-table :deep(.v-data-table-header__row) {
  background: linear-gradient(90deg, #f8fafc, #f1f5f9) !important;
  border-bottom: 2px solid #e2e8f0 !important;
}

.vault-table :deep(.v-data-table-row:hover) {
  background-color: #f8fafc !important;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 600px) {
  .vault-table {
    margin: 0 -1rem !important;
    border-radius: 0 !important;
  }
}
</style>

