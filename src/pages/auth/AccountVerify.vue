<template>
    <v-container fluid class="fill-height verify-page pa-0">
      <v-row no-gutters class="fill-height">
        <v-col cols="12" md="6" class="bg-primary d-none d-md-flex align-center justify-center relative">
          <div class="branding-content text-center white--text px-10">
            <v-icon size="80" color="white" class="mb-6">mdi-shield-check-outline</v-icon>
            <h1 class="text-h3 font-weight-bold mb-4">Secure Verification</h1>
            <p class="text-h6">We've sent a 6-digit code to your email address to ensure your account is safe.</p>
          </div>
        </v-col>
  
        <v-col cols="12" md="6" class="d-flex align-center justify-center bg-grey-lighten-4">
          <v-card flat max-width="450" width="100%" class="pa-8 pa-md-12 verification-card">
            <div class="text-center mb-8">
              <h2 class="text-h4 font-weight-bold mb-2">Verify Email</h2>
              <p class="text-body-1 text-grey-darken-1">
                Enter the OTP sent to <br>
                <strong class="text-primary">{{ email }}</strong>
              </p>
            </div>
  
            <v-alert
              v-if="showAlert"
              type="error"
              variant="tonal"
              closable
              class="mb-6"
              @click:close="showAlert = false"
            >
              {{ alertMessage }}
            </v-alert>
  
            <v-form @submit.prevent="handleVerify">
              <v-otp-input
                v-model="otpCode"
                length="6"
                variant="outlined"
                class="mb-6"
                :disabled="isLoading"
              ></v-otp-input>
  
              <v-btn
                block
                size="large"
                color="primary"
                class="text-none font-weight-bold"
                type="submit"
                :loading="isLoading"
              >
                Verify Account
              </v-btn>
  
              <div class="text-center mt-6">
                <p class="text-body-2 text-grey-darken-1">
                  Didn't receive the code? 
                  <v-btn variant="text" color="primary" class="pa-0 text-none font-weight-bold" @click="resendOtp">
                    Resend OTP
                  </v-btn>
                </p>
                <v-btn variant="text" density="compact" class="mt-4 text-none" to="/register">
                  Back to Registration
                </v-btn>
              </div>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useAuthStore } from '../../stores'; // Ensure your store index exports useAuthStore
  
  const router = useRouter();
  const route = useRoute();
  const authStore = useAuthStore();
  
  const otpCode = ref('');
  const email = ref('');
  const showAlert = ref(false);
  const alertMessage = ref('');
  const isLoading = ref(false);
  
  // 1. Get email from the URL query params set during Registration
  onMounted(() => {
    if (route.query.email) {
      email.value = route.query.email as string;
    } else {
      // If no email is present, we can't verify; send back to register
      router.push('/register');
    }
  });
  
  const handleVerify = async () => {
    if (otpCode.value.length < 6) {
      showError('Please enter the full 6-digit verification code.');
      return;
    }
  
    isLoading.value = true;
    showAlert.value = false;
  
    try {
      // 2. Call the backend via the Auth Store 
      // The request body matches Postman: { "email": "...", "token": "..." } 
      await authStore.verifyAccount(email.value, otpCode.value);
      
      // 3. Success! Redirect to login page
      router.push('/login');
    } catch (error: any) {
      showError(error.response?.data?.message || 'Verification failed. Please check your code.');
    } finally {
      isLoading.value = false;
    }
  };
  
  const resendOtp = async () => {
    // Optional: Add logic to trigger forgot-password endpoint to resend OTP
    alert('Resend feature depends on backend implementation. Use Forgot Password if needed.');
  };
  
  const showError = (msg: string) => {
    alertMessage.value = msg;
    showAlert.value = true;
  };
  </script>
  
  <style scoped>
  .verify-page {
    background-color: #f5f5f5;
  }
  
  .verification-card {
    border-radius: 20px !important;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05) !important;
  }
  
  .bg-primary {
    background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%) !important;
  }
  
  .relative {
    position: relative;
  }
  
  /* Customizing Vuetify OTP Input spacing if needed */
  :deep(.v-otp-input__content) {
    padding: 0;
    gap: 8px;
  }
  </style>