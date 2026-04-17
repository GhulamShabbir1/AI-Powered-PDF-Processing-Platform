<template>
  <section class="ai-processing" id="ai-processing">
    <!-- Animated Background Elements -->
    <div class="bg-elements">
      <div class="bg-circle bg-circle-1"></div>
      <div class="bg-circle bg-circle-2"></div>
      <div class="bg-circle bg-circle-3"></div>
      <div class="bg-circle bg-circle-4"></div>
    </div>

    <v-container>
      <!-- Section Header -->
      <v-row justify="center" class="mb-12 lg:mb-16">
        <v-col cols="12" md="8" class="text-center">
          <div class="section-badge mb-4">
            🚀 Advanced AI Technology
          </div>
          <h2 class="section-title mb-4">
            Powered by 
            <span class="text-gradient">Next-Gen AI</span>
          </h2>
          <p class="section-subtitle">
            Experience the future of document processing with our cutting-edge neural networks
            and advanced machine learning algorithms.
          </p>
        </v-col>
      </v-row>

      <!-- Processing Details -->
      <v-row 
        v-for="(item, index) in details" 
        :key="index"
        class="processing-row mb-12"
        :class="{ 'flex-row-reverse': index % 2 === 1 }"
      >
        <!-- Content Column -->
        <v-col cols="12" lg="6" class="processing-content-col">
          <div class="processing-content" :class="{ 'text-right': index % 2 === 1 }">
            <!-- Tag Badge -->
            <div class="feature-tag" :style="{ background: item.gradient }">
              <v-icon size="20" color="white" class="mr-2">{{ item.icon }}</v-icon>
              <span>{{ item.tag }}</span>
            </div>

            <!-- Title -->
            <h3 class="processing-title">
              {{ item.title }}
            </h3>

            <!-- Description -->
            <p class="processing-description">
              {{ item.description }}
            </p>

            <!-- Feature Points -->
            <div class="feature-points" :class="{ 'justify-end': index % 2 === 1 }">
              <div 
                v-for="(point, pIdx) in item.points" 
                :key="pIdx"
                class="feature-point"
              >
                <v-icon size="18" :color="item.color" class="mr-2">mdi-check-circle</v-icon>
                <span>{{ point }}</span>
              </div>
            </div>

            <!-- CTA Button -->
            <v-btn
              size="large"
              class="processing-cta"
              :style="{ background: item.gradient }"
              @click="scrollToCta"
            >
              Try {{ item.tag }} Now
              <v-icon end class="ml-2">mdi-arrow-right</v-icon>
            </v-btn>
          </div>
        </v-col>

        <!-- Image Column -->
        <v-col cols="12" lg="6" class="processing-image-col">
          <div class="image-container">
            <div class="image-glow" :style="{ background: item.gradient }"></div>
            <div class="image-wrapper">
              <v-img
                :src="item.image"
                :alt="item.title"
                class="processing-image"
                cover
                rounded="xl"
              >
                <template v-slot:placeholder>
                  <div class="image-placeholder">
                    <v-progress-circular
                      indeterminate
                      :color="item.color"
                      size="50"
                    />
                  </div>
                </template>
              </v-img>
              
              <!-- Floating Stats -->
              <div class="floating-stats">
                <div class="stat stat-1">
                  <v-icon size="16" :color="item.color">mdi-speedometer</v-icon>
                  <span>99.9% Accuracy</span>
                </div>
                <div class="stat stat-2">
                  <v-icon size="16" :color="item.color">mdi-clock-fast</v-icon>
                  <span>&lt;5s Processing</span>
                </div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Bottom Stats Bar -->
      <v-row justify="center" class="mt-12 pt-8">
        <v-col cols="12">
          <div class="stats-bar">
            <div class="stat-item">
              <div class="stat-value">1M+</div>
              <div class="stat-label">Documents Processed</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-value">99.9%</div>
              <div class="stat-label">Accuracy Rate</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-value">50+</div>
              <div class="stat-label">Languages Supported</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-value">24/7</div>
              <div class="stat-label">AI Support</div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
