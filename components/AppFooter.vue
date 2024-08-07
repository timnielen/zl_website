<template>
    <footer class="w-full bg-green-600 text-white absolute bottom-0 ">
        <nav class="max-w-6xl lg:mx-auto p-4 text-xs flex gap-5 flex-wrap justify-center">
            <ul class="flex gap-5 justify-center flex-grow items-center">
                <li class="hover:underline">
                    <NuxtLink to="/">Startseite</NuxtLink>
                </li>
                <li class="hover:underline">
                    <NuxtLink to="/intern">Übersicht für Zeltlagerleitung</NuxtLink>
                </li>
                <li class="hover:underline">
                    <NuxtLink to="/kontakt">Impressum</NuxtLink>
                </li>
                <li class="hover:underline">
                    <NuxtLink to="/datenschutz">Datenschutzerklärung</NuxtLink>
                </li>
            </ul>
        </nav>
    </footer>
</template>

<script setup lang="ts">
</script>