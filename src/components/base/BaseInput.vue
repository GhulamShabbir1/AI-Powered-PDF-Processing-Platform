<template>
  <div class="input-wrapper">
    <v-text-field
      v-bind="$attrs"
      :label="label"
      :type="type"
      :prepend-inner-icon="prependIcon"
      :append-inner-icon="appendIcon"
      variant="outlined"
      density="comfortable"
      hide-details="auto"
      class="app-input"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label?: string
  type?: string
  prependIcon?: string
  appendIcon?: string
}>()
</script>

<style scoped>
.input-wrapper {
  width: 100%;
}

/* 🎨 Base Input */
.app-input :deep(.v-field) {
  border-radius: var(--radius-md);
  background: var(--color-surface);
  transition: var(--transition-fast);
}

/* 🟣 Focus Effect (AI Glow) */
.app-input :deep(.v-field--active),
.app-input :deep(.v-field--focused) {
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2),
              0 0 8px rgba(6, 182, 212, 0.2);
}

/* 🔲 Border Color */
.app-input :deep(.v-field__outline) {
  border-color: var(--color-border);
}

/* ✏️ Text */
.app-input :deep(input) {
  color: var(--color-text-primary);
}

/* 🧾 Label */
.app-input :deep(.v-label) {
  color: var(--color-text-secondary);
}

/* ❌ Error State */
.app-input :deep(.v-field--error) {
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
}

/* 🌙 Dark Mode Support */
.dark .app-input :deep(.v-field) {
  background: var(--color-dark-surface);
}
</style>