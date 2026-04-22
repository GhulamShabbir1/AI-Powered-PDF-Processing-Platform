<template>
  <v-container fluid class="fill-height pa-0 bg-grey-lighten-4 overflow-hidden">
    
    <v-slide-y-transition mode="out-in">
      
      <div v-if="!selectedFile" class="w-100 h-100 d-flex align-center justify-center">
        <FileUploader 
          title="Process Document" 
          description="Upload a PDF or Image to run OCR, Summarize, Translate, or Extract Data."
          @file-selected="onFileSelected"
        />
      </div>

      <v-row v-else class="ma-0 h-100 w-100">
        
        <v-col cols="12" md="8" lg="9" class="preview-area d-flex flex-column bg-grey-lighten-4 position-relative pa-0">
          
          <div class="preview-toolbar pa-4 d-flex align-center justify-space-between w-100">
            <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="clearFile" class="font-weight-bold text-none text-black">
              Back to Upload
            </v-btn>
          </div>

          <div class="canvas-container flex-grow-1 d-flex align-center justify-center position-relative pa-6 pa-md-10">
            
            <v-card class="document-preview-card elevation-2 rounded-xl d-flex flex-column align-center pa-6 bg-white">
              
              <div class="thumbnail-wrapper d-flex align-center justify-center w-100 mb-6 flex-grow-1">
                
                <v-img
                  v-if="isImage"
                  :src="previewUrl"
                  class="thumbnail-img elevation-1"
                  cover
                ></v-img>

                <div v-else-if="isPdf" class="pdf-thumbnail-container elevation-2">
                  <iframe
                    :src="previewUrl + '#toolbar=0&navpanes=0&scrollbar=0'"
                    class="pdf-thumbnail"
                    scrolling="no"
                    tabindex="-1"
                  ></iframe>
                  <div class="iframe-overlay"></div>
                </div>

                <v-icon v-else size="80" color="grey-lighten-1">mdi-file-document-outline</v-icon>
              </div>

              <div class="file-name-text text-body-2 font-weight-medium text-truncate text-center w-100" :title="selectedFile.name">
                {{ selectedFile.name }}
              </div>
            </v-card>

          </div>
        </v-col>

        <v-col cols="12" md="4" lg="3" class="options-sidebar bg-surface elevation-2 d-flex flex-column pa-0">
          
          <div class="sidebar-header pa-6 border-b">
            <v-select
              v-model="activeService"
              :items="availableServices"
              item-title="title"
              item-value="value"
              variant="underlined"
              hide-details
              class="text-h6 font-weight-bold"
            >
              <template v-slot:selection="{ item }">
                <span class="text-h5 font-weight-bold text-black">{{ item.title }} options</span>
              </template>
            </v-select>
          </div>

          <div class="sidebar-content flex-grow-1 pa-6 overflow-y-auto">
            
            <v-alert
              type="info"
              variant="tonal"
              class="mb-6 rounded-lg text-body-2 info-alert"
              density="compact"
              icon="mdi-information-outline"
            >
              {{ currentServiceInfo }}
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
              ></v-autocomplete>
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
              ></v-select>

              <div class="text-subtitle-2 font-weight-bold mb-2 text-black">Output Format</div>
              <v-select
                v-model="summarizeSettings.format"
                :items="['Bullet Points', 'Paragraphs']"
                variant="outlined"
                density="comfortable"
                hide-details
              ></v-select>
            </div>

            <div v-if="activeService === 'translate'">
              <div class="text-subtitle-2 font-weight-bold mb-2 text-black">Target Language</div>
              <v-autocomplete
                v-model="translateSettings.target"
                :items="['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese']"
                variant="outlined"
                density="comfortable"
                hide-details
              ></v-autocomplete>
            </div>

          </div>

          <div class="sidebar-footer pa-6 bg-surface">
            <v-btn 
              color="#DC2626" 
              size="x-large" 
              block 
              class="action-btn text-none font-weight-bold text-white elevation-2"
              @click="processDocument"
            >
              Apply {{ activeService.toUpperCase() }}
              <v-icon end>mdi-arrow-right-circle</v-icon>
            </v-btn>
          </div>

        </v-col>
      </v-row>
    </v-slide-y-transition>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue';
