<template>
  <div class="login-container pa-0 ma-0">
    <div class="login-form-section d-flex align-center justify-center">
        <div class="form-wrapper">
          <div class="logo-section mb-12">
            <div class="logo-animation">
              <v-img src="@/assets/logo.png" height="50" contain class="mx-auto"></v-img>
            </div>
            <h1 class="text-h4 font-weight-bold primary-text mt-6">Login to AI-PDF</h1>
            <p class="text-body-2 text-muted mt-2">Enter your credentials to access your account</p>
          </div>

          <v-form class="login-form">
            <div class="form-group">
              <v-text-field 
                v-model="email"
                label="Email" 
                variant="outlined" 
                density="comfortable" 
                class="custom-field" 
                hide-details
                prepend-inner-icon="mdi-email-outline"
                required
              ></v-text-field>
            </div>

            <div class="form-group">
              <v-text-field 
                v-model="password"
                label="Password" 
                type="password" 
                variant="outlined" 
                density="comfortable" 
                class="custom-field" 
                hide-details
                prepend-inner-icon="mdi-lock-outline"
                required
              ></v-text-field>
            </div>

            <div class="d-flex align-center justify-space-between mb-6">
              <v-checkbox label="Remember me" hide-details density="compact" class="text-muted ma-0 pa-0"></v-checkbox>
              <router-link to="/forget-password" class="text-caption text-decoration-none font-weight-bold forgot-password-link">
                Forgot Password?
              </router-link>
            </div>

            <v-btn 
              class="login-btn w-100 py-6 font-weight-bold" 
              size="large"
              @click="validateAndLogin"
            >
              LOGIN
            </v-btn>
          </v-form>

          <div class="signup-link-section">
             <span class="text-muted text-body-2">Don't have an account? </span>
             <v-btn variant="text" to="/register" class="font-weight-bold text-none px-1">Sign Up</v-btn>
          </div>
        </div>
    </div>

    <!-- Right Side - Branding Panel -->
    <AuthLayout />

    <!-- Notification Alert -->
    <v-snackbar 
      v-model="showAlert"
      :timeout="5000"
      location="top start"
      class="validation-snackbar"
    >
      <div class="snackbar-content">
        <v-icon class="snackbar-icon">mdi-alert-circle</v-icon>
        <span>{{ alertMessage }}</span>
      </div>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AuthLayout from '../../layouts/AuthLayout.vue'

const email = ref('')
const password = ref('')
const showAlert = ref(false)
const alertMessage = ref('')
let alertTimeout: NodeJS.Timeout | null = null

const showErrorAlert = (message: string) => {
  // Clear any existing timeout
  if (alertTimeout) clearTimeout(alertTimeout)
  
  alertMessage.value = message
  showAlert.value = true
  
  // Auto-dismiss after 5 seconds
  alertTimeout = setTimeout(() => {
    showAlert.value = false
  }, 5000)
}

const validateAndLogin = () => {
  // Reset alert
  showAlert.value = false
  alertMessage.value = ''

  // Validate email
  if (!email.value.trim()) {
    showErrorAlert('Please enter your email address')
    return
  }

  // Validate password
  if (!password.value.trim()) {
    showErrorAlert('Please enter your password')
    return
  }

  // If validation passes, proceed with login
  console.log('Login with:', { email: email.value, password: password.value })
  // TODO: Call login API
}
</script>

<style scoped>
/* Container & Layout */
.login-container {
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
}

/* Left Section - Form Area */
.login-form-section {
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
  .login-form-section {
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
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
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
.login-form {
  text-align: left;
  animation: slideInUp 0.6s ease-out 0.2s both;
}

.form-group {
  margin-bottom: 20px;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Custom Input Fields */
:deep(.custom-field .v-field__outline) {
  --v-field-border-color: #000000 !important;
  border-radius: var(--radius-md);
  border: 2px solid #000000 !important;
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

/* Autofill styling */
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

/* Checkbox */
:deep(.v-checkbox .v-selection-control__input) {
  color: var(--color-primary);
}

/* Alert Styling */
.validation-snackbar {
  z-index: 2000;
}

:deep(.validation-snackbar .v-snackbar__wrapper) {
  background-color: #d32f2f !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
}

.snackbar-content {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #fff;
  font-weight: 600;
  font-size: 0.95rem;
}

.snackbar-icon {
  flex-shrink: 0;
}

/* Login Button */
.login-btn {
  background: var(--gradient-ai);
  color: white;
  border-radius: var(--radius-md);
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-md);
  text-transform: none;
  animation: slideInUp 0.6s ease-out 0.4s both;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

:deep(.login-btn .v-btn__content) {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.login-btn:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.login-btn:active {
  transform: translateY(0);
}

/* Forgot Password Link */
.forgot-password-link {
  color: var(--color-primary);
  transition: color var(--transition-fast);
}

.forgot-password-link:hover {
  color: var(--color-primary-dark);
}

/* Signup Link Section */
.signup-link-section {
  margin-top: 32px;
  animation: slideInUp 0.6s ease-out 0.6s both;
}

:deep(.signup-link-section .v-btn) {
  color: var(--color-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

:deep(.signup-link-section .v-btn .v-btn__content) {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

:deep(.signup-link-section .v-btn:hover) {
  color: var(--color-primary-dark);
}

/* Responsive */
@media (max-width: 960px) {
  .form-wrapper {
    padding: 40px 20px;
  }
}

@media (max-width: 600px) {
  .form-wrapper {
    padding: 32px 16px;
    max-width: 100%;
  }

  .logo-section {
    margin-bottom: 32px;
  }
}
</style>