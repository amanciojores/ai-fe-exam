
<script setup>
import { computed } from 'vue';
import { ref } from 'vue';
const { inputLabel, modelValue, type, required, id } = defineProps({
  id: String,
  inputLabel: String,
  modelValue: String,
  type: String,
  required: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const internalValue = computed({
  get: () => modelValue,
  set: (value) => emit('update:modelValue', value),
});

let isFocused = ref(false);

const checkIfFilled = (e)=>{
  if(e.target.value) return;
  isFocused.value = false;
}

</script>


<template>
  <div class="border-1 rounded-md border-slate-400 py-3 px-5 relative">
    <label :for="id" :class="['absolute text-base transition-all ease-in-out opacity-80 bg-white px-2 top-3 left-3 pointer-events-none', isFocused ? 'active' : '']">
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

<style scoped>
  .active{
    translate: 0px -25px;
    font-size: 14px;
    opacity: 1;
  }
</style>