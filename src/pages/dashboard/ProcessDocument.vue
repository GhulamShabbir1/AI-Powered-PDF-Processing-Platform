<template>
  <v-container fluid class="fill-height pa-0 bg-grey-lighten-4 overflow-hidden">
    <v-slide-y-transition mode="out-in">
      <div v-if="!selectedFile" class="w-100 h-100 d-flex align-center justify-center">
        <FileUploader
          :title="serviceTitle"
          description="Upload a PDF or image, preview it, then start the selected AI service."
          @file-selected="onFileSelected"
        />
      </div>

      <v-row v-else class="ma-0 h-100 w-100">
        <v-col cols="12" md="8" lg="9" class="preview-area d-flex flex-column bg-grey-lighten-4 position-relative pa-0">
          <div class="preview-toolbar pa-4 d-flex align-center w-100">
            <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="clearFile" class="font-weight-bold text-none text-black">
              Back to Upload
            </v-btn>
            <v-spacer />
            <v-btn
              color="error"
              variant="tonal"
              prepend-icon="mdi-delete-outline"
              class="text-none"
              :loading="isDeleting"
              :disabled="isBusy"
              @click="deleteFileAndReset"
            >
              Delete File
            </v-btn>
          </div>

          <div class="canvas-container flex-grow-1 d-flex align-center justify-center pa-6">
            <v-card class="document-preview-card elevation-2 rounded-xl d-flex flex-column align-center pa-6 bg-white">
              <div class="thumbnail-wrapper d-flex align-center justify-center w-100 mb-4 flex-grow-1">
                <v-img v-if="isImage" :src="previewUrl || undefined" class="thumbnail-img elevation-1" cover></v-img>

                <div v-else-if="isPdf" class="pdf-thumbnail-container elevation-2">
                  <iframe
                    :src="previewUrl + '#toolbar=0&navpanes=0&scrollbar=0'"
                    class="pdf-thumbnail"
                    scrolling="no"
                    tabindex="-1"
                  ></iframe>
                  <div class="iframe-overlay"></div>
                </div>

                <v-icon v-else size="80" color="error">mdi-file-pdf-box</v-icon>
              </div>

              <div class="file-name-text text-body-2 font-weight-bold text-primary text-truncate text-center w-100" :title="selectedFile.name">
                {{ selectedFile.name }}
              </div>

              <div class="text-caption text-medium-emphasis mt-2">
                {{ fileMeta }}
              </div>
            </v-card>
          </div>
        </v-col>

        <v-col cols="12" md="4" lg="3" class="options-sidebar bg-surface elevation-2 d-flex flex-column pa-0">
          <div class="sidebar-header pa-6 border-b">
            <h2 class="text-h5 font-weight-bold text-black text-capitalize">
              {{ serviceTitle }} options
            </h2>
          </div>

          <div class="sidebar-content flex-grow-1 pa-6 overflow-y-auto">
            <v-alert type="info" variant="tonal" class="mb-6 rounded-lg text-body-2 info-alert" density="compact" icon="mdi-information-outline">
              {{ currentServiceInfo }}
            </v-alert>

            <v-alert
              v-if="processError"
              type="error"
              variant="tonal"
              class="mb-4 rounded-lg text-body-2"
              closable
              @click:close="processError = null"
            >
              {{ processError }}
            </v-alert>

            <v-alert
              v-if="processSuccess"
              type="success"
              variant="tonal"
              class="mb-4 rounded-lg text-body-2"
            >
              {{ processSuccess }}
            </v-alert>

            <div v-if="activeService === 'ocr'">
              <div class="text-subtitle-2 font-weight-bold mb-2 text-black">Document languages</div>
              <v-autocomplete
                v-model="ocrSettings.languages"
                :items="['English', 'Spanish', 'French', 'German', 'Arabic']"
                multiple
                chips
                closable-chips
                variant="outlined"
                density="comfortable"
                hide-details
              />
            </div>

            <div v-if="activeService === 'summarize'">
              <div class="text-subtitle-2 font-weight-bold mb-2 text-black">Summary Length</div>
              <v-select
                v-model="summarizeSettings.length"
                :items="['Short (Executive)', 'Medium (Standard)', 'Detailed (Comprehensive)']"
                variant="outlined"
                density="comfortable"
                class="mb-4"
                hide-details
              />

              <div class="text-subtitle-2 font-weight-bold mb-2 text-black">Output Format</div>
              <v-select
                v-model="summarizeSettings.format"
                :items="['Bullet Points', 'Paragraphs']"
                variant="outlined"
                density="comfortable"
                hide-details
              />
            </div>

            <div v-if="activeService === 'translate'">
              <div class="text-subtitle-2 font-weight-bold mb-2 text-black">Target Language</div>
              <v-autocomplete
                v-model="translateSettings.target"
                :items="['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese']"
                variant="outlined"
                density="comfortable"
                hide-details
              />
            </div>

            <div v-if="currentRequest" class="result-panel mt-6">
              <div class="text-subtitle-2 font-weight-bold mb-3 text-black">Latest response</div>

              <div class="d-flex align-center justify-space-between mb-3">
                <span class="text-body-2 text-medium-emphasis">Status</span>
                <v-chip :color="statusColor" size="small" variant="flat">
                  {{ currentRequest.status }}
                </v-chip>
              </div>

              <div class="d-flex align-center justify-space-between mb-3">
                <span class="text-body-2 text-medium-emphasis">File ID</span>
                <span class="text-caption text-black">{{ currentRequest.fileId }}</span>
              </div>

              <div class="d-flex align-center justify-space-between mb-3">
                <span class="text-body-2 text-medium-emphasis">Service ID</span>
                <span class="text-caption text-black">{{ currentRequest.id }}</span>
              </div>

              <div v-if="currentRequest.targetLanguage" class="d-flex align-center justify-space-between mb-3">
                <span class="text-body-2 text-medium-emphasis">Target language</span>
                <span class="text-caption text-black">{{ currentRequest.targetLanguage }}</span>
              </div>

              <div v-if="resultSummary" class="text-body-2 text-medium-emphasis">
                {{ resultSummary }}
              </div>
            </div>
          </div>

          <div class="sidebar-footer pa-6 bg-surface border-t">
            <v-btn
              color="#DC2626"
              size="x-large"
              block
              class="action-btn text-none font-weight-bold text-white elevation-2 mb-3"
              :loading="isBusy"
              @click="processDocument"
            >
              Apply {{ actionLabel }}
              <v-icon end>mdi-arrow-right-circle</v-icon>
            </v-btn>

            <v-btn
              v-if="currentRequest"
              color="primary"
              variant="tonal"
              block
              class="text-none"
              @click="router.push({ name: 'Vault' })"
            >
              Open Vault
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-slide-y-transition>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FileUploader from '../../components/upload/FileUploader.vue'
import { useRequestStore, useUploadStore } from '../../stores'
import type { PDFRequest, ServiceType } from '../../types/request.types'
import { formatFileSize, truncateText } from '../../utils/helpers'

