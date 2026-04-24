<template>
  <v-container fluid class="pa-0 pa-md-4">

    <!-- Motto Section -->
    <v-sheet class="text-center py-8 bg-transparent">
      <h1 class="text-h4 text-md-h3 font-weight-black text-primary">
        AI PDF <span class="text-gradient">Tools</span>
      </h1>

      <p class="text-subtitle-1 text-medium-emphasis mt-2">
        Extract, Summarize & Translate with AI
      </p>
    </v-sheet>

    <!-- Tools Grid -->
    <v-row density="comfortable" justify="center">

      <v-col
        v-for="(tool, index) in tools"
        :key="index"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card
          class="pa-4 text-center d-flex flex-column align-center cursor-pointer"
          elevation="2"
          rounded="lg"
          hover
          @click="router.push(tool.path)"
        >

          <!-- Icon -->
          <v-avatar
            size="56"
            class="mb-3"
            :style="{ background: tool.gradient }"
          >
            <v-icon color="white" size="28">
              {{ tool.icon }}
            </v-icon>
          </v-avatar>

          <!-- Title -->
          <div class="text-subtitle-1 font-weight-bold text-grey-darken-4 mb-1">
            {{ tool.title }}
          </div>

          <!-- Description -->
          <div class="text-caption text-medium-emphasis mb-3">
            {{ tool.description }}
          </div>

          <!-- Action -->
          <v-btn
            variant="text"
            color="primary"
            size="small"
            append-icon="mdi-arrow-right"
          >
            Try Now
          </v-btn>

        </v-card>
      </v-col>

    </v-row>

  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const tools = [
  {
    title: "OCR Extraction",
    description: "Convert scanned PDFs to editable text",
    icon: "mdi-scan-helper",
    gradient: "linear-gradient(135deg, #4F46E5, #7C3AED)",
    path: "/dashboard/process/ocr",
  },
  {
    title: "AI Summarizer",
    description: "Get instant summaries from long documents",
    icon: "mdi-auto-fix",
    gradient: "linear-gradient(135deg, #06B6D4, #0891B2)",
    path: "/dashboard/process/summarize",
  },
  {
    title: "Smart Translator",
    description: "Translate documents while preserving format",
    icon: "mdi-translate",
    gradient: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
    path: "/dashboard/process/translate",
  },
];
</script>
