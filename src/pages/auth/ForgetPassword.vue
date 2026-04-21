<template>
  <div class="auth-container pa-0 ma-0">
    <div class="auth-form-section d-flex align-center justify-center">
        <div class="form-wrapper">
          
          <div class="logo-section mb-10">
            <div class="logo-animation">
              <v-img src="@/assets/logo.png" height="50" contain class="mx-auto"></v-img>
            </div>
            <h1 class="text-h4 font-weight-bold primary-text mt-6">
              <span v-if="step === 1">Reset Password</span>
              <span v-else-if="step === 2">Verify Email</span>
              <span v-else-if="step === 3">New Password</span>
              <span v-else>Password Reset!</span>
            </h1>
            <p class="text-body-2 text-muted mt-2 px-4">
              <span v-if="step === 1">Enter your email and check your inbox for instructions</span>
              <span v-else-if="step === 2">Enter the 6-digit code sent to <strong>{{ form.email }}</strong></span>
              <span v-else-if="step === 3">Create a strong new password for your account</span>
              <span v-else>Your password has been successfully updated. You can now log in.</span>
            </p>
          </div>

          <v-alert 
            v-if="error" 
            type="error" 
            variant="tonal" 
            class="mb-6 rounded-lg text-left" 
            closable
            @click:close="error = null"
          >
            {{ error }}
          </v-alert>

          <v-fade-transition mode="out-in">
            
            <v-form v-if="step === 1" @submit.prevent="handleSendOtp" v-model="isEmailValid" class="auth-form">
              <div class="form-group">
                <v-text-field 
                  v-model="form.email"
                  label="Email Address" 
                  type="email"
                  variant="outlined" 
                  density="comfortable" 
                  class="custom-field" 
                  hide-details="auto"
                  prepend-inner-icon="mdi-email-outline"
                  :rules="emailRules"
                ></v-text-field>
              </div>

              <v-btn 
                type="submit" 
                class="auth-btn w-100 py-6 font-weight-bold mt-2" 
                size="large"
                :loading="isLoading"
                :disabled="!isEmailValid || isLoading"
              >
                SEND OTP
              </v-btn>
            </v-form>

            <v-form v-else-if="step === 2" @submit.prevent="handleVerifyOtp" v-model="isOtpValid" class="auth-form">
              <div class="form-group">
                <v-text-field 
                  v-model="form.otp"
                  label="6-Digit OTP Code" 
                  type="text"
                  variant="outlined" 
                  density="comfortable" 
                  class="custom-field" 
                  hide-details="auto"
                  prepend-inner-icon="mdi-shield-key-outline"
                  :rules="otpRules"
                ></v-text-field>
              </div>

              <v-btn 
                type="submit" 
                class="auth-btn w-100 py-6 font-weight-bold mt-2" 
                size="large"
                :loading="isLoading"
                :disabled="!isOtpValid || isLoading"
              >
                VERIFY CODE
              </v-btn>
              
              <div class="text-center mt-4">
                <v-btn 
                  variant="text" 
                  color="primary" 
                  @click="handleSendOtp" 
                  :disabled="isLoading"
                  class="font-weight-bold text-none"
                >
                  Didn't receive it? Resend
                </v-btn>
              </div>
            </v-form>

            <v-form v-else-if="step === 3" @submit.prevent="handleResetPassword" v-model="isPasswordValid" class="auth-form">
              <div class="form-group">
                <v-text-field 
                  v-model="form.newPassword"
                  label="New Password" 
                  type="password"
                  variant="outlined" 
                  density="comfortable" 
                  class="custom-field" 
                  hide-details="auto"
                  prepend-inner-icon="mdi-lock-outline"
                  :rules="passwordRules"
                ></v-text-field>
              </div>

              <div class="form-group">
                <v-text-field 
                  v-model="form.confirmPassword"
                  label="Confirm Password" 
                  type="password"
                  variant="outlined" 
                  density="comfortable" 
                  class="custom-field" 
                  hide-details="auto"
                  prepend-inner-icon="mdi-lock-check-outline"
                  :rules="confirmPasswordRules"
                ></v-text-field>
              </div>

              <v-btn 
                type="submit" 
                class="auth-btn w-100 py-6 font-weight-bold mt-2" 
                size="large"
                :loading="isLoading"
                :disabled="!isPasswordValid || isLoading"
              >
                UPDATE PASSWORD
              </v-btn>
            </v-form>

            <div v-else class="auth-form text-center">
              <v-icon color="success" size="80" class="mb-6">mdi-check-circle</v-icon>
              <v-btn 
                to="/login"
                class="auth-btn w-100 py-6 font-weight-bold mt-2" 
                size="large"
              >
                PROCEED TO LOGIN
              </v-btn>
            </div>

          </v-fade-transition>

          <div class="auth-link-section" v-if="step !== 4">
             <span class="text-muted text-body-2">Remember your password?</span>
             <v-btn variant="text" to="/login" class="font-weight-bold text-none px-1">Log In</v-btn>
          </div>
          
        </div>
    </div>

    <AuthLayout />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import AuthLayout from '../../layouts/AuthLayout.vue'
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

// Validators
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

// Mock API Handlers
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

<style scoped>
/* Container & Layout */
.auth-container {
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
}

/* Left Section - Form Area */
.auth-form-section {
  background: var(--color-surface);
  position: fixed;
  left: 0;
  top: 0;
  width: 50%;
  height: 100vh;
  overflow: hidden;
  z-index: 10;
}

@media (max-width: 960px) {
  .auth-form-section {
    position: relative;
    width: 100%;
    z-index: auto;
  }
}

.form-wrapper {
  width: 100%;
  max-width: 420px;
  padding: 48px 24px;
  text-align: center;
}

/* Logo Animation */
.logo-section {
  animation: slideInDown 0.6s ease-out;
}

.logo-animation {
  animation: float 3s ease-in-out infinite;
}

@keyframes slideInDown {
  from { opacity: 0; transform: translateY(-30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Text Styles */
.primary-text {
  color: var(--color-text-primary);
  line-height: 1.3;
}

.text-muted {
  color: var(--color-text-secondary);
}

/* Form Styling */
.auth-form {
  text-align: left;
  animation: slideInUp 0.6s ease-out 0.2s both;
}

.form-group {
  margin-bottom: 20px;
}

@keyframes slideInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Custom Input Fields */
:deep(.custom-field .v-field__outline) {
  --v-field-border-color: var(--color-border);
  border-radius: var(--radius-md);
}

:deep(.custom-field.v-field--focused .v-field__outline) {
  --v-field-border-color: var(--color-primary) !important;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  transition: all var(--transition-fast);
}

:deep(.custom-field .v-field__prepend-inner) {
  color: var(--color-text-secondary);
  margin-right: 8px;
}

/* Auth Button */
.auth-btn {
  background: var(--gradient-ai);
  color: white;
  border-radius: var(--radius-md);
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-md);
  text-transform: none;
}

.auth-btn:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.auth-btn:active {
  transform: translateY(0);
}

/* Auth Link Section */
.auth-link-section {
  margin-top: 32px;
  animation: slideInUp 0.6s ease-out 0.6s both;
}

:deep(.auth-link-section .v-btn) {
  color: var(--color-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

:deep(.auth-link-section .v-btn:hover) {
  color: var(--color-primary-dark);
}

/* Responsive */
@media (max-width: 960px) {
  .form-wrapper { padding: 40px 20px; }
}

@media (max-width: 600px) {
  .form-wrapper {
    padding: 32px 16px;
    max-width: 100%;
  }
  .logo-section { margin-bottom: 32px; }
}
</style>