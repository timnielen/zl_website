<template>
    <UModal :title="title" v-model:open="open">
        <slot></slot>

        <template #body>
            <div class="flex gap-2">
                <UButton :label="label_confirm" color="success" @click="onClick" :loading="loading"></UButton>
                <UButton :label="label_cancel" color="neutral" variant="subtle" @click="open = false" :disabled="loading"></UButton>
            </div>
        </template>
    </UModal>
</template>

<script setup lang="ts">
const { title, action } = defineProps<{
    title: string,
    label_confirm: string,
    label_cancel: string,
    action: (event?: Event) => Promise<any>
}>()
const open = ref(false)

const loading = ref(false)
async function onClick(event: Event) {
    loading.value = true;
    try {
        await action(event);
    } catch (e) {
        loading.value = false
        throw e;
    }
    loading.value = false;
    open.value = false;
}
</script>