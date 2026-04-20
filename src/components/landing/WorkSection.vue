<template>
  <section class="how-it-works" id="how-it-works">
    <!-- Animated Background -->
    <div class="bg-particles">
      <div class="particle particle-1"></div>
      <div class="particle particle-2"></div>
      <div class="particle particle-3"></div>
      <div class="particle particle-4"></div>
      <div class="particle particle-5"></div>
    </div>

    <v-container>
      <!-- Section Header -->
      <v-row justify="center" class="section-header-no-gap">
        <v-col cols="12" md="8" class="text-center">
          <div class="section-badge mb-4">
            ⚡ Simple Process
          </div>
          <h2 class="section-title mb-4">
            Four Simple Steps to 
            <span class="text-gradient">Magic</span>
          </h2>
          <p class="section-subtitle">
            Our streamlined workflow handles the complexity so you can focus on the insights.
            Get started in minutes, not days.
          </p>
        </v-col>
      </v-row>

      <!-- Steps Grid -->
      <v-row class="steps-grid">
        <v-col 
          v-for="(step, index) in steps" 
          :key="index"
          cols="12" 
          sm="6"
          md="3"
          class="step-col"
        >
          <div class="step-card">
            <!-- Step Number -->
            <div class="step-number-wrapper">
              <div class="step-number">{{ String(index + 1).padStart(2, '0') }}</div>
            </div>

            <!-- Icon -->
            <div class="step-icon-wrapper">
              <div class="step-icon-bg" :style="{ background: step.gradient }">
                <v-icon size="32" color="white">{{ step.icon }}</v-icon>
              </div>
            </div>

            <!-- Content -->
            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-description">{{ step.description }}</p>

            <!-- Connector Line (Desktop only) -->
            <div v-if="index < steps.length - 1" class="step-connector desktop-only">
              <div class="connector-line"></div>
              <div class="connector-dot">
                <v-icon size="14" color="#4F46E5">mdi-arrow-right</v-icon>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Bottom CTA -->
      <v-row justify="center">
        <v-col cols="auto">
          <v-btn
            size="large"
            class="steps-cta-btn"
            @click="scrollToCta"
          >
            Start Your Free Trial
            <v-icon end class="ml-2">mdi-rocket-launch</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
interface Step {
  title: string;
  description: string;
  icon: string;
  gradient: string;
}

const steps: Step[] = [
  {
    title: 'Upload File',
    description: 'Securely drag & drop your PDFs or images into our cloud portal. Supports all major formats.',
    icon: 'mdi-cloud-upload-outline',
    gradient: 'linear-gradient(135deg, #4F46E5, #7C3AED)'
  },
  {
    title: 'Choose Process',
    description: 'Select OCR, Summarization, Translation, or Data Extraction based on your needs.',
    icon: 'mdi-tune',
    gradient: 'linear-gradient(135deg, #06B6D4, #0891B2)'
  },
  {
    title: 'AI Processing',
    description: 'Our neural engine processes instantly with real-time progress and smart optimization.',
    icon: 'mdi-brain',
    gradient: 'linear-gradient(135deg, #8B5CF6, #6D28D9)'
  },
  {
    title: 'Download Results',
    description: 'Get perfectly formatted results in multiple formats or export directly to your tools.',
    icon: 'mdi-download-circle-outline',
    gradient: 'linear-gradient(135deg, #10B981, #059669)'
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
.how-it-works {
  position: relative;
  padding: 5rem 0;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%);
  overflow-x: hidden;
}

/* Animated Particles Background */
.bg-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.08;
  animation: floatParticle 15s infinite ease-in-out;
  pointer-events: none;
}

.particle-1 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #4F46E5, #06B6D4);
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.particle-2 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #8B5CF6, #EC4899);
  bottom: -50px;
  right: -50px;
  animation-delay: 2s;
}

.particle-3 {
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, #F59E0B, #10B981);
  top: 50%;
  left: 10%;
  animation-delay: 4s;
}

.particle-4 {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #EF4444, #F59E0B);
  bottom: 20%;
  right: 15%;
  animation-delay: 6s;
}

.particle-5 {
  width: 250px;
  height: 250px;
  background: linear-gradient(135deg, #06B6D4, #8B5CF6);
  top: 20%;
  right: 5%;
  animation-delay: 8s;
}

@keyframes floatParticle {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(30px, -30px) rotate(120deg);
  }
  66% {
    transform: translate(-20px, 20px) rotate(240deg);
  }
}

/* Section Header */
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

/* Steps Grid */
.steps-grid {
  margin: 0 -12px !important;
  position: relative;
  z-index: 1;
}

.step-col {
  padding: 12px !important;
  margin-bottom: 0;
}

/* Step Card */
.step-card {
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 2rem 1.5rem;
  text-align: center;
  height: 100%;
  min-height: 280px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(226, 232, 240, 0.8);
  display: flex;
  flex-direction: column;
}

.step-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15);
  border-color: rgba(79, 70, 229, 0.2);
}

