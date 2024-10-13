<template>
  <div class="h-full flex flex-col gap-5 items-center justify-center">
    <h2 class="text-3xl">{{ type }} Company</h2>
    <form class="w-full grid grid-cols-1 gap-4 xl:w-3/4 md:w-3/4" @submit.prevent="addCompany">
      <StyledSelect
        v-if="type == 'Edit'"
        v-model="editCompany"
        select-type="Company"
        id="companyData"
        :select-items="selectCompanies"
        :required="required"
        :key="resetKey"
      />
      <h3 v-if="type == 'Edit'">Update Info</h3>
      <StyledFile @files-selected="handleFiles" />
      <StyledInput
        v-model="companyName"
        inputLabel="Company Name"
        :required="type == 'Add' ? required : false"
        type="text"
      />
      <StyledSelect
        select-type="Status"
        v-model="companyStatus"
        :select-items="companyStatusOption"
        id="status"
        :required="type == 'Add' ? required : false"
        :key="resetKey"
      />
      <StyledButton buttonType="submit" :buttonText="`${type} Company`" :disabled="buttonDisable" />
    </form>
  </div>
</template>
<script setup>
import StyledInput from '@/containers/Inputs/StyledInput.vue'
import StyledSelect from '@/containers/Inputs/StyledSelect.vue'
import StyledButton from '@/containers/Inputs/StyledButton.vue'

import { useStore } from 'vuex'
import { ref, computed, onMounted } from 'vue'

import eventBus from '@/EventBus'
import StyledFile from '@/containers/Inputs/StyledFile.vue'

const store = useStore()

const editCompany = ref('')
const companyName = ref('')
const buttonDisable = ref(false)
const required = ref(false)
const companyLogo = ref({})
const companyStatus = ref('')
const resetKey = ref(0)

const allCompanies = ref([])
const selectCompanies = computed(() => {
  return allCompanies.value.map((companies) => ({
    id: companies.id,
    label: companies.name,
    status: companies.status,
    logo: companies.logo
  }))
})

const emit = defineEmits(['on-success'])

const companyStatusOption = [
  { id: 'active', label: 'Active' },
  { id: 'inactive', label: 'Inactive' }
]

const { type } = defineProps({
  type: {
    type: String,
    required: true
  }
})

onMounted(() => {
  if (type === 'Edit') {
    store.dispatch('getCompany/getCompany').then((companies) => (allCompanies.value = companies))
  }
})

const resetForm = () => {
  editCompany.value = ''
  companyName.value = ''
  buttonDisable.value = false
  required.value = false
  companyLogo.value = {}
  companyStatus.value = ''
  resetKey.value++
  emit('on-success', true)
}

const handleFiles = (files) => {
  companyLogo.value = files
}

const handleResponse = (msg, type) => {
  eventBus.emit('show-snackbar', {
    msg: msg,
    status: type
  })
  buttonDisable.value = false
}

const addCompany = async () => {
  buttonDisable.value = true
  const checkType = (condition, type) => {
    if (type == 'Add') {
      return condition
    }
    return true
  }

  if (checkType(companyStatus.value, type)) {
    const formData = new FormData()

    const imageInfo = {
      name: companyName.value,
      status: companyStatus.value
    }

    Object.entries(imageInfo).forEach(([key, value]) => {
      formData.append(key, value)
    })

    formData.append('logo', companyLogo.value[0])

    if (type === 'Add') {
      try {
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        const response = await store.dispatch('postCompany/createCompany', { formData, config })

        if (response == 'Success') {
          handleResponse('Added new Company', 'success')
          resetForm()
        } else if (response == 'No Files') {
          handleResponse('No File Uploaded', 'failed')
        } else {
          handleResponse(response, 'failed')
        }
      } catch (err) {
        eventBus.emit('show-snackbar', {
          msg: 'Error adding new company' + err,
          status: 'failed'
        })
      }
    } else {
      if (!editCompany.value) {
        required.value = true
        buttonDisable.value = false
        return
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        id: editCompany.value
      }

      const response = await store.dispatch('postCompany/updateCompany', { formData, config })

      if (response == 'Success') {
        handleResponse(response, 'success')
        store
          .dispatch('getCompany/getCompany')
          .then((companies) => (allCompanies.value = companies))
      } else {
        handleResponse('Failed to update company', 'failed')
      }
      resetForm()
    }
  } else {
    required.value = true
  }
}
</script>
