<template>
  <section class="cta-wrapper" id="cta">
    <!-- Animated Background -->
    <div class="bg-gradient-animation"></div>
    <div class="bg-particles">
      <div class="particle particle-1"></div>
      <div class="particle particle-2"></div>
      <div class="particle particle-3"></div>
      <div class="particle particle-4"></div>
      <div class="particle particle-5"></div>
      <div class="particle particle-6"></div>
    </div>

    <v-container>
      <v-row justify="center">
        <v-col cols="12" lg="10" xl="8">
          <div class="cta-card">
            <!-- Decorative Elements -->
            <div class="cta-decoration decoration-1"></div>
            <div class="cta-decoration decoration-2"></div>
            
            <!-- Content -->
            <div class="cta-content">
              <!-- Badge -->
              <div class="cta-badge mb-6">
                <v-icon size="20" class="mr-2">mdi-rocket-launch</v-icon>
                <span>Limited Time Offer</span>
              </div>

              <!-- Title -->
              <h2 class="cta-title">
                Ready to Transform Your 
                <span class="text-gradient-white">Document Workflow?</span>
              </h2>

              <!-- Description -->
              <p class="cta-description">
                Join thousands of innovative teams processing PDFs smarter, faster, 
                and more securely. Enterprise ready with bank-grade security.
              </p>

              <!-- Features List -->
              <div class="cta-features">
                <div class="feature">
                  <v-icon size="20" color="#10B981">mdi-check-circle</v-icon>
                  <span>No credit card required</span>
                </div>
                <div class="feature">
                  <v-icon size="20" color="#10B981">mdi-check-circle</v-icon>
                  <span>14-day free trial</span>
                </div>
                <div class="feature">
                  <v-icon size="20" color="#10B981">mdi-check-circle</v-icon>
                  <span>Cancel anytime</span>
                </div>
              </div>

              <!-- CTA Buttons -->
              <div class="cta-buttons">
                <v-btn
                  size="large"
                  class="cta-primary-btn"
                  @click="scrollToTop"
                >
                  Start Free Trial
                  <v-icon end class="ml-2">mdi-arrow-right</v-icon>
                </v-btn>
                
                <v-btn
                  size="large"
                  variant="outlined"
                  class="cta-secondary-btn"
                  @click="watchDemo"
                >
                  <v-icon start class="mr-2">mdi-play-circle</v-icon>
                  Watch Demo (2min)
                </v-btn>
              </div>

              <!-- Trust Badges -->
              <div class="trust-badges">
                <div class="trust-badge">
                  <v-icon size="20" color="#F59E0B">mdi-shield-check</v-icon>
                  <span>ISO 27001 Certified</span>
                </div>
                <div class="trust-badge">
                  <v-icon size="20" color="#F59E0B">mdi-lock-check</v-icon>
                  <span>GDPR Compliant</span>
                </div>
                <div class="trust-badge">
                  <v-icon size="20" color="#F59E0B">mdi-credit-card-check</v-icon>
                  <span>SOC2 Type II</span>
                </div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const watchDemo = () => {
  // Add demo video modal or link
  window.open('https://www.youtube.com/watch?v=demo', '_blank');
};
</script>

<style scoped>
.cta-wrapper {
  position: relative;
  padding: 3rem 0;
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%);
  overflow-x: hidden;
}

/* Animated Background Gradient */
.bg-gradient-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 20% 50%, rgba(79, 70, 229, 0.3), transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.3), transparent 50%);
  animation: gradientShift 10s ease infinite;
}

@keyframes gradientShift {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

/* Floating Particles */
.bg-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  backdrop-filter: blur(4px);
  animation: floatParticle 15s infinite ease-in-out;
}

.particle-1 {
  width: 60px;
  height: 60px;
  top: 10%;
  left: 5%;
  animation-delay: 0s;
}

.particle-2 {
  width: 40px;
  height: 40px;
  top: 70%;
  right: 8%;
  animation-delay: 3s;
}

.particle-3 {
  width: 80px;
  height: 80px;
  bottom: 20%;
  left: 15%;
  animation-delay: 6s;
}

.particle-4 {
  width: 30px;
  height: 30px;
  top: 40%;
  right: 20%;
  animation-delay: 9s;
}

