<template>
  <div class="h-full flex flex-col gap-5 items-center justify-center">
    <h2 class="text-3xl">{{ type }} Users</h2>
    <form class="w-full grid grid-cols-1 gap-4 xl:w-3/4 md:w-3/4" @submit.prevent="addUsers">
      <StyledSelect
        v-if="type == 'Edit'"
        v-model="editUser"
        :select-items="selectUsers"
        select-type="Users"
        id="userData"
        @user-selected="handleSelectChange"
        :required="required"
        :key="resetKey"
      />
      <h3 v-if="type == 'Edit'">Update Info</h3>
      <StyledInput
        v-model="firstName"
        inputLabel="First Name"
        type="text"
        :required="type == 'Add' ? required : false"
      />
      <StyledInput
        v-model="lastName"
        inputLabel="Last Name"
        type="text"
        :required="type == 'Add' ? required : false"
      />
      <StyledSelect
        select-type="Type"
        v-model="userType"
        :select-items="userTypeOption"
        id="userType"
        :required="type == 'Add' ? required : false"
        :key="resetKey"
      />
      <StyledSelect
        select-type="Status"
        v-model="userStatus"
        :select-items="userStatusOption"
        id="userStatus"
        :required="type == 'Add' ? required : false"
        :key="resetKey"
      />
      <StyledButton buttonType="submit" :buttonText="`${type} User`" :disabled="buttonDisable" />
    </form>
  </div>
</template>
<script setup>
import StyledInput from '@/containers/Inputs/StyledInput.vue'
import StyledButton from '@/containers/Inputs/StyledButton.vue'
import StyledSelect from '@/containers/Inputs/StyledSelect.vue'

import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

import eventBus from '@/EventBus'

const firstName = ref('')
const lastName = ref('')
const userType = ref('')
const userStatus = ref('')
const buttonDisable = ref(false)
const required = ref(false)
const editUser = ref('')
const resetKey = ref(0)

const auth = getAuth()
const store = useStore()

const allUsers = ref([])
const selectUsers = computed(() => {
  return allUsers.value.map((users) => ({
    id: users.id,
    label: `${users.firstname} ${users.lastname}`,
    status: users.status,
    type: users.type
  }))
})

const { type } = defineProps({
  type: {
    type: String,
    required: true
  }
})

const handleSelectChange = (data) => {
  editUser.value = data
}

onMounted(() => {
  if (type === 'Edit') {
    store.dispatch('getUsers/getUsers').then((users) => (allUsers.value = users))
  }
})

const emit = defineEmits(['on-success'])

const userStatusOption = [
  { id: 'active', label: 'Active' },
  { id: 'inactive', label: 'Inactive' }
]

const userTypeOption = [
  { id: 'writer', label: 'Writer' },
  { id: 'editor', label: 'Editor' }
]

const resetForm = () => {
  firstName.value = ''
  lastName.value = ''
  userType.value = ''
  userStatus.value = ''
  buttonDisable.value = false
  required.value = false
  editUser.value = ''
  resetKey.value++
  emit('on-success', true)
}

const addUsers = async () => {
  buttonDisable.value = true

  const { email, password } = await store.dispatch('getUsers/createUser', {
    type: userType.value,
    lastName: lastName.value
  })

  const body = {
    firstname: firstName.value,
    lastname: lastName.value,
    type: userType.value,
    status: userStatus.value
  }

  const checkType = (condition, type) => {
    if (type == 'Add') {
      return condition
    }
    return true
  }

  if (checkType(body.type != '' && body.status != '', type)) {
    if (type == 'Add') {
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCreds) => {
          buttonDisable.value = true
          const config = {
            id: userCreds.user.uid
          }
          const newUser = await store.dispatch('postUsers/createUser', { body, config })
          if (newUser == 'Success') {
            eventBus.emit('show-snackbar', {
              msg: 'Added New User!',
              status: 'success'
            })
            resetForm()
          }
        })
        .catch((error) => {
          const errorCode = error.code
          if (errorCode === 'auth/email-already-in-use') {
            eventBus.emit('show-snackbar', {
              msg: 'Email already in use, please use a different one',
              status: 'failed'
            })
          } else {
            eventBus.emit('show-snackbar', {
              msg: 'Failed registering user',
              status: 'failed'
            })
          }
        })
    } else {
      if (!editUser.value) {
        required.value = true
        return
      }
      const config = {
        id: editUser.value
      }
      const response = await store.dispatch('postUsers/updateUser', { body, config })
      if (response == 'Success') {
        eventBus.emit('show-snackbar', {
          msg: 'User Updated',
          status: 'success'
        })
        await store.dispatch('getUsers/getUsers').then((users) => (allUsers.value = users))
        resetForm()
      }
    }
  } else {
    required.value = true
  }
}
</script>
