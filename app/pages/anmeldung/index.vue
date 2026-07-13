<template>
    <section class="page-section grid gap-6">
        <h1 class="page-title">Anmeldung <span v-if="!registrationOpen">(geschlossen)</span></h1>

        <UStepper
            :items="stepperItems"
            :model-value="currentStep"
            :orientation="stepperOrientation"
            @update:model-value="jumpToStep"
        />

        <USeparator class="stepper-separator" />

        <UForm :schema="schema" :state="formState" class="registration-form" @submit="onSubmit">
            <header class="form-header">
                <h2 class="form-title">{{ currentStage.title }}</h2>
                <p v-if="currentStage.description" class="form-stage-description">{{ currentStage.description }}</p>
            </header>

            <div class="form-fields">
                <template v-for="(element, index) in currentStage.elements" :key="`${currentStage.id}-${index}`">
                    <p v-if="element.kind === 'info'" :class="element.className ?? 'info-text'">{{ element.content }}</p>

                    <div v-else-if="element.kind === 'row'" :class="element.className ?? 'field-row'">
                        <div class="col-span-full" v-if="element.label || element.description">
                            <h3 v-if="element.label" class="row-title">{{ element.label }}</h3>
                            <p v-if="element.description" class="row-description">{{ element.description }}</p>
                        </div>
                        <RegistrationFormField
                            v-for="key in element.fields"
                            :key="key"
                            :field-key="key"
                            :state="state"
                        />
                        <!-- </UFormField> -->
                    </div>

                    <RegistrationCheckboxGroup v-else-if="element.kind === 'checkboxgroup'" :config="element" :state="state" />

                    <RegistrationFormField v-else :field-key="element.key" :class-name="element.className" :state="state" />
                </template>
            </div>

            <div class="form-nav">
                <UButton type="button" color="neutral" variant="subtle" :disabled="isFirstStep || loading" @click="previousStep">
                    Zurück
                </UButton>
                <UButton v-if="!isLastStep" type="button" :disabled="loading" @click="nextStep">Weiter</UButton>
                <UButton v-else type="submit" :loading="loading">Anmeldung abschicken</UButton>
            </div>
        </UForm>
    </section>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import * as v from 'valibot'
import { getRegistrationPeriodFromRuntimeConfig, isRegistrationOpenAt } from '~~/utils/registration-period'
import {
    defaultRegistrationState,
    getStageFieldKeys,
    registrationStages,
    schema,
    type RegistrationState
} from '~~/types/registration'

useHead({
    title: 'Anmeldung - Zeltlager Milbertshofen',
    meta: [
        { name: 'description', content: 'Hier können Sie Ihr Kind zum kommenden Zeltlager anmelden.' }
    ]
})

type FetchErrorLike = {
    status?: number
    statusCode?: number
    data?: { status?: number; statusCode?: number }
}

const runtimeConfig = useRuntimeConfig()
const toast = useToast()
const loading = ref(false)
const currentStep = ref(0)
const registrationPeriod = getRegistrationPeriodFromRuntimeConfig(runtimeConfig.public)
const registrationOpen = computed(() => isRegistrationOpenAt(registrationPeriod.startDate, registrationPeriod.endDate))
const state = reactive(defaultRegistrationState()) as RegistrationState
const formState = state as unknown as Partial<RegistrationState>

const isMobile = ref(false)
onMounted(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    isMobile.value = mq.matches
    mq.addEventListener('change', (e) => { isMobile.value = e.matches })
})

const currentStage = computed(() => registrationStages[currentStep.value] ?? registrationStages[0]!)
const isFirstStep = computed(() => currentStep.value === 0)
const isLastStep = computed(() => currentStep.value === registrationStages.length - 1)
const stepperOrientation = computed(() => isMobile.value ? 'vertical' as const : 'horizontal' as const)
const stepperItems = computed(() =>
    registrationStages.map((stage, index) => ({
        title: stage.title,
        status: index < currentStep.value ? 'completed' as const : undefined
    }))
)

