<template>
  <v-dialog
    v-model="isOpen"
    max-width="500"
    transition="dialog-bottom-transition"
    v-bind="$attrs"
  >
    <v-card class="app-dialog">

      <!-- 🟣 Header -->
      <v-card-title class="dialog-header">
        <span>{{ title }}</span>

        <v-btn
          icon="mdi-close"
          variant="text"
          @click="isOpen = false"
        />
      </v-card-title>

      <!-- 📄 Content -->
      <v-card-text class="dialog-content">
        <slot />
      </v-card-text>

      <!-- ⚙️ Actions -->
      <v-card-actions class="dialog-actions">
        <slot name="actions" />
      </v-card-actions>

      <!-- 🔄 Optional Loader -->
      <div v-if="loading" class="dialog-overlay">
        <v-progress-circular
          indeterminate
          size="40"
          class="ai-loader"
        />
      </div>

    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  modelValue: boolean;
  title?: string;
  loading?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>

<style scoped>
/* 🧱 Card */
.app-dialog {
  border-radius: var(--radius-lg);
  overflow: hidden;
  position: relative;
}

/* 🟣 Header */
.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 18px;
  padding: 16px 20px;

  background: linear-gradient(135deg, #4F46E5, #06B6D4);
  color: white;
}

/* 📄 Content */
.dialog-content {
  padding: 20px;
  color: var(--color-text-primary);
}

/* ⚙️ Actions */
.dialog-actions {
  padding: 16px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 🔄 Loading Overlay */
.dialog-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(4px);

  display: flex;
  align-items: center;
  justify-content: center;
}

/* 🌙 Dark Mode */
.dark .dialog-overlay {
  background: rgba(15, 23, 42, 0.6);
}
</style>