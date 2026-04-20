<template>
  <section class="features-wrapper" id="features">
    <!-- Animated Background Elements -->
    <div class="bg-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>

    <v-container>
      <!-- Section Header -->
      <v-row justify="center" class="section-header-no-gap">
        <v-col cols="12" md="8" lg="6" class="text-center">
          <div class="section-badge mb-4">
            ✨ Why Choose Us
          </div>
          <h2 class="section-title mb-4">
            Powerful Features for 
            <span class="text-gradient">Smart Analysis</span>
          </h2>
          <p class="section-subtitle">
            Everything you need to transform static documents into dynamic, 
            actionable data using our cutting-edge AI engine.
          </p>
        </v-col>
      </v-row>

      <!-- Features Grid - Fixed spacing -->
      <v-row class="features-grid">
        <v-col 
          v-for="(feature, index) in features" 
          :key="index"
          cols="12" 
          sm="6"
          md="4"
          class="feature-col"
        >
          <v-card
            class="feature-card"
            elevation="0"
            rounded="xl"
          >
            <!-- Icon Container - Fixed alignment -->
            <div class="feature-icon-wrapper">
              <div class="feature-icon-bg" :style="{ background: feature.gradient }">
                <v-icon size="36" color="white" class="feature-icon">{{ feature.icon }}</v-icon>
              </div>
            </div>

            <!-- Content - Fixed spacing -->
            <div class="feature-content">
              <h3 class="feature-title">
                {{ feature.title }}
              </h3>
              <p class="feature-description">
                {{ feature.description }}
              </p>
              
              <!-- Learn More Link -->
              <div class="feature-link">
                <span>Learn More</span>
                <v-icon size="16" class="ml-1">mdi-arrow-right</v-icon>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Bottom CTA -->
      <v-row justify="center">
        <v-col cols="auto">
          <v-btn
            size="large"
            class="features-cta-btn"
            @click="scrollToCta"
          >
            Explore All Features
            <v-icon end class="ml-2">mdi-arrow-right</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
interface Feature {
  title: string;
  description: string;
  icon: string;
  gradient: string;
  color: string;
}

const features: Feature[] = [
  {
    title: 'OCR Extraction',
    description: 'Convert scanned PDFs and images into editable text with 99.9% accuracy using our neural vision models.',
    icon: 'mdi-file-search-outline',
    gradient: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
    color: '#4F46E5'
  },
  {
    title: 'AI Summarization',
    description: 'Condense 50-page reports into key bullet points and executive summaries in less than 5 seconds.',
    icon: 'mdi-auto-fix',
    gradient: 'linear-gradient(135deg, #06B6D4, #0891B2)',
    color: '#06B6D4'
  },
  {
    title: 'Neural Translation',
    description: 'Break language barriers instantly. Translate complex technical documents while maintaining original formatting.',
    icon: 'mdi-translate',
    gradient: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
    color: '#8B5CF6'
  },
  {
    title: 'Smart Search',
    description: 'Find any information instantly with AI-powered semantic search across all your documents.',
    icon: 'mdi-magnify',
    gradient: 'linear-gradient(135deg, #EC4899, #BE185D)',
    color: '#EC4899'
  },
  {
    title: 'Data Extraction',
    description: 'Extract tables, forms, and structured data automatically with 99% accuracy.',
    icon: 'mdi-database-export',
    gradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
    color: '#F59E0B'
  },
  {
    title: 'API Integration',
    description: 'Seamlessly integrate with your existing workflow using our powerful REST API.',
    icon: 'mdi-api',
    gradient: 'linear-gradient(135deg, #10B981, #059669)',
    color: '#10B981'
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
.features-wrapper {
  position: relative;
  padding: 5rem 0;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%);
  overflow-x: hidden;
}

/* Animated Background Shapes */
.bg-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}

.shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.3;
  pointer-events: none;
}

.shape-1 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #4F46E5, #06B6D4);
  top: -100px;
  left: -100px;
  animation: float 20s infinite;
}

.shape-2 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #8B5CF6, #EC4899);
  bottom: -50px;
  right: -50px;
  animation: float 25s infinite reverse;
}

.shape-3 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #F59E0B, #10B981);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: float 30s infinite;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(30px, -30px) rotate(120deg); }
  66% { transform: translate(-20px, 20px) rotate(240deg); }
}

/* Section Header - Fixed spacing */
.section-header-no-gap {
  margin-bottom: 0;
  position: relative;
  z-index: 1;
}

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

