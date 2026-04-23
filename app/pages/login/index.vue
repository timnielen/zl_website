<template>
    <section class="bg-white px-8 py-12 rounded-xl shadow-xl my-8 mx-auto max-w-md flex flex-col items-center gap-4">
        <div class="flex flex-col items-center">
            <UIcon name="i-material-symbols-person-rounded" class="size-12"></UIcon>
            <h1 class="text-3xl">Interner Login</h1>
            <label>(nur für Zeltlager Leitung)</label>
        </div>
        <UForm :schema="login_schema" :state="state" @submit="onSubmit" class="grid gap-4 w-full">
            <UFormField label="E-Mail" name="email">
                <UInput v-model="state.email" type="email" class="w-full"></UInput>
            </UFormField>
            <UFormField label="Passwort" name="password">
                <UInput v-model="state.password" type="password" class="w-full"></UInput>
            </UFormField>
            <UFormField>
                <UButton type="submit" :loading="loading">
                    Anmelden
                </UButton>
            </UFormField>
        </UForm>
    </section>
</template>

<script setup lang="ts">
import { login_schema, type LoginSchema } from '~/types/login';
import type { FormSubmitEvent } from '#ui/types'
import { createClient } from '@supabase/supabase-js'

const state = reactive<Record<string, any>>({
    email: "",
    password: ""
})

const runtimeConfig = useRuntimeConfig()
const supabase = createClient(runtimeConfig.public.SUPABASE_URL, runtimeConfig.public.SUPABASE_KEY)
const loading = ref(false)
const router = useRouter()
const route = useRoute()
async function onSubmit(event: FormSubmitEvent<Record<string, any>>) {
    console.log(event.data)
    const { email, password } = event.data
    loading.value = true
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    loading.value = false
    if (!error) {
        const redirect = route.query.redirect || '/'
        router.push(redirect as string)
    }
}
</script>