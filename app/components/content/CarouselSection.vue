<template>
    <section class="w-full  xl:mx-auto py-4 text-center">
        <UCarousel v-slot="{ item }" loop :autoplay="{ delay: delay }" :items="src"
            :ui="{ item: 'basis-3/4 md:basis-1/2 lg:basis-1/4 ps-4 ' }">
            <NuxtImg placeholder :src="dir + item" class="object-cover aspect-4/3 h-full w-full rounded-xl "
                draggable="false" :modifiers="{ rotate: null }" format="webp" sizes="256px sm:512px xxl:1024px" />
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