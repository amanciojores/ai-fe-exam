<template>
  <a
    class="block w-full rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300"
  >
    <div class="relative pb-2/3">
      <slot name="image">
        <img
          class="absolute h-full w-full object-cover"
          src="https://via.placeholder.com/300x200"
          alt="Article image"
        />
      </slot>
    </div>
    <div class="px-6 py-4">
      <div class="font-bold text-xl mb-2">
        <slot name="title">Article Title</slot>
      </div>
      <p class="text-gray-700 text-sm mb-2 flex gap-5">
        Writer: <slot name="writer">John Doe</slot>
      </p>
      <p class="text-gray-700 text-sm mb-2 flex gap-5">Editor: <slot name="editor">N/A</slot></p>
      <p class="text-gray-700 text-sm mb-2">
        <slot name="date"> Jan 18 1989 </slot>
      </p>
      <p class="text-gray-500 text-sm">
        <slot name="url"> https://sample.com </slot>
      </p>
    </div>
  </a>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  url: {
    type: String,
    default: '#'
  }
})
</script>
