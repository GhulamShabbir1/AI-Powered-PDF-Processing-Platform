<template>
    <v-container class="fill-height d-flex justify-center align-center">
      <v-card class="pa-4 pa-sm-8 elevation-0" max-width="500" width="100%" color="transparent">
        
        <v-alert 
          v-if="error" 
          type="error" 
          variant="tonal" 
          class="mb-6 rounded-lg" 
          closable
          @click:close="error = null"
        >
          {{ error }}
        </v-alert>
  
        <v-fade-transition mode="out-in">
          
          <v-form v-if="step === 1" @submit.prevent="handleSendOtp" v-model="isEmailValid">
            
            <div class="text-center mb-8">
              <h2 class="text-h4 font-weight-bold mb-4">
                Reset your <span class="text-gradient">password</span>
              </h2>
              <p class="text-body-1 text-muted mx-auto" style="max-width: 420px; line-height: 1.6;">
                Enter your email and check your inbox for instructions. Please also check your spam folder.
              </p>
            </div>
  
            <BaseInput
              v-model="form.email"
              placeholder="Your email"
              type="email"
              prepend-icon="mdi-email-outline"
              :rules="emailRules"
              class="mb-6"
            />
  
            <div class="text-center">
              <BaseButton
                type="submit"
                size="large"
                :loading="isLoading"
                :disabled="!isEmailValid || isLoading"
                class="px-10 py-2 text-body-1 font-weight-bold"
              >
                Send
              </BaseButton>
            </div>
          </v-form>
  
  
          <v-form v-else-if="step === 2" @submit.prevent="handleVerifyOtp" v-model="isOtpValid">
            <div class="text-center mb-8">
              <h2 class="text-h4 font-weight-bold mb-4">
                Verify your <span class="text-gradient">email</span>
              </h2>
              <p class="text-body-1 text-muted mx-auto" style="max-width: 420px; line-height: 1.6;">
                Enter the 6-digit code sent to <strong>{{ form.email }}</strong>.
              </p>
            </div>
  
            <BaseInput
              v-model="form.otp"
              placeholder="OTP Code"
              type="text"
              prepend-icon="mdi-shield-key-outline"
              :rules="otpRules"
              class="mb-8"
            />
  
            <div class="text-center">
              <BaseButton
                type="submit"
                size="large"
                :loading="isLoading"
                :disabled="!isOtpValid || isLoading"
                class="px-10 py-2 text-body-1 font-weight-bold"
              >
                Verify Code
              </BaseButton>
            </div>
            
            <div class="text-center mt-6">
              <v-btn 
                variant="text" 
                size="small" 
                color="primary" 
                @click="handleSendOtp" 
                :disabled="isLoading"
                class="font-weight-bold text-none"
              >
                Didn't receive it? Resend
              </v-btn>
            </div>
          </v-form>
  
  
          <v-form v-else-if="step === 3" @submit.prevent="handleResetPassword" v-model="isPasswordValid">
            <div class="text-center mb-8">
              <h2 class="text-h4 font-weight-bold mb-4">
                Set new <span class="text-gradient">password</span>
              </h2>
              <p class="text-body-1 text-muted mx-auto" style="max-width: 420px; line-height: 1.6;">
                Create a strong new password for your account.
              </p>
            </div>
  
            <BaseInput
              v-model="form.newPassword"
              placeholder="New Password"
              type="password"
              prepend-icon="mdi-lock-outline"
              :rules="passwordRules"
              class="mb-4"
            />
  
            <BaseInput
              v-model="form.confirmPassword"
              placeholder="Confirm New Password"
              type="password"
              prepend-icon="mdi-lock-check-outline"
              :rules="confirmPasswordRules"
              class="mb-8"
            />
  
            <div class="text-center">
              <BaseButton
                type="submit"
                size="large"
                :loading="isLoading"
                :disabled="!isPasswordValid || isLoading"
                class="px-10 py-2 text-body-1 font-weight-bold"
              >
                Update Password
              </BaseButton>
            </div>
          </v-form>
  
  
          <div v-else class="text-center">
            <v-icon color="success" size="64" class="mb-4">mdi-check-circle-outline</v-icon>
            <h2 class="text-h4 font-weight-bold mb-4">Password <span class="text-gradient">Reset!</span></h2>
            <p class="text-body-1 text-muted mx-auto mb-10" style="max-width: 420px; line-height: 1.6;">
              Your password has been successfully updated. You can now log in securely.
            </p>
            <BaseButton
              size="large"
              @click="$router.push('/login')"
              class="px-10 py-2 text-body-1 font-weight-bold"
            >
              Proceed to Login
            </BaseButton>
          </div>
        </v-fade-transition>
  
        <div v-if="step !== 4" class="text-center mt-12">
          <p class="text-body-1 text-muted">
            Already a member? 
            <router-link 
              to="/login" 
              class="font-weight-bold text-primary text-decoration-underline" 
              style="text-underline-offset: 4px;"
            >
              Log in
            </router-link>
          </p>
        </div>
  
      </v-card>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive } from 'vue';
  import BaseInput from '../../components/base/BaseInput.vue';
  import BaseButton from '../../components/base/BaseButton.vue';
  import { validateEmail, validatePassword, validateConfirmPassword } from '../../utils/validators';
  
  const step = ref(1);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  
  const isEmailValid = ref(false);
  const isOtpValid = ref(false);
  const isPasswordValid = ref(false);
  
  const form = reactive({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Utilizing your custom validator rules
  const emailRules = [
    (v: string) => !!v || 'Email is required',
    (v: string) => validateEmail(v) || 'Please enter a valid email address'
  ];
  
  const otpRules = [
    (v: string) => !!v || 'OTP is required',
    (v: string) => v.length === 6 || 'OTP must be exactly 6 digits'
  ];
  
  const passwordRules = [
    (v: string) => !!v || 'Password is required',
    (v: string) => {
      const result = validatePassword(v);
      return result.valid || result.error;
    }
  ];
  
  const confirmPasswordRules = [
    (v: string) => !!v || 'Please confirm your password',
    (v: string) => {
      const result = validateConfirmPassword(form.newPassword, v);
      return result.valid || result.error;
    }
  ];
  
  // Mocked Handlers
  const handleSendOtp = async () => {
    if (!isEmailValid.value) return;
    isLoading.value = true;
    error.value = null;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      step.value = 2;
    } catch (err: any) {
      error.value = err.message || 'Failed to send OTP.';
    } finally {
      isLoading.value = false;
    }
  };
  
  const handleVerifyOtp = async () => {
    if (!isOtpValid.value) return;
    isLoading.value = true;
    error.value = null;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      step.value = 3;
    } catch (err: any) {
      error.value = err.message || 'Invalid OTP.';
    } finally {
      isLoading.value = false;
    }
  };
  
  const handleResetPassword = async () => {
    if (!isPasswordValid.value) return;
    isLoading.value = true;
    error.value = null;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      step.value = 4;
    } catch (err: any) {
      error.value = err.message || 'Failed to reset password.';
    } finally {
      isLoading.value = false;
    }
  };
  </script>