<template>
  <div class="loader-wrapper">
    <!-- Outer Glow Ring -->
    <v-progress-circular
      :size="12" 
      :width="2"
      indeterminate
      class="loader-glow"
    />

    <!-- Main Loader -->
    <v-progress-circular
      v-bind="$attrs"
      :size="size"
      :width="4"
      indeterminate
      class="loader-main"
    />

    <!-- Optional Text -->
    <p v-if="label" class="loader-text">
      {{ label }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  size?: number;
  label?: string;
}>();
</script>

<style scoped>
.loader-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* 🌈 Main Loader (Gradient) */
.loader-main {
  color: transparent !important;
  background: conic-gradient(
    #4F46E5,
    #06B6D4,
    #8B5CF6,
    #4F46E5
  );
  border-radius: 50%;
  -webkit-mask: radial-gradient(circle, transparent 55%, black 56%);
  mask: radial-gradient(circle, transparent 55%, black 56%);
  animation: spin 1.2s linear infinite;
}

/* ✨ Glow Effect */
.loader-glow {
  position: absolute;
  opacity: 0.4;
  filter: blur(6px);
  color: #06B6D4;
  animation: pulse 1.5s infinite ease-in-out;
}

/* 📝 Text */
.loader-text {
  margin-top: 12px;
  font-size: 14px;
  color: var(--color-text-secondary);
}

/* Animations */
@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0% {
    opacity: 0.2;
    transform: scale(0.95);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.05);
  }
  100% {
    opacity: 0.2;
    transform: scale(0.95);
  }
}
</style>