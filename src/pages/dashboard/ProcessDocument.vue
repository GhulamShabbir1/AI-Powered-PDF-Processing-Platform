<template>
  <v-container fluid class="process-page fill-height pa-0 bg-grey-lighten-4 overflow-hidden">
    <v-slide-y-transition mode="out-in">
      <div v-if="!selectedFile" class="w-100 h-100 d-flex align-center justify-center">
        <FileUploader
          :title="serviceTitle"
          description="Upload a PDF or image, preview it, then start the selected AI service."
          @file-selected="onFileSelected"
        />
      </div>

      <v-row v-else class="ma-0 h-100 w-100">
        <v-col cols="12" md="9" lg="9" class="preview-area d-flex flex-column bg-grey-lighten-4 position-relative pa-0">
          <div class="preview-toolbar pa-3 d-flex align-center w-100">
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

          <div class="canvas-container flex-grow-1 d-flex align-center justify-center pa-4">
            <v-card class="document-preview-card elevation-2 rounded-xl d-flex flex-column align-center pa-4 bg-white">
              <div class="thumbnail-wrapper d-flex align-center justify-center w-100 mb-3 flex-grow-1">
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

              <div class="text-caption text-medium-emphasis mt-1">
                {{ fileMeta }}
              </div>
            </v-card>
          </div>
        </v-col>

        <v-col cols="12" md="3" lg="3" class="options-sidebar bg-surface elevation-2 d-flex flex-column pa-0">
          <div class="sidebar-header pa-4 border-b">
            <h2 class="text-h6 font-weight-bold text-black text-capitalize">
              {{ serviceTitle }} options
            </h2>
          </div>

          <div class="sidebar-content flex-grow-1 pa-4">
            <v-alert
              v-if="processError"
              type="error"
              variant="tonal"
              class="mb-3 rounded-lg text-body-2"
              closable
              @click:close="processError = null"
            >
              {{ processError }}
            </v-alert>

            <v-alert
              v-if="processSuccess"
              type="success"
              variant="tonal"
              class="mb-3 rounded-lg text-body-2"
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
                :items="translationLanguageOptions"
                :loading="isLoadingTranslationLanguages"
                variant="outlined"
                density="comfortable"
                item-title="title"
                item-value="value"
                placeholder="Select a language"
                hide-details
              />
            </div>

            <div v-if="currentRequest" class="result-panel mt-4">
              <div class="text-subtitle-2 font-weight-bold mb-2 text-black">Latest response</div>

              <v-skeleton-loader
                v-if="currentRequest.status === 'processing'"
                type="card"
                class="mb-3"
              ></v-skeleton-loader>

              <template v-else>
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
                  <span class="text-caption text-black">{{ selectedTranslationLabel }}</span>
                </div>

                <div v-if="resultSummary" class="text-body-2 text-medium-emphasis">
                  {{ resultSummary }}
                </div>
              </template>
            </div>
          </div>

          <div class="sidebar-footer pa-4 bg-surface border-t">
            <v-btn
              color="#DC2626"
              size="large"
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
              @click="router.push({ name: 'History' })"
            >
              Open History
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-slide-y-transition>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import clientNotificationService from '../../services/clientNotification.service'
import FileUploader from '../../components/upload/FileUploader.vue'
import languageService from '../../services/language.service'
import { useRequestStore, useUploadStore } from '../../stores'
import type { LanguageOption } from '../../types/language.types'
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