function validateStep(index: number, showToast = true) {
    const stage = registrationStages[index]
    if (!stage) return false

    const result = v.safeParse(schema, state)
    if (result.success) return true

    const stageFieldKeys = new Set<string>(getStageFieldKeys(stage))
    const stageIssues = result.issues.filter((issue) => {
        const key = issue.path?.[0]?.key
        return typeof key === 'string' && stageFieldKeys.has(key)
    })

    if (stageIssues.length === 0) return true

    if (showToast) {
        toast.add({
            title: 'Bitte prüfen Sie Ihre Eingaben',
            description: stageIssues[0]!.message,
            color: 'error'
        })
    }

    return false
}

function nextStep() {
    if (validateStep(currentStep.value) && currentStep.value < registrationStages.length - 1) {
        currentStep.value += 1
    }
}

function previousStep() {
    if (currentStep.value > 0) currentStep.value -= 1
}

function jumpToStep(value: string | number | undefined) {
    const index = Number(value)
    if (!Number.isFinite(index) || index < 0 || index >= registrationStages.length) return

    if (index <= currentStep.value) {
        currentStep.value = index
        return
    }

    for (let stepIndex = currentStep.value; stepIndex < index; stepIndex++) {
        if (!validateStep(stepIndex)) return
    }

    currentStep.value = index
}

async function onSubmit(event: FormSubmitEvent<Record<string, unknown>>) {
    for (let stepIndex = 0; stepIndex < registrationStages.length; stepIndex++) {
        if (!validateStep(stepIndex, false)) {
            currentStep.value = stepIndex
            toast.add({
                title: 'Bitte prüfen Sie Ihre Eingaben',
                description: 'Es gibt Fehler in Ihren Angaben in ' + registrationStages[stepIndex]?.title + '. Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.',
                color: 'error'
            })
            return
        }
    }

    const rowData: Record<string, unknown> = {}
    const files: Record<string, Blob> = {}
    for (const [key, value] of Object.entries(event.data)) {
        if (value instanceof Blob) files[key] = value
        else rowData[key] = value
    }

    const formData = new FormData()
    for (const [key, blob] of Object.entries(files)) {
        formData.append(key, blob, `${rowData.name}_${rowData.sirname}_${key}`)
    }
    formData.append('_data', JSON.stringify(rowData))

    loading.value = true

    try {
        await $fetch('/api/register', { method: 'POST', body: formData })
    } catch (error) {
        const e = error as FetchErrorLike
        const status = e?.statusCode ?? e?.status ?? e?.data?.statusCode ?? e?.data?.status

        const description = status === 400
            ? 'Die Anmeldung konnte nicht abgeschlossen werden. Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.'
            : status === 423
            ? 'Die Anmeldung ist leider geschlossen. Versuchen Sie es während des Anmeldezeitraums erneut.'
            : `Ein interner Fehler ist aufgetreten. Bitte versuchen Sie es später erneut. (${status})`

        toast.add({ title: 'Anmeldung fehlgeschlagen!', description, color: 'error' })
        loading.value = false
        return
    }

    loading.value = false

    toast.add({
        title: 'Anmeldung abgeschlossen!',
        description: `Die Anmeldung wurde abgeschlossen. Wir haben eine Bestätigungsmail an ${rowData.email} gesandt. Bitte überprüfen Sie Ihr Postfach.`,
        color: 'success',
        duration: 10000
    })

    navigateTo('/')
}
</script>

<style scoped>
@reference "../../assets/css/main.css";
.page-section {
    @apply bg-white xl:mx-auto max-w-7xl px-8 py-12 rounded-xl shadow-xl my-8;
}
.page-title {
    @apply text-primary-500 text-3xl md:text-5xl;
}
.registration-form {
    @apply space-y-6;
}
.form-header {
    @apply grid gap-2;
}
.form-title {
    @apply text-2xl md:text-3xl;
}
.form-stage-description {
    @apply text-sm text-gray-600;
}
.form-fields {
    @apply grid gap-4;
}
.info-text {
    @apply text-sm text-gray-700;
}
.field-row {
    @apply grid gap-4 md:grid-cols-2;
}
.form-nav {
    @apply flex flex-wrap gap-3 pt-2;
}
.row-title {
    @apply text-sm font-semibold col-span-full;
}
.row-description {
    @apply text-sm text-gray-600 mb-2 col-span-full;
}
</style>
