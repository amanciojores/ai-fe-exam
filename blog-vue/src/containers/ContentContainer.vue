<template>
  <div :class="[' max-w-fit flex', innerContent ? '' : 'mx-auto h-full', customClass]">
    <slot></slot>
  </div>
</template>

<script setup>
const {innerContent, customClass} = defineProps({
  innerContent: {
    type: Boolean,
    default: false,
  },
  customClass: String
})
</script>