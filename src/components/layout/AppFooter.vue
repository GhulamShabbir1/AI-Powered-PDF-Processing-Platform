<template>
  <footer 
    class="footer-wrapper position-relative overflow-hidden"
  >
    <!-- Floating decoration -->
    <div class="footer-floaters">
      <div class="floater-gradient floater-1"></div>
      <div class="floater-gradient floater-2"></div>
    </div>
    
    <v-container class="pa-8 lg:pa-12">
      <!-- Main Footer Content -->
      <v-row>
        <!-- Brand & Description -->
        <v-col cols="12" lg="4" class="mb-8 lg:mb-0">
          <div class="brand-section">
            <div class="logo-container d-flex align-center mb-6">
              <div class="logo-box-footer bg-gradient-primary mr-4">
                <v-icon color="white" size="32">mdi-brain</v-icon>
              </div>
              <div>
                <h3 class="text-h4 font-weight-black text-white mb-2 brand-name">AI PDF Processor</h3>
                <div class="verified-badge">
                  <v-icon color="success" size="20">mdi-shield-check</v-icon>
                  <span class="text-caption font-weight-bold ml-2">Trusted by 10K+</span>
                </div>
              </div>
            </div>
            <p class="footer-text text-body-2 text-white-alpha lh-relaxed">
              Transform static documents into dynamic intelligence. Enterprise-grade AI for OCR, 
              summarization, and translation at scale.
            </p>
          </div>
        </v-col>

        <!-- Navigation Columns -->
        <v-col cols="6" sm="6" md="3" lg="2">
          <h4 class="section-title text-subtitle-1 font-weight-bold text-white mb-6">Product</h4>
          <v-list density="compact" nav class="pa-0">
            <v-list-item 
              v-for="link in productLinks" 
              :key="link"
              class="px-0 py-1 min-h-auto"
              link
            >
              <a href="#" class="footer-link text-body-2 text-white-alpha-hover">
                {{ link }}
              </a>
            </v-list-item>
          </v-list>
        </v-col>

        <v-col cols="6" sm="6" md="3" lg="2">
          <h4 class="section-title text-subtitle-1 font-weight-bold text-white mb-6">Company</h4>
          <v-list density="compact" nav class="pa-0">
            <v-list-item 
              v-for="link in companyLinks" 
              :key="link"
              class="px-0 py-1 min-h-auto"
              link
            >
              <a href="#" class="footer-link text-body-2 text-white-alpha-hover">
                {{ link }}
              </a>
            </v-list-item>
          </v-list>
        </v-col>

        <!-- Newsletter & Social -->
        <v-col cols="12" lg="4">
          <h4 class="section-title text-subtitle-1 font-weight-bold text-white mb-6">Stay Updated</h4>
          
          <!-- Newsletter -->
          <div class="newsletter-section mb-8">
            <p class="text-body-2 text-white-alpha mb-4">
              Get AI insights & product updates
            </p>
            <v-text-field
              v-model="email"
              label="Enter your email"
              variant="outlined"
              color="secondary"
              density="compact"
              hide-details
              class="newsletter-field rounded-xl"
              placeholder="your@email.com"
            >
              <template v-slot:append-inner>
                <v-btn 
                  icon 
                  variant="text" 
                  color="secondary" 
                  size="x-small"
                  class="rounded-circle"
                >
                  <v-icon>mdi-arrow-right</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </div>

          <!-- Social Links -->
          <div class="social-section">
            <div class="social-title text-caption font-weight-bold text-white-alpha mb-4 uppercase">
              Connect with us
            </div>
            <div class="social-links d-flex gap-3">
              <v-btn
                v-for="social in socialLinks"
                :key="social.icon"
                :icon="social.icon"
                :color="social.color"
                variant="tonal"
                size="x-large"
                class="social-btn rounded-xl elevation-4"
                :title="social.name"
              ></v-btn>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Divider & Bottom Bar -->
      <v-divider class="my-12 divider-gradient" color="white" thickness="1"></v-divider>

      <v-row align="center" class="bottom-bar">
        <v-col cols="12" md="6" class="text-md-left text-center order-md-1 order-2">
          <span class="copyright text-caption text-white-alpha">
            © {{ new Date().getFullYear() }} AI PDF Processor. All rights reserved.
          </span>
        </v-col>
        <v-col cols="12" md="6" class="text-md-right text-center order-md-2 order-1 mt-4 md:mt-0">
          <div class="legal-links d-flex justify-md-end justify-center gap-6 flex-wrap">
            <a href="#" class="legal-link text-caption text-white-alpha-hover font-weight-medium">Privacy</a>
            <a href="#" class="legal-link text-caption text-white-alpha-hover font-weight-medium">Terms</a>
            <a href="#" class="legal-link text-caption text-white-alpha-hover font-weight-medium">Security</a>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </footer>
