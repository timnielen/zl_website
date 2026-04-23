<template>
    <UFormField :label="config.label" :description="config.description" :required="config.required" :class="config.className">
        <UCheckboxGroup :model-value="selectedKeys" :items="items" @update:model-value="onUpdate" />
    </UFormField>
</template>

<script setup lang="ts">
import type { RegistrationCheckboxGroupConfig, RegistrationState } from '~~/types/registration'

const { config, state } = defineProps<{
    config: RegistrationCheckboxGroupConfig
    state: RegistrationState
}>()

const items = config.fields.map(f => ({ value: String(f.key), label: f.label }))

const selectedKeys = computed(() =>
    config.fields.filter(f => state[f.key] === true).map(f => String(f.key))
)

function onUpdate(values: string[]) {
    const selected = new Set(values)
    for (const field of config.fields) {
        state[field.key] = selected.has(String(field.key)) as never
    }
}
</script>