interface DetailBlock {
  tag: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  image: string;
  points: string[];
}

const details: DetailBlock[] = [
  {
    tag: 'OCR',
    title: 'Advanced Text Extraction at Enterprise Scale',
    description: 'Beyond pixels—our Vision AI understands document anatomy: multi-column layouts, nested tables, charts, and handwritten notes become perfectly structured data.',
    icon: 'mdi-scan-helper',
    color: '#4F46E5',
    gradient: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&w=800&q=80',
    points: [
      '50+ languages & dialects',
      'Table reconstruction with formulas',
      'Handwriting & signature detection'
    ]
  },
  {
    tag: 'Summarization',
    title: 'Instant Executive Insights & Analysis',
    description: 'LLM-powered extraction of key findings, risks, and opportunities. Customizable by tone, length, and focus areas for any business need.',
    icon: 'mdi-text-box-search-outline',
    color: '#06B6D4',
    gradient: 'linear-gradient(135deg, #06B6D4, #0891B2)',
    image: 'https://images.unsplash.com/photo-1517433456452-f9633a875f6f?ixlib=rb-4.0.3&w=800&q=80',
    points: [
      'Multi-length summaries',
      'Risk/opportunity highlighting',
      'Custom focus areas'
    ]
  },
  {
    tag: 'Translation',
    title: 'Global Document Intelligence',
    description: 'Neural translation preserves exact formatting while adapting content culturally and contextually for international audiences.',
    icon: 'mdi-earth-globe-variant',
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&w=800&q=80',
    points: [
      'Format/layout preservation',
      'Industry terminology packs',
      'Real-time collaboration'
    ]
  }
];

const scrollToCta = () => {
  const element = document.getElementById('cta');
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};
</script>

<style scoped>
.ai-processing {
  position: relative;
  padding: 5rem 0;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%);
  overflow-x: hidden;
}

/* Animated Background Elements */
.bg-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  animation: floatBg 20s infinite ease-in-out;
}

.bg-circle-1 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #4F46E5, #06B6D4);
  top: -100px;
  left: -100px;
}

.bg-circle-2 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #8B5CF6, #EC4899);
  bottom: -50px;
  right: -50px;
  animation-delay: 5s;
}

.bg-circle-3 {
  width: 250px;
  height: 250px;
  background: linear-gradient(135deg, #F59E0B, #10B981);
  top: 40%;
  left: 70%;
  animation-delay: 10s;
}

.bg-circle-4 {
  width: 350px;
  height: 350px;
  background: linear-gradient(135deg, #EF4444, #F59E0B);
  bottom: 30%;
  right: 60%;
  animation-delay: 15s;
}

@keyframes floatBg {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

/* Section Header */
.section-badge {
  display: inline-block;
  padding: 0.5rem 1.25rem;
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(6, 182, 212, 0.1));
  border-radius: 100px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #4F46E5;
  letter-spacing: 0.025em;
}

.section-title {
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 800;
  line-height: 1.2;
  color: #0F172A;
}

.text-gradient {
  background: linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-subtitle {
  font-size: 1.125rem;
  color: #64748B;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Processing Rows */
.processing-row {
  position: relative;
  z-index: 1;
  margin-bottom: 5rem;
}

/* Content Styles */
.processing-content-col {
  display: flex;
  align-items: center;
}

.processing-content {
  padding: 2rem;
}

.text-right .processing-content {
  text-align: right;
}

/* Feature Tag */
.feature-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1.25rem;
  border-radius: 100px;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1.5rem;
}

/* Processing Title */
.processing-title {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 1rem;
  line-height: 1.3;
}

/* Processing Description */
.processing-description {
  font-size: 1rem;
  line-height: 1.6;
  color: #64748B;
  margin-bottom: 1.5rem;
}

/* Feature Points */
.feature-points {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}

.text-right .feature-points {
  justify-content: flex-end;
}

.feature-point {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: #334155;
  background: rgba(255, 255, 255, 0.8);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  backdrop-filter: blur(4px);
}

/* CTA Button */
.processing-cta {
  text-transform: none !important;
  font-weight: 600 !important;
  padding: 0 1.5rem !important;
  border-radius: 12px !important;
  color: white !important;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2) !important;
  transition: all 0.3s ease !important;
}

.processing-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25) !important;
}

