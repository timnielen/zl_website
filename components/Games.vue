<template>
    <div class="flex flex-wrap gap-4">
        <UCard v-for="(count, game) in team_counts" :key="game" variant="subtle">
            <template #header>
                <ULink :to="'intern/edit_game/' + game">
                    <ProseH3>{{ game }}</ProseH3>
                </ULink>

            </template>
            Anzahl Teams: {{ count }}
            <template #footer>
                <UButton icon="material-symbols:delete-forever" size="md" color="neutral" variant="solid"
                    @click="remove(game)">
                    Löschen</UButton>
            </template>
        </UCard>
        <NuxtLink to="intern/edit_game">
            <UButton icon="material-symbols:add-2-rounded" size="md" color="primary" variant="solid">
                Spiel hinzufügen</UButton>
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">

import { createClient } from '@supabase/supabase-js'
const runtimeConfig = useRuntimeConfig()
const supabase = createClient(runtimeConfig.public.SUPABASE_URL, runtimeConfig.public.SUPABASE_KEY)

const { data: saved_games, refresh: refresh_games } = await useAsyncData("getAvailableGames", async () => {
    const { data, error } = await supabase.from("Teams")
        .select("game, team")
    if (error) throw error
    return data
})

console.log("games", saved_games.value)

const team_counts = computed(() => {
    return saved_games.value?.reduce((acc: any, { game, team }: any) => {
        if (game in acc) {
            acc[game] = Math.max(acc[game], team + 1)
        } else {
            acc[game] = team + 1
        }
        return acc
    }, {})
})

console.log(team_counts.value)

const toast = useToast()
async function remove(game: String) {
    if (!confirm(`Willst du "${game}" wirklich löschen?`)) return
    const { error } = await supabase.from("Teams")
        .delete().eq("game", game)
    if (error) {
        toast.add({
            title: "Löschen fehlgeschlagen!",
            description: error.message,
            color: "error",
            duration: 5000
        })
    } else {
        toast.add({
            title: "Spiel gelöscht!",
            color: "success",
            duration: 1000,
        })
        const { error } = await supabase.from("team_scores")
            .delete()
            .eq("game", game)
        if (error) {
            toast.add({
                title: "Fehlgeschlagen!",
                description: error.message,
                color: "error",
                duration: 5000,
            })
        } else
            toast.add({
                title: "Punkte gelöscht!",
                color: "success",
                duration: 1000,
            })
    }
    await refresh_games()
}
</script>