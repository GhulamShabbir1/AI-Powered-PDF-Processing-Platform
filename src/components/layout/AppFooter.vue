<template>
  <footer class="footer-wrapper">
    <!-- Animated Background -->
    <div class="bg-particles">
      <div class="particle particle-1"></div>
      <div class="particle particle-2"></div>
      <div class="particle particle-3"></div>
      <div class="particle particle-4"></div>
    </div>

    <v-container>
      <!-- Main Footer Content -->
      <v-row class="footer-main">
        <!-- Brand Section -->
        <v-col cols="12" md="6" lg="4" class="mb-8 mb-md-0">
          <div class="brand-section">
            <div class="logo-wrapper mb-4">
              <div class="logo-icon">
                <v-icon size="32" color="white">mdi-brain</v-icon>
              </div>
              <h3 class="brand-name">AI PDF Processor</h3>
            </div>
            
            <p class="brand-description">
              Transform static documents into dynamic intelligence. Enterprise-grade AI for OCR, 
              summarization, and translation at scale.
            </p>
            
            <div class="trust-badge">
              <v-icon size="20" color="#10B981">mdi-shield-check</v-icon>
              <span>Trusted by 10,000+ teams worldwide</span>
            </div>
          </div>
        </v-col>

        <!-- Product Links -->
        <v-col cols="6" md="3" lg="2">
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
        <v-col cols="6" md="3" lg="2">
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
        <v-col cols="12" md="6" lg="4">
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
      <v-divider class="footer-divider" />

      <!-- Bottom Bar -->
      <v-row class="footer-bottom">
        <v-col cols="12" md="6" class="text-center text-md-left">
          <div class="copyright">
            © {{ new Date().getFullYear() }} AI PDF Processor. All rights reserved.
          </div>
        </v-col>
        <v-col cols="12" md="6" class="text-center text-md-right">
          <div class="legal-links">
            <a href="#" class="legal-link">Privacy Policy</a>
            <span class="separator">•</span>
            <a href="#" class="legal-link">Terms of Service</a>
            <span class="separator">•</span>
            <a href="#" class="legal-link">Security</a>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const email = ref('');

const productLinks = ['Features', 'Pricing', 'API Docs', 'Integrations', 'Changelog'];
const companyLinks = ['About', 'Careers', 'Blog', 'Press', 'Contact'];

const socialLinks = [
  { name: 'Twitter', icon: 'mdi-twitter', color: '#1DA1F2', url: 'https://twitter.com' },
  { name: 'LinkedIn', icon: 'mdi-linkedin', color: '#0A66C2', url: 'https://linkedin.com' },
  { name: 'GitHub', icon: 'mdi-github', color: '#333333', url: 'https://github.com' },
  { name: 'Discord', icon: 'mdi-discord', color: '#5865F2', url: 'https://discord.com' }
];

const subscribeNewsletter = () => {
  if (email.value) {
    console.log('Subscribed:', email.value);
    // Add your newsletter subscription logic here
    email.value = '';
  }
};
</script>

<style scoped>
.footer-wrapper {
  position: relative;
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%);
  padding: 4rem 0 2rem;
  overflow-x: hidden;
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
}

.particle {
  position: absolute;
  border-radius: 50%;
  background: rgba(79, 70, 229, 0.1);
  filter: blur(40px);
  animation: floatParticle 20s infinite ease-in-out;
}

.particle-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.particle-2 {
  width: 200px;
  height: 200px;
  bottom: -50px;
  right: -50px;
  background: rgba(6, 182, 212, 0.1);
  animation-delay: 5s;
}

.particle-3 {
  width: 250px;
  height: 250px;
  top: 40%;
  left: 70%;
  background: rgba(139, 92, 246, 0.1);
  animation-delay: 10s;
}

.particle-4 {
  width: 150px;
  height: 150px;
  bottom: 20%;
  left: 20%;
  background: rgba(16, 185, 129, 0.1);
  animation-delay: 15s;
}

