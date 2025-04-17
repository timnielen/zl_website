<template>
    <section class="w-full relative">
        <NuxtImg :src="img_src" :alt="img_alt" class="absolute object-cover h-full w-full object-bottom"
            :style="{ opacity: img_alpha + '%' }" v-if="img_src"/>
        <header class="max-w-7xl xl:mx-auto text-white px-10 grid gap-4 md:text-xl text-lg my-28 relative">
            <slot></slot>
            <NuxtLink :to="link.to" v-if="link">
                <UButton class="md:text-xl text-lg">{{link.value}}</UButton>
            </NuxtLink>
        </header>
    </section>
</template>

<script setup lang="ts">

const { img_src, img_alt, img_alpha = 70, link } = defineProps<{
    img_src?: string,
    img_alt?: string,
    img_alpha?: number
    link?: {
        to: string
        value: string
    }
}>()
</script>