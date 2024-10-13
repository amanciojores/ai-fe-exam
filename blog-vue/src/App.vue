<template>
  <RouterView />
  <SnackBar :message="message" :visible="snackbarVisible" :status="snackbarStatus" />
</template>
<script setup>
import SnackBar from './components/Snippets/SnackBar.vue'

import { RouterView } from 'vue-router'
import { onMounted, ref } from 'vue'

import eventBus from './EventBus'

const message = ref('')
const snackbarVisible = ref(false)
const snackbarStatus = ref('success')

const showSnackbar = ({ msg, status }) => {
  message.value = msg
  snackbarStatus.value = status
  snackbarVisible.value = true
  setTimeout(() => {
    snackbarVisible.value = false
  }, 3000)
}

const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

onMounted(() => {
  eventBus.on('show-snackbar', showSnackbar)
  eventBus.on('toTitleCase', toTitleCase)
})
</script>
