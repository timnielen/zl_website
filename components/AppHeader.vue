<template>
    <header class="bg-green-600">
        <nav class="max-w-7xl lg:mx-auto rounded-md p-4 text-white font-semibold flex gap-5">
            <NuxtLink to="/">
                <div class="flex gap-2 items-center ">
                <UIcon class="w-12 h-12" name="i-material-symbols-camping-rounded"></UIcon>
                <h1 class="text-lg">
                    <span>KJG Ortsgruppe</span>
                    <br>
                    <span>Zeltlager Milbertshofen</span>
                </h1>
            </div>
            </NuxtLink>
            <ul class="flex gap-5 justify-end flex-grow items-center text-lg underline-offset-4">
                <li class="hover:underline decoration-2"><NuxtLink to="/anmeldung">Anmeldung</NuxtLink></li>
                <li class="hover:underline decoration-2"><NuxtLink to="/kontakt">Kontakt</NuxtLink></li>
            </ul>
        </nav>
    </header>
</template>

<script setup lang="ts">
</script>