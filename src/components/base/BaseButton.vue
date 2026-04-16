<template>
  <v-btn v-bind="$attrs">{{ text }}</v-btn>
</template>

<script setup lang="ts">
defineProps<{
  text?: string
}>()
</script>
