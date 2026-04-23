<template>
    <UFormField
        v-if="isVisible"
        :name="String(field.key)"
        :label="field.label"
        :description="field.description"
        :required="field.required"
        :class="field.className"
    >
        <UInput
            v-if="field.fieldType === 'text' || field.fieldType === 'email' || field.fieldType === 'date' || field.fieldType === 'tel'"
            v-model="model"
            :type="field.fieldType"
            :placeholder="field.placeholder"
            class="w-full"
        />

        <UTextarea
            v-else-if="field.fieldType === 'textarea'"
            v-model="model"
            :placeholder="field.placeholder"
            class="w-full"
        />

        <USelect
            v-else-if="field.fieldType === 'select'"
            v-model="model"
            :items="field.items"
            :placeholder="field.placeholder ?? 'bitte auswählen'"
            class="w-full"
        />

        <USelectMenu
            v-else-if="field.fieldType === 'multiselect'"
            v-model="model"
            multiple
            :items="field.items"
            :placeholder="field.placeholder ?? 'bitte auswählen'"
            :search-input="field.searchInput ?? false"
            class="w-full"
        />

        <URadioGroup
            v-else-if="field.fieldType === 'radio'"
            v-model="model"
            :items="field.items"
            class="w-full"
        />

        <UCheckbox
            v-else-if="field.fieldType === 'checkbox' && field.key !== 'privacy_agreement'"
            v-model="model"
            :label="field.checkboxLabel"
        />

        <UCheckbox
            v-else-if="field.fieldType === 'checkbox' && field.key === 'privacy_agreement'"
            v-model="model"
        >
            <template #label>
                <span>
                    Ich habe die
                    <NuxtLink to="/datenschutz">Datenschutzerklärung</NuxtLink>
                    gelesen und bin damit einverstanden, dass die angegebenen Daten vom Zeltlagerteam im Rahmen
                    der Durchführung des diesjährigen Zeltlagers verarbeitet und gespeichert werden dürfen.
                </span>
            </template>
        </UCheckbox>

        <UFileUpload 
            v-else-if="field.fieldType === 'file'" 
            v-model="state.consent" 
            :accept="field.accept" 
            class="min-h-48" />

        <template v-if="field.fieldType === 'file'" #description>
            Lesen Sie nun bitte die
            <a href="/files/08_Reisebedingungen_fur_Kirchenstiftungen_11.01.2016-1.pdf" target="_blank">Reisebestimmungen</a>
            aufmerksam durch. Daraufhin bitten wir Sie darum die
            <a href="/files/Einverständniserklärung.pdf" target="_blank">Einverständniserklärung</a>
            auszufüllen und im folgenden Feld hochzuladen.
        </template>
    </UFormField>
</template>

<script setup lang="ts">
import type { RegistrationFieldConfig, RegistrationState } from '~~/types/registration'

const { field, state } = defineProps<{
    field: RegistrationFieldConfig
    state: RegistrationState
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const isVisible = computed(() => !field.visibleWhen || field.visibleWhen(state))

const model = computed({
    get: () => state[field.key],
    set: (value) => {
        state[field.key] = value as never
    }
})
</script>

<style scoped>
@reference "../../assets/css/main.css";

a {
    @apply text-green-600 underline;
}
</style>
