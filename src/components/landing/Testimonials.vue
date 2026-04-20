<template>
  <section class="testimonials-wrapper" id="testimonials">
    <!-- Animated Background -->
    <div class="bg-particles">
      <div class="particle particle-1"></div>
      <div class="particle particle-2"></div>
      <div class="particle particle-3"></div>
      <div class="particle particle-4"></div>
    </div>

    <v-container>
      <!-- Section Header -->
      <v-row justify="center">
        <v-col cols="12" md="8" class="text-center">
          <div class="section-badge mb-4">
            ⭐ Client Testimonials
          </div>
          <h2 class="section-title mb-4">
            Trusted by 
            <span class="text-gradient">Visionary Teams</span>
          </h2>
          <p class="section-subtitle">
            Join 10,000+ professionals revolutionizing document workflows worldwide.
            See what our customers are saying.
          </p>
        </v-col>
      </v-row>

      <!-- Testimonials Grid -->
      <v-row>
        <v-col 
          v-for="(testimonial, index) in testimonials" 
          :key="index"
          cols="12" 
          md="4"
          class="testimonial-col"
        >
          <div class="testimonial-card">
            <!-- Quote Icon -->
            <div class="quote-icon-wrapper">
              <v-icon size="32" color="#4F46E5" class="quote-icon">mdi-format-quote-open</v-icon>
            </div>

            <!-- Rating Stars -->
            <div class="rating-stars mb-4">
              <v-icon v-for="star in 5" :key="star" size="18" color="#F59E0B" class="mr-1">
                mdi-star
              </v-icon>
            </div>

            <!-- Feedback -->
            <p class="testimonial-feedback">
              "{{ testimonial.feedback }}"
            </p>

            <!-- User Info -->
            <div class="user-info">
              <v-avatar size="56" class="user-avatar">
                <v-img :src="testimonial.image" alt="User avatar" cover />
              </v-avatar>
              <div class="user-details">
                <div class="user-name">{{ testimonial.name }}</div>
                <div class="user-role">{{ testimonial.role }}</div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Stats Section -->
      <v-row justify="center">
        <v-col cols="12">
          <div class="stats-container">
            <div 
              v-for="(stat, index) in stats" 
              :key="index"
              class="stat-item"
            >
              <div class="stat-number">{{ stat.number }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Bottom CTA -->
      <v-row justify="center">
        <v-col cols="auto">
          
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
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

const testimonials: Testimonial[] = [
  {
    name: 'Sarah Jenkins',
    role: 'Lead Data Analyst, TechFlow Inc.',
    feedback: 'The OCR accuracy is incredible. Reduced our manual data entry by 85% in the first month. Complex tables that broke every other tool work flawlessly here.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&w=200&q=80&fit=facecrop'
  },
  {
    name: 'Marcus Chen',
    role: 'Operations Manager, GlobalLogistics',
    feedback: 'Processing 100-page shipping manifests in seconds is a game-changer. The AI summarization automatically flags priority items for review.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=200&q=80&fit=facecrop'
  },
  {
    name: 'Elena Rodriguez',
    role: 'Legal Counsel, JusticePartners',
    feedback: 'Bank-grade security with incredible summarization capabilities. SOC2 compliance gives us confidence to process sensitive case files.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&w=200&q=80&fit=facecrop'
  }
];

const stats: Stat[] = [
  { number: '10K+', label: 'Active Users' },
  { number: '99.9%', label: 'Accuracy Rate' },
  { number: '50+', label: 'Languages Supported' },
  { number: '24/7', label: 'Customer Support' },
  { number: '5M+', label: 'Documents Processed' }
];

const scrollToCta = () => {
  const element = document.getElementById('cta');
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};
</script>

<style scoped>
.testimonials-wrapper {
  position: relative;
  padding: 5rem 0;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%);
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
  opacity: 0.1;
  animation: floatParticle 20s infinite ease-in-out;
}

.particle-1 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #4F46E5, #06B6D4);
  top: -100px;
  left: -100px;
}

.particle-2 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #8B5CF6, #EC4899);
  bottom: -50px;
  right: -50px;
  animation-delay: 5s;
}

.particle-3 {
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, #F59E0B, #10B981);
  top: 40%;
  left: 80%;
  animation-delay: 10s;
}

