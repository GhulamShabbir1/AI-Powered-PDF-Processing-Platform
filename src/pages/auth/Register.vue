<template>
  <div class="register-container pa-0 ma-0">
    <div class="register-form-section d-flex align-center justify-center">
        <div class="form-wrapper">
          <div class="logo-section mb-12">
            <div class="logo-animation">
              <v-img src="@/assets/logo.png" height="50" contain class="mx-auto"></v-img>
            </div>
            <h1 class="text-h4 font-weight-bold primary-text mt-6">Create Account</h1>
            <p class="text-body-2 text-muted mt-2">Join us and start managing your PDFs</p>
          </div>

          <v-form class="register-form">
            <div class="form-group">
              <v-text-field 
                label="Full Name" 
                variant="outlined" 
                density="comfortable" 
                class="custom-field" 
                hide-details
                prepend-inner-icon="mdi-account-outline"
              ></v-text-field>
            </div>

            <div class="form-group">
              <v-text-field 
                label="Email" 
                variant="outlined" 
                density="comfortable" 
                class="custom-field" 
                hide-details
                prepend-inner-icon="mdi-email-outline"
              ></v-text-field>
            </div>

            <div class="form-group">
              <v-text-field 
                label="Password" 
                type="password" 
                variant="outlined" 
                density="comfortable" 
                class="custom-field" 
                hide-details
                prepend-inner-icon="mdi-lock-outline"
              ></v-text-field>
            </div>

            <div class="form-group">
              <v-text-field 
                label="Confirm Password" 
                type="password" 
                variant="outlined" 
                density="comfortable" 
                class="custom-field" 
                hide-details
                prepend-inner-icon="mdi-lock-check-outline"
              ></v-text-field>
            </div>

            <div class="mb-6">
              <v-checkbox 
                label="I agree to the Terms & Conditions" 
                hide-details 
                density="compact" 
                class="text-muted ma-0 pa-0"
              ></v-checkbox>
            </div>

            <v-btn class="register-btn w-100 py-6 font-weight-bold" size="large">
              CREATE ACCOUNT
            </v-btn>
          </v-form>

          <div class="login-link-section">
             <span class="text-muted text-body-2">Already have an account? </span>
             <v-btn variant="text" to="/login" class="font-weight-bold text-none px-1">Log In</v-btn>
          </div>
        </div>
    </div>

    <!-- Right Side - Branding Panel -->
    <AuthBrandingPanel />
  </div>
</template>

<script setup lang="ts">
import AuthBrandingPanel from '../../components/AuthBrandingPanel.vue'
</script>

<style scoped>
/* Container & Layout */
.register-container {
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
}

/* Left Section - Form Area */
.register-form-section {
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
  .register-form-section {
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
.register-form {
  text-align: left;
  animation: slideInUp 0.6s ease-out 0.2s both;
}

.form-group {
  margin-bottom: 18px;
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

/* Checkbox */
:deep(.v-checkbox .v-selection-control__input) {
  color: var(--color-primary);
}

/* Register Button */
.register-btn {
  background: var(--gradient-ai);
  color: white;
  border-radius: var(--radius-md);
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-md);
  text-transform: none;
  animation: slideInUp 0.6s ease-out 0.4s both;
}

.register-btn:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.register-btn:active {
  transform: translateY(0);
}

/* Login Link Section */
.login-link-section {
  margin-top: 32px;
  animation: slideInUp 0.6s ease-out 0.6s both;
}

:deep(.login-link-section .v-btn) {
  color: var(--color-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

:deep(.login-link-section .v-btn:hover) {
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