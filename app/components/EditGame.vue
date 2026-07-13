<template>
    <TextSection>
        <ULink to="/intern"><- Zurück zur Übersicht </ULink>
                <ProseH1 v-if="!existingGame" class="text-primary-500">Spiel erstellen</ProseH1>
                <ProseH1 v-else class="text-primary-500">{{ existingGame.game }}</ProseH1>
                <USeparator />
                <UFormField label="Spielname" name="name">
                    <UInput v-model="game.name" placeholder="Fuchsjagd (max. 30 Zeichen)" />
                </UFormField>
                <UFormField label="Anzahl Teams" name="num_teams">
                    <div class="flex gap-1">
                        <UInput v-model="game.num_teams" type="number" @change="createTeams()" />
                        <UButton icon="material-symbols:refresh" size="md" color="neutral" variant="solid"
                            @click="createTeams()" />
                    </div>
                </UFormField>
                <UFormField>
                    <UButton icon="material-symbols:save-rounded" size="md" color="primary" variant="solid"
                        @click="save" :loading="saving">
                        Speichern</UButton>
                </UFormField>
                <UFormField>
                    <UButton v-if="existingGame"
                        icon="material-symbols:delete-forever" size="md" color="neutral" variant="solid" @click="remove"
                        :loading="deleting">
                        Löschen</UButton>
                </UFormField>
                <USeparator />
                <div class="flex flex-wrap gap-4">
                    <UCard variant="subtle" v-for="team in teams" :key="team.id" @drop="onDrop($event, team.id)"
                        @dragover.prevent @dragenter.prevent>
                        <template #header>
                            <ProseH2 class="text-primary-500">Team {{ team.id + 1 }}</ProseH2>
                            <UFormField label="Punkte" name="name">
                                <USelect :items="options_score" class="w-32"
                                    @update:model-value="setScore(team.id, $event)" :default-value="null"
                                    v-model="team.score" />
                            </UFormField>
                        </template>

                        <div class="grid gap-1">
                            <TransitionGroup name="team">
                                <UBadge v-for="player in team.players" :key="player.id" draggable="true"
                                    @dragstart="startDrag($event, player.id)" color="neutral" variant="outline"
                                    class="cursor-grab">
                                    {{ player.name }} {{ player.sirname }} ({{ player.age }} Jahre)
                                </UBadge>
                            </TransitionGroup>
                        </div>

                        <template #footer>
                            <div class="flex flex-col">
                                <span>Jungs: {{team.players.reduce((total, player) => player.gender === "männlich" ?
                                    total + 1 : total, 0)}}</span>
                                <span>Mädchen: {{team.players.reduce((total, player) => player.gender !== "männlich" ?
                                    total + 1 : total, 0)}}</span>
                                <span>Durchschnittsalter: {{ getAverageAge(team) }} Jahre</span>
                                <span class="text-primary-500">Anzahl Spieler: {{ team.players.length }}</span>


                            </div>
                        </template>
                    </UCard>
                    <UCard variant="subtle" @drop="onDrop($event, -1)" @dragover.prevent @dragenter.prevent>
                        <template #header>
                            <ProseH2 class="text-primary-500">Ersatzbank</ProseH2>
                        </template>
                        <div class="grid gap-1">
                            <TransitionGroup name="team">
                                <UBadge v-for="player in players.filter(({ team }) => team === -1)" :key="player.id"
                                    draggable="true" @dragstart="startDrag($event, player.id)" color="neutral"
                                    variant="outline" class="cursor-grab">
                                    {{ player.name }} {{ player.sirname }} ({{ player.age }} Jahre)
                                </UBadge>
                            </TransitionGroup>
                        </div>
                    </UCard>
                </div>
    </TextSection>
</template>
<script setup lang="ts">
import { createClient } from '@supabase/supabase-js'

const props = defineProps<{
    gameId?: string
}>()

const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const supabase = createClient(runtimeConfig.public.SUPABASE_URL, runtimeConfig.public.SUPABASE_KEY)

