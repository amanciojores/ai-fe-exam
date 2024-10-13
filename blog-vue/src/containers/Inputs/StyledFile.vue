<template>
  <div class="w-full mx-auto">
    <div
      class="bg-vue-green bg-opacity-25 border-4 border-dashed rounded-lg p-8 text-center relative"
      :class="{ 'border-slate-700': isDragging, 'border-slate-500': !isDragging }"
      @dragenter.prevent="isDragging = true"
      @dragover.prevent
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <!-- Whole div preview overlay -->
      <div
        v-if="imageDisplay === 'whole' && previewUrl"
        class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center pointer-events-none"
      >
        <img :src="previewUrl" alt="Preview" class="max-w-full max-h-full object-contain" />
      </div>

      <!-- Original content -->
      <div :class="{ 'opacity-0': imageDisplay === 'whole' && previewUrl }">
        <!-- Mini preview or ImageIcon -->
        <div v-if="!previewUrl || imageDisplay === 'whole'">
          <ImageIcon class="w-16 h-16 mx-auto" />
        </div>
        <div v-else-if="imageDisplay === 'mini'">
          <img :src="previewUrl" alt="Preview" class="w-16 h-16 mx-auto object-cover rounded-md" />
        </div>

        <div class="relative inline-block mt-4">
          <button class="bg-vue-green text-white px-4 py-2 rounded-md flex items-center">
            <span class="mr-2">Select Image</span>
            <ChevronDown />
          </button>
          <input
            type="file"
            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="image/*"
            @change="handleFileSelect"
          />
        </div>

        <p class="mt-4 text-gray-600" v-if="!hasFiles">or, drag and drop an image here</p>
        <p class="mt-4 text-gray-600" v-if="hasFiles">{{ fileName }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ChevronDown from '@/assets/Icons/ChevronDown.vue'
import ImageIcon from '@/assets/Icons/ImageIcon.vue'

const { imageDisplay } = defineProps({
  imageDisplay: {
    type: String,
    default: 'mini',
    validator: (value) => ['mini', 'whole'].includes(value)
  }
})

const isDragging = ref(false)
const hasFiles = ref(false)
const fileName = ref('')
const previewUrl = ref('')
const emit = defineEmits(['files-selected'])

const handleDrop = (e) => {
  isDragging.value = false
  const files = e.dataTransfer.files
  if (files.length) {
    handleFiles(files)
  }
}

const handleFileSelect = (e) => {
  const files = e.target.files
  if (files.length) {
    handleFiles(files)
  }
}

const handleFiles = (files) => {
  hasFiles.value = true
  fileName.value = files[0].name
  emit('files-selected', files)

  // Create preview URL
  const file = files[0]
  if (file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      previewUrl.value = e.target.result
    }
    reader.readAsDataURL(file)
  } else {
    previewUrl.value = ''
  }
}
</script>
