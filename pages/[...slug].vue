<template>
    <article class="bg-white xl:mx-auto max-w-7xl p-10 rounded-xl shadow-xl m-2 prose">
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