<template>
  <div
    :class="[
      ' transition-all absolute p-4 bottom-0 left-0 w-full flex items-center justify-center z-50',
      visible ? 'translate-y-0' : 'translate-y-full '
    ]"
  >
    <div
      :class="[
        'px-6 py-4 rounded-md shadow-slate-400 shadow-md flex justify-between gap-10 items-center',
        status === 'success' ? 'bg-vue-green' : 'bg-red-500'
      ]"
    >
      <p class="text-white">{{ message }}</p>
    </div>
  </div>
</template>
<script setup>
const { message, visible, status } = defineProps({
  message: {
    type: String,
    defualt: 'Hi How Are yoU!'
  },
  visible: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: 'success'
  }
})
</script>
