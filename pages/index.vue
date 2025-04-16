<template>
    <div class="grid">
        <section class="w-full bg-cover bg-bottom relative ">
            <NuxtImg src="img/lager/hero.jpg"
                class="absolute -z-10 object-cover h-full w-full object-bottom opacity-70" />
            <div class="absolute -z-20 h-full w-full bg-black "></div>
            <header class="max-w-7xl xl:mx-auto my-28 hero text-white px-10 grid gap-4">
                <ContentRenderer v-if="hero" :value="hero" class=" grid gap-4 md:text-xl text-md" />
                <NuxtLink to="/anmeldung">
                    <UButton class="md:text-xl text-md">Jetzt Anmelden</UButton>
                </NuxtLink>
            </header>
        </section>
        <section class="bg-white py-10">
            <article class="w-full max-w-7xl xl:mx-auto px-10 prose ">
                <ContentRenderer v-if="description" :value="description" />
            </article>
        </section>
        <section class="w-full  xl:mx-auto py-10">
            <UCarousel v-slot="{ item }" loop :autoplay="{ delay: 3000 }" :items="carousel_lager?.images"
                :ui="{ item: 'basis-1/2 lg:basis-1/3 xl:basis-1/4' }">
                <NuxtImg :src="'/img/lager/' + item" class="object-cover aspect-square md:aspect-4/3 h-full w-full"
                    draggable="false" :modifiers="{ rotate: null }" format="webp" sizes="128px md:256px lg:512px" />
            </UCarousel>
        </section>
        <section class="bg-white py-10">
            <article class="w-full max-w-7xl xl:mx-auto box-border px-10 prose">
                <h1>Fragen & Antworten</h1>
                <UAccordion v-if="QAndA" :items="QAndA" />
            </article>
        </section>
        <section class="w-full  xl:mx-auto py-10">
            <UCarousel v-slot="{ item }" loop :autoplay="{ delay: 3000 }" :items="carousel_leiter?.images"
                :ui="{ item: 'basis-1/2 lg:basis-1/3 xl:basis-1/4' }">
                <NuxtImg :src="'/img/leiter/' + item" class="object-cover aspect-square md:aspect-4/3 h-full w-full"
                    draggable="false" :modifiers="{ rotate: null }" format="webp" sizes="128px md:256px lg:512px" />
            </UCarousel>
        </section>
        <section class="bg-white py-10">
            <article class="w-full max-w-7xl xl:mx-auto px-10 prose ">
                <ContentRenderer v-if="about" :value="about" />
            </article>
        </section>
    </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { data: hero } = await useAsyncData("hero", () => queryCollection('main').path("/main/hero").first())
console.log(hero, route.path)
useHead({
    title: hero.value?.seo?.title,
    meta: [
        { name: 'description', content: hero.value?.seo?.description }
    ]
})

const { data: description } = await useAsyncData("description", () => queryCollection('main').path("/main/description").first())
const { data: about } = await useAsyncData("about", () => queryCollection('main').path("/main/about").first())


const { data: QAndA } = await useAsyncData("QAndA", () => queryCollection('QAndA').all())


const { data: carousel_lager } = await useAsyncData("lager_carousel", () => queryCollection('carousel').where('stem', '=', 'main/carousel/lager').first())
console.log(carousel_lager.value?.images)

const { data: carousel_leiter } = await useAsyncData("leiter_carousel", () => queryCollection('carousel').where('stem', '=', 'main/carousel/leiter').first())
console.log(carousel_leiter)
</script>

<style>
@import "tailwindcss";

:where(.hero h1) {
    @apply text-3xl md:text-5xl;
}
</style>