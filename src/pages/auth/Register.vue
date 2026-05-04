<template>
  <div class="register-container pa-0 ma-0">
    
    <div class="register-form-section d-flex align-center justify-center">
      <div class="form-wrapper">

        <div class="text-center mb-6">
          <v-img src="@/assets/logo.png" height="40" contain />
          <h1 class="text-h6 font-weight-bold mt-2">Create Account</h1>
          <p class="text-body-2 text-medium-emphasis">
            Join us and start managing your PDFs
          </p>
        </div>

        <v-form ref="formRef" v-model="isFormValid" validate-on="input">

          <v-text-field
            v-model="fullName"
            label="Full Name"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            class="mb-3"
            validate-on="input"
            :rules="[rules.fullName]"
          />

          <v-text-field
            v-model="organization"
            label="Organization"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            class="mb-3"
            validate-on="input"
            :rules="[rules.required]"
          />

          <v-text-field
            v-model="email"
            label="Email"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            class="mb-3"
            validate-on="input"
            :rules="[rules.required, rules.email]"
          />

          <v-text-field
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            class="mb-2"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
            @keydown.space.prevent="handlePasswordSpacePress"
            validate-on="input"
            :rules="[rules.required, rules.password]"
          />

          <div v-if="password.length > 0" class="password-strength-container mb-3 px-1">
            <v-progress-linear
              :model-value="passwordStrength"
              :color="passwordStrengthColor"
              height="4"
              rounded
              class="mt-1"
            />
            <div class="text-caption mt-1" style="font-size: 0.75rem !important;">
              Strength: 
              <span :class="`text-${passwordStrengthColor} font-weight-bold`">
                {{ passwordStrengthText }}
              </span>
            </div>
          </div>

          <v-text-field
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            label="Confirm Password"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            class="mb-6 mt-1"
            :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showConfirmPassword = !showConfirmPassword"
            validate-on="input"
            :rules="[
              rules.required,
              () => password === confirmPassword || 'Passwords do not match'
            ]"
          />

          <v-btn
            color="primary"
            size="large"
            block
            variant="flat"
            :loading="loading"
            :disabled="!canSubmit"
            @click="validateAndRegister"
          >
            Create Account
          </v-btn>

        </v-form>

        <div class="text-center mt-6">
          <span class="text-body-2">Already have an account?</span>
          <v-btn variant="text" to="/login" density="compact" class="ml-1">Login</v-btn>
        </div>

      </div>
    </div>

    <AuthLayout />

    <v-snackbar v-model="showAlert" color="error" timeout="4000" location="top left">
      {{ alertMessage }}
    </v-snackbar>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import AuthLayout from '../../layouts/AuthLayout.vue'
import { useAuthStore } from '../../stores'
import { validateEmail, validateName, validatePassword, validateRequired } from '../../utils/validators'

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

const showPassword = ref(false)
const showConfirmPassword = ref(false)

// ALERT
const showAlert = ref(false)
const alertMessage = ref('')

// Helper function to show alert with proper cleanup
const displayAlert = async (message: string) => {
  showAlert.value = false
  alertMessage.value = message
  await nextTick()
  showAlert.value = true
}

// Handler for space key in password field
const handlePasswordSpacePress = () => {
  alertMessage.value = "Password can't contain spaces"
  showAlert.value = true
}

// RULES
const rules = {
  required: (v: string) => {
    const result = validateRequired(v, 'This field')
    return result.valid ? true : result.error || 'This field is required'
  },

  fullName: (v: string) => {
    const result = validateName(v)
    return result.valid ? true : result.error || 'Invalid full name'
  },

  email: (v: string) => {
    const result = validateEmail(v)
    return result.valid ? true : result.error || 'Invalid email'
  },

  password: (v: string) => {
    const result = validatePassword(v)
    return result.valid ? true : result.error || 'Invalid password'
  }
}

const canSubmit = computed(() => {
  const isFullNameValid = validateName(fullName.value).valid
  const isOrganizationValid = validateRequired(organization.value, 'Organization').valid
  const isEmailValid = validateEmail(email.value).valid
  const isPasswordValid = validatePassword(password.value).valid
  const isConfirmPasswordValid =
    confirmPassword.value.trim().length > 0 && password.value === confirmPassword.value

  return (
    isFormValid.value &&
    isFullNameValid &&
    isOrganizationValid &&
    isEmailValid &&
    isPasswordValid &&
    isConfirmPasswordValid
  )
})

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
      fullName.value.trim(),
      email.value.trim(),
      organization.value.trim(),
      password.value
    )

    router.push({ path: '/verify', query: { email: email.value.trim() } })

  } catch (error: any) {
    let message = 'Registration failed'
    
    // Handle specific HTTP error codes
    if (error?.response?.status === 409) {
      message = 'This email is already registered. Please use a different email or try logging in.'
    } else {
      message =
        error?.response?.data?.message ||
        error.message ||
        'Registration failed'
    }

    await displayAlert(message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
}

.register-form-section {
  width: 50%;
  position: fixed;
  height: 100vh;
  background: white;
  overflow-y: auto;
}

@media (max-width: 960px) {
  .register-form-section {
    width: 100%;
    position: relative;
  }
}

.form-wrapper {
  width: 100%;
  max-width: 420px;
  padding: 24px;
  margin: auto;
}

:deep(.v-messages) {
  min-height: 0;
  padding: 4px 0;
  text-align: right;
  font-size: 0.75rem;
}

.password-strength-container {
  width: 100%;
}
</style>