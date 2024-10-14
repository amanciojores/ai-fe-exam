<template>
  <ContentContainer display="grid">
    <div class="flex justify-center items-center flex-col">
      <h1 class="text-3xl mb-5">Welcome to Vue Blog</h1>
      <form @submit.prevent="login" class="flex flex-col gap-4">
        <StyledInput v-model="email" inputLabel="Email" type="email" required />
        <StyledInput v-model="password" inputLabel="Password" type="password" required />
        <button
          class="text-lg px-5 py-2 rounded-md transition ease-in-out bg-[#42b883] text-white border border-[#42b883] hover:bg-transparent hover:text-slate-700"
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  </ContentContainer>
</template>

<script setup>
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

import ContentContainer from '@/containers/ContentContainer.vue'
import StyledInput from '@/containers/Inputs/StyledInput.vue'

import { routeUser } from '@/scripts/login/loginRouter'

import { app } from '@/firebase'
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'
import eventBus from '@/EventBus'

const email = ref('')
const password = ref('')
const store = useStore()
const router = useRouter()

const login = async () => {
  const auth = getAuth()
  try {
    const userCreds = await signInWithEmailAndPassword(auth, email.value, password.value)
    const token = await userCreds.user.getIdToken()

    const config = {
      headers: { Authorization: 'Bearer ' + token },
      withCredentials: true
    }

    store.dispatch('postUsers/loginUser', { config }).then((response) => {
      Cookies.set('__userType__', response.type)
      Cookies.set('__user__', response.firstname)
      routeUser(response.type, router)
    })
  } catch (e) {
    const code = e.code
    if (code == 'auth/invalid-credential') {
      eventBus.emit('show-snackbar', {
        msg: 'Invalid Credentials',
        status: 'failed'
      })
    }
  }
}
</script>
