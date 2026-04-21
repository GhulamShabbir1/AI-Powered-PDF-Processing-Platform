<template>
  <div class="auth-container pa-0 ma-0">
    <div class="auth-form-section d-flex align-center justify-center">
        <div class="form-wrapper">
          
          <div class="logo-section mb-10">
            <div class="logo-animation">
              <v-img src="@/assets/logo.png" height="50" contain class="mx-auto"></v-img>
            </div>
            <h1 class="text-h4 font-weight-bold primary-text mt-6">
              {{ step === 1 ? 'Reset Password' : 'Verify Email' }}
            </h1>
            <p class="text-body-2 text-muted mt-2 px-4">
              <span v-if="step === 1">Enter your email and check your inbox for instructions.</span>
              <span v-else>Enter the 6-digit code sent to <strong>{{ form.email }}</strong></span>
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
                  class="custom-field text-center tracking-widest" 
                  hide-details="auto"
                  prepend-inner-icon="mdi-shield-key-outline"
                  :rules="otpRules"
                  maxlength="6"
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
          </v-fade-transition>

          <div class="auth-link-section">
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
import { useRouter } from 'vue-router';
import AuthLayout from '../../layouts/AuthLayout.vue';
import { validateEmail } from '../../utils/validators';

const router = useRouter();
const step = ref(1);
const isLoading = ref(false);
const error = ref<string | null>(null);

const isEmailValid = ref(false);
const isOtpValid = ref(false);

const form = reactive({
  email: '',
  otp: ''
});

const emailRules = [
  (v: string) => !!v || 'Email is required',
  (v: string) => validateEmail(v) || 'Please enter a valid email address'
];

const otpRules = [
  (v: string) => !!v || 'OTP is required',
  (v: string) => v.length === 6 || 'OTP must be exactly 6 digits'
];

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
    // Route to the Reset Password page with the email in the query
    router.push({ path: '/reset-password', query: { email: form.email } });
  } catch (err: any) {
    error.value = err.message || 'Invalid OTP.';
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

.primary-text {
  color: var(--color-text-primary);
  line-height: 1.3;
}

.text-muted {
  color: var(--color-text-secondary);
}

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

/* Inherited Custom Input Fields */
:deep(.custom-field .v-field__outline) {
  --v-field-border-color: #000000 !important;
  border-radius: var(--radius-md);
  /* border: 2px solid #000000 !important; */
}

:deep(.custom-field .v-field__input) {
  --v-field-input-placeholder-opacity: 1 !important;
  color: var(--color-text-primary) !important;
}

:deep(.custom-field .v-field__input::placeholder) {
  color: var(--color-text-secondary) !important;
  opacity: 1 !important;
}

:deep(.custom-field .v-label) {
  color: var(--color-text-secondary) !important;
  opacity: 1 !important;
  background-color: white !important;
  padding: 0 4px !important;
  margin-left: -4px !important;
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

:deep(.custom-field .v-field__input:-webkit-autofill),
:deep(.custom-field .v-field__input:-webkit-autofill:hover),
:deep(.custom-field .v-field__input:-webkit-autofill:focus) {
  -webkit-box-shadow: 0 0 0 1000px white inset !important;
  box-shadow: 0 0 0 1000px white inset !important;
}

:deep(.custom-field .v-field__input:-webkit-autofill) {
  -webkit-text-fill-color: var(--color-text-primary) !important;
  color: var(--color-text-primary) !important;
}

:deep(.custom-field:has(.v-field__input:-webkit-autofill) .v-field__outline) {
  --v-field-border-color: var(--color-primary) !important;
}

.auth-btn {
  background: var(--gradient-ai);
  color: white;
  border-radius: var(--radius-md);
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-md);
  text-transform: none;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

:deep(.auth-btn .v-btn__content) {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.auth-btn:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.auth-btn:active {
  transform: translateY(0);
}

.auth-link-section {
  margin-top: 32px;
  animation: slideInUp 0.6s ease-out 0.6s both;
}

:deep(.auth-link-section .v-btn) {
  color: var(--color-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

:deep(.auth-link-section .v-btn .v-btn__content) {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

:deep(.auth-link-section .v-btn:hover) {
  color: var(--color-primary-dark);
}

/* OTP Specific spacing */
.tracking-widest :deep(input) {
  letter-spacing: 0.25em !important;
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
}

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