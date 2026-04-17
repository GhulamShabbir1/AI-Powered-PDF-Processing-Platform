<template>
  <section class="testimonials-wrapper bg-gradient-testimonials position-relative">
    <v-container class="py-12 lg:py-20"></v-container>
    <div class="quote-pattern"></div>
    <div class="testimonial-floaters">
      <div class="floater floater-1"></div>
      <div class="floater floater-2"></div>
    </div>
    
    <v-container>
      <v-intersect once>
        <v-row justify="center" class="mb-12 lg:mb-16">
          <v-col cols="12" md="8" class="text-center">
            <v-fade-transition>
              <v-icon color="primary" size="64" class="mb-8 quote-icon">mdi-format-quote-open</v-icon>
              <h2 class="text-h3 font-weight-bold mb-6">Trusted by Visionary Teams</h2>
              <p class="text-body-1 text-muted max-w-text">
                Join 10,000+ professionals revolutionizing document workflows worldwide.
              </p>
            </v-fade-transition>
          </v-col>
        </v-row>
      </v-intersect>

      <v-row justify="center">
        <v-col cols="12" lg="10">
          <v-intersect once>
            <v-carousel
              v-model="carouselModel"
              cycle
              autoplay="5000"
              hide-delimiter-background
              :show-arrows="false"
              height="480"
              color="primary"
              class="testimonial-carousel rounded-3xl overflow-visible"
              :continuous="true"
            >
              <v-carousel-item 
                v-for="(testimonial, i) in testimonials" 
                :key="i"
              >
                <div class="carousel-slide d-flex align-center justify-center pa-8 min-h-full">
                  <v-card 
                    class="testimonial-card mx-auto pa-12 elevation-12 position-relative"
                    max-width="800px"
                    rounded="3xl"
                  >
                    <!-- Quote marks -->
                    <div class="quote-marks">
                      <v-icon size="48" color="primary" class="quote-mark-top">mdi-format-quote-open</v-icon>
                      <v-icon size="48" color="primary" class="quote-mark-bottom">mdi-format-quote-close</v-icon>
                    </div>
                    
                    <!-- Avatar & Content -->
                    <div class="testimonial-content">
                      <v-avatar size="100" class="avatar-glow mb-8 mx-auto position-relative">
                        <v-img :src="testimonial.image" alt="User avatar" cover></v-img>
                        <div class="avatar-ring"></div>
                      </v-avatar>

                      <p class="text-h6 font-italic font-weight-400 mb-10 px-lg-12 text-center lh-generous testimonial-text">
                        "{{ testimonial.feedback }}"
                      </p>

                      <div class="user-info text-center">
                        <h4 class="text-h5 font-weight-bold mb-2">{{ testimonial.name }}</h4>
                        <div class="role-badge">
                          <span class="text-caption font-weight-black text-uppercase tracking-wider">
                            {{ testimonial.role }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Stars rating -->
                    <div class="stars-rating mt-8">
                      <v-rating
                        :model-value="5"
                        color="warning"
                        size="22"
                        half-increments
                        readonly
                      ></v-rating>
                    </div>
                  </v-card>
                </div>
              </v-carousel-item>
            </v-carousel>
          </v-intersect>
        </v-col>
      </v-row>

      <v-row class="mt-12 lg:mt-16">
        <v-col cols="12">
          <div class="stats-row d-flex justify-space-around flex-wrap gap-8">
            <div v-for="stat in stats" :key="stat.label" class="stat-item text-center">
              <div class="stat-number text-h4 font-weight-black text-gradient">{{ stat.number }}</div>
              <div class="stat-label text-body-2 text-muted font-weight-medium">{{ stat.label }}</div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Testimonial {
  name: string;
  role: string;
  feedback: string;
  image: string;
}

interface Stat {
  number: string;
  label: string;
}

const carouselModel = ref(0)

const testimonials = ref<Testimonial[]>([
  {
    name: 'Sarah Jenkins',
    role: 'Lead Data Analyst, TechFlow Inc.',
    feedback: "OCR accuracy transformed our workflow. Reduced manual entry by 85% month one. Complex tables that broke every other tool work flawlessly here.",
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&w=300&q=80&fit=facecrop'
  },
  {
    name: 'Marcus Chen', 
    role: 'Operations Manager, GlobalLogistics',
    feedback: "100-page shipping manifests now process in seconds. AI summarization auto-flags priority items. Saved our team countless hours weekly.",
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=300&q=80&fit=facecrop'
  },
  {
    name: 'Elena Rodriguez',
    role: 'Legal Counsel, JusticePartners',
    feedback: "Bank-grade security with incredible summarization of complex briefs. SOC2 compliance gives us confidence to process sensitive case files.",
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&w=300&q=80&fit=facecrop'
  }
]);

const stats = ref<Stat[]>([
  { number: '10K+', label: 'Active Users' },
  { number: '99.9%', label: 'Accuracy Rate' },
  { number: '50+', label: 'Languages' },
  { number: '24/7', label: 'Support' }
]);
</script>

<style scoped>
.bg-gradient-testimonials {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  isolation: isolate;
  position: relative;
}

.quote-pattern {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%);
  z-index: 0;
}

