<template>
  <div class="auth-container pa-0 ma-0">
    <div class="auth-form-section d-flex align-center justify-center">
      <div class="form-wrapper">
        
        <!-- Header -->
        <div class="logo-section mb-10">
          <div class="logo-animation">
            <v-img src="@/assets/logo.png" height="50" contain class="mx-auto"/>
          </div>

          <h1 class="text-h4 font-weight-bold primary-text mt-6">
            {{ step === 1 ? "Reset Password" : "Verify Email" }}
          </h1>

          <p class="text-body-2 text-muted mt-2 px-4">
            <span v-if="step === 1">
              Enter your email and check your inbox for instructions.
            </span>
            <span v-else>
              Enter the 6-digit code sent to 
              <strong>{{ form.email }}</strong>
            </span>
          </p>
        </div>

        <!-- Error Alert -->
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

          <!-- STEP 1: EMAIL -->
          <v-form
            v-if="step === 1"
            @submit.prevent="handleSendOtp"
            v-model="isEmailValid"
            class="auth-form"
          >
            <div class="form-group">
              <v-text-field
                v-model.trim="form.email"
                label="Email Address"
                type="email"
                variant="outlined"
                density="comfortable"
                class="custom-field"
                hide-details="auto"
                prepend-inner-icon="mdi-email-outline"
                :rules="emailRules"
              />
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

          <!-- STEP 2: OTP -->
          <v-form
            v-else
            @submit.prevent="handleVerifyOtp"
            v-model="isOtpValid"
            class="auth-form"
          >
            <div class="form-group">
              <v-text-field
                v-model="form.otp"
                label="6-Digit OTP Code"
                variant="outlined"
                density="comfortable"
                class="custom-field text-center tracking-widest"
                hide-details="auto"
                prepend-inner-icon="mdi-shield-key-outline"
                :rules="otpRules"
                maxlength="6"
                inputmode="numeric"
                autofocus
                @input="handleOtpInput"
              />
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

        <!-- Footer -->
        <div class="auth-link-section">
          <span class="text-muted text-body-2">Remember your password?</span>
          <v-btn variant="text" to="/login" class="font-weight-bold text-none px-1">
            Log In
          </v-btn>
        </div>

      </div>
    </div>

    <AuthLayout />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores'
import AuthLayout from '../../layouts/AuthLayout.vue'
import { validateEmail, validateRequired } from '../../utils/validators'

const router = useRouter()
const authStore = useAuthStore()

const step = ref(1)
const isLoading = ref(false)
const error = ref<string | null>(null)

const isEmailValid = ref(false)
const isOtpValid = ref(false)

const form = reactive({
  email: '',
  otp: ''
})

/* ================= VALIDATION RULES ================= */

const emailRules = [
  (v: string) => {
    const result = validateRequired(v, 'Email')
    return result.valid ? true : result.error || 'Email is invalid'
  },
  (v: string) => {
    const result = validateEmail(v)
    return result.valid ? true : result.error || 'Invalid email format'
  },
  (v: string) => v.length <= 254 || 'Email too long'
]

const otpRules = [
  (v: string) => {
    const result = validateRequired(v, 'OTP')
    return result.valid ? true : result.error || 'OTP is invalid'
  },
  (v: string) => /^\d+$/.test(v) || 'OTP must be numeric',
  (v: string) => v.length === 6 || 'OTP must be exactly 6 digits'
]

/* ================= HANDLERS ================= */

const handleOtpInput = (value: string) => {
  // Only allow digits
  form.otp = value.replace(/\D/g, '').slice(0, 6)
}

const handleSendOtp = async () => {
  if (!isEmailValid.value) return

  isLoading.value = true
  error.value = null

  try {
    await authStore.forgotPassword(form.email.trim())
    step.value = 2
  } catch (err: any) {
    error.value =
      err.response?.data?.message ||
      err.message ||
      'Failed to send OTP'
  } finally {
    isLoading.value = false
  }
}

const handleVerifyOtp = async () => {
  if (!isOtpValid.value) return

  router.push({
    path: '/reset-password',
    query: {
      email: form.email,
      token: form.otp
    }
  })
}
</script>

<style scoped>
/* KEEPING YOUR UI EXACT — NO DAMAGE */

/* container */
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
}

/* responsive */
@media (max-width: 960px) {
  .auth-form-section {
    position: relative;
    width: 100%;
  }
}

/* wrapper */
.form-wrapper {
  width: 100%;
  max-width: 420px;
  padding: 48px 24px;
  text-align: center;
}

/* animation */
.logo-animation {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  50% { transform: translateY(-10px); }
}

/* button */
.auth-btn {
  background: var(--gradient-ai);
  color: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}

.auth-btn:hover {
  transform: translateY(-2px);
}

/* otp spacing */
.tracking-widest :deep(input) {
  letter-spacing: 0.25em !important;
  font-size: 1.25rem;
  text-align: center;
}
</style>
