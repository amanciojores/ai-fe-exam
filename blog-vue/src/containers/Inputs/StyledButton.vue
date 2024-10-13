<template>
  <button
    class="text-lg disabled:bg-[#1da96a] px-5 py-2 rounded-md transition ease-in-out bg-vue-green text-white border border-[#42b883] hover:-translate-y-1 hover:shadow-sm hover:shadow-slate-400 hover:bg-white hover:text-slate-700"
    :type="buttonType"
    :disabled="disabled"
  >
    {{ buttonText }}
  </button>
</template>
<script setup>
const { buttonType, buttonText, disabled } = defineProps({
  buttonType: {
    type: String,
    defaut: 'text'
  },
  buttonText: {
    type: String,
    default: 'Button Text'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>
