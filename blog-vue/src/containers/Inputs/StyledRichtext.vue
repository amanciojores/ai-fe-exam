<template>
  <div class="relative">
    <p class="absolute text-sm p-1 rounded-sm px-2 -translate-y-3 translate-x-3 z-20 bg-white">
      {{ label }}
    </p>
    <Editor
      v-model="internalValue"
      api-key="09ltx9areijft2ic8mqcl3g4map10yswen75ne4hdu1tgd7h"
      :init="{
        toolbar_mode: 'sliding',
        plugins: [
          // Core editing features
          'anchor',
          'autolink',
          'charmap',
          'codesample',
          'emoticons',
          'link',
          'lists',
          'searchreplace',
          'table',
          'visualblocks',
          'wordcount',
          'checklist',
          'mediaembed',
          'casechange',
          'export',
          'formatpainter',
          'pageembed',
          'a11ychecker',
          'tinymcespellchecker',
          'permanentpen',
          'powerpaste',
          'advtable',
          'advcode',
          'editimage',
          'advtemplate',
          'mentions',
          'tableofcontents',
          'footnotes',
          'autocorrect',
          'typography',
          'inlinecss',
          'markdown'
        ],
        toolbar:
          'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat'
      }"
    />
  </div>
</template>

<script setup>
import Editor from '@tinymce/tinymce-vue'
import { ref, computed } from 'vue'

const { label, modelValue } = defineProps({
  label: {
    type: String,
    default: 'Rich Text Editor'
  },
  modelValue: String
})

const emit = defineEmits(['update:modelValue'])

const internalValue = computed({
  get: () => modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>
