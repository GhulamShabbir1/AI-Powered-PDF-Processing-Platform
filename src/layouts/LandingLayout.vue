<template>
  <v-main class="landing-page">
    <AppNavbar />
    
    <!-- Main Content Container with proper spacing between sections -->
    <v-container fluid class="section-container ">
      <div class="sections-wrapper">
        <HeroSection id="hero" />
        <section id="features" class="section">
          <FeatureSection />
        </section>
        <section id="how-it-works" class="section">
          <WorkSection />
        </section>
        <section id="ai-processing" class="section">
          <AIProcessing />
        </section>
        <section id="benefits" class="section">
          <Benefits />
        </section>
        <section id="testimonials" class="section">
          <Testimonials />
        </section>
        <section id="cta" class="section">
          <CTASection />
        </section>
      </div>
      <AppFooter />
    </v-container>
    
  </v-main>
</template>

<script setup lang="ts">
import AIProcessing from '../components/landing/AIProcessing.vue'
import Benefits from '../components/landing/Benefits.vue'
import CTASection from '../components/landing/CTASection.vue'
import FeatureSection from '../components/landing/FeatureSection.vue'
import HeroSection from '../components/landing/HeroSection.vue'
import Testimonials from '../components/landing/Testimonials.vue'
import WorkSection from '../components/landing/WorkSection.vue'
import AppFooter from '../components/layout/AppFooter.vue'
import AppNavbar from '../components/layout/AppNavbar.vue'
</script>

<style scoped>
.landing-page {
  width: 100vw !important;
  max-width: 100vw !important;
  margin: 0 !important;
  padding: 0 !important;
  scroll-behavior: smooth;
  background: white;
  overflow-x: hidden !important;
}

.section-container {
  overflow-x: hidden;
  margin: 0 auto;
}

.sections-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin: 0 !important;
  padding: 0 !important;
}

.section {
  scroll-margin-top: 8rem;
  margin: 0;
  padding-top: 1rem !important;
  padding-bottom: 1rem !important;
}

:deep(.v-main) {
  padding: 0 !important;
}

:deep(.section .v-container) {
  padding-left: 1rem !important;
  padding-right: 1rem !important;
  max-width: 1400px !important;
}
</style>
