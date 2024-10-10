<template>
  <ContentContainer>
  <div class=" flex justify-center items-center flex-col">
    <h1 class=" text-3xl mb-5">Welcome to Vue Blog</h1>
    <form @submit.prevent="login" class=" flex flex-col gap-4">
      <StyledInput v-model="email" inputLabel="Email" type="email" required />
      <StyledInput v-model="password" inputLabel="Password" type="password" required />
      <button class="text-lg px-5 py-2 rounded-md transition ease-in-out bg-[#42b883] text-white border border-[#42b883] hover:bg-transparent hover:text-slate-700" type="submit">Login</button>
    </form>
    {{ users }}
  </div>
  </ContentContainer>

</template>

<script setup>
import ContentContainer from '@/containers/ContentContainer.vue';
import StyledInput from '@/containers/StyledInput.vue';
import { ref } from 'vue';
import { computed } from 'vue';
import { useStore } from 'vuex';

const email = ref('');
const password = ref('');
const store = useStore();

const login = ()=>{
  store.dispatch("getUsers/fetchItems");
}

const users = computed(()=>store.getters['getUsers/getUsers']);
</script>
