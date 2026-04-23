<template>
  <article>
    <ContentRenderer v-if="page" :value="page" class="grid" />
  </article>
</template>

<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => queryCollection('pages').path(route.path).first())
useHead({
  title: page.value?.seo?.title,
  meta: [
    { name: 'description', content: page.value?.seo?.description }
  ]
})
</script>