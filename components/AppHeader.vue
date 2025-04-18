<template>
    <header class="bg-green-500">
        <nav
            class="max-w-7xl lg:mx-auto rounded-md p-4 text-white font-semibold flex gap-5 justify-between items-center">
            <NuxtLink to="/">
                <div class="flex gap-2 items-center ">
                    <UIcon class="w-12 h-12" name="i-material-symbols-camping-rounded"></UIcon>
                    <span class="text-lg">
                        KjG Ortsgruppe
                        <br>
                        Zeltlager Milbertshofen
                    </span>
                </div>
            </NuxtLink>
            <ul class="flex gap-5 justify-end grow items-center text-lg max-md:hidden">
                <ULink v-for="item in items" raw :to="item?.to" class="text-white" active-class="font-bold">
                    {{ item?.label }}
                </ULink>
            </ul>
            <UDrawer direction="right" class="md:hidden" title="Menü">
                <UIcon class="w-12 h-12" label="Open" name="i-material-symbols-menu" />
                <template #content>
                    <div class="flex flex-col gap-5 text-lg m-5">
                        <NuxtLink to="/">
                            <div class="flex flex-col gap-2 items-center ">
                                <UIcon class="w-12 h-12" name="i-material-symbols-camping-rounded"></UIcon>
                                <h1 class="text-lg text-center">
                                    KjG Ortsgruppe
                                    <br>
                                    Zeltlager Milbertshofen
                                </h1>
                            </div>
                        </NuxtLink>
                        <USeparator />
                        <ULink to="/">Startseite</ULink>
                        <ULink v-for="item in items" :to="item.to">
                            {{ item.label }}
                        </ULink>
                        <ULink to="/intern">Intern</ULink>
                    </div>
                </template>
            </UDrawer>
        </nav>
    </header>
</template>

<script setup lang="ts">
const items = [{
    label: 'Anmeldung',
    to: '/anmeldung',
}, {
    label: 'Datenschutz',
    to: '/datenschutz',
}, {
    label: 'Impressum',
    to: '/impressum',
}]
</script>