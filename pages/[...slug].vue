<template>
    <div class="grid gap-5">
        <UCarousel ref="carouselRef" v-slot="{ item }" loop arrows :autoplay="{ delay: 4000 }" :items="carouselImages"
            :ui="{ item: 'basis-full' }">
            <NuxtImg :src="item.src" class="object-cover md:aspect-2/1 aspect-3/4 h-full w-full rounded-lg" 
            :class="item.alignment"
                draggable="false" />
        </UCarousel>
        <article class="prose bg-white shadow-lg p-5 md:columns-2 rounded-lg text-black">
            <ContentDoc />
        </article>
    </div>
</template>

<script setup lang="ts">
const route = useRoute()
console.log(route)
const carouselImages = [
    {
        src: 'img/IMG_20220801_201345.jpg',
        alignment: 'object-bottom'
    },
    {
        src: 'img/IMG_5225.JPG',
        alignment: 'object-center'
    },
    {
        src: 'img/plane.JPG',
        alignment: 'object-bottom'
    },
    {
        src: 'img/Gruppenbild.JPG',
        alignment: 'object-center'
    }
]

const carouselRef = ref()

onMounted(() => {
    setInterval(() => {
        if (!carouselRef.value) return

        if (carouselRef.value.page === carouselRef.value.pages) {
            return carouselRef.value.select(0)
        }

        carouselRef.value.next()
    }, 3000)
})
</script>