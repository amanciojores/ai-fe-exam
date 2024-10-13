<template>
  <div class="h-full relative" :key="resetKey">
    <ContentContainer class="py-5 flex-col">
      <nav class="mb-4 absolute top-0 w-full">
        <RouterLink :to="{ name: 'articles', params: { forEdit, published } }" class="mr-2">
          Go to Articles Page
        </RouterLink>
        <RouterLink :to="{ name: 'all-articles', params: { articles, tableHeaders } }" class="mr-2">
          Go to All Articles
        </RouterLink>
      </nav>
      <RouterView
        :key="resetKey"
        v-slot="{ Component, route }"
        :for-edit="forEdit"
        :published="published"
        :headers="tableHeaders"
        :articles="articles"
      >
        <component :is="Component" :for-edit="forEdit" :published="published" />
      </RouterView>
    </ContentContainer>
    <ActionButton @on-success="onSuccess" />
  </div>
</template>
<script setup>
import ActionButton from '@/components/Forms/ActionButton.vue'
import router from '@/router'

import { ref, computed, onMounted } from 'vue'
import store from '@/stores'
import ContentContainer from '@/containers/ContentContainer.vue'
const resetKey = ref(0)

const tableHeaders = ref(['Image', 'Title', 'Link', 'Writer', 'Editor', 'Status'])

const onSuccess = async (bool) => {
  if (bool) {
    const response = await store.dispatch('getArticle/fetchArticles')
    articles.value = response
    resetKey.value++
  }
}

const articles = ref([])
const forEdit = computed(() => articles.value.filter((data) => data.status == 'For Edit'))
const published = computed(() => articles.value.filter((data) => data.status == 'Published'))

onMounted(async () => {
  const response = await store.dispatch('getArticle/fetchArticles')
  articles.value = response
  router.push({ name: 'articles' })
})
</script>