</xai:function_call >

<xai:function_call name="edit_file">
<parameter name="path">e:/Programmer Force/AI-Powered-PDF-Processing-Platform-Frontend/pdf-processor/TODO.md
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')

const productLinks = ['Features', 'Pricing', 'API Docs', 'Security', 'Integrations']
const companyLinks = ['About', 'Careers', 'Blog', 'Contact', 'Support']
const socialLinks = [
  { icon: 'mdi-twitter', color: '#1DA1F2', name: 'Twitter' },
  { icon: 'mdi-linkedin', color: '#0A66C2', name: 'LinkedIn' },
  { icon: 'mdi-github', color: '#333', name: 'GitHub' },
  { icon: 'mdi-discord', color: '#5865F2', name: 'Discord' }
]
</script>

<style scoped>
.footer-wrapper {
  background: linear-gradient(180deg, #0f172a 0%, #1e1b4b 50%, #111827 100%);
  color: white;
  position: relative;
}

.footer-floaters {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
}

.floater-gradient {
  position: absolute;
  filter: blur(60px);
  animation: gradientFloat 20s ease-in-out infinite;
}

.floater-1 {
  top: 10%;
  left: 10%;
  width: 300px;
  height: 300px;
  background: linear-gradient(45deg, rgba(79,70,229,0.2), transparent);
}

.floater-2 {
  bottom: 20%;
  right: 10%;
  width: 200px;
  height: 200px;
  background: linear-gradient(-45deg, rgba(6,182,212,0.15), transparent);
  animation-delay: -10s;
}

@keyframes gradientFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
  50% { transform: translateY(-30px) rotate(180deg); opacity: 1; }
}

.logo-box-footer {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20px 40px rgba(79, 70, 229, 0.3);
}

.brand-name {
  background: linear-gradient(135deg, white, #e2e8f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.verified-badge {
  background: rgba(16, 185, 129, 0.2);
  color: #10B981;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  border: 1px solid rgba(16, 185, 129, 0.4);
}

.footer-text {
  opacity: 0.9;
  max-width: 320px;
}

.lh-relaxed {
  line-height: 1.7;
}

.section-title {
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 40px;
  height: 3px;
  background: var(--gradient-ai);
  border-radius: 2px;
}

.newsletter-field {
  background: rgba(255,255,255,0.05) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.1) !important;
}

.newsletter-field .v-field__outline {
  color: rgba(255,255,255,0.3) !important;
}

.newsletter-field:focus-within .v-field__outline {
  color: var(--color-secondary) !important;
}

.social-btn {
  width: 56px !important;
  height: 56px !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0);
}

.social-btn:hover {
  transform: translateY(-8px) scale(1.1) !important;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3) !important;
}

.divider-gradient {
  opacity: 0.6 !important;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent) !important;
}

.text-white-alpha {
  opacity: 0.7;
}

.text-white-alpha-hover {
  transition: opacity 0.3s ease;
}

.text-white-alpha-hover:hover {
  opacity: 1 !important;
}

.legal-link {
  position: relative;
}

.legal-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: currentColor;
  opacity: 0.8;
  transition: width 0.3s ease;
}

.legal-link:hover::after {
  width: 100%;
}

.min-h-auto {
  min-height: auto !important;
}

/* Mobile Responsive */
@media (max-width: 960px) {
  .lg-4 { max-width: 100% !important; margin-bottom: 3rem !important; }
  .social-links { justify-content: center !important; }
}

@media (max-width: 600px) {
  .footer-wrapper { padding-top: 4rem !important; }
  .brand-section { text-align: center !important; }
  .section-title::after { left: 50% !important; transform: translateX(-50%); }
}
</style>

