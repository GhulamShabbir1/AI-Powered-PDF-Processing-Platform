<template>
  <section class="benefits-wrapper">
    <div class="bg-pattern"></div>
    
    <v-container>
      <v-intersect once>
        <v-row justify="center" class="mb-12 lg:mb-16">
          <v-col cols="12" md="8" class="text-center">
            <v-fade-transition>
              <div>
                <h2 class="text-h3 font-weight-bold mb-4">
                  Why Choose Our <span class="text-gradient">AI Engine?</span>
                </h2>
                <p class="text-body-1 text-muted max-w-text">
                  Built for enterprise-grade performance, reliability, and security.
                </p>
              </div>
            </v-fade-transition>
          </v-col>
        </v-row>
      </v-intersect>

      <v-row>
        <v-col 
          v-for="(benefit, index) in benefits" 
          :key="index"
          cols="12" sm="6" lg="3"
          class="benefit-col"
        >
          <v-intersect once :delay="index * 75">
            <div class="benefit-item h-100 pa-6 rounded-xl bg-surface hover-lift">
              <div 
                class="icon-circle d-flex align-center justify-center mb-6 mx-auto"
                :style="{ backgroundColor: benefit.bgColor }"
              >
                <v-icon :color="benefit.color" size="36" class="benefit-icon">
                  {{ benefit.icon }}
                </v-icon>
              </div>

              <h3 class="text-h6 font-weight-bold mb-4 text-center">
                {{ benefit.title }}
              </h3>
              
              <p class="text-body-2 text-muted leading-relaxed text-center">
                {{ benefit.description }}
              </p>
            </div>
          </v-intersect>
        </v-col>
      </v-row>

      <v-intersect once class="mt-12 lg:mt-16">
        <v-row justify="center">
          <v-col cols="12" md="8" lg="6" class="text-center">
            <v-fade-transition>
              <div class="trust-section">
                <div class="trust-pill px-8 py-4 d-flex align-center justify-center mx-auto">
                  <v-icon color="success" size="28" class="mr-4">mdi-shield-check</v-icon>
                  <div>
                    <span class="text-body-1 font-weight-bold text-uppercase tracking-widest">
                      ISO 27001 Certified
                    </span>
                    <br>
                    <span class="text-caption text-muted">GDPR Compliant • SOC2 Type II</span>
                  </div>
                </div>
              </div>
            </v-fade-transition>
          </v-col>
        </v-row>
      </v-intersect>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Benefit {
  title: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
}

const benefits = ref<Benefit[]>([
  {
    title: 'Lightning Fast',
    description: 'Process documents in milliseconds using distributed GPU clusters.',
    icon: 'mdi-bolt-variant',
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.12)'
  },
  {
    title: '99.9% Accuracy',
    description: 'Trained on billions of samples for unmatched extraction precision.',
    icon: 'mdi-target-precision',
    color: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.12)'
  },
  {
    title: 'Bank-Grade Security',
    description: 'SOC2 compliant with end-to-end encryption. Your data, your control.',
    icon: 'mdi-lock-pattern',
    color: '#4F46E5',
    bgColor: 'rgba(79, 70, 229, 0.12)'
  },
  {
    title: 'Infinite Scale',
    description: 'Handle single PDFs or enterprise batches automatically.',
    icon: 'mdi-server-network',
    color: '#06B6D4',
    bgColor: 'rgba(6, 182, 212, 0.12)'
  }
]);
</script>

<style scoped>
.benefits-wrapper {
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  isolation: isolate;
}

.bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(79,70,229,0.03) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(6,182,212,0.03) 0%, transparent 50%);
  z-index: 0;
}

.benefit-col {
  opacity: 0;
  transform: translateY(40px) scale(0.95);
  transition: all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.benefit-col .v-intersect--in {
  opacity: 1 !important;
  transform: translateY(0) scale(1) !important;
}

.benefit-item {
  border: 1px solid rgba(229, 231, 235, 0.6);
  backdrop-filter: saturate(180%) blur(8px);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.hover-lift {
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
}

.hover-lift:hover {
  transform: translateY(-16px) scale(1.02) !important;
  border-color: rgba(79, 70, 229, 0.2) !important;
  box-shadow: 0 25px 50px rgba(79, 70, 229, 0.15) !important;
}

.icon-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  transition: all 0.4s ease;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.hover-lift:hover .icon-circle {
  transform: scale(1.15) rotate(360deg);
  box-shadow: 0 0 30px currentColor;
}

.benefit-icon {
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.2));
}

.trust-section {
  opacity: 0;
  transform: scale(0.9);
  transition: all 0.8s ease;
}

.trust-section .v-intersect--in {
  opacity: 1 !important;
  transform: scale(1) !important;
}

.trust-pill {
  background: rgba(255,255,255,0.9) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(16,185,129,0.3);
  border-radius: 50px;
  max-width: 400px;
  box-shadow: 0 20px 40px rgba(16,185,129,0.15);
}

.tracking-widest {
  letter-spacing: 0.1em;
}

.max-w-text {
  max-width: 520px;
  margin: 0 auto;
}

.leading-relaxed {
  line-height: 1.65;
}

/* Mobile */
@media (max-width: 600px) {
  .benefit-item { margin-bottom: 1.5rem; }
  .trust-pill { flex-direction: column !important; gap: 0.5rem; }
}
</style>

