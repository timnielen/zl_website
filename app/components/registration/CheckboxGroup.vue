<template>
    <UFormField :label="config.label" :description="config.description" :required="config.required" :class="config.className">
        <UCheckboxGroup :model-value="selectedKeys" :items="items" @update:model-value="onUpdate" />
    </UFormField>
</template>

<script setup lang="ts">
import { fieldDefs } from '~~/types/registration'
import type { RegistrationStageElement, RegistrationState } from '~~/types/registration'

const { config, state } = defineProps<{
    config: Extract<RegistrationStageElement, { kind: 'checkboxgroup' }>
    state: RegistrationState
}>()

const items = config.fields.map((key) => ({ value: key, label: fieldDefs[key].label ?? key }))

const selectedKeys = computed(() =>
    config.fields.filter((key) => state[key] === true)
)

function onUpdate(values: string[]) {
    const selected = new Set(values)
    for (const key of config.fields) {
        state[key] = selected.has(key)
    }
}
</script>
