<template>
  <ContentContainer display="flex" class="py-8 flex-col max-w-screen-md m-auto">
    <ContentContainer inner-content class="gap-3 p-5 shadow-slate-200 shadow-md hidden md:flex">
      <ContentContainer>
        <h3 class="text-lg">For Publish</h3>
      </ContentContainer>
      <!-- Published Header -->
      <ContentContainer>
        <h3 class="text-lg">Published</h3>
      </ContentContainer>
    </ContentContainer>
    <!-- For Publish Header -->

    <ContentContainer
      display="grid"
      class="grid-cols-1 md:grid-cols-2 py-5 w-full max-h-full overflow-auto scroll gap-3"
    >
      <p class="md:hidden text-lg text-center font-medium">For Publish</p>
      <ContentContainer display="flex" class="gap-3 flex-col" inner-content>
        <span v-for="content in forEdit">
          <ArticleCard class="p-4">
            <template #image>
              <div
                class="rounded-md shadow-slate-600 shadow-md w-full relative md:h-40 h-72 overflow-hidden"
              >
                <img
                  :src="content.image"
                  class="absolute top-0 left-0 w-full h-full object-cover object-center"
                />
              </div>
            </template>
            <template #title>
              <h2 class="text-left text-lg">{{ content.title }}</h2>
            </template>
            <template #writer>
              <ContentContainer inner-content class="items-center">
                <div
                  :class="[
                    'size-2 mr-3 flex-shrink-0 rounded-full',
                    content.writer.status == 'active' ? ' bg-vue-green' : 'bg-gray-700'
                  ]"
                ></div>
                {{ content.writer.firstname }} {{ content.writer.lastname }}
              </ContentContainer>
            </template>
            <template #date>
              {{ formatDate(content.date) }}
            </template>
            <template #url>
              {{ content.url }}
            </template>
          </ArticleCard>
        </span>
      </ContentContainer>
      <p class="md:hidden text-lg text-center font-medium">Published</p>
      <ContentContainer display="flex" class="gap-3 flex-col" inner-content>
        <span v-for="content in published">
          <ArticleCard class="p-4">
            <template #image>
              <div
                class="rounded-md shadow-slate-600 shadow-md w-full relative md:h-40 h-72 overflow-hidden"
              >
                <img
                  :src="content.image"
                  class="absolute top-0 left-0 w-full h-full object-cover object-center"
                />
              </div>
            </template>
            <template #title>
              <h2 class="text-left text-lg">{{ content.title }}</h2>
            </template>
            <template #writer>
              <ContentContainer inner-content class="items-center">
                <div
                  :class="[
                    'size-2 mr-3 flex-shrink-0 rounded-full',
                    content.writer.status == 'active' ? ' bg-vue-green' : 'bg-gray-700'
                  ]"
                ></div>
                {{ content.writer.firstname }} {{ content.writer.lastname }}
              </ContentContainer>
            </template>
            <template #date>
              {{ formatDate(content.date) }}
            </template>
            <template #url>
              {{ content.url }}
            </template>
          </ArticleCard>
        </span>
      </ContentContainer>
    </ContentContainer>
  </ContentContainer>
</template>
<script setup>
import ContentContainer from '@/containers/ContentContainer.vue'
import ArticleCard from '@/containers/Articles/ArticleCard.vue'
import { formatDate } from '@/scripts/common/formatDate'

const { forEdit, published } = defineProps({
  forEdit: {
    type: Array,
    required: true
  },
  published: {
    type: Array,
    required: true
  },
  resetKey: Number
})
</script>
<style scoped>
.overflow-auto::-webkit-scrollbar {
  width: 12px;
}

.overflow-auto::-webkit-scrollbar-track {
  background-color: #f5f5f5;
}

.overflow-auto::-webkit-scrollbar-thumb {
  background-color: #4a5568;
  border: 3px solid #f5f5f5;
  border-radius: 5px;
}
.overflow-auto::-webkit-scrollbar-thumb:hover {
  background-color: #2d3748;
}
</style>
