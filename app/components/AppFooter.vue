<template>
    <footer class="w-full bg-primary-500 mt-auto text-white">
        <nav class="max-w-7xl xl:mx-auto flex max-md:flex-col-reverse justify-between items-center text-sm p-8 gap-4">
            <span class="text-center">{{ new Date().getFullYear() }} © KjG OG Zeltlager Milbertshofen. All rights reserved.</span>
            <USeparator class="sm:hidden" />
            <ul class="flex max-sm:flex-col gap-4">
                <li v-for="item in items" class="text-center">
                    <ULink raw :to="item.to" class="text-white" :target="item.target"
                    active-class="font-bold" inactive-class="text-(--ui-text-muted)">
                        {{ item.label }}
                    </ULink>
                </li>
            </ul>
        </nav>
    </footer>
</template>

<script setup lang="ts">
let items = [{
    label: 'Anmeldung',
    to: '/anmeldung',
}, {
    label: 'Impressum',
    to: '/impressum',
}, {
    label: 'Datenschutzerklärung',
    to: '/datenschutz',
}, {
    label: 'Intern',
    to: '/intern',
}, {
    label: 'Instagram',
    to: 'https://www.instagram.com/zeltlager_milbertshofen/',
    target: "_blank"
}
]
const runtimeConfig = useRuntimeConfig()

if(runtimeConfig.public.REGISTRATION_IS_OPEN !== "TRUE") {
    items.shift()
}
</script>