import FileUploader from '../../components/upload/FileUploader.vue'; // [cite: 7]

// --- State ---
const selectedFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null);

const availableServices = [
  { title: 'OCR PDF', value: 'ocr', info: 'The accuracy of detection is increased by correctly selecting the document\'s languages.' },
  { title: 'Summarize', value: 'summarize', info: 'AI will read the document and extract the most critical information based on your selected length.' },
  { title: 'Translate', value: 'translate', info: 'Neural translation preserves your exact document formatting and layouts.' },
];

const activeService = ref('ocr');

// --- Dynamic Settings Models ---
const ocrSettings = ref({ languages: ['English'] });
const summarizeSettings = ref({ length: 'Medium (Standard)', format: 'Bullet Points' });
const translateSettings = ref({ target: 'Spanish' });

// --- Computed ---
const currentServiceInfo = computed(() => {
  const service = availableServices.find(s => s.value === activeService.value);
  return service?.info || '';
});

const isImage = computed(() => selectedFile.value?.type.startsWith('image/'));
const isPdf = computed(() => selectedFile.value?.type === 'application/pdf');

// --- File Handling & URL Cleanup ---
watch(selectedFile, (newFile) => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = null;
  }
  if (newFile) {
    previewUrl.value = URL.createObjectURL(newFile);
  }
});

onBeforeUnmount(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
});

// --- Methods ---
const onFileSelected = (file: File) => {
  selectedFile.value = file;
};

const clearFile = () => {
  selectedFile.value = null;
};

const processDocument = () => {
  let payload = {};
  if (activeService.value === 'ocr') payload = ocrSettings.value;
  if (activeService.value === 'summarize') payload = summarizeSettings.value;
  if (activeService.value === 'translate') payload = translateSettings.value;

  console.log(`Processing ${selectedFile.value?.name} with service: ${activeService.value}`, payload);
  alert(`Starting ${activeService.value.toUpperCase()} processing... Check console for payload.`);
};
</script>

<style scoped>
/* Preview Area */
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

/* 📄 Document Card Styles */
.document-preview-card {
  width: 280px; /* Matches screenshot proportions */
  height: 360px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.thumbnail-wrapper {
  position: relative;
}

/* Image Thumbnail */
.thumbnail-img {
  width: 160px;
  height: 220px;
  border-radius: 4px;
}

/* PDF Thumbnail Trick */
.pdf-thumbnail-container {
  width: 160px;
  height: 220px;
  position: relative;
  overflow: hidden;
  background: white;
  border-radius: 4px;
}

.pdf-thumbnail {
  width: 320px; /* Double width to account for scale */
  height: 440px; /* Double height to account for scale */
  transform: scale(0.5); /* Scale down to make it look like a thumbnail */
  transform-origin: top left;
  border: none;
  pointer-events: none; /* Disables clicking/scrolling inside the iframe */
}

.iframe-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background: transparent;
}

.file-name-text {
  color: #6B7280;
  max-width: 90%;
}

/* Sidebar Styles */
.options-sidebar {
  height: 100vh;
  border-left: 1px solid rgba(0,0,0,0.08);
}

.sidebar-header :deep(.v-field__input) {
  padding-left: 0 !important;
}

.info-alert {
  background-color: #E0F2FE !important; 
  color: #0369A1 !important;
  border: 1px solid #BAE6FD;
}

.info-alert :deep(.v-icon) {
  color: #0284C7 !important;
}

/* Main Action Button */
.action-btn {
  border-radius: 12px;
  letter-spacing: 0.5px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(220, 38, 38, 0.3) !important;
}

/* Responsive Overrides */
@media (max-width: 960px) {
  .preview-area {
    height: 60vh;
  }
  .options-sidebar {
    height: 40vh;
    border-left: none;
    border-top: 1px solid rgba(0,0,0,0.08);
  }
}
</style>