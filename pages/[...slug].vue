<template>
    <article class="prose bg-white shadow-lg p-5 rounded-lg">
        <ContentRenderer v-if="page" :value="page" />
    </article>
</template>

<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => queryCollection('pages').path("/pages" + route.path).first())
useHead({
  title: page.value?.seo?.title,
  meta: [
    { name: 'description', content: page.value?.seo?.description }
  ]
})
</script>