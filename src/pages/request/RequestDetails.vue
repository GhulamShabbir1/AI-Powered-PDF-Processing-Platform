<template>
  <v-container class="result-page py-3 py-md-4">
    <v-row justify="center">
      <v-col cols="12" xl="11">
        <div class="d-flex flex-wrap align-center justify-space-between ga-3  result-header">
          <div>
            <h1 class="text-h3 text-md-h4 font-weight-bold text-grey-darken-4">
              {{ pageTitle }}
            </h1>
            <p class="text-body-1 text-medium-emphasis mt-2">{{ pageDescription }}</p>
          </div>

          <div class="d-flex flex-wrap ga-2">
            <v-btn
              variant="outlined"
              prepend-icon="mdi-arrow-left"
              class="text-none"
              @click="goBackToProcess"
            >
              Back to service
            </v-btn>
            <v-btn
              color="primary"
              variant="tonal"
              prepend-icon="mdi-folder-outline"
              class="text-none"
              :to="{ name: 'History' }"
            >
              Open History
            </v-btn>
            <v-btn
              color="success"
              variant="flat"
              prepend-icon="mdi-download"
              class="text-none"
              :disabled="!formattedResult"
              @click="downloadResultPdf"
            >
              Download PDF
            </v-btn>
          </div>
        </div>

        <v-alert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          class="mb-4"
        >
          {{ errorMessage }}
        </v-alert>

        <v-row class="ga-md-0 ga-3">
          <v-col cols="12" md="3">
            <v-card class="rounded-xl h-100" elevation="2">
              <v-card-text class="pa-4 pa-md-5">
                <div class="text-subtitle-2 font-weight-bold mb-3">Request summary</div>

                <div class="summary-row">
                  <span class="text-medium-emphasis">Service</span>
                  <span class="font-weight-medium text-capitalize">{{ friendlyServiceName }}</span>
                </div>

                <div class="summary-row">
                  <span class="text-medium-emphasis">Status</span>
                  <v-chip :color="statusColor" size="small" variant="flat">
                    {{ requestDetails?.status || 'unknown' }}
                  </v-chip>
                </div>

                <div class="summary-row">
                  <span class="text-medium-emphasis">File ID</span>
                  <span class="summary-value">{{ fileId }}</span>
                </div>

                <div class="summary-row" v-if="requestDetails?.id">
                  <span class="text-medium-emphasis">Request ID</span>
                  <span class="summary-value">{{ requestDetails.id }}</span>
                </div>

                <div class="summary-row" v-if="requestDetails?.filename">
                  <span class="text-medium-emphasis">File name</span>
                  <span class="summary-value">{{ requestDetails.filename }}</span>
                </div>

                <div class="summary-row" v-if="requestDetails?.updatedAt">
                  <span class="text-medium-emphasis">Updated</span>
                  <span class="summary-value">{{ formatDate(requestDetails.updatedAt) }}</span>
                </div>

                <v-btn
                  v-if="isPolling"
                  block
                  color="warning"
                  variant="tonal"
                  class="mt-4 text-none"
                  prepend-icon="mdi-timer-refresh-outline"
                  :loading="isRefreshing"
                  @click="refreshRequest"
                >
                  Checking status...
                </v-btn>

                <v-btn
                  v-else
                  block
                  color="primary"
                  variant="outlined"
                  class="mt-4 text-none"
                  prepend-icon="mdi-refresh"
                  :loading="isRefreshing"
                  @click="refreshRequest"
                >
                  Refresh status
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="9">
            <v-card class="rounded-xl h-100" elevation="2">
              <v-card-text class="pa-4 pa-md-5">
                <div class="d-flex align-center justify-space-between mb-3">
                  <div class="text-subtitle-2 font-weight-bold">Output</div>
                  <div class="d-flex align-center ga-2">
                    <!-- NEW: Copy button -->
                    <v-btn
                      variant="outlined"
                      :color="isCopying ? 'success' : 'primary'"
                      size="small"
                      :disabled="isCopyDisabled"
                      :icon="isCopying ? 'mdi-check' : 'mdi-content-copy'"
                      @click="copyToClipboard"
                      class="text-none"
                    >
                    </v-btn>
                    <v-chip :color="statusColor" size="small" variant="tonal">
                      {{ statusMessage }}
                    </v-chip>
                  </div>
                </div>

                <div v-if="isLoading && !requestDetails">
                  <v-skeleton-loader type="card" />
                </div>

                <div v-else-if="requestDetails?.error" class="state-box error-box">
                  <v-icon color="error" size="48">mdi-alert-circle-outline</v-icon>
                  <p class="text-body-1 mt-3 mb-0">{{ requestDetails.error }}</p>
                </div>

                <div v-else-if="!formattedResult" class="state-box">
                  <v-icon color="primary" size="48">mdi-file-clock-outline</v-icon>
                  <p class="text-body-1 mt-3 mb-1">
                    {{ emptyStateTitle }}
                  </p>
                  <p class="text-body-2 text-medium-emphasis mb-0">
                    {{ emptyStateDescription }}
                  </p>
                </div>

                <div v-else>
                  <div class="text-body-2 text-medium-emphasis mb-3">
                    {{ resultIntro }}
                  </div>
                  <pre class="result-block">{{ formattedResult }}</pre>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRequestStore } from '../../stores'
