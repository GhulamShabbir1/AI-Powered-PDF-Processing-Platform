<template>
  <v-container fluid class="dashboard-page tools-container pa-0 pa-lg-6">
    <!-- Simple Motto -->

    <div class="motto-section text-center mb-6">
      <h1 class="motto-title mb-2">
        AI PDF <span class="gradient-text">Tools</span>
      </h1>

      <p class="motto-subtitle">Extract, Summarize & Translate with AI</p>
    </div>

    <!-- Tools Grid -->

    <v-row class="tools-grid">
      <v-col
        v-for="(tool, index) in tools"
        :key="index"
        cols="12"
        sm="6"
        md="4"
      >
        <div class="tool-card" @click="router.push(tool.path)"
        >
          <!-- Icon -->

          <div class="icon-wrapper" :style="{ background: tool.gradient }">
            <v-icon size="28" color="white">{{ tool.icon }}</v-icon>
          </div>

          <!-- Title -->

          <h3 class="tool-title">{{ tool.title }}</h3>

          <!-- Description -->

          <p class="tool-description">{{ tool.description }}</p>

          <!-- Action -->

          <div class="tool-action">
            <span>Try Now</span>

            <v-icon size="16">mdi-arrow-right</v-icon>
          </div>
        </div>
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

    path: '/dashboard/process/ocr',
  },

  {
    title: "AI Summarizer",

    description: "Get instant summaries from long documents",

    icon: "mdi-auto-fix",

    gradient: "linear-gradient(135deg, #06B6D4, #0891B2)",

    path: '/dashboard/process/summarize',
  },

  {
    title: "Smart Translator",

    description: "Translate documents while preserving format",

    icon: "mdi-translate",

    gradient: "linear-gradient(135deg, #8B5CF6, #6D28D9)",

    path: '/dashboard/process/translate',
  },
];
</script>

<style scoped>
.tools-container {
  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 2rem;

  height: 100vh;

  width: 100%;

  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
}

/* Simple Motto */

.motto-title {
  font-size: 2.5rem;

  font-weight: 900;

  color: #0f172a;
}

.gradient-text {
  background: linear-gradient(135deg, #4f46e5, #06b6d4);

  -webkit-background-clip: text;

  -webkit-text-fill-color: transparent;

  background-clip: text;
}

.motto-subtitle {
  font-size: 1rem;

  color: #3e587c;
}

/* Tools Grid */

.tools-grid {
  display: flex;

  flex-wrap: wrap;

  gap: 1.5rem;
}

/* Compact Cards */

.tool-card {
  background: white;

  border: 1px solid #e5e7eb;

  border-radius: 16px;

  padding: 1.25rem;

  cursor: pointer;

  transition: all 0.3s ease;

  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 0.5rem;
}

.tool-card:hover {
  transform: translateY(-4px);

  border-color: transparent;

  box-shadow: 0px 0px 25px rgba(114, 4, 4, 0.1);
}

/* Small Icon */

.icon-wrapper {
  width: 52px;

  height: 52px;

  border-radius: 14px;

  display: flex;

  align-items: center;

  justify-content: center;
}

/* Small Title */

.tool-title {
  font-size: 1rem;

  font-weight: 700;

  color: #0f172a;

  margin-bottom: 0.5rem;
}

/* Small Description */

.tool-description {
  font-size: 0.75rem;

  line-height: 1.4;

  color: #64748b;

  margin-bottom: 1rem;
}

/* Simple Action */

.tool-action {
  display: inline-flex;

  align-items: center;

  gap: 0.25rem;

  font-size: 0.75rem;

  font-weight: 600;

  color: #4f46e5;
}

.tool-card:hover .tool-action {
  gap: 0.5rem;
}

/* Responsive */

@media (max-width: 960px) {
  .tools-container {
    padding: 1rem !important;
  }

  .motto-title {
    font-size: 1.5rem;
  }

  .tool-card {
    padding: 1rem;
  }

  .icon-wrapper {
    width: 48px;

    height: 48px;
  }

  .icon-wrapper .v-icon {
    font-size: 24px !important;
  }

  .tool-title {
    font-size: 0.875rem;
  }

  .tool-description {
    font-size: 0.7rem;
  }
}

@media (max-width: 600px) {
  .motto-title {
    font-size: 1.25rem;
  }

  .motto-subtitle {
    font-size: 0.75rem;
  }

  .tool-card {
    padding: 0.875rem;
  }

  .icon-wrapper {
    width: 44px;

    height: 44px;

    margin-bottom: 0.75rem;
  }

  .icon-wrapper .v-icon {
    font-size: 22px !important;
  }

  .tool-title {
    font-size: 0.8125rem;
  }

  .tool-description {
    font-size: 0.6875rem;

    margin-bottom: 0.75rem;
  }

  .tool-action {
    font-size: 0.6875rem;
  }
}
</style>
