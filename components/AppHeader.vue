<template>
    <header class="bg-green-600">
        <nav
            class="max-w-7xl lg:mx-auto rounded-md p-4 text-white font-semibold flex gap-5 justify-between items-center">
            <NuxtLink to="/">
                <div class="flex gap-2 items-center ">
                    <UIcon class="w-12 h-12" name="i-material-symbols-camping-rounded"></UIcon>
                    <h1 class="text-lg">
                        KjG Ortsgruppe
                        <br>
                        Zeltlager Milbertshofen
                    </h1>
                </div>
            </NuxtLink>
            <ul class="flex gap-5 justify-end grow items-center text-lg max-md:hidden">
                <ULink raw active-class="bg-green-500 p-2 rounded-md" to="/datenschutz">Datenschutz</ULink>
                <ULink raw active-class="bg-green-500 p-2 rounded-md" to="/kontakt">Impressum</ULink>
                <ULink raw active-class="bg-green-500 p-2 rounded-md" to="/anmeldung">Anmeldung</ULink>
            </ul>
            <UDrawer direction="right" class="md:hidden" title="Menü">
                <UIcon class="w-12 h-12" label="Open" name="i-material-symbols-menu" />
                <template #content>
                    <ul class="flex flex-col gap-5 text-lg m-5">
                        <NuxtLink to="/">
                            <div class="flex gap-2 items-center ">
                                <UIcon class="w-12 h-12" name="i-material-symbols-camping-rounded"></UIcon>
                                <br>
                                <h1 class="text-lg">
                                    KjG Ortsgruppe
                                    <br>
                                    Zeltlager Milbertshofen
                                </h1>
                            </div>
                        </NuxtLink>
                        <ULink to="/datenschutz">Datenschutz</ULink>
                        <ULink to="/kontakt">Impressum</ULink>
                        <ULink to="/anmeldung">Anmeldung</ULink>
                    </ul>
                </template>
            </UDrawer>
        </nav>
    </header>
</template>

<script setup lang="ts">
</script>