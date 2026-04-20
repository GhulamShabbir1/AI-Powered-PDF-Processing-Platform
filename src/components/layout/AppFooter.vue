<template>
  <footer class="footer-wrapper">
    <!-- Animated Background -->
    <div class="bg-particles">
      <div class="particle particle-1"></div>
      <div class="particle particle-2"></div>
      <div class="particle particle-3"></div>
      <div class="particle particle-4"></div>
    </div>

    <v-container fluid class="footer-container pa-0">
      <div class="footer-inner">
        <!-- Main Footer Content -->
        <v-row class="footer-main ma-0">
          <!-- Brand Section -->
          <v-col cols="12" md="6" lg="4" class="brand-col pa-4">
            <div class="brand-section">
              <div class="logo-wrapper">
                <div class="logo-icon">
                  <v-icon size="28" color="white">mdi-brain</v-icon>
                </div>
                <h3 class="brand-name">AI PDF Processor</h3>
              </div>
              
              <p class="brand-description">
                Transform static documents into dynamic intelligence. Enterprise-grade AI for OCR, 
                summarization, and translation at scale.
              </p>
              
              <div class="trust-badge">
                <v-icon size="18" color="#10B981">mdi-shield-check</v-icon>
                <span>Trusted by 10,000+ teams worldwide</span>
              </div>
            </div>
          </v-col>

          <!-- Product Links -->
          <v-col cols="6" md="3" lg="2" class="links-col pa-4">
            <div class="footer-section">
              <h4 class="footer-title">Product</h4>
              <ul class="footer-links">
                <li v-for="link in productLinks" :key="link">
                  <a href="#" class="footer-link">{{ link }}</a>
                </li>
              </ul>
            </div>
          </v-col>

          <!-- Company Links -->
          <v-col cols="6" md="3" lg="2" class="links-col pa-4">
            <div class="footer-section">
              <h4 class="footer-title">Company</h4>
              <ul class="footer-links">
                <li v-for="link in companyLinks" :key="link">
                  <a href="#" class="footer-link">{{ link }}</a>
                </li>
              </ul>
            </div>
          </v-col>

          <!-- Newsletter Section -->
          <v-col cols="12" md="6" lg="4" class="newsletter-col pa-4">
            <div class="footer-section">
              <h4 class="footer-title">Stay Updated</h4>
              <p class="newsletter-text">
                Get AI insights & product updates delivered to your inbox.
              </p>
              
              <div class="newsletter-form">
                <v-text-field
                  v-model="email"
                  placeholder="Enter your email"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  class="newsletter-input"
                  @keyup.enter="subscribeNewsletter"
                >
                  <template v-slot:append-inner>
                    <v-btn
                      icon="mdi-arrow-right"
                      variant="text"
                      size="small"
                      class="subscribe-btn"
                      @click="subscribeNewsletter"
                    />
                  </template>
                </v-text-field>
              </div>

              <!-- Social Links -->
              <div class="social-section">
                <div class="social-label">Follow us</div>
                <div class="social-icons">
                  <v-btn
                    v-for="social in socialLinks"
                    :key="social.name"
                    :icon="social.icon"
                    :href="social.url"
                    target="_blank"
                    variant="text"
                    size="small"
                    class="social-icon"
                    :style="{ color: social.color }"
                  />
                </div>
              </div>
            </div>
          </v-col>
        </v-row>

        <!-- Divider -->
        <div class="footer-divider"></div>

        <!-- Bottom Bar -->
        <v-row class="footer-bottom ma-0">
          <v-col cols="12" md="6" class="bottom-col text-center text-md-left pa-4">
            <div class="copyright">
              © {{ new Date().getFullYear() }} AI PDF Processor. All rights reserved.
            </div>
          </v-col>
          <v-col cols="12" md="6" class="bottom-col text-center text-md-right pa-4">
            <div class="legal-links">
              <a href="#" class="legal-link">Privacy Policy</a>
              <span class="separator">•</span>
              <a href="#" class="legal-link">Terms of Service</a>
              <span class="separator">•</span>
              <a href="#" class="legal-link">Security</a>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const email = ref('');