/* Image Styles */
.processing-image-col {
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-container {
  position: relative;
  width: 100%;
  max-width: 500px;
}

.image-glow {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 120%;
  height: 120%;
  border-radius: 30px;
  filter: blur(40px);
  opacity: 0.3;
  z-index: -1;
  animation: glowPulse 3s infinite;
}

@keyframes glowPulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.05);
  }
}

.image-wrapper {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.2);
}

.processing-image {
  width: 100%;
  height: auto;
  transition: transform 0.5s ease;
}

.image-wrapper:hover .processing-image {
  transform: scale(1.05);
}

.image-placeholder {
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
}

/* Floating Stats */
.floating-stats {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.stat {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1rem;
  border-radius: 100px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #1E293B;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.5s ease forwards;
  opacity: 0;
  transform: translateY(20px);
}

.stat-1 { animation-delay: 0.3s; }
.stat-2 { animation-delay: 0.5s; }

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Stats Bar */
.stats-bar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: white;
  border-radius: 80px;
  padding: 2rem 3rem;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #4F46E5, #06B6D4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748B;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: #E2E8F0;
}

/* Dark Mode Support */
:deep(.dark) .ai-processing {
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%);
}

:deep(.dark) .section-title {
  color: #F1F5F9;
}

:deep(.dark) .section-subtitle {
  color: #94A3B8;
}

:deep(.dark) .processing-title {
  color: #F1F5F9;
}

:deep(.dark) .processing-description {
  color: #94A3B8;
}

:deep(.dark) .feature-point {
  background: rgba(30, 41, 59, 0.9);
  color: #CBD5E1;
}

:deep(.dark) .stats-bar {
  background: #1E293B;
  border-color: #334155;
}

:deep(.dark) .stat-label {
  color: #94A3B8;
}

:deep(.dark) .stat-divider {
  background: #334155;
}

/* Responsive Design */
@media (max-width: 1264px) {
  .stats-bar {
    padding: 1.5rem 2rem;
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
}

@media (max-width: 960px) {
  .ai-processing {
    padding: 3rem 0;
  }
  
  .processing-row {
    margin-bottom: 3rem;
  }
  
  .processing-content {
    padding: 1.5rem;
    text-align: center !important;
  }
  
  .feature-tag {
    margin-left: auto;
    margin-right: auto;
  }
  
  .feature-points {
    justify-content: center !important;
  }
  
  .stats-bar {
    flex-direction: column;
    gap: 1.5rem;
    border-radius: 24px;
    padding: 1.5rem;
  }
  
  .stat-divider {
    width: 80px;
    height: 1px;
  }
  
  .floating-stats {
    bottom: 10px;
    left: 10px;
    right: 10px;
  }
  
  .stat {
    padding: 0.375rem 0.75rem;
    font-size: 0.625rem;
  }
}

@media (max-width: 600px) {
  .ai-processing {
    padding: 2rem 0;
  }
  
  .section-badge {
    font-size: 0.75rem;
    padding: 0.375rem 1rem;
  }
  
  .feature-points {
    flex-direction: column;
    align-items: center;
  }
  
  .floating-stats {
    display: none;
  }
  
  .stats-bar {
    margin-top: 1rem;
  }
  
  .stat-value {
    font-size: 1.25rem;
  }
  
  .stat-label {
    font-size: 0.75rem;
  }
}
</style>