<template>
  <div>
    <h2>{{ isEdit ? 'Edit Article' : 'Create Article' }}</h2>
    <form @submit.prevent="handleSubmit">
      <input placeholder="Title" required />
      <textarea placeholder="Content" required></textarea>
      <input placeholder="Link" type="url" required />
      <input type="file"/>
      <button type="submit">{{ isEdit ? 'Update' : 'Create' }}</button>
    </form>
  </div>
</template>

<script setup>

</script>
