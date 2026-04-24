<template>
  <div class="login-container pa-0 ma-0">

    <!-- LEFT SIDE -->
    <div class="login-form-section d-flex align-center justify-center">
      <div class="form-wrapper">

        <!-- Logo -->
        <div class="text-center mb-8">
          <v-img src="@/assets/logo.png" height="50" contain />
          <h1 class="text-h5 font-weight-bold mt-4">Login to AI-PDF</h1>
          <p class="text-body-2 text-medium-emphasis">
            Enter your credentials to access your account
          </p>
        </div>

        <!-- FORM -->
        <v-form ref="formRef" v-model="isFormValid" validate-on="input">

          <!-- EMAIL -->
          <v-text-field
            v-model="email"
            label="Email"
            variant="outlined"
            prepend-inner-icon="mdi-email-outline"
            validate-on="input"
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
            validate-on="input"
            :rules="[rules.required]"
          />

          <!-- OPTIONS -->
          <div class="d-flex align-center justify-space-between mb-4">
            <v-checkbox
              v-model="rememberMe"
              label="Remember me"
              density="compact"
              hide-details
            />

            <v-btn
              variant="text"
              to="/forget-password"
              class="text-caption text-none"
            >
              Forgot Password?
            </v-btn>
          </div>

          <!-- LOGIN BUTTON -->
          <v-btn
            color="primary"
            size="large"
            block
            :loading="loading"
            :disabled="!canSubmit"
            @click="validateAndLogin"
          >
            Login
          </v-btn>

        </v-form>

        <!-- SIGNUP -->
        <div class="text-center mt-6">
          <span class="text-body-2">Don't have an account?</span>
          <v-btn variant="text" to="/register">Sign Up</v-btn>
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
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthLayout from '../../layouts/AuthLayout.vue'
import { useAuthStore } from '../../stores'
import { validateEmail, validateRequired } from '../../utils/validators'

const router = useRouter()
const authStore = useAuthStore()

// FORM STATE
const formRef = ref()
const isFormValid = ref(false)
const loading = ref(false)

const email = ref('')
const password = ref('')
const rememberMe = ref(false)

const showPassword = ref(false)

// ALERT
const showAlert = ref(false)
const alertMessage = ref('')

// VALIDATION RULES
const rules = {
  required: (v: string) => {
    const result = validateRequired(v, 'This field')
    return result.valid ? true : result.error || 'This field is required'
  },

  email: (v: string) => {
    const result = validateEmail(v)
    return result.valid ? true : result.error || 'Invalid email'
  },
}

const canSubmit = computed(() => {
  const isEmailValid = validateEmail(email.value).valid
  const isPasswordValid = validateRequired(password.value, 'Password').valid

  return isFormValid.value && isEmailValid && isPasswordValid
})

// LOGIN
const validateAndLogin = async () => {
  const { valid } = await formRef.value.validate()

  if (!valid) return

  loading.value = true

  try {
    await authStore.login(email.value.trim(), password.value)

    router.push('/dashboard')

  } catch (error: any) {
    alertMessage.value =
      error?.response?.data?.message ||
      error.message ||
      'Invalid credentials'

    showAlert.value = true
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
}

.login-form-section {
  width: 50%;
  position: fixed;
  height: 100vh;
  background: white;
}

@media (max-width: 960px) {
  .login-form-section {
    width: 100%;
    position: relative;
  }
}

.form-wrapper {
  width: 100%;
  max-width: 420px;
  padding: 32px;
}
</style>
