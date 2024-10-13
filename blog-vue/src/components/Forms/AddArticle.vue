<template>
  <div class="h-full flex flex-col gap-5 items-center justify-center">
    <h2 class="text-3xl">{{ type }} Article</h2>

    <form class="w-full grid grid-cols-1 gap-4 xl:w-3/4 md:w-3/4" @submit.prevent="addArticle">
      <StyledSelect
        v-if="type == 'Edit' || type == 'Publish'"
        v-model="editArticle"
        select-type="Article"
        id="companyData"
        :select-items="userType == 'writer' ? forEdit : type == 'Edit' ? allArticles : toPublish"
        :required="type == 'Add' ? required : false"
        :key="resetKey"
        @user-selected="handleSelected"
      />
      <h3 v-if="type == 'Edit' || type == 'Publish'">Update Info</h3>
      <StyledSelect
        v-model="selectedCompany"
        select-type="Company"
        id="companyData"
        :select-items="company"
        :key="resetKey"
        :required="type == 'Add' ? required : false"
      />
      <StyledFile @files-selected="handleFiles" image-display="whole" :key="resetKey" />
      <StyledInput
        v-model="title"
        inputLabel="Title"
        type="text"
        :required="type == 'Add' ? required : false"
      />
      <StyledInput
        v-model="url"
        inputLabel="Link"
        type="text"
        :required="type == 'Add' ? required : false"
      />
      <StyledInput
        v-model="date"
        inputLabel="Date"
        type="date"
        :required="type == 'Add' ? required : false"
      />
      <StyledRichtext v-model="content" label="Article Content" />
      <StyledButton button-type="submit" :button-text="`${type} Article`" />
    </form>
  </div>
</template>

<script setup>
import StyledFile from '@/containers/Inputs/StyledFile.vue'
import StyledInput from '@/containers/Inputs/StyledInput.vue'
import StyledRichtext from '@/containers/Inputs/StyledRichtext.vue'
import StyledSelect from '@/containers/Inputs/StyledSelect.vue'
import eventBus from '@/EventBus'
import store from '@/stores'
import StyledButton from '@/containers/Inputs/StyledButton.vue'

import { ref, onMounted, computed } from 'vue'

const { type, userType } = defineProps({
  type: String,
  userType: String
})

onMounted(() => {
  store.dispatch('getCompany/getCompany').then((companies) => (allCompanies.value = companies))
  store.dispatch('getArticle/fetchArticles').then((articles) => {
    allArticles.value = articles
  })
})

const content = ref('')
const title = ref('')
const date = ref('')
const url = ref('')
const selectedCompany = ref('')
const allCompanies = ref([])
const required = ref(false)
const image = ref({})
const resetKey = ref(0)
const editArticle = ref('')
const allArticles = ref([[]])
const articleStatus = ref('')
const articleId = ref()

const forEdit = computed(() => {
  return allArticles.value.filter((data) => data.status == 'For Edit')
})
const toPublish = computed(() => {
  return allArticles.value.filter((data) => data.status == 'For Edit')
})

const company = computed(() => {
  return allCompanies.value.map((companies) => ({
    id: companies.id,
    label: companies.name,
    status: companies.status,
    logo: companies.logo
  }))
})

const handleSelected = (article) => {
  content.value = article.content
  title.value = article.title
  date.value = article.date
  url.value = article.url
  selectedCompany.value = article.company.id
  required.value = true
  image.value = article.image
  articleId.value = article.id
  articleStatus.value = article.status
}

const emit = defineEmits(['on-success'])

const resetForm = () => {
  content.value = ''
  title.value = ''
  date.value = ''
  url.value = ''
  selectedCompany.value = ''
  required.value = false
  image.value = {}
  resetKey.value++
}

const checkType = (condition, type) => {
  if (type == 'Add') {
    return condition
  }
  return true
}

const handleFiles = (file) => {
  image.value = file
}

const isValidURL = (input) => {
  try {
    new URL(input)
    return true
  } catch (error) {
    return false
  }
}

function createFormData(body) {
  const formData = new FormData()

  Object.entries(body).forEach(([key, value]) => {
    if (key === 'image') {
      return
    } else {
      formData.append(key, value)
    }
  })

  return formData
}

const addArticle = async () => {
  const body = {
    company: selectedCompany.value,
    image: image.value,
    title: title.value,
    url: url.value,
    date: date.value,
    content: content.value,
    status: articleStatus.value == 'Published' ? 'Published' : 'For Edit',
    writer: 'initial',
    editor: 'initial'
  }

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    withCredentials: true
  }

  const toTitleCase = (str) => {
    return str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  const inputRequired = Object.entries(body).reduce((acc, [key, value]) => {
    if (value === '' || JSON.stringify(value) === '{}') {
      acc.push(toTitleCase(key))
    }
    return acc
  }, [])

  if (inputRequired.length && type == 'Add') {
    eventBus.emit('show-snackbar', {
      msg: `This input is required: ${inputRequired.join(', ')}`,
      status: 'failed'
    })
    return
  }

  if ((type == 'Edit' || type == 'Publish') && !editArticle.value) {
    eventBus.emit('show-snackbar', {
      msg: `Please select Article to ${type}`,
      status: 'failed'
    })

    return
  }

  if (!isValidURL(body.url) && (type == 'Add' || type == 'Edit' || type == 'Publish')) {
    eventBus.emit('show-snackbar', {
      msg: `Link Invalid: ${body.url}`,
      status: 'failed'
    })
    return
  }

  const formData = createFormData(body)
  formData.append('image', image.value[0])

  if (type == 'Add') {
    const response = await store.dispatch('postArticle/addArticle', { formData, config })
    if (response == 'Success') {
      eventBus.emit('show-snackbar', {
        msg: 'Article Successfully Added',
        status: 'success'
      })
      resetForm()
      emit('on-success', true)
    }
  } else {
    const id = articleId.value
    if (type == 'Publish') {
      formData.set('status', 'Published')
    }
    const response = await store.dispatch('postArticle/updateArticle', { formData, config, id })
    if (response == 'Success') {
      eventBus.emit('show-snackbar', {
        msg: `Article Successfully Edited ${type == 'Edit' ? 'Edited!' : 'Published'}`,
        status: 'success'
      })
      resetForm()
      emit('on-success', true)
    }
  }
}
</script>
