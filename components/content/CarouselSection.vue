<template>
    <section class="w-full  xl:mx-auto py-10">
        <UCarousel v-slot="{ item }" loop :autoplay="{ delay: delay }" :items="src"
            :ui="{ item: 'basis-1/2 lg:basis-1/3 xl:basis-1/4 ps-1 md:ps-4' }">
            <NuxtImg :src="dir + item" class="object-cover aspect-square md:aspect-4/3 h-full w-full"
                draggable="false" :modifiers="{ rotate: null }" format="webp" sizes="128px md:256px lg:512px" />
        </UCarousel>
    </section>
</template>
<script setup lang="ts">

const { dir, delay=3000, src = []} = defineProps<{
    dir: string,
    delay?: number,
    src?: Array<string>
}>()
</script>