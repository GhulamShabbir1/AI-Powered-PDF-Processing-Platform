<template>
  <section class="hero-wrapper" id="hero">
    <!-- Background Image -->
    <div class="hero-background">
      <div class="hero-bg-image"></div>
      <div class="hero-overlay"></div>
    </div>

    <v-container fluid class="hero-container pa-0">
      <v-row align="center" justify="center" class="hero-row ma-0">
        <v-col cols="12" class="hero-content text-center">
          <v-fade-transition appear>
            <div>
              <!-- Badge -->
              <div class="hero-badge mb-4">
                <span class="badge-text">✨ AI-Powered Document Processing</span>
              </div>

              <!-- Title -->
              <h1 class="hero-title">
                Master Your Documents with 
                <span class="hero-title-gradient">AI-Powered</span> 
                PDF Processing
              </h1>
              
              <!-- Subtitle -->
              <p class="hero-subtitle">
                Extract insights, summarize complex reports, and automate your document 
                workflow in seconds with enterprise-grade AI.
              </p>

              <!-- CTA Buttons -->
              <div class="hero-ctas">
                <v-btn
                  size="large"
                  class="hero-primary-btn"
                  @click="scrollToCta"
                >
                  <v-icon start class="mr-2">mdi-rocket-launch</v-icon>
                  Get Started Free
                </v-btn>
                
                <v-btn
                  size="large"
                  variant="outlined"
                  class="hero-secondary-btn"
                  @click="scrollToFeatures"
                >
                  <v-icon start class="mr-2">mdi-play-circle</v-icon>
                  Watch Demo
                </v-btn>
              </div>

              <!-- Stats Section -->
              <div class="hero-stats mt-12">
                <div class="stat-item">
                  <div class="stat-number">50K+</div>
                  <div class="stat-label">Documents Processed</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">99.9%</div>
                  <div class="stat-label">Accuracy Rate</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">24/7</div>
                  <div class="stat-label">AI Support</div>
                </div>
              </div>
            </div>
          </v-fade-transition>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
const scrollToCta = () => {
  const element = document.getElementById('cta')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const scrollToFeatures = () => {
  const element = document.getElementById('features')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<style scoped>
.hero-wrapper {
  position: relative;
  min-height: 100vh;
  padding: 4rem 0 0 0 !important;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: white;
  margin-bottom: -2px;
}

/* Background Image */
.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.hero-bg-image {
  width: 100%;
  height: 100%;
  background-image: url('https://images.unsplash.com/photo-1558494949-ef0d38d76e02?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=85');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.2;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(145deg, #0e3694 20%, #c50d0d 80%);
  opacity: 0.9;
  z-index: 1;
}

/* Container */
.hero-container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
}

.hero-row {
  margin: 0 !important;
  width: 100%;
  min-height: 100vh;
}

.hero-content {
  padding: 4rem 2rem !important;
  max-width: 900px;
  margin: 0 auto;
}

/* Badge */
.hero-badge {
  display: inline-block;
  padding: 0.5rem 1.25rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 100px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.badge-text {
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.025em;
}

/* Title */
.hero-title {
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  letter-spacing: -0.025em;
}

.hero-title-gradient {
  background: linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Subtitle */
.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  opacity: 0.9;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto 2rem auto;
}

/* CTA Buttons */
.hero-ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
}

.hero-primary-btn,
.hero-secondary-btn {
  font-weight: 600 !important;
  font-size: 1rem !important;
  text-transform: none !important;
  letter-spacing: 0.025em !important;
  border-radius: 12px !important;
  height: 52px !important;
  min-width: 180px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.hero-primary-btn {
  background: linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%) !important;
  box-shadow: 0 4px 14px 0 rgba(79, 70, 229, 0.4) !important;
  border: none !important;
  color: white !important;
}

.hero-primary-btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 25px 0 rgba(79, 70, 229, 0.5) !important;
}

.hero-secondary-btn {
  background: transparent !important;
  border: 2px solid rgba(255, 255, 255, 0.3) !important;
  color: white !important;
}

.hero-secondary-btn:hover {
  transform: translateY(-1px) !important;
  border-color: rgba(255, 255, 255, 0.6) !important;
  background: rgba(255, 255, 255, 0.1) !important;
}

/* Stats Section */
.hero-stats {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 3rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #4F46E5, #06B6D4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.7;
  letter-spacing: 0.025em;
}

/* Bottom Curve - Outside the hero section */
.hero-bottom-curve {
  width: 100%;
  height: 100px;
  background: white;
  border-top-left-radius: 50% 100px;
  border-top-right-radius: 50% 100px;
  position: relative;
  z-index: 5;
  margin-top: -2px;
}

/* Dark mode support for curve */
:deep(.dark) .hero-bottom-curve {
  background: #1E293B;
}

/* Responsive Design */
@media (max-width: 960px) {
  .hero-content {
    padding: 3rem 1.5rem !important;
  }
  
  .hero-stats {
    gap: 2rem;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .stat-label {
    font-size: 0.75rem;
  }
  
  .hero-bottom-curve {
    height: 70px;
    border-top-left-radius: 50% 70px;
    border-top-right-radius: 50% 70px;
  }
}

@media (max-width: 600px) {
  .hero-wrapper {
    min-height: 90vh;
  }
  
  .hero-row {
    min-height: 90vh;
  }
  
  .hero-content {
    padding: 2rem 1rem !important;
  }
  
  .hero-badge {
    padding: 0.375rem 1rem;
  }
  
  .badge-text {
    font-size: 0.75rem;
  }
  
  .hero-primary-btn,
  .hero-secondary-btn {
    height: 48px !important;
    min-width: 160px !important;
    font-size: 0.875rem !important;
  }
  
  .hero-stats {
    gap: 1.5rem;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
  }
  
  .stat-number {
    font-size: 1.25rem;
  }
  
  .hero-bottom-curve {
    height: 50px;
    border-top-left-radius: 50% 50px;
    border-top-right-radius: 50% 50px;
  }
}

@media (max-width: 480px) {
  .hero-ctas {
    flex-direction: column;
    width: 100%;
    max-width: 280px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .hero-primary-btn,
  .hero-secondary-btn {
    width: 100%;
    min-width: unset !important;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }
}
</style>