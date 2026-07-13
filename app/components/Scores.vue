<template>
    <div class="flex gap-3">
        <ProseH2 class="inline">Ergebnisse</ProseH2>
        <UButton icon="material-symbols:refresh" size="md" color="neutral" variant="solid" @click="refresh_scores()" />
    </div>
    <UTable ref="myTable" :data="scores" />
</template>

<script setup lang="ts">
import { createClient } from '@supabase/supabase-js'

const { year } = defineProps<{ year: number }>()

const runtimeConfig = useRuntimeConfig()
const supabase = createClient(runtimeConfig.public.SUPABASE_URL, runtimeConfig.public.SUPABASE_KEY)


const { data: scores, refresh: refresh_scores } = await useAsyncData("getPlayerScores", async () => {
    const { data, error } = await supabase.from("scores")
        .select("Vorname:name, Nachname:sirname, Punkte:score")
        .eq("year", year)
        .order("score", { ascending: false })
    if (error) throw error
    return data
}, { watch: [() => year] })
</script>
