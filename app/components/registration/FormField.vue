<template>
    <UFormField
        :name="fieldKey"
        :label="def.label"
        :description="def.description"
        :required="def.required"
        :class="className"
    >
        <UInput
            v-if="def.fieldType === 'text' || def.fieldType === 'email' || def.fieldType === 'tel'"
            v-model="model"
            :type="def.fieldType"
            :placeholder="def.placeholder"
            class="w-full"
        />

        <UInputDate
            v-else-if="def.fieldType === 'date'"
            icon="i-lucide-calendar"
            v-model="dateModel"
            class="w-full"
        />

        <UTextarea
            v-else-if="def.fieldType === 'textarea'"
            v-model="model"
            :placeholder="def.placeholder"
            class="w-full"
        />

        <USelect
            v-else-if="def.fieldType === 'select'"
            v-model="model"
            :items="def.items"
            :placeholder="def.placeholder ?? 'bitte auswählen'"
            class="w-full"
        />

        <USelectMenu
            v-else-if="def.fieldType === 'multiselect'"
            v-model="model"
            multiple
            :items="def.items"
            :placeholder="def.placeholder ?? 'bitte auswählen'"
            :search-input="def.searchInput ?? false"
            class="w-full"
        />

        <URadioGroup
            v-else-if="def.fieldType === 'radio'"
            v-model="model"
            :items="def.items"
            class="w-full"
        />

        <UCheckbox
            v-else-if="def.fieldType === 'checkbox' && fieldKey !== 'privacy_agreement'"
            v-model="model"
            :label="def.checkboxLabel"
        />

        <UCheckbox
            v-else-if="def.fieldType === 'checkbox' && fieldKey === 'privacy_agreement'"
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
            v-else-if="def.fieldType === 'file'"
            v-model="model"
            :accept="def.accept ?? def.validation?.mimeTypes?.join(', ')"
            class="min-h-48" />

        <template v-if="def.fieldType === 'file'" #description>
            Lesen Sie nun bitte die
            <a href="/files/08_Reisebedingungen_fur_Kirchenstiftungen_11.01.2016-1.pdf" target="_blank">Reisebestimmungen</a>
            aufmerksam durch. Daraufhin bitten wir Sie darum die
            <a href="/files/Einverständniserklärung.pdf" target="_blank">Einverständniserklärung</a>
            auszufüllen und im folgenden Feld hochzuladen.
        </template>
    </UFormField>
</template>

<script setup lang="ts">
import { parseDate } from '@internationalized/date'
import type { DateValue } from '@internationalized/date'
import { fieldDefs } from '~~/types/registration'
import type { FieldKey, RegistrationState } from '~~/types/registration'

const { fieldKey, className, state } = defineProps<{
    fieldKey: FieldKey
    className?: string
    state: RegistrationState
}>()

const def = computed(() => fieldDefs[fieldKey])

const model = computed({
    get: () => state[fieldKey],
    set: (value) => { state[fieldKey] = value }
})

const dateModel = computed<DateValue | undefined>({
    get: () => {
        const val = state[fieldKey]
        if (typeof val !== 'string' || !val) return undefined
        try { return parseDate(val) } catch { return undefined }
    },
    set: (value) => { state[fieldKey] = value?.toString() ?? '' }
})
</script>

<style scoped>
@reference "../../assets/css/main.css";

a {
    @apply text-green-600 underline;
}
</style>