const route = useRoute()
const router = useRouter()
const requestStore = useRequestStore()
const uploadStore = useUploadStore()

const activeService = computed(() => (route.params.service as string) || 'ocr')
const serviceConfig = {
  ocr: {
    title: 'OCR PDF',
    info: 'Upload the document first, then start OCR extraction for the selected file.',
    type: 'ocr' as ServiceType,
  },
  summarize: {
    title: 'Summarizer',
    info: 'The file is uploaded once, then the summarization service is created for that file.',
    type: 'summarization' as ServiceType,
  },
  translate: {
    title: 'Translator',
    info: 'After upload, the translation service runs for the same file using your target language.',
    type: 'translation' as ServiceType,
  },
}

const serviceTitle = computed(() => serviceConfig[activeService.value as keyof typeof serviceConfig]?.title || 'Process')
const currentServiceInfo = computed(() => serviceConfig[activeService.value as keyof typeof serviceConfig]?.info || '')
const serviceType = computed<ServiceType>(() => serviceConfig[activeService.value as keyof typeof serviceConfig]?.type || 'ocr')

const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const uploadedFileId = ref<string | null>(null)
const isSubmitting = ref(false)
const isDeleting = ref(false)
const processError = ref<string | null>(null)
const processSuccess = ref<string | null>(null)
const currentRequest = ref<PDFRequest | null>(null)
const pollingTimer = ref<number | null>(null)

const ocrSettings = ref({ languages: ['English'] })
const summarizeSettings = ref({ length: 'Medium (Standard)', format: 'Bullet Points' })
const translateSettings = ref({ target: 'Spanish' })

const isImage = computed(() => selectedFile.value?.type.startsWith('image/'))
const isPdf = computed(() => selectedFile.value?.type === 'application/pdf')
const fileMeta = computed(() => {
  if (!selectedFile.value) return ''
  return `${selectedFile.value.type || 'Unknown type'} - ${formatFileSize(selectedFile.value.size)}`
})

const fileIdToDelete = computed(() => currentRequest.value?.fileId || uploadedFileId.value)
const isBusy = computed(() => isSubmitting.value || isDeleting.value || uploadStore.isUploading)
const actionLabel = computed(() => {
  if (uploadStore.isUploading) return 'Uploading'
  if (isSubmitting.value) return 'Processing'
  return activeService.value.toUpperCase()
})

const statusColor = computed(() => {
  const status = currentRequest.value?.status
  return {
    completed: 'success',
    processing: 'warning',
    pending: 'info',
    failed: 'error',
  }[status || 'pending']
})