import type { PDFRequest, ServiceType } from '../../types/request.types'
import { downloadTextAsPdf } from '../../utils/pdf'
import clientNotificationService from '../../services/clientNotification.service'

const route = useRoute()
const router = useRouter()
const requestStore = useRequestStore()

const requestDetails = ref<PDFRequest | null>(null)
const errorMessage = ref<string | null>(null)
const isRefreshing = ref(false)
const pollingTimer = ref<number | null>(null)
const isCopying = ref(false) // NEW: Track if just copied for visual feedback

const validServiceTypes: ServiceType[] = ['ocr', 'summarization', 'translation']

const fileId = computed(() => String(route.params.fileId || ''))
const serviceType = computed<ServiceType>(() => {
  const raw = String(route.params.serviceType || '')
  return validServiceTypes.includes(raw as ServiceType) ? (raw as ServiceType) : 'ocr'
})

const serviceRouteName = computed(() => {
  if (serviceType.value === 'summarization') return 'summarize'
  if (serviceType.value === 'translation') return 'translate'
  return 'ocr'
})

const friendlyServiceName = computed(() => {
  const names: Record<ServiceType, string> = {
    ocr: 'OCR',
    summarization: 'Summarization',
    translation: 'Translation',
  }
  return names[serviceType.value]
})

const pageTitle = computed(() => `${friendlyServiceName.value} Result`)
const pageDescription = computed(() => {
  if (requestDetails.value?.status === 'completed') {
    return 'The processing finished successfully and the latest output is shown below.'
  }
  if (requestDetails.value?.status === 'failed') {
    return 'The request finished with an error. You can review the message and try again.'
  }
  return 'Your file has been submitted. This page checks the latest status until the output is ready.'
})

const statusColor = computed(() => {
  const colors: Record<string, string> = {
    completed: 'success',
    processing: 'warning',
    pending: 'info',
    failed: 'error',
  }
  return colors[requestDetails.value?.status || 'pending'] || 'info'
})

const statusMessage = computed(() => {
  if (requestDetails.value?.status === 'completed') return 'Completed'
  if (requestDetails.value?.status === 'failed') return 'Failed'
  if (requestDetails.value?.status === 'processing') return 'Still processing'
  return 'Waiting for result'
})

const extractReadableText = (value: unknown): string => {
  if (value == null) return ''
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)

  if (Array.isArray(value)) {
    const parts = value
      .map((item) => extractReadableText(item))
      .filter(Boolean)
    return parts.join('\n\n').trim()
  }

  if (typeof value === 'object') {
    const record = value as Record<string, unknown>
    const preferredKeys = [
      'summarized_text',
      'translated_text',
      'extracted_text',
      'ocr_text',
      'text',
      'data',
      'result',
      'content',
      'output',
      'summary',
      'translation',
      'message',
    ]

    for (const key of preferredKeys) {
      const extracted = extractReadableText(record[key])
      if (extracted) return extracted
    }

    const joined = Object.values(record)
      .map((item) => extractReadableText(item))
      .filter(Boolean)
      .join('\n\n')
      .trim()

    if (joined) return joined

    return JSON.stringify(record, null, 2)
  }

  return ''
}

const formattedResult = computed(() => {
  const result = requestDetails.value?.result
  return extractReadableText(result)
})

const isLoading = computed(() => requestStore.isLoading)
const isPolling = computed(() => {
  const status = requestDetails.value?.status
  return status === 'pending' || status === 'processing' || !status
})

const emptyStateTitle = computed(() => {
  if (requestDetails.value?.status === 'failed') return 'No result was returned.'
  if (requestDetails.value?.status === 'processing') return 'The AI service is still working on your file.'
  return 'Waiting for the first result update.'
})

const emptyStateDescription = computed(() => {
  if (requestDetails.value?.status === 'failed') return 'Check the request summary or go back and submit the file again.'
  if (requestDetails.value?.status === 'processing') return 'This screen will refresh automatically until the backend sends back the output.'
  return 'If the backend needs a little time, stay on this page and it will keep checking for updates.'
})

const resultIntro = computed(() => {
  if (serviceType.value === 'ocr') return 'Extracted text from your document:'
  if (serviceType.value === 'translation') return 'Translated content from your document:'
  return 'Generated summary from your document:'
})

// NEW: Disable copy button if there's no text to copy or still loading
const isCopyDisabled = computed(() => {
  return !formattedResult.value || isLoading.value
})