/* Features Grid - Fixed spacing */
.features-grid {
  margin: 0 -12px !important;
  position: relative;
  z-index: 1;
}

.feature-col {
  padding: 12px !important;
  margin-bottom: 0;
}

/* Feature Cards - Fixed height and alignment */
.feature-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 24px;
  padding: 2rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4F46E5, #06B6D4, #8B5CF6);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  border-color: rgba(79, 70, 229, 0.2);
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15);
}

.feature-card:hover::before {
  transform: scaleX(1);
}

/* Feature Icon - Fixed alignment */
.feature-icon-wrapper {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.feature-icon-bg {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.feature-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-card:hover .feature-icon-bg {
  transform: scale(1.05);
  box-shadow: 0 15px 30px -8px rgba(0, 0, 0, 0.15);
}

/* Feature Content - Fixed text alignment */
.feature-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.feature-title {
  font-size: 1.35rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #0F172A;
  line-height: 1.3;
}

.feature-description {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: #64748B;
  margin-bottom: 1.5rem;
  flex: 1;
}

.feature-link {
  display: inline-flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: #4F46E5;
  cursor: pointer;
  opacity: 0;
  transform: translateX(-8px);
  transition: all 0.3s ease;
  padding: 4px 0;
}

.feature-card:hover .feature-link {
  opacity: 1;
  transform: translateX(0);
}

.feature-link:hover {
  gap: 6px;
  color: #06B6D4;
}

/* CTA Button */
.features-cta-btn {
  background: linear-gradient(135deg, #4F46E5, #06B6D4) !important;
  color: white !important;
  text-transform: none !important;
  font-weight: 600 !important;
  padding: 0 2rem !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3) !important;
  transition: all 0.3s ease !important;
}

.features-cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(79, 70, 229, 0.4) !important;
}

/* Dark Mode Support */
:deep(.dark) .features-wrapper {
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%);
}

:deep(.dark) .feature-card {
  background: rgba(30, 41, 59, 0.95);
  border-color: rgba(51, 65, 85, 0.8);
}

:deep(.dark) .section-title {
  color: #F1F5F9;
}

:deep(.dark) .section-subtitle {
  color: #94A3B8;
}

:deep(.dark) .feature-title {
  color: #F1F5F9;
}

:deep(.dark) .feature-description {
  color: #94A3B8;
}

/* Responsive Design - Fixed spacing */
@media (max-width: 1264px) {
  .features-wrapper {
    padding: 4rem 0;
  }
  
  .feature-card {
    padding: 1.75rem;
  }
  
  .feature-icon-bg {
    width: 64px;
    height: 64px;
  }
  
  .feature-icon {
    font-size: 32px !important;
  }
  
  .feature-title {
    font-size: 1.25rem;
  }
}

@media (max-width: 960px) {
  .features-wrapper {
    padding: 3rem 0;
  }
  
  .section-header {
    margin-bottom: 2rem;
  }
  
  .feature-card {
    padding: 1.5rem;
  }
  
  .feature-icon-bg {
    width: 60px;
    height: 60px;
  }
  
  .feature-icon {
    font-size: 30px !important;
  }
}

@media (max-width: 600px) {
  .features-wrapper {
    padding: 2rem 0;
  }
  
  .section-header {
    margin-bottom: 1.5rem;
  }
  
  .feature-col {
    padding: 8px !important;
  }
  
  .feature-card {
    padding: 1.25rem;
  }
  
  .feature-icon-bg {
    width: 56px;
    height: 56px;
  }
  
  .feature-icon {
    font-size: 28px !important;
  }
  
  .feature-title {
    font-size: 1.125rem;
    margin-bottom: 0.5rem;
  }
  
  .feature-description {
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }
  
  .section-badge {
    font-size: 0.75rem;
    padding: 0.375rem 1rem;
  }
  
  .section-subtitle {
    font-size: 0.9375rem;
  }
  
  .features-cta-btn {
    font-size: 0.875rem !important;
    padding: 0 1.5rem !important;
  }
}

/* Animation - Fixed stagger timing */
.feature-col {
  opacity: 0;
  animation: fadeInUp 0.5s ease forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Stagger animations - smoother */
.feature-col:nth-child(1) { animation-delay: 0.05s; }
.feature-col:nth-child(2) { animation-delay: 0.1s; }
.feature-col:nth-child(3) { animation-delay: 0.15s; }
.feature-col:nth-child(4) { animation-delay: 0.2s; }
.feature-col:nth-child(5) { animation-delay: 0.25s; }
.feature-col:nth-child(6) { animation-delay: 0.3s; }
</style>