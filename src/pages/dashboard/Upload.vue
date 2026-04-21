<template>
    <v-container class="fill-height bg-grey-lighten-4" fluid>
      <v-slide-y-transition mode="out-in">
        <div v-if="!selectedFile" class="w-100">
          <FileUploader 
            title="OCR PDF" 
            description="Convert non-selectable PDF files into selectable and searchable PDF with high accuracy."
            @file-selected="onFileSelected"
          />
        </div>
  
        <div v-else class="w-100 d-flex justify-center">
          <v-card class="pa-8 elevation-4 rounded-xl text-center" max-width="500" width="100%">
            <v-avatar color="success-lighten-5" size="80" class="mb-4">
              <v-icon color="success" size="40">mdi-file-check-outline</v-icon>
            </v-avatar>
            
            <h2 class="text-h5 font-weight-bold mb-2">File Ready!</h2>
            
            <v-sheet color="grey-lighten-4" class="pa-4 rounded-lg mb-6 text-left">
              <div class="d-flex align-center">
                <v-icon color="error" size="32" class="mr-3">mdi-file-pdf-box</v-icon>
                <div>
                  <div class="font-weight-bold text-truncate" style="max-width: 300px;">
                    {{ selectedFile.name }}
                  </div>
                  <div class="text-caption text-muted">
                    {{ formatFileSize(selectedFile.size) }}
                  </div>
                </div>
              </div>
            </v-sheet>
  
            <v-btn 
              color="primary" 
              variant="tonal" 
              block 
              size="large"
              class="font-weight-bold text-none mb-3"
              @click="processFile"
            >
              Process Document
            </v-btn>
  
            <v-btn 
              variant="text" 
              color="grey-darken-2" 
              block 
              class="text-none"
              @click="clearFile"
            >
              Upload a different file
            </v-btn>
          </v-card>
        </div>
      </v-slide-y-transition>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  // 🛑 Using a relative path to avoid the Vite import errors we saw earlier!
  import FileUploader from '../../components/upload/FileUploader.vue';
  
  // State to hold the uploaded file
  const selectedFile = ref<File | null>(null);
  
  // Event listener triggered by your FileUploader component
  const onFileSelected = (file: File) => {
    console.log('Test Page received file:', file);
    selectedFile.value = file;
  };
  
  const clearFile = () => {
    selectedFile.value = null;
  };
  
  const processFile = () => {
    alert(`Normally, this would send ${selectedFile.value?.name} to your OCR API!`);
  };
  
  // Quick helper to format bytes into MB/KB
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  </script>