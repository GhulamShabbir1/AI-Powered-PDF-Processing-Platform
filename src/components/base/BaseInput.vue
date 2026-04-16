<template>
  <v-text-field v-bind="$attrs" />
</template>

<script setup lang="ts">
defineProps<{
  label?: string
}>()
</script>
