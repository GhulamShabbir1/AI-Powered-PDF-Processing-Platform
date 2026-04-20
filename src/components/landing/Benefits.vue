<template>
  <section class="benefits-wrapper" id="benefits">
    <!-- Animated Background -->
    <div class="bg-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
      <div class="shape shape-4"></div>
    </div>

    <v-container>
      <!-- Section Header -->
      <v-row justify="center">
        <v-col cols="12" md="8" class="text-center">
          <div class="section-badge mb-4">
            💪 Why Choose Us
          </div>
          <h2 class="section-title mb-4">
            Why Choose Our 
            <span class="text-gradient">AI Engine?</span>
          </h2>
          <p class="section-subtitle">
            Built for enterprise-grade performance, reliability, and security.
            Trusted by leading companies worldwide.
          </p>
        </v-col>
      </v-row>

      <!-- Benefits Grid -->
      <v-row class="benefits-grid">
        <v-col 
          v-for="(benefit, index) in benefits" 
          :key="index"
          cols="12" 
          sm="6" 
          lg="3"
          class="benefit-col"
        >
          <div class="benefit-card">
            <!-- Icon -->
            <div class="benefit-icon-wrapper">
              <div class="benefit-icon-bg" :style="{ background: benefit.gradient }">
                <v-icon size="32" color="white" class="benefit-icon">{{ benefit.icon }}</v-icon>
              </div>
            </div>

            <!-- Content -->
            <h3 class="benefit-title">{{ benefit.title }}</h3>
            <p class="benefit-description">{{ benefit.description }}</p>

            <!-- Hover Overlay -->
            <div class="benefit-overlay" :style="{ background: benefit.gradient }">
              <v-icon size="48" color="white">{{ benefit.icon }}</v-icon>
              <span>Learn More</span>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Trust Section -->
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <div class="trust-section">
            <!-- Trust Badges -->
            <div class="trust-badges">
              <div class="trust-badge">
                <v-icon color="#10B981" size="28" class="trust-icon">mdi-shield-check</v-icon>
                <div class="trust-content">
                  <div class="trust-title">ISO 27001 Certified</div>
                  <div class="trust-subtitle">Information Security Management</div>
                </div>
              </div>
              
              <div class="trust-badge">
                <v-icon color="#4F46E5" size="28" class="trust-icon">mdi-lock-check</v-icon>
                <div class="trust-content">
                  <div class="trust-title">GDPR Compliant</div>
                  <div class="trust-subtitle">Data Protection & Privacy</div>
                </div>
              </div>
              
              <div class="trust-badge">
                <v-icon color="#06B6D4" size="28" class="trust-icon">mdi-certificate</v-icon>
                <div class="trust-content">
                  <div class="trust-title">SOC2 Type II</div>
                  <div class="trust-subtitle">Security & Availability</div>
                </div>
              </div>
            </div>

            <!-- Trust Text -->
            <div class="trust-text">
              <p>Enterprise-grade security and compliance for your most sensitive documents</p>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
interface Benefit {
  title: string;
  description: string;
  icon: string;
  gradient: string;
  color: string;
}

const benefits: Benefit[] = [
  {
    title: 'Lightning Fast',
    description: 'Process documents in milliseconds using distributed GPU clusters with parallel processing.',
    icon: 'mdi-flash',
    gradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
    color: '#F59E0B'
  },
  {
    title: '99.9% Accuracy',
    description: 'Trained on billions of samples for unmatched extraction precision and reliability.',
    icon: 'mdi-target',
    gradient: 'linear-gradient(135deg, #10B981, #059669)',
    color: '#10B981'
  },
  {
    title: 'Bank-Grade Security',
    description: 'SOC2 compliant with end-to-end encryption. Your data, your control, always.',
    icon: 'mdi-shield-lock',
    gradient: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
    color: '#4F46E5'
  },
  {
    title: 'Infinite Scale',
    description: 'Handle single PDFs or enterprise batches automatically without any limits.',
    icon: 'mdi-cloud-upload',
    gradient: 'linear-gradient(135deg, #06B6D4, #0891B2)',
    color: '#06B6D4'
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
.benefits-wrapper {
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
  filter: blur(80px);
  opacity: 0.15;
  animation: floatShape 20s infinite ease-in-out;
  pointer-events: none;
}

.shape-1 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #4F46E5, #06B6D4);
  top: -100px;
  left: -100px;
}

.shape-2 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #F59E0B, #10B981);
  bottom: -50px;
  right: -50px;
  animation-delay: 5s;
}

.shape-3 {
  width: 250px;
  height: 250px;
  background: linear-gradient(135deg, #8B5CF6, #EC4899);
  top: 40%;
  left: 70%;
  animation-delay: 10s;
}

.shape-4 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #06B6D4, #8B5CF6);
  bottom: 30%;
  left: 10%;
  animation-delay: 15s;
}

@keyframes floatShape {
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

/* Benefits Grid */
.benefits-grid {
  margin: 0 -12px;
}

.benefit-col {
  padding: 12px;
  margin-bottom: 0;
}

/* Benefit Cards */
.benefit-card {
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
  cursor: pointer;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.benefit-card:hover {
  transform: translateY(-6px);
  border-color: rgba(79, 70, 229, 0.2);
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15);
}

/* Benefit Icon - FIXED spacing */
.benefit-icon-wrapper {
  margin-bottom: 1.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.benefit-icon-bg {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.1);
}

.benefit-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.benefit-card:hover .benefit-icon-bg {
  transform: scale(1.05);
  box-shadow: 0 15px 30px -8px rgba(0, 0, 0, 0.15);
}

/* Benefit Content - FIXED spacing */
.benefit-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #0F172A;
  line-height: 1.3;
}