const serviceType = computed<ServiceType>(() => serviceConfig[activeService.value as keyof typeof serviceConfig]?.type || 'ocr')
const fallbackTranslationLanguages: LanguageOption[] = [
  { code: 'en', name: 'English' },
  { code: 'ur', name: 'Urdu' },
  { code: 'ar', name: 'Arabic' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese (Simplified)' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
]

const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const uploadedFileId = ref<string | null>(null)
const isSubmitting = ref(false)
const isDeleting = ref(false)
const processError = ref<string | null>(null)
const processSuccess = ref<string | null>(null)
const currentRequest = ref<PDFRequest | null>(null)
const pollingTimer = ref<number | null>(null)
const translationLanguages = ref<LanguageOption[]>([...fallbackTranslationLanguages])
const isLoadingTranslationLanguages = ref(false)

const ocrSettings = ref({ languages: ['English'] })
const summarizeSettings = ref({ length: 'Medium (Standard)', format: 'Bullet Points' })
const translateSettings = ref({ target: fallbackTranslationLanguages[0]?.code || '' })

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
const translationLanguageOptions = computed(() =>
  translationLanguages.value.map((language) => ({
    title: language.name,
    value: language.code,
  }))
)
const translationLanguageMap = computed(() =>
  Object.fromEntries(translationLanguages.value.map((language) => [language.code, language.name])) as Record<string, string>
)
const selectedTranslationLabel = computed(() => {
  if (!currentRequest.value?.targetLanguage) return ''
  return translationLanguageMap.value[currentRequest.value.targetLanguage] || currentRequest.value.targetLanguage
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

const loadTranslationLanguages = async () => {
  isLoadingTranslationLanguages.value = true

  try {
    const languages = await languageService.getLanguages()
    if (languages.length) {
      translationLanguages.value = languages
    }
  } catch (error) {
    console.warn('Failed to load translation languages. Falling back to local defaults.', error)
  } finally {
    const hasSelectedLanguage = translationLanguages.value.some(
      (language) => language.code === translateSettings.value.target
    )

    if (!hasSelectedLanguage) {
      translateSettings.value.target = translationLanguages.value[0]?.code || ''
    }

    isLoadingTranslationLanguages.value = false
  }
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

  // Show processing notification
  const processingId = await clientNotificationService.showProgress(
    `Starting ${serviceTitle.value}`,
    0
  )

  try {
    const fileId = uploadedFileId.value || (await uploadCurrentFile())

    const created = await requestStore.createRequest({
      fileId,
      type: serviceType.value,
      targetLanguage: serviceType.value === 'translation' ? translateSettings.value.target : undefined,
    })

    currentRequest.value = created
    processSuccess.value = `${serviceTitle.value} started successfully.`

    // Update notification with polling info
    await clientNotificationService.completeProgress(
      processingId,
      `${serviceTitle.value} Started!`,
      'Check notification bar for status updates'
    )

    await router.push({
      name: 'RequestDetails',
      params: {
        fileId,
        serviceType: created.serviceType,
      },
    })
  } catch (error: any) {
    await clientNotificationService.showError(
      `${serviceTitle.value} Failed`,
      error?.response?.data?.message || error?.message || `Failed to start ${serviceTitle.value}.`
    )
    processError.value =
      error?.response?.data?.message ||
      error?.message ||
      `Failed to start ${serviceTitle.value}.`
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  void loadTranslationLanguages()
})
</script>

<style scoped>
.process-page {
  height: 100%;
  min-height: 100%;
}

.preview-area {
  height: 100%;
  min-height: 100%;
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
  padding-top: 56px !important;
}

.document-preview-card {
  width: min(100%, 520px);
  height: 290px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.thumbnail-wrapper {
  position: relative;
}

.thumbnail-img {
  width: 230px;
  height: 150px;
  border-radius: 4px;
}

.pdf-thumbnail-container {
  width: 280px;
  height: 150px;
  position: relative;
  overflow: hidden;
  background: white;
  border-radius: 4px;
}

.pdf-thumbnail {
  width: 560px;
  height: 300px;
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
  height: 100%;
  min-height: 100%;
  border-left: 1px solid rgba(0, 0, 0, 0.08);
}

.sidebar-content {
  overflow: hidden;
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
  padding: 12px;
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
  .process-page {
    min-height: auto;
  }

  .preview-area {
    height: 48vh;
    min-height: 48vh;
  }

  .options-sidebar {
    height: auto;
    min-height: 40vh;
    border-left: none;
    border-top: 1px solid rgba(0, 0, 0, 0.08);
  }

  .sidebar-content {
    overflow: visible;
  }

  .document-preview-card {
    width: min(100%, 420px);
    height: 250px;
  }

  .pdf-thumbnail-container {
    width: 220px;
    height: 120px;
  }

  .thumbnail-img {
    width: 220px;
    height: 120px;
  }

  .pdf-thumbnail {
    width: 440px;
    height: 240px;
  }
}
</style>
