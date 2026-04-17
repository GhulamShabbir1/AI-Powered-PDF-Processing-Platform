<template>
  <section class="processing-details bg-gradient-wave position-relative overflow-hidden">
    <!-- Wave pattern -->
    <div class="wave-deco top"></div>
    <div class="wave-deco bottom"></div>
    
    <v-container>
      <v-row 
        v-for="(item, index) in details" 
        :key="index"
        align="center"
        class="processing-row mb-12 lg:mb-16 py-8 position-relative"
        :class="index % 2 === 0 ? 'row-left' : 'row-right'"
      >
        <v-intersect once :delay="index * 200">
          <v-col cols="12" lg="5" xl="4" class="px-lg-12 order-2 order-lg-1">
            <div class="content-body fade-in-left">
              <div class="tag-header d-flex align-center mb-6">
                <div class="tag-badge" :style="{ backgroundColor: item.color + '20' }">
                  <v-icon :color="item.color" size="24">{{ item.icon }}</v-icon>
                </div>
                <span 
                  class="tag-text text-overline font-weight-black text-uppercase tracking-wider ml-3"
                  :style="{ color: item.color }"
                >
                  {{ item.tag }}
                </span>
              </div>
              
              <h2 class="text-h3 font-weight-bold mb-8 text-dark-primary leading-tight">
                {{ item.title }}
              </h2>
              
              <p class="text-body-1 text-muted mb-10 leading-loose">
                {{ item.description }}
              </p>

              <v-list bg-color="transparent" class="features-list mb-10 pa-0">
                <v-list-item 
                  v-for="(point, pIdx) in item.points" 
                  :key="pIdx" 
                  class="px-0 py-2 feature-point"
                >
                  <template v-slot:prepend>
                    <v-icon color="success" size="20" class="shrink mr-3">mdi-check-circle-outline</v-icon>
                  </template>
                  <v-list-item-title class="text-body-1 font-weight-medium lh-snug">
                    {{ point }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>

              <v-btn 
                size="large" 
                :color="item.color"
                class="px-10 py-3 font-weight-bold text-transform-none rounded-lg"
                elevation="4"
                :class="['cta-gradient', item.color + '-btn']"
              >
                Try {{ item.tag }}
                <v-icon end size="20" class="ml-2">mdi-arrow-right</v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-intersect>

        <v-intersect once :delay="index * 200 + 100">
          <v-col cols="12" lg="7" xl="8" class="mt-12 mt-lg-0 order-1 order-lg-2">
            <div class="image-wrapper position-relative">
              <div class="image-blob" :style="{ background: item.color + '15' }"></div>
              <v-img
                :src="item.image"
                :alt="item.title"
                class="processing-image app-card elevation-16 rounded-2xl"
                cover
                :aspect-ratio="16/9"
                lazy-src="https://placehold.co/400x300/1e293b/ffffff?text=AI..."
              >
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular 
                      indeterminate 
                      :color="item.color" 
                      size="80"
                      class="loader-glow"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </div>
          </v-col>
        </v-intersect>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface DetailBlock {
  tag: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  image: string;
  points: string[];
}

const details = ref<DetailBlock[]>([
  {
    tag: 'OCR',
    title: 'Text Extraction at Enterprise Scale',
    description: 'Beyond pixels—our Vision AI understands document anatomy: multi-column layouts, nested tables, charts, and handwritten notes become perfectly structured data.',
    icon: 'mdi-scan-helper',
    color: '#4F46E5',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&w=1200&q=80',
    points: [
      '50+ languages & dialects',
      'Table reconstruction with formulas',
      'Handwriting & signature detection'
    ]
  },
  {
    tag: 'Summarization', 
    title: 'Executive Insights Instantly',
    description: 'LLM-powered extraction of key findings, risks, and opportunities. Customizable by tone, length, and focus areas.',
    icon: 'mdi-text-box-search-outline',
    color: '#06B6D4',
    image: 'https://images.unsplash.com/photo-1517433456452-f9633a875f6f?ixlib=rb-4.0.3&w=1200&q=80',
    points: [
      'Multi-length summaries',
      'Risk/opportunity highlighting',
      'Custom focus areas'
    ]
  },
  {
    tag: 'Translation',
    title: 'Global Document Intelligence',
    description: 'Neural translation preserves exact formatting while adapting content culturally and contextually.',
    icon: 'mdi-earth-globe-variant',
    color: '#8B5CF6',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&w=1200&q=80',
    points: [
      'Format/layout preservation',
      'Industry terminology packs',
      'Real-time collaboration'
    ]
  }
]);
</script>

<style scoped>
.bg-gradient-wave {
  background: linear-gradient(135deg, #f0f9ff 0%, #f8fafc 30%, #ffffff 70%, #f1f5f9 100%);
  overflow-x: hidden !important;
  width: 100vw !important;
  max-width: 100vw !important;
}

.processing-details {
  overflow-x: hidden !important;
}

/* Image wrappers */
.image-wrapper,
.processing-image {
  max-width: 100% !important;
  overflow: hidden !important;
}

.wave-deco {
  position: absolute;
  height: 200px;
  width: 200%;
  background-size: 100px 100px;
  opacity: 0.05;
  z-index: 0;
}

.wave-deco.top {
  top: 0;
  background-image: linear-gradient(45deg, transparent 49%, rgba(79,70,229,0.03) 50%), 
                          linear-gradient(-45deg, transparent 49%, rgba(6,182,212,0.03) 50%);
  animation: waveMove 20s linear infinite;
}

.wave-deco.bottom {
  bottom: 0;
  background-image: linear-gradient(45deg, transparent 49%, rgba(139,92,246,0.03) 50%), 
                          linear-gradient(-45deg, transparent 49%, rgba(16,185,129,0.03) 50%);
  animation: waveMoveReverse 25s linear infinite;
}

@keyframes waveMove {
  0% { transform: translateX(-100px) translateY(-20px); }
  100% { transform: translateX(-1800px) translateY(-20px); }
}

@keyframes waveMoveReverse {
  0% { transform: translateX(-100px) translateY(20px); }
  100% { transform: translateX(-1800px) translateY(20px); }
}

.tag-badge {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 15px currentColor20;
}

.tag-text {
  letter-spacing: 0.15em;
}

.content-body {
  max-width: 520px;
}

.fade-in-left {
  transform: translateX(-30px);
}

.fade-in-left.v-fade-transition--enter-active .v-fade-transition__wrapper {
  transition-delay: 0.2s;
}

.lh-snug {
  line-height: 1.5;
}

.cta-gradient {
  position: relative;
  overflow: hidden;
}

.cta-gradient::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.6s;
}

.cta-gradient:hover::before {
  left: 100%;
}

.image-wrapper {
  z-index: 2;
}

.image-blob {
  position: absolute;
  top: -30px;
  right: -30px;
  width: 100%;
  height: 100%;
  border-radius: var(--radius-2xl);
  filter: blur(60px);
  z-index: -1;
  animation: blobPulse 4s ease-in-out infinite;
}

@keyframes blobPulse {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.6; }
  50% { transform: scale(1.1) rotate(180deg); opacity: 1; }
}

.loader-glow {
  filter: drop-shadow(0 0 20px currentColor);
}

.processing-image {
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.processing-image:hover {
  transform: scale(1.03);
}

/* Mobile: Force Vertical Stack */
@media (max-width: 959px) {
  .processing-row {
    flex-direction: column !important;
  }
  
  .row-left, .row-right {
    flex-direction: column !important;
  }
  
  .order-1, .order-2 {
    order: 1 !important;
  }
  
  .mt-12 { margin-top: 3rem !important; }
}

@media (max-width: 600px) {
  .py-20 { padding-top: 5rem !important; padding-bottom: 5rem !important; }
}
</style>

