<template>
  <v-theme theme="light">
    <v-container fluid class="fill-height pa-0 notfound-bg">
      <v-row align="center" justify="center" class="fill-height">
        <v-col cols="12" md="8" lg="6" xl="4">
          
          <div class="glass-card text-center pa-8">
            
            <!-- Icon -->
            <v-icon
              icon="mdi-alert-circle-outline"
              size="120"
              class="mb-4 main-icon"
            />

            <!-- 404 Text -->
            <h1 class="error-code">404</h1>

            <h2 class="error-title">
              Page Not Found
            </h2>

            <p class="error-desc">
              The page you're looking for doesn’t exist or was moved.
              Let’s get you back on track.
            </p>

            <!-- Buttons -->
            <div class="d-flex justify-center flex-wrap gap-3 mt-6">
              
              <RouterLink to="/">
                <v-btn
                  prepend-icon="mdi-home"
                  size="large"
                  class="primary-btn"
                >
                  Go Home
                </v-btn>
              </RouterLink>

              <v-btn
                prepend-icon="mdi-arrow-left"
                size="large"
                variant="outlined"
                class="secondary-btn"
                @click="goBack"
              >
                Go Back
              </v-btn>

            </div>
          </div>

          <!-- Footer -->
          <div class="footer-text text-center mt-6">
            PDF Processor © 2026
          </div>

        </v-col>
      </v-row>
    </v-container>
  </v-theme>
</template>

<script setup lang="ts">
import { useRouter, RouterLink } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>

/* 🌈 Animated Background */
.notfound-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #4f46e5, #7c3aed, #06b6d4);
  background-size: 300% 300%;
  animation: gradientMove 8s ease infinite;
}

@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* 🧊 Glass Card */
.glass-card {
  backdrop-filter: blur(16px);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
  color: white;
}

/* 🎯 Icon */
.main-icon {
  color: white;
  opacity: 0.9;
  transition: transform 0.3s ease;
}

.main-icon:hover {
  transform: scale(1.1);
}

/* 🔢 404 */
.error-code {
  font-size: 5rem;
  font-weight: 800;
  margin: 0;
  line-height: 1;
}

/* 📝 Title */
.error-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 8px;
}

/* 📄 Description */
.error-desc {
  margin-top: 10px;
  opacity: 0.85;
  line-height: 1.6;
}

/* 🔘 Buttons */
.primary-btn {
  background: white;
  color: #4f46e5;
  font-weight: 600;
  border-radius: 12px;
  text-transform: none;
  transition: all 0.3s ease;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

.secondary-btn {
  border-radius: 12px;
  color: white;
  border: 2px solid rgba(255,255,255,0.5);
  text-transform: none;
  transition: all 0.3s ease;
}

.secondary-btn:hover {
  background: rgba(255,255,255,0.1);
  transform: translateY(-2px);
}

/* 📌 Footer */
.footer-text {
  color: rgba(255,255,255,0.7);
  font-size: 0.85rem;
}

/* 📱 Responsive */
@media (max-width: 600px) {
  .error-code {
    font-size: 3.5rem;
  }

  .glass-card {
    padding: 32px 20px;
  }
}

</style>