.particle-5 {
  width: 50px;
  height: 50px;
  bottom: 50%;
  left: 80%;
  animation-delay: 12s;
}

.particle-6 {
  width: 25px;
  height: 25px;
  top: 80%;
  left: 40%;
  animation-delay: 15s;
}

@keyframes floatParticle {
  0%, 100% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0.3;
  }
  33% {
    transform: translateY(-30px) translateX(20px) scale(1.2);
    opacity: 0.6;
  }
  66% {
    transform: translateY(20px) translateX(-15px) scale(0.8);
    opacity: 0.4;
  }
}

/* CTA Card */
.cta-card {
  position: relative;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(20px);
  border-radius: 36px;
  padding: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  z-index: 1;
}

/* Decorative Elements */
.cta-decoration {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.3;
  z-index: -1;
}

.decoration-1 {
  top: -35px;
  left: -35px;
  background: linear-gradient(135deg, #4F46E5, #06B6D4);
  animation: pulse 4s ease infinite;
}

.decoration-2 {
  bottom: -50px;
  right: -50px;
  background: linear-gradient(135deg, #8B5CF6, #EC4899);
  animation: pulse 4s ease infinite reverse;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.5;
  }
}

/* CTA Content */
.cta-content {
  text-align: center;
  position: relative;
  z-index: 2;
}

/* Badge */
.cta-badge {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1.25rem;
  border-radius: 100px;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Title */
.cta-title {
  font-size: clamp(1.5rem, 3.75vw, 2.5rem);
  font-weight: 800;
  line-height: 1.2;
  color: white;
  margin-bottom: 1.25rem;
}

.text-gradient-white {
  background: linear-gradient(135deg, #FFFFFF, #94A3B8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Description */
.cta-description {
  font-size: 0.875rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  max-width: 400px;
  margin: 0 auto 1.5rem auto;
}

/* Features */
.cta-features {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.feature {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
}

/* Buttons */
.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 3rem;
}

.cta-primary-btn {
  background: linear-gradient(135deg, #FFFFFF, #E2E8F0) !important;
  color: #0F172A !important;
  text-transform: none !important;
  font-weight: 700 !important;
  padding: 0 2rem !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.3s ease !important;
}

.cta-primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2) !important;
}

.cta-secondary-btn {
  border-color: rgba(255, 255, 255, 0.3) !important;
  color: white !important;
  text-transform: none !important;
  font-weight: 600 !important;
  padding: 0 1.5rem !important;
  border-radius: 12px !important;
  transition: all 0.3s ease !important;
}

.cta-secondary-btn:hover {
  border-color: rgba(255, 255, 255, 0.6) !important;
  background: rgba(255, 255, 255, 0.1) !important;
  transform: translateY(-2px);
}

/* Trust Badges */
.trust-badges {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.trust-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
}

/* Responsive Design */
@media (max-width: 1264px) {
  .cta-card {
    padding: 3rem;
    margin: 1rem;
  }
}

@media (max-width: 960px) {
  .cta-wrapper {
    padding: 3rem 0;
  }
  
  .cta-card {
    padding: 2rem;
    border-radius: 32px;
  }
  
  .cta-title {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
  }
  
  .cta-description {
    font-size: 1rem;
  }
  
  .cta-features {
    gap: 1rem;
  }
  
  .trust-badges {
    gap: 1rem;
  }
}

@media (max-width: 600px) {
  .cta-wrapper {
    padding: 2rem 0;
  }
  
  .cta-card {
    padding: 1.5rem;
    border-radius: 24px;
  }
  
  .cta-badge {
    font-size: 0.75rem;
    padding: 0.375rem 1rem;
  }
  
  .cta-title {
    font-size: 1.5rem;
  }
  
  .cta-description {
    font-size: 0.875rem;
    margin-bottom: 1.5rem;
  }
  
  .cta-features {
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }
  
  .cta-buttons {
    flex-direction: column;
    width: 100%;
    max-width: 280px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 2rem;
  }
  
  .cta-primary-btn,
  .cta-secondary-btn {
    width: 100%;
  }
  
  .trust-badges {
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }
  
  .particle {
    display: none;
  }
}
</style>