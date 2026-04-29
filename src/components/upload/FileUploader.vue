<template>
  <v-container class="uploader-wrapper d-flex flex-column align-center justify-center text-center fill-height pa-4">
    
    <div class="header-section mb-10">
      <h1 class="text-h2 font-weight-black text-grey-darken-4 mb-4">{{ title }}</h1>
      <p class="text-h5 font-weight-regular text-grey-darken-1 mx-auto description-text">
        {{ description }}
      </p>
    </div>

    <v-alert
      v-if="errorMessage"
      type="error"
      variant="tonal"
      closable
      class="mb-6 rounded-lg text-left w-100"
      style="max-width: 600px;"
      @click:close="errorMessage = null"
    >
      {{ errorMessage }}
    </v-alert>

    <div 
      class="drop-zone w-100 d-flex flex-column align-center justify-center py-12 rounded-xl"
      :class="{ 'is-dragging': isDragging }"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      
      <div class="action-group d-flex align-center justify-center gap-4 mb-6">
        
        <BaseButton
          size="x-large"
          class="main-upload-btn text-h5 font-weight-bold"
          @click="triggerFileInput"
        >
          Select file
        </BaseButton>

      </div>

      <p class="text-h6 text-grey-darken-1 font-weight-regular">
        or drop PDF, PNG, JPG here
      </p>

    </div>

    <input
      type="file"
      ref="fileInput"
      accept=".pdf, .png, .jpg, .jpeg, image/png, image/jpeg"
      class="d-none"
      @change="handleFileChange"
    />

    <!-- FILE VALIDATION LOADER -->
    <v-dialog v-model="isValidating" width="auto" persistent>
      <v-card class="d-flex flex-column align-center justify-center pa-8 rounded-xl" min-width="300">
        <v-progress-circular
          indeterminate
          size="60"
          color="primary"
          class="mb-4"
        />
        <p class="text-body-2 text-center text-medium-emphasis">
          Validating your file...
        </p>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseButton from '../base/BaseButton.vue';

// 👇 Import your centralized validation logic!
import { validateFile } from '../../utils/validators';

defineProps<{
  title: string;
  description: string;
}>();

const emit = defineEmits<{
  'file-selected': [file: File];
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const errorMessage = ref<string | null>(null); // State to hold validation errors
const isValidating = ref(false); // State for skeleton loader during validation

// Trigger hidden input click
const triggerFileInput = () => {
  errorMessage.value = null; // Clear errors on new attempt
  fileInput.value?.click();
};

// 🛡️ Centralized function to process and validate the file
const processFile = (file: File) => {
  isValidating.value = true;
  
  // Simulate validation time for better UX (100ms minimum)
  setTimeout(() => {
    const result = validateFile(file);
    
    if (result.valid) {
      errorMessage.value = null;
      emit('file-selected', file);
    } else {
      // If validation fails, show the exact error from validators.ts in the UI
      errorMessage.value = result.error || 'Invalid file type.';
    }
    
    isValidating.value = false;
  }, 100);
};

// Handle traditional click upload
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    processFile(target.files[0]);
    // Reset input so the same file can be selected again if needed
    if (fileInput.value) fileInput.value.value = '';
  }
};

// Handle Drag & Drop
const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  errorMessage.value = null;
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    processFile(event.dataTransfer.files[0]);
  }
};
</script>

<style scoped>
.uploader-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  min-height: 60vh;
}

.description-text {
  max-width: 800px;
  line-height: 1.5;
}

/* Drag & Drop Zone */
.drop-zone {
  border: 4px dashed transparent;
  transition: all 0.3s ease;
  background: transparent;
}

/* When a file is hovered over the zone */
.drop-zone.is-dragging {
  border-color: rgba(79, 70, 229, 0.5); /* Primary color slightly transparent */
  background: rgba(79, 70, 229, 0.05);
  transform: scale(1.02);
}

/* Primary Massive Button */
.main-upload-btn {
  background: linear-gradient(135deg, #4F46E5, #06B6D4) !important;
  color: white !important;
  padding: 0 48px !important;
  height: 80px !important; /* Forces the massive size */
  border-radius: 16px !important;
  box-shadow: 0 10px 25px rgba(79, 70, 229, 0.3) !important;
  transition: transform 0.2s ease, box-shadow 0.2s ease !important;
}

.main-upload-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 35px rgba(79, 70, 229, 0.4) !important;
}

/* Cloud Storage Action Buttons */
.cloud-actions {
  display: flex;
  flex-direction: column;
}

.cloud-btn {
  border-radius: 50% !important;
  width: 36px !important;
  height: 36px !important;
  transition: transform 0.2s ease;
}

.cloud-btn:hover {
  transform: scale(1.1);
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .main-upload-btn {
    height: 64px !important;
    padding: 0 32px !important;
    font-size: 1.25rem !important;
  }
  
  .action-group {
    flex-direction: column;
  }
  
  .cloud-actions {
    flex-direction: row;
    margin-left: 0 !important;
    margin-top: 16px;
  }
}
</style>