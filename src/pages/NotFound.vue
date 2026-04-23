<template>
  <v-theme theme="light">
    <v-container fluid class="fill-height pa-0" style="background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); min-height: 100vh;">
      <v-row align="center" justify="center" class="fill-height">
        <v-col cols="12" md="8" lg="6" xl="4" class="text-center">
          <div class="pa-8">
            <v-icon 
              icon="mdi-file-find-off" 
              size="200" 
              color="#4F46E5" 
              class="mb-6 hover"
            />
            
            <h1 class="text-h2 font-weight-bold mb-4" style="color: #1e293b;">
              404
            </h1>
            
            <h2 class="text-h5 mb-6" style="color: #475569;">
              Page Not Found
            </h2>
            
            <p class="text-body-1 mb-12" style="color: #64748b; line-height: 1.7; max-width: 500px; margin: 0 auto;">
              Oops! The page you're looking for seems to have gotten lost in the PDF processing ether. 
              Don't worry, let's get you back.
            </p>
            
            <v-row justify="center" class="gap-4 flex-wrap">
              <v-col cols="12" sm="auto">
                <RouterLink to="/">
                  <v-btn 
                    prepend-icon="mdi-home"
                    size="large"
                    color="#4F46E5" 
                    class="text-white rounded-xl shadow-lg v-btn-hover"
                    style="text-transform: none; font-weight: 600;"
                  >
                    Go Home
                  </v-btn>
                </RouterLink>
              </v-col>
              
              <v-col cols="12" sm="auto">
                <RouterLink to="/dashboard">
                  <v-btn 
                    prepend-icon="mdi-monitor-dashboard"
                    size="large" 
                    color="#06B6D4"
                    class="text-white rounded-xl shadow-lg v-btn-hover"
                    style="text-transform: none; font-weight: 600;"
                    variant="outlined"
                  >
                    Dashboard
                  </v-btn>
                </RouterLink>
              </v-col>
              
              <v-col cols="12" sm="auto">
                <v-btn 
                  prepend-icon="mdi-arrow-left"
                  size="large" 
                  color="grey"
                  class="text-white rounded-xl shadow-lg v-btn-hover"
                  style="text-transform: none; font-weight: 600;"
                  variant="outlined"
                  @click="goBack"
                >
                  Go Back
                </v-btn>
              </v-col>
            </v-row>
          </div>
          
          <div class="mt-auto pa-4 text-caption text-center" style="color: #94a3b8;">
            PDF Processor © 2024. Let's find that page together.
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-theme>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.v-icon {
  filter: drop-shadow(0 10px 20px rgba(79, 70, 229, 0.3));
}

.hover, .v-btn-hover {
  transition: all 0.3s ease !important;
}

.hover:hover, .v-btn-hover:hover {
  transform: scale(1.05) !important;
}

@media (max-width: 600px) {
  .v-icon {
    font-size: 150px !important;
  }
}
</style>

