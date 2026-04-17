<template>
  <v-main class="landing-page">
    <AppNavbar />
    
    <!-- Main Content Container with proper spacing between sections -->
    <v-container fluid class="section-container ">
      <div class="sections-wrapper">
        <HeroSection id="hero" />
        <section id="features" class="section py-12">
          <FeatureSection />
        </section>
        <section id="how-it-works" class="section py-12">
          <WorkSection />
        </section>
        <section id="ai-processing" class="section py-12">
          <AIProcessing />
        </section>
        <section id="benefits" class="section py-12">
          <Benefits />
        </section>
        <section id="testimonials" class="section py-12">
          <Testimonials />
        </section>
        <section id="cta" class="section py-12">
          <CTASection />
        </section>
      </div>
      <!-- <AppFooter /> -->
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
  width: 100% !important;
  scroll-behavior: smooth;
  background: white;
  width: 100vw !important;
  max-width: 100vw !important;
  overflow-x: hidden !important;
  position: relative;
  margin: 0 !important;
  padding: 0 !important;

}

.section-container {
  overflow-x: hidden;
  margin: 0 auto;
}

.sections-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section {
  scroll-margin-top: 8rem; /* Navbar offset for smooth scroll */
}

:deep(.v-main) {
  padding: 0 !important;
}

:deep(.section .v-container) {
  padding-left: 1.5rem !important;
  padding-right: 1.5rem !important;
  max-width: 1400px !important;
}
</style>
