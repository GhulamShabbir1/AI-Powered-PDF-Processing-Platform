<template>
  <v-btn
    :variant="variant"
    :size="size"
    :loading="loading"
    :disabled="disabled"
    :block="block"
    :type="type"
    :class="['app-btn', variantClass, customClass]"
    @click="$emit('click', $event)"
  >
    <!-- 🔄 Loader -->
    <template #loader>
      <v-progress-circular
        indeterminate
        size="18"
        width="2"
        class="btn-loader"
      />
    </template>

    <slot />
  </v-btn>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  variant?: "text" | "flat" | "outlined" | "tonal";
  color?: string;
  size?: "x-small" | "small" | "default" | "large" | "x-large";
  loading?: boolean;
  disabled?: boolean;
  block?: boolean;
  type?: "button" | "submit" | "reset";
  customClass?: string;
}>();

defineEmits<{
  click: [event: MouseEvent];
}>();

/* 🎨 Smart Variant Styling */
const variantClass = computed(() => {
  if (props.variant === "outlined") return "btn-outlined";
  if (props.variant === "text") return "btn-text";
  return "btn-primary"; // default
});
</script>

<style scoped>
/* 🔘 Base Button */
.app-btn {
  border-radius: var(--radius-md);
  text-transform: none;
  font-weight: 500;
  transition: all var(--transition-fast);
}

/* 🟣 Primary Gradient Button */
.btn-primary {
  background: linear-gradient(135deg, #4F46E5, #06B6D4);
  color: white;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

/* ✨ Hover Effect */
.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(6, 182, 212, 0.35);
}

/* 🔽 Active Click */
.btn-primary:active {
  transform: scale(0.98);
}

/* 🔲 Outlined */
.btn-outlined {
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
}

/* 📄 Text Button */
.btn-text {
  color: var(--color-primary);
}

/* 🔄 Loader */
.btn-loader {
  color: white;
}

/* 🚫 Disabled */
.app-btn.v-btn--disabled {
  opacity: 0.6;
  box-shadow: none;
}

/* 🌙 Dark Mode */
.dark .btn-outlined {
  border-color: var(--color-dark-card);
  color: var(--color-dark-text);
}
</style>