.particle-4 {
  width: 250px;
  height: 250px;
  background: linear-gradient(135deg, #06B6D4, #8B5CF6);
  bottom: 30%;
  left: 10%;
  animation-delay: 15s;
}

@keyframes floatParticle {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

/* Section Header */
.section-badge {
  display: inline-block;
  padding: 0.5rem 1.25rem;
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(6, 182, 212, 0.1));
  border-radius: 100px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #4F46E5;
  letter-spacing: 0.025em;
}

.section-title {
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 800;
  line-height: 1.2;
  color: #0F172A;
}

.text-gradient {
  background: linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-subtitle {
  font-size: 1.125rem;
  color: #64748B;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Testimonial Cards */
.testimonial-col {
  margin-bottom: 2rem;
}

.testimonial-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 2rem;
  height: 100%;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(226, 232, 240, 0.8);
  position: relative;
  overflow: hidden;
}

.testimonial-card:hover {
  transform: translateY(-8px);
  border-color: rgba(79, 70, 229, 0.2);
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15);
}

/* Quote Icon */
.quote-icon-wrapper {
  margin-bottom: 1rem;
}

.quote-icon {
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.testimonial-card:hover .quote-icon {
  opacity: 1;
}

/* Rating Stars */
.rating-stars {
  display: flex;
  gap: 0.25rem;
}

/* Feedback Text */
.testimonial-feedback {
  font-size: 0.9375rem;
  line-height: 1.7;
  color: #334155;
  margin: 1rem 0 1.5rem 0;
  min-height: 120px;
}

/* User Info */
.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: auto;
}

.user-avatar {
  border: 2px solid #4F46E5;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.testimonial-card:hover .user-avatar {
  transform: scale(1.05);
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 1rem;
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 0.25rem;
}

.user-role {
  font-size: 0.75rem;
  color: #64748B;
}

/* Stats Container */
.stats-container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 2rem;
  background: white;
  border-radius: 80px;
  padding: 2rem 3rem;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(226, 232, 240, 0.8);
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
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748B;
  font-weight: 500;
}

/* CTA Button */
.testimonials-cta-btn {
  background: linear-gradient(135deg, #4F46E5, #06B6D4) !important;
  color: white !important;
  text-transform: none !important;
  font-weight: 600 !important;
  padding: 0 2rem !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3) !important;
  transition: all 0.3s ease !important;
}

.testimonials-cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(79, 70, 229, 0.4) !important;
}

/* Dark Mode Support */
:deep(.dark) .testimonials-wrapper {
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%);
}

:deep(.dark) .testimonial-card {
  background: rgba(30, 41, 59, 0.9);
  border-color: rgba(51, 65, 85, 0.8);
}

:deep(.dark) .section-title {
  color: #F1F5F9;
}

:deep(.dark) .section-subtitle {
  color: #94A3B8;
}

:deep(.dark) .testimonial-feedback {
  color: #CBD5E1;
}

:deep(.dark) .user-name {
  color: #F1F5F9;
}

:deep(.dark) .user-role {
  color: #94A3B8;
}

:deep(.dark) .stats-container {
  background: #1E293B;
  border-color: #334155;
}

:deep(.dark) .stat-label {
  color: #94A3B8;
}

/* Responsive Design */
@media (max-width: 1264px) {
  .stats-container {
    padding: 1.5rem 2rem;
    border-radius: 60px;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
}

@media (max-width: 960px) {
  .testimonials-wrapper {
    padding: 4rem 0;
  }
  
  .testimonial-card {
    padding: 1.5rem;
  }
  
  .testimonial-feedback {
    min-height: 140px;
    font-size: 0.875rem;
  }
  
  .stats-container {
    flex-wrap: wrap;
    gap: 1.5rem;
    border-radius: 40px;
  }
}

@media (max-width: 600px) {
  .testimonials-wrapper {
    padding: 3rem 0;
  }
  
  .testimonial-card {
    padding: 1.25rem;
  }
  
  .testimonial-feedback {
    min-height: auto;
    margin: 0.75rem 0 1rem 0;
  }
  
  .section-badge {
    font-size: 0.75rem;
    padding: 0.375rem 1rem;
  }
  
  .stats-container {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    border-radius: 24px;
  }
  
  .stat-number {
    font-size: 1.25rem;
  }
  
  .stat-label {
    font-size: 0.75rem;
  }
  
  .testimonials-cta-btn {
    font-size: 0.875rem !important;
    padding: 0 1.5rem !important;
  }
  
  .user-avatar {
    width: 48px !important;
    height: 48px !important;
  }
  
  .user-name {
    font-size: 0.875rem;
  }
  
  .user-role {
    font-size: 0.6875rem;
  }
}

/* Animation for cards */
.testimonial-col {
  opacity: 0;
  animation: fadeInUp 0.6s ease forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Stagger animations */
.testimonial-col:nth-child(1) { animation-delay: 0.1s; }
.testimonial-col:nth-child(2) { animation-delay: 0.2s; }
.testimonial-col:nth-child(3) { animation-delay: 0.3s; }
</style>