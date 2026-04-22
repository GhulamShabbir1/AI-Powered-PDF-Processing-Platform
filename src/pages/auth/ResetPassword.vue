<template>
    <div class="auth-container pa-0 ma-0">
      <div class="auth-form-section d-flex align-center justify-center">
          <div class="form-wrapper">
            <div class="logo-section mb-10">
              <div class="logo-animation">
                <v-img src="../../assets/logo.png" height="50" contain class="mx-auto"></v-img>
              </div>
              <h1 class="text-h4 font-weight-bold primary-text mt-6">
                {{ isSuccess ? 'Password Reset!' : 'Set New Password' }}
              </h1>
              <p class="text-body-2 text-muted mt-2 px-4">
                <span v-if="isSuccess">Your password has been successfully updated. You can now log in securely.</span>
                <span v-else>Create a strong new password for <strong>{{ displayEmail }}</strong>.</span>
              </p>
            </div>
  
            <v-alert v-if="error" type="error" variant="tonal" class="mb-6 rounded-lg text-left" closable @click:close="error = null">
              {{ error }}
            </v-alert>
  
            <v-fade-transition mode="out-in">
              <v-form v-if="!isSuccess" @submit.prevent="handleResetPassword" v-model="isFormValid" class="auth-form">
  
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
                  :disabled="!isFormValid || isLoading"
                >
                  UPDATE PASSWORD
                </v-btn>
              </v-form>
  
              <div v-else class="auth-form text-center">
                <v-icon color="success" size="80" class="mb-6">mdi-check-circle</v-icon>
                <v-btn to="/login" class="auth-btn w-100 py-6 font-weight-bold mt-2" size="large">
                  PROCEED TO LOGIN
                </v-btn>
              </div>
            </v-fade-transition>
            
          </div>
      </div>
      
      <AuthLayout />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import AuthLayout from '../../layouts/AuthLayout.vue';
  import { validatePassword, validateConfirmPassword } from '../../utils/validators';
  
  const route = useRoute();
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const isSuccess = ref(false);
  const isFormValid = ref(false);
  
  const displayEmail = computed(() => route.query.email as string || 'your account');
  
  const form = reactive({
    newPassword: '',
    confirmPassword: ''
  });
  
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
  
  const handleResetPassword = async () => {
    if (!isFormValid.value) return;
    isLoading.value = true;
    error.value = null;
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      isSuccess.value = true;
    } catch (err: any) {
      error.value = err.message || 'Failed to update password.';
    } finally {
      isLoading.value = false;
    }
  };
  </script>
  
  <style scoped>
  /* Paste the exact same <style scoped> from ForgetPassword.vue above, excluding the .tracking-widest specific class */
  .auth-container { min-height: 100vh; width: 100%; overflow: hidden; }
  .auth-form-section { background: var(--color-surface); position: fixed; left: 0; top: 0; width: 50%; height: 100vh; overflow: hidden; z-index: 10; }
  @media (max-width: 960px) { .auth-form-section { position: relative; width: 100%; z-index: auto; } }
  .form-wrapper { width: 100%; max-width: 420px; padding: 48px 24px; text-align: center; }
  .logo-section { animation: slideInDown 0.6s ease-out; }
  .logo-animation { animation: float 3s ease-in-out infinite; }
  @keyframes slideInDown { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
  .primary-text { color: var(--color-text-primary); line-height: 1.3; }
  .text-muted { color: var(--color-text-secondary); }
  .auth-form { text-align: left; animation: slideInUp 0.6s ease-out 0.2s both; }
  .form-group { margin-bottom: 20px; }
  @keyframes slideInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
/* =========================================
   Custom Input Fields
   ========================================= */

/* ⬛ Default State: Bold Black Outline (Native Vuetify) */
:deep(.custom-field .v-field__outline) {
  --v-field-border-color: #000000 !important;
  --v-field-border-opacity: 1 !important;
  --v-field-border-width: 2px !important; /* 👈 Keeps it bold the right way! */
  border-radius: var(--radius-md);
  border: none !important; /* 👈 Kills the broken box cutting through the label */
}

/* Base Text & Placeholder Formatting */
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

:deep(.custom-field .v-field__prepend-inner) {
  color: var(--color-text-secondary);
  margin-right: 8px;
}

/* 🔵 Focused State */
:deep(.custom-field.v-field--focused .v-field__outline) {
  --v-field-border-color: #000000 !important;
  --v-field-border-opacity: 1 !important;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1) !important;
  transition: all var(--transition-fast);
}

/* ❌ Error State: Solid Red Outline & Text */
:deep(.custom-field.v-field--error .v-field__outline) {
  --v-field-border-color: #EF4444 !important;
  --v-field-border-opacity: 1 !important;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.15) !important;
}

:deep(.custom-field.v-field--error .v-label),
:deep(.custom-field.v-field--error .v-icon),
:deep(.custom-field.v-field--error input) {
  color: #EF4444 !important;
}

:deep(.v-input--error .v-messages__message) {
  color: #EF4444 !important;
  font-weight: 500;
}

/* Chrome Autofill Fixes */
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
  --v-field-border-color: #000000 !important;
}
.auth-btn { background: var(--gradient-ai); color: white; border-radius: var(--radius-md); font-weight: 600; letter-spacing: 0.5px; transition: all var(--transition-normal); box-shadow: var(--shadow-md); text-transform: none; display: flex !important; align-items: center !important; justify-content: center !important; }
  :deep(.auth-btn .v-btn__content) { display: flex !important; align-items: center !important; justify-content: center !important; }
  .auth-btn:hover { box-shadow: var(--shadow-lg); transform: translateY(-2px); }
  .auth-btn:active { transform: translateY(0); }
  @media (max-width: 960px) { .form-wrapper { padding: 40px 20px; } }
  @media (max-width: 600px) { .form-wrapper { padding: 32px 16px; max-width: 100%; } .logo-section { margin-bottom: 32px; } }
  </style>  