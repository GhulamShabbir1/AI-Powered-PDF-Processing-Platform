<template>
  <section class="cta-wrapper overflow-hidden">
    <v-container class="py-12 lg:py-20"></v-container>
    <div class="cta-particles">
      <div class="particle particle-1"></div>
      <div class="particle particle-2"></div>
      <div class="particle particle-3"></div>
      <div class="particle particle-4"></div>
      <div class="particle particle-5"></div>
    </div>
    
    <v-container>
      <v-intersect once>
        <v-hover v-slot="{ isHovering, props }">
          <v-card
            v-bind="props"
            class="cta-card text-center pa-10 pa-md-16 position-relative rounded-3xl elevation-24"
            :class="{ 'cta-lift': isHovering }"
            max-width="1200"
          >
            <div class="cta-glow-bg"></div>
            
            <v-row justify="center" align="center" class="position-relative z-2">
              <v-col cols="12" md="10" lg="8">
                <v-fade-transition appear>
                  <div>
                    <div class="cta-badge mb-6 mx-auto">
                      <v-chip 
                        color="white" 
                        class="pa-3 font-weight-bold text-overline text-uppercase tracking-widest elevation-4"
                      >
                        Ready to Transform Your Workflow?
                      </v-chip>
                    </div>
                    
                    <h1 class="text-h2-xl font-weight-black mb-8 text-white leading-tight">
                      Accelerate Your Document Intelligence 
                      <span class="d-block d-md-inline">10x Faster</span>
                    </h1>
                    
                    <p class="text-h5 text-white-alpha mb-12 max-w-hero lh-relaxed">
                      Join thousands of innovative teams processing PDFs smarter, faster, 
                      and more securely. Enterprise ready. Start free today.
                    </p>

                    <div class="cta-buttons d-flex flex-column flex-md-row justify-center align-center gap-6">
                      <v-btn
                        size="xx-large"
                        color="white"
                        class="primary-cta px-16 py-4 font-weight-black text-h6 rounded-xl elevation-8 text-primary"
                        :class="{ 'cta-scale': isHovering }"
                      >
                        <v-icon start class="mr-3">mdi-rocket-launch</v-icon>
                        Start Free Trial
                        <v-icon end class="ml-3">mdi-arrow-right</v-icon>
                      </v-btn>
                      
                      <div class="secondary-info d-flex align-center flex-column flex-md-row gap-4 mt-4 mt-md-0">
                        <v-btn
                          variant="tonal"
                          color="white"
                          size="large"
                          class="px-8 py-3 rounded-lg font-weight-medium"
                          flat
                        >
                          Watch Demo (2min)
                        </v-btn>
                        <span class="text-caption text-white-alpha font-weight-medium text-center text-md-left">
                          No credit card required • Cancel anytime
                        </span>
                      </div>
                    </div>
                  </div>
                </v-fade-transition>
              </v-col>
            </v-row>
          </v-card>
        </v-hover>
      </v-intersect>
    </v-container>
  </section>
</template>

<script setup lang="ts">
// Reactive state for hover particles
</script>

<style scoped>
.cta-wrapper {
  background: radial-gradient(ellipse at center, #1e3a8a 0%, #1e40af 25%, #1d4ed8 50%, #3730a3 75%, #1e293b 100%);
  position: relative;
}

.cta-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.particle {
  position: absolute;
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
  backdrop-filter: blur(10px);
  animation: particleFloat 8s infinite ease-in-out;
}

.particle-1 { width: 12px; height: 12px; top: 20%; left: 10%; animation-delay: 0s; }
.particle-2 { width: 8px; height: 8px; top: 60%; right: 15%; animation-delay: 2s; }
.particle-3 { width: 16px; height: 16px; bottom: 30%; left: 20%; animation-delay: 4s; }
.particle-4 { width: 10px; height: 10px; top: 40%; right: 25%; animation-delay: 5s; }
.particle-5 { width: 14px; height: 14px; bottom: 10%; left: 70%; animation-delay: 6s; }

@keyframes particleFloat {
  0%, 100% { 
    transform: translateY(0) scale(1); 
    opacity: 0.6; 
  }
  50% { 
    transform: translateY(-30px) scale(1.2); 
    opacity: 1; 
  }
}

.cta-card {
  background: rgba(255,255,255,0.08) !important;
  backdrop-filter: blur(40px);
  border: 1px solid rgba(255,255,255,0.15);
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.cta-lift {
  transform: translateY(-20px) scale(1.02) !important;
  box-shadow: 0 60px 120px rgba(30, 58, 138, 0.6) !important;
  border-color: rgba(255,255,255,0.25) !important;
}

.cta-glow-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 30%, rgba(99,102,241,0.4) 0%, transparent 50%),
              radial-gradient(circle at 70% 70%, rgba(6,182,212,0.3) 0%, transparent 50%);
  z-index: -1;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.cta-lift .cta-glow-bg {
  opacity: 1;
}

.cta-badge {
  max-width: 420px;
}

.text-h2-xl {
  font-size: clamp(2.5rem, 6vw, 4.5rem) !important;
}

.text-white-alpha {
  opacity: 0.85;
}

.lh-relaxed {
  line-height: 1.65;
}

.max-w-hero {
  max-width: 720px;
  margin: 0 auto;
}

.cta-buttons {
  gap: 24px;
}

.primary-cta {
  background: linear-gradient(135deg, white 0%, #f8fafc 100%) !important;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
}

.cta-scale {
  transform: scale(1.08) !important;
  box-shadow: 0 25px 50px rgba(255,255,255,0.4) !important;
}

.cta-buttons .v-btn:hover {
  transform: translateY(-4px) !important;
}

/* Mobile Perfection */
@media (max-width: 960px) {
  .cta-card { margin: 2rem !important; }
  .text-h2-xl { line-height: 1.2 !important; }
  .py-20 { padding: 6rem 1rem !important; }
}

@media (max-width: 600px) {
  .secondary-info { 
    text-align: center !important; 
    gap: 1rem !important;
  }
  
  .text-caption {
    font-size: 0.875rem !important;
  }
}
</style>