const productLinks = ['Features', 'Pricing', 'API Docs', 'Integrations', 'Changelog'];
const companyLinks = ['About', 'Careers', 'Blog', 'Press', 'Contact'];

const socialLinks = [
  { name: 'Twitter', icon: 'mdi-facebook', color: '#1DA1F2', url: 'https://focebook.com' },
  { name: 'LinkedIn', icon: 'mdi-linkedin', color: '#0A66C2', url: 'https://linkedin.com' },
  { name: 'GitHub', icon: 'mdi-github', color: '#ffffff', url: 'https://github.com' },
  { name: 'Twitter', icon: 'mdi-twitter', color: '#1DA1F2', url: 'https://twitter.com' }
];

const subscribeNewsletter = () => {
  if (email.value && email.value.includes('@')) {
    console.log('Subscribed:', email.value);
    email.value = '';
  }
};
</script>

<style scoped>
.footer-wrapper {
  position: relative;
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%);
  overflow-x: hidden;
  margin-top: auto;
  width: 100%;
}

.footer-container {
  width: 100%;
  max-width: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
}

.footer-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 3rem 2rem 1.5rem;
}

/* Animated Background Particles */
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
  background: rgba(79, 70, 229, 0.08);
  filter: blur(40px);
  animation: floatParticle 20s infinite ease-in-out;
  pointer-events: none;
}

.particle-1 {
  width: 250px;
  height: 250px;
  top: -80px;
  left: -80px;
  animation-delay: 0s;
}

.particle-2 {
  width: 180px;
  height: 180px;
  bottom: -40px;
  right: -40px;
  background: rgba(6, 182, 212, 0.08);
  animation-delay: 5s;
}

.particle-3 {
  width: 200px;
  height: 200px;
  top: 30%;
  left: 80%;
  background: rgba(139, 92, 246, 0.08);
  animation-delay: 10s;
}

.particle-4 {
  width: 120px;
  height: 120px;
  bottom: 15%;
  left: 15%;
  background: rgba(16, 185, 129, 0.08);
  animation-delay: 15s;
}

@keyframes floatParticle {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.4;
  }
  33% {
    transform: translate(20px, -20px) scale(1.15);
    opacity: 0.7;
  }
  66% {
    transform: translate(-15px, 15px) scale(0.85);
    opacity: 0.5;
  }
}

/* Main Footer Content */
.footer-main {
  position: relative;
  z-index: 1;
  margin: 0 !important;
}

/* Column Spacing */
.brand-col,
.links-col,
.newsletter-col {
  padding: 1rem !important;
}

/* Brand Section */
.brand-section {
  margin-bottom: 0;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.logo-icon {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #4F46E5, #06B6D4);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px -4px rgba(79, 70, 229, 0.3);
  flex-shrink: 0;
}

.brand-name {
  font-size: 1.35rem;
  font-weight: 800;
  background: linear-gradient(135deg, #FFFFFF, #94A3B8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: -0.3px;
}

.brand-description {
  font-size: 0.875rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 1rem;
  max-width: 320px;
}

.trust-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.9rem;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.25);
  border-radius: 100px;
  font-size: 0.7rem;
  font-weight: 600;
  color: #10B981;
}

/* Footer Sections */
.footer-section {
  margin-bottom: 0;
}

.footer-title {
  font-size: 1rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1.25rem;
  position: relative;
  display: inline-block;
  padding-bottom: 0;
}

.footer-title::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 0;
  width: 32px;
  height: 2px;
  background: linear-gradient(90deg, #4F46E5, #06B6D4);
  border-radius: 2px;
}

/* Footer Links */
.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.7rem;
}

.footer-link {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.55);
  text-decoration: none;
  transition: all 0.25s ease;
  display: inline-block;
}

.footer-link:hover {
  color: white;
  transform: translateX(4px);
}

/* Newsletter Section */
.newsletter-text {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.55);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.newsletter-form {
  margin-bottom: 1.5rem;
}