.benefit-description {
  font-size: 0.875rem;
  line-height: 1.6;
  color: #64748B;
  margin: 0;
  flex: 1;
}

/* Hover Overlay */
.benefit-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  opacity: 0;
  transition: all 0.3s ease;
  border-radius: 24px;
  color: white;
  font-weight: 600;
  pointer-events: none;
}

.benefit-card:hover .benefit-overlay {
  opacity: 0.95;
}

.benefit-overlay span {
  font-size: 1rem;
  font-weight: 600;
}

/* Trust Section - FIXED spacing */
.trust-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 28px;
  padding: 2rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.08);
}

.trust-badges {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.trust-badge {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
}

.trust-icon {
  flex-shrink: 0;
}

.trust-content {
  text-align: left;
}

.trust-title {
  font-size: 1rem;
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 0.25rem;
}

.trust-subtitle {
  font-size: 0.75rem;
  color: #64748B;
}

.trust-text {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(226, 232, 240, 0.8);
}

.trust-text p {
  font-size: 0.875rem;
  color: #64748B;
  margin: 0;
}

/* CTA Button */
.benefits-cta-btn {
  background: linear-gradient(135deg, #4F46E5, #06B6D4) !important;
  color: white !important;
  text-transform: none !important;
  font-weight: 600 !important;
  padding: 0 2rem !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3) !important;
  transition: all 0.3s ease !important;
}

.benefits-cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(79, 70, 229, 0.4) !important;
}

/* Dark Mode Support */
:deep(.dark) .benefits-wrapper {
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%);
}

:deep(.dark) .benefit-card {
  background: rgba(30, 41, 59, 0.95);
  border-color: rgba(51, 65, 85, 0.8);
}

:deep(.dark) .section-title {
  color: #F1F5F9;
}

:deep(.dark) .section-subtitle {
  color: #94A3B8;
}

:deep(.dark) .benefit-title {
  color: #F1F5F9;
}

:deep(.dark) .benefit-description {
  color: #94A3B8;
}

:deep(.dark) .trust-section {
  background: rgba(30, 41, 59, 0.95);
  border-color: rgba(51, 65, 85, 0.8);
}

:deep(.dark) .trust-title {
  color: #F1F5F9;
}

:deep(.dark) .trust-subtitle,
:deep(.dark) .trust-text p {
  color: #94A3B8;
}

:deep(.dark) .trust-text {
  border-top-color: rgba(51, 65, 85, 0.8);
}

/* Responsive Design */
@media (max-width: 1264px) {
  .benefits-wrapper {
    padding: 4rem 0;
  }
  
  .benefit-icon-bg {
    width: 64px;
    height: 64px;
  }
  
  .benefit-icon {
    font-size: 28px !important;
  }
}

@media (max-width: 960px) {
  .benefits-wrapper {
    padding: 3rem 0;
  }
  
  .benefit-card {
    padding: 1.5rem;
    min-height: 260px;
  }
  
  .benefit-icon-wrapper {
    margin-bottom: 1.5rem;
  }
  
  .benefit-icon-bg {
    width: 60px;
    height: 60px;
  }
  
  .benefit-icon {
    font-size: 26px !important;
  }
  
  .benefit-title {
    font-size: 1.125rem;
  }
  
  .trust-badges {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .trust-badge {
    width: 100%;
    max-width: 320px;
    justify-content: center;
  }
}

@media (max-width: 600px) {
  .benefits-wrapper {
    padding: 2rem 0;
  }
  
  .benefits-grid {
    margin: 0 -8px;
  }
  
  .benefit-col {
    padding: 8px;
  }
  
  .benefit-card {
    padding: 1.25rem;
    min-height: 240px;
  }
  
  .benefit-icon-wrapper {
    margin-bottom: 1.25rem;
  }
  
  .benefit-icon-bg {
    width: 52px;
    height: 52px;
  }
  
  .benefit-icon {
    font-size: 24px !important;
  }
  
  .benefit-title {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
  
  .benefit-description {
    font-size: 0.8125rem;
  }
  
  .section-badge {
    font-size: 0.75rem;
    padding: 0.375rem 1rem;
  }
  
  .section-subtitle {
    font-size: 0.9375rem;
  }
  
  .trust-section {
    padding: 1.25rem;
  }
  
  .trust-badge {
    padding: 0.5rem;
    gap: 0.75rem;
  }
  
  .trust-icon {
    size: 24px;
  }
  
  .trust-title {
    font-size: 0.875rem;
  }
  
  .trust-subtitle {
    font-size: 0.6875rem;
  }
  
  .benefits-cta-btn {
    font-size: 0.875rem !important;
    padding: 0 1.5rem !important;
  }
}

/* Animation for benefits */
.benefit-col {
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
.benefit-col:nth-child(1) { animation-delay: 0.05s; }
.benefit-col:nth-child(2) { animation-delay: 0.1s; }
.benefit-col:nth-child(3) { animation-delay: 0.15s; }
.benefit-col:nth-child(4) { animation-delay: 0.2s; }
</style>