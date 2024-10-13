<template>
  <div :class="[display == 'flex' ? 'flex' : display, innerContent ? '' : 'w-full mx-auto h-full']">
    <slot></slot>
  </div>
</template>

<script setup>
const { innerContent, display } = defineProps({
  innerContent: {
    type: Boolean,
    default: false
  },
  display: {
    type: String,
    default: 'flex'
  }
})
</script>
