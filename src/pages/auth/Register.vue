<template>
  <div class="register-container pa-0 ma-0">
    
    <!-- LEFT SIDE -->
    <div class="register-form-section d-flex align-center justify-center">
      <div class="form-wrapper">

        <!-- Logo -->
        <div class="text-center mb-8">
          <v-img src="@/assets/logo.png" height="50" contain />
          <h1 class="text-h5 font-weight-bold mt-4">Create Account</h1>
          <p class="text-body-2 text-medium-emphasis">
            Join us and start managing your PDFs
          </p>
        </div>

        <!-- FORM -->
        <v-form ref="formRef" v-model="isFormValid">

          <v-text-field
            v-model="fullName"
            label="Full Name"
            variant="outlined"
            prepend-inner-icon="mdi-account-outline"
            :rules="[rules.required]"
          />

          <v-text-field
            v-model="organization"
            label="Organization"
            variant="outlined"
            prepend-inner-icon="mdi-domain"
            :rules="[rules.required]"
          />

          <v-text-field
            v-model="email"
            label="Email"
            variant="outlined"
            prepend-inner-icon="mdi-email-outline"
            :rules="[rules.required, rules.email]"
          />

          <!-- PASSWORD -->
          <v-text-field
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            variant="outlined"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
            :rules="[rules.required, rules.password]"
          />

          <!-- PASSWORD STRENGTH -->
          <v-progress-linear
            :model-value="passwordStrength"
            :color="passwordStrengthColor"
            height="6"
            rounded
            class="mb-1"
          />

          <div class="text-caption mb-4">
            Strength: 
            <span :class="`text-${passwordStrengthColor}`">
              {{ passwordStrengthText }}
            </span>
          </div>

          <!-- CONFIRM PASSWORD -->
          <v-text-field
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            label="Confirm Password"
            variant="outlined"
            prepend-inner-icon="mdi-lock-check-outline"
            :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showConfirmPassword = !showConfirmPassword"
            :rules="[
              rules.required,
              () => password === confirmPassword || 'Passwords do not match'
            ]"
          />

          <!-- TERMS -->
          <v-checkbox
            v-model="termsAccepted"
            label="I agree to Terms & Conditions"
            :rules="[v => !!v || 'You must accept terms']"
          />

          <!-- BUTTON -->
          <v-btn
            color="primary"
            size="large"
            block
            :loading="loading"
            :disabled="!isFormValid"
            @click="validateAndRegister"
          >
            Create Account
          </v-btn>

        </v-form>

        <!-- LOGIN -->
        <div class="text-center mt-6">
          <span class="text-body-2">Already have an account?</span>
          <v-btn variant="text" to="/login">Login</v-btn>
        </div>

      </div>
    </div>

    <!-- RIGHT SIDE -->
    <AuthLayout />

    <!-- SNACKBAR -->
    <v-snackbar v-model="showAlert" color="error" timeout="4000">
      {{ alertMessage }}
    </v-snackbar>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AuthLayout from '../../layouts/AuthLayout.vue'
import { useAuthStore } from '../../stores'

const router = useRouter()
const authStore = useAuthStore()

// FORM STATE
const formRef = ref()
const isFormValid = ref(false)
const loading = ref(false)

const fullName = ref('')
const organization = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const termsAccepted = ref(false)

const showPassword = ref(false)
const showConfirmPassword = ref(false)

// ALERT
const showAlert = ref(false)
const alertMessage = ref('')

// RULES
const rules = {
  required: (v: string) => !!v || 'This field is required',

  email: (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Invalid email',

  password: (v: string) => {
    if (v.length < 8) return 'Min 8 characters'
    if (!/[A-Z]/.test(v)) return '1 uppercase required'
    if (!/[a-z]/.test(v)) return '1 lowercase required'
    if (!/[0-9]/.test(v)) return '1 number required'
    if (!/[!@#$%^&*]/.test(v)) return '1 special character required'
    return true
  }
}

// PASSWORD STRENGTH
const passwordStrength = computed(() => {
  let score = 0
  if (password.value.length >= 8) score += 25
  if (/[A-Z]/.test(password.value)) score += 25
  if (/[0-9]/.test(password.value)) score += 25
  if (/[!@#$%^&*]/.test(password.value)) score += 25
  return score
})

const passwordStrengthText = computed(() => {
  if (passwordStrength.value <= 25) return 'Weak'
  if (passwordStrength.value <= 50) return 'Fair'
  if (passwordStrength.value <= 75) return 'Good'
  return 'Strong'
})

const passwordStrengthColor = computed(() => {
  if (passwordStrength.value <= 25) return 'error'
  if (passwordStrength.value <= 50) return 'warning'
  if (passwordStrength.value <= 75) return 'info'
  return 'success'
})

// SUBMIT
const validateAndRegister = async () => {
  const { valid } = await formRef.value.validate()

  if (!valid) return

  loading.value = true

  try {
    await authStore.register(
      fullName.value,
      email.value,
      organization.value,
      password.value
    )

    router.push({ path: '/verify', query: { email: email.value } })

  } catch (error: any) {
    alertMessage.value =
      error?.response?.data?.message ||
      error.message ||
      'Registration failed'

    showAlert.value = true
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  min-height: 80vh;
}

.register-form-section {
  width: 50%;
  position: fixed;
  height: 100vh;
  background: white;
}

/* @media (max-width: 960px) {
  .register-form-section {
    width: 100%;
    position: relative;
  }
} */

.form-wrapper {
  width: 100%;
  max-width: 420px;
  padding: 32px;
}
</style>