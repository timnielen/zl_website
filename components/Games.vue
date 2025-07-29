<template>
    <div class="flex gap-3">
        <ProseH2>Spiele</ProseH2>
        <UButton icon="material-symbols:refresh" size="md" color="neutral" variant="solid" @click="refresh_games()" />
        <ToExcel :sheets="sheets" :refresh="refresh_sheets" name="Spiele"></ToExcel>
    </div>
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
import { ToExcel } from '#components';
import { createClient } from '@supabase/supabase-js'
import type {Sheet} from '#components/ToExcel.vue';
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
    return saved_games.value?.reduce((num_teams: any, { game, team }: any) => {
        if (game in num_teams) {
            num_teams[game] = Math.max(num_teams[game], team + 1)
        } else {
            num_teams[game] = team + 1
        }
        return num_teams
    }, {})
})

const { data: sheets, refresh: refresh_sheets } = await useAsyncData("getExcelSheet", async () => {
    const { data, error } = await supabase.from("Teams")
        .select("numbered_participants (name, sirname, number), game, team").order("game, team, numbered_participants(number)", )
    if (error) throw error
    let result: Sheet[] = []
    for (const [game, num_teams] of Object.entries(team_counts.value)) {
        const game_data = data.filter((row: any) => row.game === game)
        let rows = []
        for (let num_team = 0; num_team < num_teams; num_team++) {
            game_data.filter((row: any) => row.team === num_team).forEach(({numbered_participants: p}, index) => {
                name = `${p.name} ${p.sirname}`
                if (index >= rows.length ) {
                    rows.push({})
                }
                rows[index][`Team ${num_team+1}`] = name
            })
        }
        result.push({
            name: game,
            rows,
            columnVisibility: {}
        })
    }
    return result
})

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