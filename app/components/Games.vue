<template>
    <div class="flex gap-3">
        <ProseH2>Spiele</ProseH2>
        <UButton icon="material-symbols:refresh" size="md" color="neutral" variant="solid" @click="refresh_games()" />
        <ToExcel :sheets="sheets" :refresh="refresh_games" name="Spiele"></ToExcel>
    </div>
    <div class="flex flex-wrap gap-4">
        <UCard v-for="game in gamesList" :key="game.id" variant="subtle">
            <template #header>
                <ULink :to="`/intern/edit_game/${game.id}`">
                    <ProseH3>{{ game.game }}</ProseH3>
                </ULink>
            </template>
            Anzahl Teams: {{ teamCount(game) }}
            <template #footer>
                <UButton icon="material-symbols:delete-forever" size="md" color="neutral" variant="solid"
                    @click="remove(game)">
                    Löschen</UButton>
            </template>
        </UCard>
        <NuxtLink :to="`/intern/edit_game?year=${year}`">
            <UButton icon="material-symbols:add-2-rounded" size="md" color="primary" variant="solid">
                Spiel hinzufügen</UButton>
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">
import { ToExcel } from '#components';
import { createClient } from '@supabase/supabase-js'
import type { Sheet } from './ToExcel.vue';

const { year } = defineProps<{ year: number }>()

const runtimeConfig = useRuntimeConfig()
const supabase = createClient(runtimeConfig.public.SUPABASE_URL, runtimeConfig.public.SUPABASE_KEY)

type GameRow = {
    id: number
    game: string
    created_at: string
    teams: { team: number; registrations: { name: string; sirname: string } | null }[]
}

const { data: gamesList, refresh: refresh_games } = await useAsyncData('getAvailableGames', async () => {
    const { data, error } = await supabase.from('games')
        .select('id, game, created_at, teams(team, registrations(name, sirname))')
        .gte('created_at', `${year}-01-01`)
        .lt('created_at', `${year + 1}-01-01`)
        .order('game')
    if (error) throw error
    return data as unknown as GameRow[]
}, { watch: [() => year] })

function teamCount(game: GameRow) {
    return game.teams.length ? Math.max(...game.teams.map((t) => t.team)) + 1 : 0
}

const sheets = computed<Sheet[]>(() => {
    const result: Sheet[] = []
    for (const game of gamesList.value ?? []) {
        const numTeams = teamCount(game)
        const rows: Record<string, string>[] = []

        for (let teamIndex = 0; teamIndex < numTeams; teamIndex++) {
            const members = game.teams
                .filter((t) => t.team === teamIndex && t.registrations)
                .map((t) => t.registrations!)
                .sort((a, b) => a.name.localeCompare(b.name))

            members.forEach((member, index) => {
                if (index >= rows.length) rows.push({})
                rows[index]![`Team ${teamIndex + 1}`] = `${member.name} ${member.sirname}`
            })
        }

        result.push({ name: game.game, rows, columnVisibility: {} })
    }
    return result
})

const toast = useToast()
async function remove(game: { id: number; game: string }) {
    if (!confirm(`Willst du "${game.game}" wirklich löschen?`)) return
    const { error } = await supabase.from('games').delete().eq('id', game.id)
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
    }
    await refresh_games()
}
</script>
