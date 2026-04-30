<template>
  <v-container fluid class="fill-height verify-page pa-0">
    <v-row no-gutters class="fill-height">

      <!-- LEFT PANEL -->
      <v-col cols="12" md="6"
        class="bg-primary d-none d-md-flex align-center justify-center relative">
        <div class="branding-content text-center white--text px-10">
          <v-icon size="80" color="white" class="mb-6">
            mdi-shield-check-outline
          </v-icon>
          <h1 class="text-h3 font-weight-bold mb-4">
            Secure Verification
          </h1>
          <p class="text-h6">
            We've sent a 6-digit code to your email address to ensure your account is safe.
          </p>
        </div>
      </v-col>

      <!-- RIGHT PANEL -->
      <v-col cols="12" md="6"
        class="d-flex align-center justify-center bg-grey-lighten-4">

        <v-card flat max-width="450" width="100%"
          class="pa-8 pa-md-12 verification-card">

          <!-- HEADER -->
          <div class="text-center mb-8">
            <h2 class="text-h4 font-weight-bold mb-2">Verify Email</h2>
            <p class="text-body-1 text-grey-darken-1">
              Enter the OTP sent to <br>
              <strong class="text-primary">{{ email }}</strong>
            </p>
          </div>

          <!-- ALERT -->
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

          <!-- FORM -->
          <v-form @submit.prevent="handleVerify">

            <!-- OTP INPUT -->
            <v-otp-input
              v-model="otpCode"
              length="6"
              variant="outlined"
              class="mb-6"
              :disabled="isLoading"
              autofocus
              @update:modelValue="handleOtpInput"
            />

            <!-- VERIFY BUTTON -->
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
              <v-btn
                variant="text"
                density="compact"
                class="text-none"
                to="/register"
              >
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
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const otpCode = ref('')
const email = ref('')
const showAlert = ref(false)
const alertMessage = ref('')
const isLoading = ref(false)

onMounted(() => {
  if (route.query.email) {
    email.value = String(route.query.email)
  }
})

/* ================= OTP HANDLING ================= */

const handleOtpInput = (value: string) => {
  // allow only digits
  otpCode.value = value.replace(/\D/g, '').slice(0, 6)

  // 🔥 optional auto-submit
  if (otpCode.value.length === 6) {
    handleVerify()
  }
}

/* ================= VERIFY ================= */

const handleVerify = async () => {
  if (!/^\d{6}$/.test(otpCode.value)) {
    showError('Please enter a valid 6-digit code.')
    return
  }

  isLoading.value = true
  showAlert.value = false

  try {
    await authStore.verifyAccount(email.value, otpCode.value)

    // success
    router.push('/login')

  } catch (error: any) {
    showError(
      error.response?.data?.message ||
      error.message ||
      'Verification failed. Please check your code.'
    )
  } finally {
    isLoading.value = false
  }
}

/* ================= ERROR ================= */

const showError = (msg: string) => {
  alertMessage.value = msg
  showAlert.value = true
}
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

/* OTP spacing */
:deep(.v-otp-input__content) {
  padding: 0;
  gap: 10px;
}
</style>