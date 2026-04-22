<template>
  <v-container fluid class="fill-height pa-0 bg-grey-lighten-4 overflow-hidden">
    
    <v-slide-y-transition mode="out-in">
      
      <div v-if="!selectedFile" class="w-100 h-100 d-flex align-center justify-center">
        <FileUploader 
          :title="serviceTitle" 
          description="Upload a PDF or Image to process. Secure, fast, and highly accurate."
          @file-selected="onFileSelected"
        />
      </div>

      <v-row v-else class="ma-0 h-100 w-100">
        
        <v-col cols="12" md="8" lg="9" class="preview-area d-flex flex-column bg-grey-lighten-4 position-relative pa-0">
          
          <div class="preview-toolbar pa-4 d-flex align-center w-100">
            <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="clearFile" class="font-weight-bold text-none text-black">
              Back to Upload
            </v-btn>
          </div>

          <div class="canvas-container flex-grow-1 d-flex align-center justify-center pa-6">
            
            <v-card class="document-preview-card elevation-2 rounded-xl d-flex flex-column align-center pa-6 bg-white">
              
              <div class="thumbnail-wrapper d-flex align-center justify-center w-100 mb-4 flex-grow-1">
                <v-img v-if="isImage" :src="previewUrl" class="thumbnail-img elevation-1" cover></v-img>

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

            <div v-if="activeService === 'ocr'">
              <div class="text-subtitle-2 font-weight-bold mb-2 text-black">Document languages</div>
              <v-autocomplete v-model="ocrSettings.languages" :items="['English', 'Spanish', 'French', 'German', 'Arabic']" multiple chips closable-chips variant="outlined" density="comfortable" hide-details></v-autocomplete>
            </div>

            <div v-if="activeService === 'summarize'">
              <div class="text-subtitle-2 font-weight-bold mb-2 text-black">Summary Length</div>
              <v-select v-model="summarizeSettings.length" :items="['Short (Executive)', 'Medium (Standard)', 'Detailed (Comprehensive)']" variant="outlined" density="comfortable" class="mb-4" hide-details></v-select>

              <div class="text-subtitle-2 font-weight-bold mb-2 text-black">Output Format</div>
              <v-select v-model="summarizeSettings.format" :items="['Bullet Points', 'Paragraphs']" variant="outlined" density="comfortable" hide-details></v-select>
            </div>

            <div v-if="activeService === 'translate'">
              <div class="text-subtitle-2 font-weight-bold mb-2 text-black">Target Language</div>
              <v-autocomplete v-model="translateSettings.target" :items="['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese']" variant="outlined" density="comfortable" hide-details></v-autocomplete>
            </div>

          </div>

          <div class="sidebar-footer pa-6 bg-surface border-t">
            <v-btn color="#DC2626" size="x-large" block class="action-btn text-none font-weight-bold text-white elevation-2" @click="processDocument">
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
import { useRoute } from 'vue-router';
import FileUploader from '../../components/upload/FileUploader.vue'; 

const route = useRoute();

// --- Dynamically get the service from the URL ---
const activeService = computed(() => (route.params.service as string) || 'ocr');

const serviceConfig = {
  ocr: { title: 'OCR PDF', info: 'The accuracy of detection is increased by correctly selecting the document\'s languages.' },
  summarize: { title: 'Summarizer', info: 'AI will read the document and extract the most critical information based on your selected length.' },
  translate: { title: 'Translator', info: 'Neural translation preserves your exact document formatting and layouts.' }
};

const serviceTitle = computed(() => serviceConfig[activeService.value as keyof typeof serviceConfig]?.title || 'Process');
const currentServiceInfo = computed(() => serviceConfig[activeService.value as keyof typeof serviceConfig]?.info || '');

// --- State ---
const selectedFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null);

const ocrSettings = ref({ languages: ['English'] });
const summarizeSettings = ref({ length: 'Medium (Standard)', format: 'Bullet Points' });
const translateSettings = ref({ target: 'Spanish' });

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

/* 📄 Clean Thumbnail Card */
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

/* PDF Thumbnail Trick */
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
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background: transparent;
}

.file-name-text {
  color: #4F46E5; /* Light blue/primary color from your screenshot */
  max-width: 90%;
}

/* Sidebar Styles */
.options-sidebar {
  height: 100vh;
  border-left: 1px solid rgba(0,0,0,0.08);
}

.info-alert {
  background-color: #E0F2FE !important; 
  color: #0369A1 !important;
  border: 1px solid #BAE6FD;
}

.info-alert :deep(.v-icon) {
  color: #0284C7 !important;
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
    height: 40vh;
    border-left: none;
    border-top: 1px solid rgba(0,0,0,0.08);
  }
}
</style>