.testimonial-floaters {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.floater {
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(20px);
  animation: floatTestimonial 15s ease-in-out infinite;
}

.floater-1 {
  width: 120px;
  height: 120px;
  top: 15%;
  left: 5%;
}

.floater-2 {
  width: 80px;
  height: 80px;
  bottom: 20%;
  right: 10%;
  animation-delay: -7s;
}

@keyframes floatTestimonial {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(30px, -30px) rotate(120deg); }
  66% { transform: translate(-20px, 20px) rotate(240deg); }
}

.quote-icon {
  filter: drop-shadow(0 10px 30px rgba(255,255,255,0.3));
}

.testimonial-carousel {
  box-shadow: 0 40px 80px rgba(0,0,0,0.3);
  overflow: hidden !important;
}

.testimonials-wrapper {
  overflow-x: hidden !important;
  width: 100vw !important;
  max-width: 100vw !important;
}

.testimonial-card {
  max-width: 100% !important;
}

.testimonial-card {
  background: rgba(255,255,255,0.1) !important;
  backdrop-filter: blur(30px);
  border: 1px solid rgba(255,255,255,0.2);
  position: relative;
  overflow: hidden;
}

.quote-marks {
  position: absolute;
  z-index: 2;
}

.quote-mark-top {
  top: 2rem;
  left: 2rem;
  opacity: 0.7;
}

.quote-mark-bottom {
  bottom: 2rem;
  right: 2rem;
  opacity: 0.7;
  transform: scaleY(-1);
}

.testimonial-content {
  z-index: 3;
  position: relative;
}

.avatar-glow {
  border: 4px solid rgba(255,255,255,0.3);
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  transition: all 0.4s ease;
}

.avatar-glow:hover {
  transform: scale(1.1);
  border-color: rgba(255,255,255,0.6);
  box-shadow: 0 30px 80px rgba(255,255,255,0.2);
}

.avatar-ring {
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  border: 2px solid transparent;
  border-radius: 50%;
  background: linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent) border-box;
  mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  animation: ringRotate 3s linear infinite;
}

@keyframes ringRotate {
  to { transform: rotate(360deg); }
}

.lh-generous {
  line-height: 1.75;
}

.role-badge {
  background: rgba(255,255,255,0.2);
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  display: inline-block;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.3);
}

.stars-rating {
  position: absolute;
  bottom: 2rem;
  right: 2rem;
}

.stat-item {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
}

.stat-item:nth-child(1) { transition-delay: 0.2s; }
.stat-item:nth-child(2) { transition-delay: 0.3s; }
.stat-item:nth-child(3) { transition-delay: 0.4s; }
.stat-item:nth-child(4) { transition-delay: 0.5s; }

.v-intersect--in .stat-item {
  opacity: 1 !important;
  transform: translateY(0) !important;
}

.stat-number {
  background: var(--gradient-ai);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.max-w-text {
  max-width: 480px;
  margin: 0 auto;
}

/* Mobile */
@media (max-width: 960px) {
  .testimonial-carousel { height: 420px; }
  .stars-rating { position: static !important; }
}

@media (max-width: 600px) {
  .py-20 { padding-top: 5rem !important; padding-bottom: 5rem !important; }
  .testimonial-card { margin: 1rem !important; }
}
</style>

