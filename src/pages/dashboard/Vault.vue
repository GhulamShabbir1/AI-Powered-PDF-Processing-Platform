<template>
  <div class="vault-page">
    <v-container class="py-6">

      <!-- 🔷 Header -->
      <div class="vault-header d-flex align-center justify-space-between mb-6">
        <div>
          <h1 class="text-h5 text-md-h4 font-weight-bold mb-1">Vault</h1>
          <p class="text-body-2 text-medium-emphasis">
            All uploaded files ({{ requestCount }})
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

      <!-- 🔄 Loading -->
      <div v-if="requestStore.isLoading" class="loader-wrapper">
        <v-progress-circular indeterminate color="primary" size="60" />
      </div>

      <!-- 📭 Empty State -->
      <div v-else-if="allRequests.length === 0" class="empty-state">
        <v-icon icon="mdi-file-document-outline" size="90" class="mb-4 empty-icon" />

        <h3 class="text-h6 mb-2">No files uploaded yet</h3>

        <p class="text-body-2 text-medium-emphasis mb-5">
          Process your first PDF to see it here
        </p>

        <v-btn color="primary" size="large" class="rounded-lg" :to="{ name: 'Dashboard' }">
          Upload Document
        </v-btn>
      </div>

      <!-- 📊 Table -->
      <v-card
        v-else
        class="vault-card"
        elevation="0"
      >
        <v-data-table
          :headers="headers"
          :items="allRequests"
          item-value="id"
          density="comfortable"
          class="vault-table"
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
                icon="mdi-eye-outline"
                size="small"
                variant="text"
                color="primary"
                class="action-btn"
                :to="`/request/${item.id}`"
              />

              <v-btn
                icon="mdi-download-outline"
                size="small"
                variant="text"
                color="success"
                class="action-btn"
                :href="item.downloadUrl"
                :disabled="!item.downloadUrl"
              />
            </div>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { useRequestStore } from '../../stores/request.store'
import type { PDFRequest } from '../../types/request.types'
import { computed, onMounted } from 'vue'

const requestStore = useRequestStore()

const allRequests = computed(() => requestStore.requests)
const requestCount = computed(() => allRequests.value.length)

const headers = [
  { title: 'File', key: 'filename', sortable: false },
  { title: 'Service', key: 'serviceType', width: 140 },
  { title: 'Status', key: 'status', width: 130, sortable: false },
  { title: 'Processed', key: 'updatedAt', width: 160 },
  { title: '', key: 'actions', width: 100, sortable: false },
]

onMounted(async () => {
  await requestStore.fetchAllRequests()
})

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
.vault-page {
  background: linear-gradient(135deg, #f8fafc, #eef2ff);
  min-height: 100vh;
}

/* 🔝 Header */
.vault-header {
  padding: 0 4px;
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
.vault-card {
  border-radius: 18px;
  background: white;
  padding: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

/* 📊 Table */
.vault-table :deep(.v-data-table-header__row) {
  background: #f8fafc !important;
}

.vault-table :deep(.v-data-table-row) {
  transition: all 0.2s ease;
}

.vault-table :deep(.v-data-table-row:hover) {
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
  .vault-card {
    border-radius: 0;
    padding: 0;
  }
}

</style>