const stopPolling = () => {
  if (pollingTimer.value) {
    window.clearInterval(pollingTimer.value)
    pollingTimer.value = null
  }
}

const fetchRequest = async () => {
  if (!fileId.value) {
    errorMessage.value = 'Missing file id for this request.'
    return
  }

  isRefreshing.value = true
  errorMessage.value = null

  try {
    const latest = await requestStore.fetchRequestById(fileId.value, serviceType.value)
    requestDetails.value = latest

    if (!latest) {
      errorMessage.value = 'No request details were found for this file yet.'
      stopPolling()
      return
    }

    if (latest.status === 'completed' || latest.status === 'failed') {
      stopPolling()
    }
  } catch (error: any) {
    errorMessage.value =
      error?.response?.data?.message ||
      error?.message ||
      'Failed to load request details.'
    stopPolling()
  } finally {
    isRefreshing.value = false
  }
}

const startPolling = () => {
  stopPolling()
  pollingTimer.value = window.setInterval(() => {
    void fetchRequest()
  }, 4000)
}

const goBackToProcess = () => {
  router.push({
    name: 'ProcessDocument',
    params: {
      service: serviceRouteName.value,
    },
  })
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

const refreshRequest = async () => {
  await fetchRequest()
  if (isPolling.value && !pollingTimer.value) {
    startPolling()
  }
}

const downloadResultPdf = async () => {
  if (!formattedResult.value) return
  
  // Show download notification
  const downloadId = await clientNotificationService.showProgress(
    'Downloading Result',
    0
  )
  
  try {
    const filename = `${friendlyServiceName.value.toLowerCase()}-${fileId.value}.pdf`
    const header = [
      pageTitle.value,
      `Service: ${friendlyServiceName.value}`,
      `File ID: ${fileId.value}`,
      `Status: ${requestDetails.value?.status || 'unknown'}`,
      '',
    ].join('\n')

    // Simulate download progress (PDF generation)
    for (let i = 0; i <= 100; i += 20) {
      await clientNotificationService.updateProgress(downloadId, i)
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    downloadTextAsPdf(filename, pageTitle.value, `${header}\n${formattedResult.value}`)
    
    await clientNotificationService.completeProgress(
      downloadId,
      'Download Complete!',
      `${filename} saved to Downloads folder`
    )
  } catch (error) {
    await clientNotificationService.showError(
      'Download Failed',
      'Please try downloading again'
    )
  }
}

// NEW: Copy result text to clipboard with user feedback
const copyToClipboard = async () => {
  // Guard: Don't copy if there's no text
  if (!formattedResult.value) return

  try {
    // Step 1: Copy text to system clipboard
    // navigator.clipboard.writeText() is the modern browser API
    // It's async, so we wait for it with 'await'
    await navigator.clipboard.writeText(formattedResult.value)

    // Step 2: Show success notification to user
    // The user won't see the clipboard, so we must tell them!
    await clientNotificationService.showSuccess(
      'Copied to Clipboard!',
      'The extracted text has been copied successfully'
    )

    // Step 3: Visual feedback - change button appearance temporarily
    // Set flag to true, button will show "Copied!" state
    isCopying.value = true

    // Step 4: Reset button appearance after 2 seconds
    // This shows the temporary feedback then returns to normal
    setTimeout(() => {
      isCopying.value = false
    }, 2000)

  } catch (error: any) {
    // Step 5: Handle errors gracefully
    // Common reasons: user denied permission, clipboard not available, HTTPS required
    console.error('Copy to clipboard failed:', error)
    await clientNotificationService.showError(
      'Failed to Copy',
      'Could not copy to clipboard. Please try again.'
    )
  }
}

onMounted(async () => {
  await fetchRequest()
  if (isPolling.value) {
    startPolling()
  }
})

onBeforeUnmount(() => {
  stopPolling()
})
</script>

<style scoped>
.result-page {
  max-width: 1500px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.summary-row:last-of-type {
  border-bottom: none;
}

.summary-value {
  max-width: 55%;
  text-align: right;
  word-break: break-word;
}

.state-box {
  min-height: 220px;
  border: 1px dashed rgba(59, 130, 246, 0.25);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px;
  text-align: center;
  background: linear-gradient(135deg, rgba(239, 246, 255, 0.8), rgba(248, 250, 252, 0.95));
}

.error-box {
  border-color: rgba(220, 38, 38, 0.2);
  background: rgba(254, 242, 242, 0.85);
}

.result-block {
  white-space: pre-wrap;
  word-break: break-word;
  padding: 16px 18px;
  border-radius: 16px;
  background: #0f172a;
  color: #e2e8f0;
  min-height: 220px;
  max-height: 52vh;
  overflow: auto;
  font-size: 0.9rem;
  line-height: 1.55;
}

@media (max-width: 960px) {
  .result-block {
    max-height: 42vh;
  }
}
</style>
