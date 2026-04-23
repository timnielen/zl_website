<template>
    <EditGame></EditGame>
</template>
<script setup lang="ts">
import EditGame from '~/components/EditGame.vue';

definePageMeta({
    middleware: ['auth']
})
</script>