const toast = useToast()

function calculateAge(birthday: string) {
    var ageDifMs = Date.now() - new Date(birthday).getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

// If editing an existing game, load it to get its name and its year (derived
// from created_at, since games no longer carry a year column of their own).
const { data: existingGame } = await useAsyncData(`game-${props.gameId ?? 'new'}`, async () => {
    if (!props.gameId) return null
    const { data, error } = await supabase.from('games')
        .select('id, game, created_at')
        .eq('id', props.gameId)
        .single()
    if (error) throw error
    return data
}, { watch: [() => props.gameId] })

const year = computed(() => {
    if (existingGame.value) return new Date(existingGame.value.created_at).getFullYear()
    const queryYear = Number(route.query.year)
    return Number.isFinite(queryYear) && queryYear > 0 ? queryYear : new Date().getFullYear()
})

const { data: participants } = await useAsyncData(`game-participants-${year.value}`, async () => {
    const { data, error } = await supabase.from('registrations')
        .select('id, name, sirname, gender, birthday')
        .eq('year', year.value)
        .order('birthday', { ascending: true })
    if (error) throw error
    return data
}, { watch: [year] })

const game = reactive({
    name: existingGame.value?.game ?? '',
    num_teams: 1,
})

const { data: team_assignment } = await useAsyncData(`game-teams-${existingGame.value?.id ?? 'new'}`, async () => {
    if (!existingGame.value) return null
    const { data, error } = await supabase.from('teams')
        .select('player_id, team').eq('game_id', existingGame.value.id)
    if (error) throw error
    return data
})

if (team_assignment.value?.length) {
    game.num_teams = Math.max(...team_assignment.value.map(a => a.team)) + 1
}

const players = reactive(participants.value?.map(({ id, name, sirname, gender, birthday }) => {
    let team = team_assignment.value?.find(({ player_id }) => player_id === id)?.team
    if (team === undefined || team === null) {
        team = -1 // Default to -1 if no team is assigned
    }
    return {
        id, name, sirname, gender, age: calculateAge(birthday),
        team: team
    }
}) || [])

interface Team {
    id: number,
    players: Array<any>,
    score?: number
}

const { data: scores, refresh: refresh_scores } = await useAsyncData(`game-scores-${existingGame.value?.id ?? 'new'}`, async () => {
    if (!existingGame.value) return null
    const { data, error } = await supabase.from('team_scores')
        .select('team, score').eq('game_id', existingGame.value.id)
    if (error) throw error
    return data
})

const teams = computed(() => {
    let teams: Team[] = [];
    for (let id = 0; id < game.num_teams; id++) {
        teams.push({
            id,
            players: players?.filter(({ team }) => team === id) || [],
            score: scores.value?.find(({ team }) => team === id)?.score || null
        })
    }
    return teams
})



const options_score = computed(() => {
    let options: any[] = [
        { label: "Keine", value: null }
    ]
    options = options.concat(teams.value.map((_, index) => index + 1))
    return options
})
async function setScore(team: number, score: any) {
    if (!existingGame.value) {
        toast.add({
            title: "Fehlgeschlagen!",
            description: "Du musst das Spiel erst speichern",
            color: "error",
            duration: 5000,
        })
        return
    }
    const gameId = existingGame.value.id
    const { error: deleteError } = await supabase.from("team_scores")
        .delete()
        .eq("game_id", gameId)
        .eq("team", team)
    if (deleteError) {
        toast.add({
            title: "Fehlgeschlagen!",
            description: deleteError.message,
            color: "error",
            duration: 5000,
        })
        return
    }
    if (score !== null) {
        const { error: insertError } = await supabase.from("team_scores")
            .insert({ game_id: gameId, team, score })
        if (insertError) {
            toast.add({
                title: "Fehlgeschlagen!",
                description: insertError.message,
                color: "error",
                duration: 5000,
            })
            return
        }
    }
    toast.add({
        title: score !== null ? "Punkte vergeben!" : "Punkte gelöscht!",
        color: "success",
        duration: 1000,
    })
    await refresh_scores()
}

function getAverageAge({ players }: Team) {
    return Math.round((players.reduce((total: number, { age }) => total + age, 0) / players.length) * 10) / 10
}

function getRandomTeam() {
    let probabilities = teams.value.map(team => {
        const num_player = team.players.length;
        if (num_player === 0) return 1; // Avoid division by zero
        return 1 / num_player;
    })

    // Normalize probabilities to be between 0 and 1
    // probabilities = probabilities.map(prob => Math.exp(prob));
    const total_probability = probabilities.reduce((a, b) => a + b, 0)

    let random = Math.random() * total_probability;
    for (let i = 0; i < probabilities.length; i++) {
        if (random < probabilities[i]) {
            return i;
        }
        random -= probabilities[i];
    }
    return -1;
}

function createTeams() {
    players?.forEach(player => {
        player.team = getRandomTeam()
    })
}



function startDrag(evt: DragEvent, player_id: number) {
    if (!evt.dataTransfer) return
    evt.dataTransfer.dropEffect = 'move'
    evt.dataTransfer.effectAllowed = 'move'
    evt.dataTransfer.setData('player_id', String(player_id))
}
function onDrop(evt: DragEvent, team_id: number) {
    if (!evt.dataTransfer) return
    const player_id = parseInt(evt.dataTransfer.getData('player_id'))
    const player = players.find(player => player.id === player_id)
    if (!player) return
    player.team = team_id
}

const saving = ref(false)
function saveError(error: string) {
    toast.add({
        title: "Speichern fehlgeschlagen!",
        description: error,
        duration: 5000,
        color: "error"
    })
}
async function save() {
    if (!game.name) {
        saveError("Bitte wähle zunächst einen Spielnamen.")
        return
    }
    if (game.name.length > 30) {
        saveError("Der Spielname darf maximal 30 Zeichen lang sein.")
        return
    }
    saving.value = true
    try {
        let gameId = existingGame.value?.id

        if (gameId) {
            const { error } = await supabase.from("games").update({ game: game.name }).eq("id", gameId)
            if (error) {
                saveError(error.message)
                return
            }
        } else {
            const { data, error } = await supabase.from("games").insert({ game: game.name }).select("id").single()
            if (error || !data) {
                saveError(error?.message ?? "Unbekannter Fehler")
                return
            }
            gameId = data.id
        }

        const { error: deleteError } = await supabase.from("teams").delete().eq("game_id", gameId)
        if (deleteError) {
            saveError(deleteError.message)
            return
        }

        const { error: insertError } = await supabase.from("teams")
            .insert(players.map(({ id, team }) => ({
                player_id: id,
                game_id: gameId,
                team
            })))
        if (insertError) {
            saveError(insertError.message)
            return
        }

        toast.add({
            title: 'Spiel gespeichert!',
            color: 'success',
            duration: 5000
        })
        await navigateTo(`/intern/edit_game/${gameId}`)
    } finally {
        saving.value = false
    }
}

const deleting = ref(false)
async function remove() {
    if (!existingGame.value) return
    if (!confirm(`Willst du "${game.name}" wirklich löschen?`)) return
    deleting.value = true
    const { error } = await supabase.from("games")
        .delete().eq("id", existingGame.value.id)
    if (error) {
        toast.add({
            title: "Löschen fehlgeschlagen!",
            description: error.message,
            color: "error",
            duration: 5000
        })
        deleting.value = false
        return
    }
    toast.add({
        title: "Spiel gelöscht!",
        color: "success",
        duration: 1000,
    })
    deleting.value = false
    await navigateTo('/intern')
}
</script>

<style lang="css" scoped>
.team-enter-active,
.team-leave-active {
    transition: all 0.5s ease;
}

.team-enter-from,
.team-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
</style>
