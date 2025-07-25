<template>
    <TextSection>
        <ULink to="/intern"><- Zurück zur Übersicht</ULink>
                <ProseH1 v-if="!props.game" class="text-primary-500">Spiel erstellen</ProseH1>
                <ProseH1 v-else class="text-primary-500">{{ props.game }}</ProseH1>
                <USeparator />
                <UFormField v-if="!props.game" label="Spielname" name="name">
                    <UInput v-model="game.name" placeholder="Fuchsjagd" />
                </UFormField>
                <UFormField label="Anzahl Teams" name="num_teams">
                    <div class="flex gap-1">
                        <UInput v-model="game.num_teams" type="number" @change="createTeams()" />
                        <UButton icon="material-symbols:refresh" size="md" color="primary" variant="solid"
                            @click="createTeams()" />
                    </div>
                </UFormField>
                <UFormField>
                    <UButton icon="material-symbols:save-rounded" size="md" color="primary" variant="solid"
                        @click="save" :loading="saving">
                        Speichern</UButton>
                </UFormField>
                <UFormField>
                    <UButton v-if="saved_games?.find(entry => entry.game === game.name)"
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
    game?: String
}>()

const runtimeConfig = useRuntimeConfig()
const supabase = createClient(runtimeConfig.public.SUPABASE_URL, runtimeConfig.public.SUPABASE_KEY)

const toast = useToast()

function calculateAge(birthday: string) {
    var ageDifMs = Date.now() - new Date(birthday);
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

const { data: participants, refresh: refresh_participants } = await useAsyncData("getParticipants", async () => {
    const { data, error } = await supabase.from("numbered_participants")
        .select("id, name, sirname, gender, birthday")
        .order("number", { ascending: true })
    if (error) throw error
    return data
})

const { data: saved_games, refresh: refresh_games } = await useAsyncData("getAvailableGames", async () => {
    const { data, error } = await supabase.from("Teams")
        .select("game, count()")
    if (error) throw error
    return data
})

const game = reactive({
    name: props.game,
    num_teams: 1,
})

console.log(props.game)
const { data: team_assignment } = await useAsyncData("getTeams", async () => {
    if (!game.name) return null
    const { data, error } = await supabase.from("Teams")
        .select("player_id, team").eq("game", game.name)
    if (error) throw error
    return data
})

if (team_assignment.value) {
    game.num_teams = Math.max(...team_assignment.value!.map(a => a.team)) + 1
}

console.log(team_assignment.value)
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

console.log(players)

interface Team {
    id: number,
    players: Array<any>,
    score?: number
}

const { data: scores, refresh: refresh_scores } = await useAsyncData("getTeamScores", async () => {
    if (!game.name) return null
    const { data, error } = await supabase.from("team_scores")
        .select("team, score").eq("game", game.name)
    if (error) throw error
    return data
})

const teams = computed(() => {
    console.log(scores.value)
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
    await refresh_games()
    if (!saved_games.value?.find(entry => entry.game === game.name)) {
        toast.add({
            title: "Fehlgeschlagen!",
            description: "Du musst das Spiel erst speichern",
            color: "error",
            duration: 5000,
        })
        return
    }
    if (score == null) {
        const { error } = await supabase.from("team_scores")
            .delete()
            .eq("game", game.name)
            .eq("team", team)
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
    } else {
        const { error } = await supabase.from("team_scores")
            .upsert({ game: game.name, team, score })
        if (error) {
            toast.add({
                title: "Fehlgeschlagen!",
                description: error.message,
                color: "error",
                duration: 5000,
            })
        } else {
            toast.add({
                title: "Punkte vergeben!",
                color: "success",
                duration: 1000,
            })
        }
    }
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
    // console.log(age, probabilities)

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
function saveError(error: any) {
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
    saving.value = true
    try {
        await refresh_games()
        if (saved_games.value?.find(entry => entry.game === game.name)) {
            const confirmed = confirm(`Das Spiel "${game.name}" existiert bereits.\nWillst du es überschreiben?`)
            if (!confirmed) return saving.value = false
            else {
                const result = await supabase.from("Teams")
                    .delete().eq("game", game.name)
                if (result.error) {
                    saveError(result.error.message)
                    saving.value = false;
                    return
                }
            }
        }
    } catch (error: any) {
        saveError(error.message)
        saving.value = false;
        return
    }
    const { data, error } = await supabase.from("Teams")
        .insert(players.map(({ id, team }) => ({
            player_id: id,
            game: game.name,
            team
        })))
    if (!error) {
        toast.add({
            title: 'Spiel gespeichert!',
            color: 'success',
            duration: 5000
        })
    } else {
        saveError(error.message)
        saving.value = false;
    }
    await refresh_games()
    return saving.value = false

}

const deleting = ref(false)
async function remove() {
    if (!confirm(`Willst du "${game.name}" wirklich löschen?`)) return
    deleting.value = true
    const { error } = await supabase.from("Teams")
        .delete().eq("game", game.name)
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
            .eq("game", game.name)
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
    await refresh_scores()
    await refresh_games()
    deleting.value = false;
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