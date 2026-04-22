<template>
    <v-container class="uploader-wrapper d-flex flex-column align-center justify-center text-center fill-height pa-4">
      
      <div class="header-section mb-10">
        <h1 class="text-h2 font-weight-black text-grey-darken-4 mb-4">{{ props.title }}</h1>
        <p class="text-h5 font-weight-regular text-grey-darken-1 mx-auto description-text">
          {{ props.description }}
        </p>
      </div>
  
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
          or drop PDF / PNG here
        </p>
  
      </div>
  
      <input
        type="file"
        ref="fileInput"
        accept=".pdf, .png, image/png"
        class="d-none"
        @change="handleFileChange"
      />
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref, withDefaults } from 'vue';
import BaseButton from '../base/BaseButton.vue';
  
  interface Props {
    title?: string;
    description?: string;
  }
  
  const props = withDefaults(defineProps<Props>(), {
    title: 'Upload Your PDF',
    description: 'Drag and drop your PDF or PNG files to get started with AI processing',
  });
  
  const emit = defineEmits<{
    'file-selected': [file: File];
  }>();
  
  const fileInput = ref<HTMLInputElement | null>(null);
  const isDragging = ref(false);
  
  // Trigger hidden input click
  const triggerFileInput = () => {
    fileInput.value?.click();
  };
  
  // Handle traditional click upload
  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      emit('file-selected', target.files[0]);
      // Reset input so the same file can be selected again if needed
      if (fileInput.value) fileInput.value.value = '';
    }
  };
  
  // Handle Drag & Drop
  const handleDrop = (event: DragEvent) => {
    isDragging.value = false;
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      
      // Accept both PDF and PNG formats
      if (file.type === 'application/pdf' || file.type === 'image/png') {
        emit('file-selected', file);
      } else {
        console.warn('Please upload a valid PDF or PNG file.');
      }
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