/* Step Number - Fixed positioning */
.step-number-wrapper {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}

.step-number {
  width: 36px;
  height: 36px;
  background: white;
  border: 2px solid #4F46E5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.875rem;
  color: #4F46E5;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.step-card:hover .step-number {
  transform: scale(1.05);
  border-color: #06B6D4;
  color: #06B6D4;
}

/* Step Icon - Fixed size */
.step-icon-wrapper {
  margin-bottom: 1.5rem;
  margin-top: 0.5rem;
}

.step-icon-bg {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  transition: all 0.3s ease;
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.1);
}

.step-card:hover .step-icon-bg {
  transform: scale(1.05);
  box-shadow: 0 15px 30px -8px rgba(0, 0, 0, 0.15);
}

/* Step Content */
.step-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #0F172A;
  line-height: 1.3;
}

.step-description {
  font-size: 0.875rem;
  line-height: 1.6;
  color: #64748B;
  margin: 0;
  flex: 1;
}

/* Connector Line - Desktop only */
.desktop-only {
  display: block;
}

.step-connector {
  position: absolute;
  top: 50%;
  right: -24px;
  transform: translateY(-50%);
  width: 48px;
  z-index: 2;
}

.connector-line {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #4F46E5, #06B6D4);
  transform: translateY(-50%);
  border-radius: 2px;
}

.connector-dot {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  background: white;
  border: 2px solid #4F46E5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;
  background: white;
}

@keyframes pulse {
  0%, 100% {
    transform: translateY(-50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translateY(-50%) scale(1.15);
    opacity: 0.8;
  }
}

/* CTA Button */
.steps-cta-btn {
  background: linear-gradient(135deg, #4F46E5, #06B6D4) !important;
  color: white !important;
  text-transform: none !important;
  font-weight: 600 !important;
  padding: 0 2rem !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3) !important;
  transition: all 0.3s ease !important;
}

.steps-cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(79, 70, 229, 0.4) !important;
}

/* Dark Mode Support */
:deep(.dark) .how-it-works {
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%);
}

:deep(.dark) .step-card {
  background: rgba(30, 41, 59, 0.95);
  border-color: rgba(51, 65, 85, 0.8);
}

:deep(.dark) .section-title {
  color: #F1F5F9;
}

:deep(.dark) .section-subtitle {
  color: #94A3B8;
}

:deep(.dark) .step-title {
  color: #F1F5F9;
}

:deep(.dark) .step-description {
  color: #94A3B8;
}

:deep(.dark) .step-number {
  background: #1E293B;
  border-color: #4F46E5;
  color: #4F46E5;
}

:deep(.dark) .connector-dot {
  background: #1E293B;
  border-color: #4F46E5;
}

/* Responsive Design */
@media (min-width: 1265px) and (max-width: 1440px) {
  .step-connector {
    right: -20px;
    width: 40px;
  }
  
  .connector-dot {
    width: 20px;
    height: 20px;
  }
  
  .connector-dot .v-icon {
    font-size: 12px !important;
  }
}

@media (max-width: 1264px) {
  .step-connector {
    display: none;
  }
  
  .desktop-only {
    display: none;
  }
}

@media (max-width: 960px) {
  .how-it-works {
    padding: 4rem 0;
  }
  
  .section-header {
    margin-bottom: 2rem;
  }
  
  .step-card {
    padding: 1.5rem;
    min-height: 260px;
  }
  
  .step-icon-bg {
    width: 64px;
    height: 64px;
  }
  
  .step-icon-bg .v-icon {
    font-size: 28px !important;
  }
  
  .step-title {
    font-size: 1.125rem;
  }
}

@media (max-width: 600px) {
  .how-it-works {
    padding: 3rem 0;
  }
  
  .section-header {
    margin-bottom: 1.5rem;
  }
  
  .step-col {
    padding: 8px !important;
  }
  
  .step-card {
    padding: 1.25rem;
    min-height: 240px;
  }
  
  .step-icon-bg {
    width: 56px;
    height: 56px;
  }
  
  .step-icon-bg .v-icon {
    font-size: 24px !important;
  }
  
  .step-title {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
  
  .step-description {
    font-size: 0.8125rem;
  }
  
  .step-number {
    width: 32px;
    height: 32px;
    font-size: 0.75rem;
  }
  
  .section-badge {
    font-size: 0.75rem;
    padding: 0.375rem 1rem;
  }
  
  .section-subtitle {
    font-size: 0.9375rem;
  }
  
  .steps-cta-btn {
    font-size: 0.875rem !important;
    padding: 0 1.5rem !important;
  }
}

/* Animation for steps */
.step-col {
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

/* Stagger animations */
.step-col:nth-child(1) { animation-delay: 0.05s; }
.step-col:nth-child(2) { animation-delay: 0.1s; }
.step-col:nth-child(3) { animation-delay: 0.15s; }
.step-col:nth-child(4) { animation-delay: 0.2s; }
</style>