<template>
  <v-container fluid class="pa-4 pa-md-8">
    <v-row justify="center">
      <v-col cols="12">
        <h1 class="text-h3 text-center font-weight-bold mb-12 text-primary">
          AI PDF Tools Dashboard
        </h1>
        
        <v-row class="tools-grid">
          <!-- OCR Card -->
          <v-col cols="12" md="4">
            <v-card 
              class="tool-card pa-6 h-100 elevation-8 hover:elevation-12 transition-all cursor-pointer rounded-xl"
              color="blue-lighten-5"
              @click="$router.push({ name: 'Ocr' })"
            >
              <v-card-title class="text-h5 font-weight-bold mb-4">
                <v-icon start size="32" color="blue-darken-2">mdi-scan-helper</v-icon>
                OCR Extraction
              </v-card-title>
              <v-card-text class="text-body1 text-medium-emphasis">
                Convert scanned PDFs and images into editable text
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn 
                  variant="flat" 
                  color="blue" 
                  :prepend-inner-icon="mdi-arrow-right"
                >
                  Start OCR
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <!-- Summarizer Card -->
          <v-col cols="12" md="4">
            <v-card 
              class="tool-card pa-6 h-100 elevation-8 hover:elevation-12 transition-all cursor-pointer rounded-xl"
              color="cyan-lighten-5"
              @click="$router.push({ name: 'Summarizer' })"
            >
              <v-card-title class="text-h5 font-weight-bold mb-4">
                <v-icon start size="32" color="cyan-darken-2">mdi-auto-fix</v-icon>
                AI Summarizer
              </v-card-title>
              <v-card-text class="text-body1 text-medium-emphasis">
                Condense long documents into key insights
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn 
                  variant="flat" 
                  color="cyan" 
                  :prepend-inner-icon="mdi-arrow-right"
                >
                  Summarize
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <!-- Translator Card -->
          <v-col cols="12" md="4">
            <v-card 
              class="tool-card pa-6 h-100 elevation-8 hover:elevation-12 transition-all cursor-pointer rounded-xl"
              color="purple-lighten-5"
              @click="$router.push({ name: 'Translator' })"
            >
              <v-card-title class="text-h5 font-weight-bold mb-4">
                <v-icon start size="32" color="purple-darken-2">mdi-translate</v-icon>
                Translator
              </v-card-title>
              <v-card-text class="text-body1 text-medium-emphasis">
                Translate documents preserving formatting
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn 
                  variant="flat" 
                  color="purple" 
                  :prepend-inner-icon="mdi-arrow-right"
                >
                  Translate
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter()
</script>

<style scoped>
.tools-grid {
  gap: 2rem;
}

.tool-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.tool-card:hover {
  transform: translateY(-8px) !important;
}

.tool-card:active {
  transform: translateY(-4px) !important;
}
</style>

