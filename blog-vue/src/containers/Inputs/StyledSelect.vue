<template>
  <div class="relative">
    <label class="block text-sm leading-6 absolute z-10 -top-3 left-3 bg-white px-2">{{
      selectType
    }}</label>
    <button
      type="button"
      :class="[
        'relative w-full cursor-default rounded-md',
        'bg-white px-5 py-3 text-left text-gray-900 shadow-sm',
        'ring-1 ring-inset  focus:outline-none focus:ring-2 focus:ring-[#42b883] sm:text-sm sm:leading-6',
        required && isEmpty(selectedItem) ? 'ring-red-400' : 'ring-gray-300'
      ]"
      @click="toggleSelect"
    >
      <span class="flex items-center">
        <div
          v-if="selectType == 'Users'"
          :class="[
            'size-2 mr-3 flex-shrink-0 rounded-full',
            selectedItem.status == 'active' ? ' bg-vue-green' : 'bg-gray-700'
          ]"
        ></div>
        <img
          v-if="selectType == 'Company' || selectType == 'Article'"
          :class="['size-5 mr-3 flex-shrink-0 rounded-full object-cover object-center']"
          :src="
            selectedItem.logo
              ? selectedItem.logo
              : (selectedItem.image ??
                'https://firebasestorage.googleapis.com/v0/b/blogs-vue-d76df.appspot.com/o/logo.svg?alt=media&token=583cec73-d546-4fef-b5aa-1256013bcf17')
          "
        />
        <div class="truncate text-sm flex justify-between w-full pr-6">
          <p>
            {{
              isEmpty(selectedItem)
                ? `Select ${selectType}`
                : (selectedItem.label ?? selectedItem.title)
            }}
          </p>
          <p v-if="selectedItem.type">{{ toTitleCase(selectedItem.type) }}</p>
        </div>
      </span>
      <SelectIcon />
    </button>

    <ul
      class="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
      tabindex="-1"
      role="listbox"
      v-if="openSelect"
    >
      <li
        class="relative cursor-default select-none py-2.5 pl-3 pr-9 text-gray-900 hover:bg-black hover:bg-opacity-5"
        role="option"
        v-for="items in selectItems"
        :key="items.id"
        @click="selectItem(items)"
      >
        <div class="flex items-center">
          <div
            v-if="selectType == 'Users'"
            :class="[
              'size-2 mr-3 flex-shrink-0 rounded-full',
              items.status == 'active' ? ' bg-vue-green' : 'bg-gray-700'
            ]"
          ></div>
          <img
            v-if="selectType == 'Company' || selectType == 'Article'"
            :class="['size-5 mr-3 flex-shrink-0 rounded-full object-cover object-center']"
            :src="items.logo ? items.logo : (items.image ?? '../../assets/logo.svg')"
          />
          <div class="truncate text-sm flex justify-between w-full pr-6">
            <p>{{ items.label ?? items.title }}</p>
            <p v-if="selectType == 'Users'">{{ toTitleCase(items.type) }}</p>
          </div>
        </div>
        <SelectedIcon v-if="items.id == selectedItem.id" />
      </li>
    </ul>
  </div>

  <select hidden v-model="internalValue" :id="id">
    <option selected="true" :value="selectedItem.id">
      {{ selectedItem.label }}
    </option>
  </select>
</template>
<script setup>
import SelectedIcon from '@/assets/Icons/SelectedIcon.vue'
import SelectIcon from '@/assets/Icons/SelectIcon.vue'
import eventBus from '@/EventBus'

import { ref } from 'vue'
import { computed } from 'vue'

const openSelect = ref(false)
const selectedItem = ref({})

const { selectItems, selectType, modelValue, id, required } = defineProps({
  id: String,
  selectItems: {
    type: Array,
    default: [
      { id: 'item1', label: 'Item 1' },
      { id: 'item2', label: 'Item 2' }
    ],
    required: true
  },
  selectType: {
    type: String,
    required: true
  },
  modelValue: String,
  required: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'user-selected', 'reset-value'])

const internalValue = computed({
  get: () => modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isEmpty = (obj) => {
  return Object.keys(obj).length === 0
}

const toggleSelect = () => {
  openSelect.value = !openSelect.value
}

const selectItem = (item) => {
  openSelect.value = false
  selectedItem.value = item
  internalValue.value = item.id

  if (selectType == 'Article') {
    emit('user-selected', item)
    return
  }
  emit('user-selected', item.id)
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}
</script>