@keyframes floatParticle {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.3;
  }
  33% {
    transform: translate(30px, -30px) scale(1.2);
    opacity: 0.6;
  }
  66% {
    transform: translate(-20px, 20px) scale(0.8);
    opacity: 0.4;
  }
}

/* Main Footer Content */
.footer-main {
  position: relative;
  z-index: 1;
}

/* Brand Section */
.brand-section {
  margin-bottom: 1rem;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #4F46E5, #06B6D4);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.3);
}

.brand-name {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #FFFFFF, #94A3B8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.brand-description {
  font-size: 0.875rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1rem;
  max-width: 300px;
}

.trust-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #10B981;
}

/* Footer Sections */
.footer-section {
  margin-bottom: 1.5rem;
}

.footer-title {
  font-size: 1rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1.25rem;
  position: relative;
  display: inline-block;
}

.footer-title::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 0;
  width: 30px;
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
  margin-bottom: 0.75rem;
}

.footer-link {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: all 0.2s ease;
  display: inline-block;
}

.footer-link:hover {
  color: white;
  transform: translateX(4px);
}

/* Newsletter Section */
.newsletter-text {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.newsletter-form {
  margin-bottom: 1.5rem;
}

.newsletter-input :deep(.v-field) {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.newsletter-input :deep(.v-field__input) {
  color: white;
}

.newsletter-input :deep(.v-field__input::placeholder) {
  color: rgba(255, 255, 255, 0.4);
}

.newsletter-input :deep(.v-field--focused) {
  border-color: #4F46E5;
}

.subscribe-btn {
  color: #4F46E5 !important;
}

.subscribe-btn:hover {
  transform: translateX(4px);
}

/* Social Section */
.social-section {
  margin-top: 1.5rem;
}

.social-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
}

.social-icons {
  display: flex;
  gap: 0.75rem;
}

.social-icon {
  transition: all 0.2s ease !important;
}

.social-icon:hover {
  transform: translateY(-4px) !important;
  opacity: 1 !important;
}

/* Divider */
.footer-divider {
  margin: 2rem 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  opacity: 0.5;
}

/* Bottom Bar */
.footer-bottom {
  position: relative;
  z-index: 1;
}

.copyright {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

.legal-links {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.legal-link {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  transition: color 0.2s ease;
}

.legal-link:hover {
  color: white;
}

.separator {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.3);
}

/* Responsive Design */
@media (max-width: 1264px) {
  .footer-wrapper {
    padding: 3rem 0 1.5rem;
  }
}

@media (max-width: 960px) {
  .footer-wrapper {
    padding: 2.5rem 0 1.5rem;
  }
  
  .brand-section {
    text-align: center;
  }
  
  .logo-wrapper {
    justify-content: center;
  }
  
  .brand-description {
    margin-left: auto;
    margin-right: auto;
  }
  
  .trust-badge {
    margin-left: auto;
    margin-right: auto;
  }
  
  .footer-title::after {
    left: 0;
  }
  
  .footer-section {
    text-align: center;
  }
  
  .footer-title::after {
    left: 50%;
    transform: translateX(-50%);
  }
  
  .footer-links li a {
    display: inline-block;
  }
  
  .social-icons {
    justify-content: center;
  }
}

@media (max-width: 600px) {
  .footer-wrapper {
    padding: 2rem 0 1rem;
  }
  
  .logo-icon {
    width: 40px;
    height: 40px;
  }
  
  .brand-name {
    font-size: 1.25rem;
  }
  
  .brand-description {
    font-size: 0.8125rem;
  }
  
  .footer-title {
    font-size: 0.9375rem;
  }
  
  .footer-link {
    font-size: 0.8125rem;
  }
  
  .legal-links {
    gap: 0.75rem;
  }
  
  .particle {
    display: none;
  }
}
</style>