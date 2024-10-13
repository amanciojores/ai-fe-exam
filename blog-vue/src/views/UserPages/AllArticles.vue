<template>
  <ContentContainer
    display="flex"
    inner-content
    class="py-8 flex-col m-auto ring-1 ring-gray-200 ring-inset rounded-md p-10 md:max-w-[75%] max-w-full"
  >
    <div class="flex flex-col">
      <div>
        <h2 class="text-lg font-medium">All Articles</h2>
      </div>
    </div>
    <div class="w-full overflow-auto">
      <table class="mt-10 border-collapse min-w-full border-spacing-4">
        <thead>
          <tr class="border-b-1 border-b-vue-green">
            <th
              v-for="(header, index) in headers"
              :key="index"
              class="py-2 text-left text-md font-semibold"
            >
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(article, index) in articles">
            <td>
              <img :src="article.image" class="size-16 rounded-md object-cover object-center" />
            </td>
            <td class="font-medium">
              {{ article.title }}
            </td>
            <td>
              {{ article.url }}
            </td>
            <td>{{ article.writer.firstname }} {{ article.writer.lastname }}</td>
            <td>
              {{
                article.editor ? `${article.editor.firstname} ${article.editor.lastname}` : 'N/A'
              }}
            </td>
            <td>
              {{ article.status }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </ContentContainer>
</template>

<script setup>
import ContentContainer from '@/containers/ContentContainer.vue'

const { articles, headers } = defineProps({
  articles: {
    type: Array,
    required: true
  },
  headers: {
    type: Array,
    required: true
  }
})
</script>
<style scoped>
td {
  padding: 10px;
  min-width: 150px;
  font-size: 16px;
  color: #747474;
}
</style>
