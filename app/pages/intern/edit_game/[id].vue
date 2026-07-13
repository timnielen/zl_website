<template>
    <EditGame :game-id="route.params.id as string"></EditGame>
</template>
<script setup lang="ts">
import EditGame from '~/components/EditGame.vue';

const route = useRoute()
definePageMeta({
    middleware: ['auth']
})
</script>
