<template>
  <div class="ring-1 ring-inset ring-gray-300 rounded-md border-slate-400 py-3 px-5 relative">
    <label
      :for="id"
      :class="[
        'absolute text-sm transition-all ease-in-out opacity-80 bg-white px-2 top-3.5 left-3 pointer-events-none',
        isFocused ? 'active' : internalValue ? 'active' : '',
        type == 'date' ? 'active' : ''
      ]"
    >
      {{ inputLabel }}
    </label>
    <input
      class="text-md outline-none w-full"
      :type="type"
      :required="required"
      :id="id"
      v-model="internalValue"
      @focus="isFocused = true"
      @blur="checkIfFilled($event)"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ref } from 'vue'
const { inputLabel, modelValue, type, required, id } = defineProps({
  id: String,
  inputLabel: String,
  modelValue: String,
  type: String,
  required: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const internalValue = computed({
  get: () => modelValue,
  set: (value) => emit('update:modelValue', value)
})

let isFocused = ref(false)

const checkIfFilled = (e) => {
  if (e.target.value) return
  isFocused.value = false
}
</script>

<style scoped>
.active {
  translate: 0px -25px;
  font-size: 14px;
  opacity: 1;
}
</style>