const resultSummary = computed(() => {
  if (!currentRequest.value?.result) return ''
  const raw =
    typeof currentRequest.value.result === 'string'
      ? currentRequest.value.result
      : JSON.stringify(currentRequest.value.result)
  return truncateText(raw, 180)
})

watch(selectedFile, (newFile) => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
  }
  if (newFile) {
    previewUrl.value = URL.createObjectURL(newFile)
  }
})

const stopPolling = () => {
  if (pollingTimer.value) {
    window.clearInterval(pollingTimer.value)
    pollingTimer.value = null
  }
}

onBeforeUnmount(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
  stopPolling()
})

const startPolling = () => {
  stopPolling()
  if (!uploadedFileId.value) return

  pollingTimer.value = window.setInterval(async () => {
    try {
      const latest = await requestStore.fetchRequestById(
        uploadedFileId.value as string,
        serviceType.value
      )

      if (latest) {
        currentRequest.value = latest
      }

      if (!latest || latest.status === 'completed' || latest.status === 'failed') {
        stopPolling()
      }
    } catch {
      stopPolling()
    }
  }, 4000)
}

const onFileSelected = (file: File) => {
  selectedFile.value = file
  uploadedFileId.value = null
  currentRequest.value = null
  processError.value = null
  processSuccess.value = null
}

const clearFile = () => {
  selectedFile.value = null
  uploadedFileId.value = null
  currentRequest.value = null
  processError.value = null
  processSuccess.value = null
  uploadStore.reset()
  stopPolling()
}

const deleteFileAndReset = async () => {
  processError.value = null
  processSuccess.value = null

  if (!fileIdToDelete.value) {
    clearFile()
    return
  }

  isDeleting.value = true

  try {
    stopPolling()
    await requestStore.deleteRequest(fileIdToDelete.value)
    clearFile()
  } catch (error: any) {
    processError.value =
      error?.response?.data?.message ||
      error?.message ||
      'Failed to delete file.'
  } finally {
    isDeleting.value = false
  }
}

const uploadCurrentFile = async () => {
  if (!selectedFile.value) {
    throw new Error('Please choose a file first.')
  }

  const uploadedFile = await uploadStore.uploadFile(selectedFile.value)
  uploadedFileId.value = uploadedFile.fileId
  return uploadedFile.fileId
}

const processDocument = async () => {
  processError.value = null
  processSuccess.value = null

  if (!selectedFile.value) {
    processError.value = 'Please select a file first.'
    return
  }

  isSubmitting.value = true

  try {
    const fileId = uploadedFileId.value || (await uploadCurrentFile())

    const created = await requestStore.createRequest({
      fileId,
      type: serviceType.value,
      targetLanguage: serviceType.value === 'translation' ? translateSettings.value.target : undefined,
    })

    currentRequest.value = created
    processSuccess.value = `${serviceTitle.value} started successfully.`

    if (created.status === 'pending' || created.status === 'processing') {
      startPolling()
    }
  } catch (error: any) {
    processError.value =
      error?.response?.data?.message ||
      error?.message ||
      `Failed to start ${serviceTitle.value}.`
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.preview-area {
  height: 100vh;
  overflow: hidden;
}

.preview-toolbar {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
}

.canvas-container {
  height: 100%;
  padding-top: 64px !important;
}

.document-preview-card {
  width: 260px;
  height: 340px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.thumbnail-wrapper {
  position: relative;
}

.thumbnail-img {
  width: 150px;
  height: 200px;
  border-radius: 4px;
}

.pdf-thumbnail-container {
  width: 150px;
  height: 200px;
  position: relative;
  overflow: hidden;
  background: white;
  border-radius: 4px;
}

.pdf-thumbnail {
  width: 300px;
  height: 400px;
  transform: scale(0.5);
  transform-origin: top left;
  border: none;
  pointer-events: none;
}

.iframe-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  background: transparent;
}

.file-name-text {
  color: #4f46e5;
  max-width: 90%;
}

.options-sidebar {
  height: 100vh;
  border-left: 1px solid rgba(0, 0, 0, 0.08);
}

.info-alert {
  background-color: #e0f2fe !important;
  color: #0369a1 !important;
  border: 1px solid #bae6fd;
}

.info-alert :deep(.v-icon) {
  color: #0284c7 !important;
}

.result-panel {
  padding: 16px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid rgba(15, 23, 42, 0.08);
}

.action-btn {
  border-radius: 12px;
  letter-spacing: 0.5px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(220, 38, 38, 0.3) !important;
}

@media (max-width: 960px) {
  .preview-area {
    height: 60vh;
  }

  .options-sidebar {
    height: auto;
    min-height: 40vh;
    border-left: none;
    border-top: 1px solid rgba(0, 0, 0, 0.08);
  }
}
</style>