.newsletter-input :deep(.v-field) {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.newsletter-input :deep(.v-field__input) {
  color: white;
  font-size: 0.85rem;
  padding: 0.75rem;
}

.newsletter-input :deep(.v-field__input::placeholder) {
  color: rgba(255, 255, 255, 0.4);
}

.newsletter-input :deep(.v-field--focused) {
  border-color: #4F46E5;
}

.subscribe-btn {
  color: #4F46E5 !important;
  transition: transform 0.2s ease !important;
}

.subscribe-btn:hover {
  transform: translateX(3px);
}

/* Social Section */
.social-section {
  margin-top: 1.25rem;
}

.social-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.45);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.75rem;
}

.social-icons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.social-icon {
  transition: all 0.25s ease !important;
  background: rgba(255, 255, 255, 0.05) !important;
  border-radius: 10px !important;
  width: 36px !important;
  height: 36px !important;
}

.social-icon:hover {
  transform: translateY(-3px) !important;
  background: rgba(255, 255, 255, 0.12) !important;
}

/* Divider */
.footer-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12), transparent);
  margin: 1rem 1rem;
}

/* Bottom Bar */
.footer-bottom {
  position: relative;
  z-index: 1;
  margin: 0 !important;
}

.bottom-col {
  padding: 0.5rem 1rem !important;
}

.copyright {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.4);
}

.legal-links {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.legal-link {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.4);
  text-decoration: none;
  transition: color 0.2s ease;
}

.legal-link:hover {
  color: rgba(255, 255, 255, 0.8);
}

.separator {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.2);
}

/* Responsive Design */
@media (max-width: 1264px) {
  .footer-inner {
    padding: 2.5rem 1.5rem 1.25rem;
  }
}

@media (max-width: 960px) {
  .footer-inner {
    padding: 2rem 1.5rem 1rem;
  }
  
  .brand-col {
    text-align: center;
  }
  
  .logo-wrapper {
    justify-content: center;
  }
  
  .brand-description {
    margin-left: auto;
    margin-right: auto;
    max-width: 80%;
  }
  
  .trust-badge {
    margin-left: auto;
    margin-right: auto;
  }
  
  .links-col {
    text-align: center;
  }
  
  .footer-title::after {
    left: 50%;
    transform: translateX(-50%);
  }
  
  .footer-links li a {
    display: inline-block;
  }
  
  .newsletter-col {
    text-align: center;
  }
  
  .social-icons {
    justify-content: center;
  }
  
  .legal-links {
    justify-content: center;
    margin-top: 0.5rem;
  }
  
  .bottom-col.text-md-right {
    text-align: center !important;
  }
  
  .brand-col,
  .links-col,
  .newsletter-col {
    padding: 0.75rem !important;
  }
}

@media (max-width: 600px) {
  .footer-inner {
    padding: 1.5rem 1rem 0.75rem;
  }
  
  .logo-icon {
    width: 38px;
    height: 38px;
  }
  
  .logo-icon .v-icon {
    font-size: 22px !important;
  }
  
  .brand-name {
    font-size: 1.2rem;
  }
  
  .brand-description {
    font-size: 0.8rem;
    max-width: 100%;
  }
  
  .footer-title {
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }
  
  .footer-link {
    font-size: 0.8rem;
  }
  
  .footer-links li {
    margin-bottom: 0.5rem;
  }
  
  .newsletter-text {
    font-size: 0.8rem;
  }
  
  .legal-links {
    gap: 0.75rem;
  }
  
  .legal-link,
  .separator,
  .copyright {
    font-size: 0.65rem;
  }
  
  .particle {
    display: none;
  }
  
  .brand-col,
  .links-col,
  .newsletter-col {
    padding: 0.5rem !important;
    margin-bottom: 0;
  }
  
  .footer-divider {
    margin: 0.75rem 0.5rem;
  }
  
  .bottom-col {
    padding: 0.25rem 0.5rem !important;
  }
}

/* Tablet specific fixes */
@media (min-width: 601px) and (max-width: 960px) {
  .brand-description {
    max-width: 70%;
  }
  
  .brand-col,
  .links-col,
  .newsletter-col {
    padding: 1rem !important;
  }
}
</style>