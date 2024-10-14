<template>
  <div class="absolute bottom-4 right-4 z-30">
    <button
      @click="toggleActions"
      class="bg-[#42b883] transition-all hover:bg-blue-600 text-white rounded-full size-11 p-2 flex items-center justify-center focus:outline-none duration-300"
      :class="{ 'rotate-180': showActions }"
    >
      <PlusIcon />
    </button>
    <div
      v-if="showActions"
      class="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg transition-opacity duration-300 w-fit"
      :class="{ 'opacity-100': showActions, 'opacity-0': !showActions }"
    >
      <div v-for="action in actions" :key="action.id">
        <div
          v-if="action.userType.some((type) => type == userType)"
          class="relative group"
          @mouseenter="setActiveAction(action.id)"
          @mouseleave="setActiveAction(null)"
        >
          <div
            class="block w-full text-left px-7 py-2 hover:bg-gray-100 rounded transition-colors duration-200 cursor-default"
          >
            {{ action.id == 'user' ? user : action.label }}
          </div>
          <div
            v-if="activeAction === action.id"
            class="absolute right-full top-0 bg-white rounded-lg shadow-lg"
          >
            <div v-for="subitem in action.subitems" :key="subitem.id">
              <button
                v-if="subitem.userType.some((type) => type == userType)"
                @click="action.id == 'user' ? userLogout() : formPopup(action.id, subitem.label)"
                class="block w-full text-left px-5 py-2 hover:bg-gray-100 rounded transition-colors duration-200 whitespace-nowrap"
              >
                {{ subitem.label }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <div v-if="showPopup" class="fixed inset-0 flex items-center justify-center z-40 p-5">
      <div
        @click="resetValues"
        class="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40"
      ></div>
      <div
        class="bg-white z-50 p-7 rounded-lg shadow-xl w-full max-h-[75%] overflow-x-auto py-28 max-w-screen-sm"
      >
        <span v-if="actionActive.addUser.status">
          <AddUser @on-success="onSuccess" :type="actionActive.addUser.type" />
        </span>
        <span v-if="actionActive.company.status">
          <AddCompany @on-success="onSuccess" :type="actionActive.company.type" />
        </span>
        <span v-if="actionActive.article.status">
          <AddArticle
            @on-success="onSuccess"
            :type="actionActive.article.type"
            :user-type="userType"
          />
        </span>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import PlusIcon from '@/assets/Icons/PlusIcon.vue'
import AddUser from './AddUser.vue'
import AddCompany from './AddCompany.vue'
import Cookies from 'js-cookie'
import AddArticle from './AddArticle.vue'

import store from '@/stores'
import router from '@/router'
import eventBus from '@/EventBus'

const showActions = ref(false)
const activeAction = ref(null)
const showPopup = ref(false)
const userType = ref('')
const user = ref('')

const emit = defineEmits(['on-success'])

const actions = [
  {
    id: 'addUser',
    label: 'Users',
    userType: ['editor'],
    subitems: [
      { id: 'add', label: 'Add', userType: ['editor'] },
      { id: 'edit', label: 'Edit', userType: ['editor'] }
    ]
  },
  {
    id: 'company',
    label: 'Company',
    userType: ['editor'],
    subitems: [
      { id: 'add', label: 'Add', userType: ['editor'] },
      { id: 'edit', label: 'Edit', userType: ['editor'] }
    ]
  },
  {
    id: 'article',
    label: 'Article',
    userType: ['writer', 'editor'],
    subitems: [
      { id: 'add', label: 'Add', userType: ['writer'] },
      { id: 'edit', label: 'Edit', userType: ['editor', 'writer'] },
      { id: 'publish', label: 'Publish', userType: ['editor'] }
    ]
  },
  {
    id: 'user',
    label: user.value,
    userType: ['writer', 'editor'],
    subitems: [{ id: 'logout', label: 'Logout', userType: ['writer', 'editor'] }]
  }
]

const actionActive = {
  addUser: {
    type: '',
    status: false
  },
  company: {
    type: '',
    status: false
  },
  article: {
    type: '',
    status: false
  },
  user: {
    type: '',
    status: false
  }
}

const toggleActions = () => {
  showActions.value = !showActions.value
  userType.value = Cookies.get('__userType__') || null
  user.value = Cookies.get('__user__') || null
}

const setActiveAction = (actionId) => {
  activeAction.value = actionId
}

const userLogout = () => {
  store.dispatch('getUsers/userLogout').then((res) => {
    if (res == 'Success') {
      router.push({ name: 'login' })
      eventBus.emit('show-snackbar', {
        msg: 'Logout Successful!',
        status: 'success'
      })
    }
  })
}

const handlePopup = (action, status, type) => {
  showPopup.value = true
  actionActive[action].status = status
  actionActive[action].type = type
  showActions.value = false
}

const formPopup = (actionId, subItemLabel) => {
  if (actionId === 'addUser' && subItemLabel == 'Add') {
    handlePopup(actionId, true, subItemLabel)
  }
  if (actionId === 'addUser' && subItemLabel == 'Edit') {
    handlePopup(actionId, true, subItemLabel)
  }
  if (actionId === 'company' && subItemLabel == 'Add') {
    handlePopup(actionId, true, subItemLabel)
  }
  if (actionId === 'company' && subItemLabel == 'Edit') {
    handlePopup(actionId, true, subItemLabel)
  }
  if (actionId === 'article' && subItemLabel == 'Add') {
    handlePopup(actionId, true, subItemLabel)
  }
  if (actionId === 'article' && subItemLabel == 'Edit') {
    handlePopup(actionId, true, subItemLabel)
  }
  if (actionId === 'article' && subItemLabel == 'Publish') {
    handlePopup(actionId, true, subItemLabel)
  }
}
const closePopup = () => {
  showPopup.value = false
}

const onSuccess = (bool) => {
  emit('on-success', true)
}

const resetValues = () => {
  closePopup()
  Object.entries(actionActive).forEach(([key, value]) => {
    actionActive[key].status = false
  })
}
</script>
