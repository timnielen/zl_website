<template>
    <div class="hero">
        <NuxtImg v-if="img_src" :src="img_src" :alt="img_alt ?? ''" class="hero-bg" :style="{ opacity: `${img_alpha}%` }" />
        <UPageHero class="hero-content" :title="`Zeltlager ${year}`" :links="heroLinks">
            <template #description>
                <slot />
            </template>
        </UPageHero>
    </div>
</template>

<script setup lang="ts">
import { getRegistrationPeriodFromRuntimeConfig, isRegistrationOpenAt } from '~~/utils/registration-period'

const { img_src, img_alt, img_alpha = 70 } = defineProps<{
    img_src?: string
    img_alt?: string
    img_alpha?: number
}>()

const runtimeConfig = useRuntimeConfig()

const registrationPeriod = computed(() => {
    try {
        return getRegistrationPeriodFromRuntimeConfig(runtimeConfig.public)
    } catch {
        return null
    }
})

const year = computed(() => registrationPeriod.value?.registrationYear ?? new Date().getFullYear())
const registrationOpen = computed(() =>
    registrationPeriod.value
        ? isRegistrationOpenAt(registrationPeriod.value.startDate, registrationPeriod.value.endDate)
        : false
)

const heroLinks = computed(() =>
    registrationOpen.value ? [{ label: 'Jetzt Anmelden', to: '/anmeldung', size: 'xl' as const }] : []
)
</script>

<style scoped>
@reference "../../assets/css/main.css";
.hero {
    @apply w-full relative bg-black;
}
.hero-bg {
    @apply absolute object-cover h-full w-full object-bottom;
}
.hero-content {
    @apply relative;
}
.hero-content :deep(h1),
.hero-content :deep(h2),
.hero-content :deep(p),
.hero-content :deep(span) {
    @apply text-white;
}
.registration-status {
    @apply block mt-2 text-sm opacity-80;
}
</style>
