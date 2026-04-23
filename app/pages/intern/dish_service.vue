<template>
    <TextSection>
        <ULink to="/intern"><- Zurück zur Übersicht </ULink>
                <ProseH1 class="text-primary-500">Spüldienst</ProseH1>
                <p>Hier kannst du den Spüldienst für die Woche planen. 
                    Ziehe Teilnehmer in die Slots, um sie zuzuweisen.
                    <br></br>
                    Benennung der Felder: Name (Alter) - Spüldienste (gesamt) - Spüldienste am jeweiligen Tag - Spüldienste zu jeweiliger Mahlzeit.
                </p>
                <UFormField>
                    <ToExcel :sheets="excel_data" :refresh="refresh_assignment" name="Spüldienst"></ToExcel>
                </UFormField>
                <UFormField label="Anzahl Teilnehmer pro Slot">
                    <UInput v-model="slot_count" type="number" min="1" :max="participants?.length || 1" />
                </UFormField>
                <div class="flex gap-1">
                    <UButton icon="streamline-ultimate:dice-bold" size="md" color="neutral" variant="solid"
                        @click="randomize()">Zufällig verteilen
                    </UButton>
                    <UButton icon="material-symbols:delete-forever" size="md" color="neutral" variant="subtle"
                        @click="clear_all_teams()">Alle leeren
                    </UButton>
                </div>
                <UFormField>
                    <UButton icon="material-symbols:save-rounded" size="md" color="primary" variant="solid"
                        @click="save()">Speichern
                    </UButton>
                </UFormField>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div class="relative">

                        <UCard variant="subtle" class="sticky top-5 z-10 max-h-[95vh] overflow-y-auto">
                            <template #header>
                                <ProseH2>Teilnehmende</ProseH2>
                            </template>
                            <div class="grid gap-1">
                                <TransitionGroup name="team">
                                    <UBadge v-for="p in p_slot_counts" :key="p.id" draggable="true"
                                        @dragstart="startDrag($event, p.id, null)" color="neutral" variant="outline"
                                        class="cursor-grab">
                                        {{ p.name }} {{ p.sirname }} ({{ p.age }}) - {{ p.num_slots }}
                                    </UBadge>
                                </TransitionGroup>
                            </div>
                        </UCard>
                    </div>
                    <div
                        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 col-span-1 md:col-span-2 lg:col-span-3">
                        <UCard v-for="team in teams" :key="team.slot" variant="subtle" @drop="onDrop($event, team.slot)"
                            @dragover.prevent @dragenter.prevent>
                            <template #header>
                                <div class="flex items-center gap-1">
                                    <ProseH3 class="end">{{ team.name }}</ProseH3>
                                    <UButton icon="streamline-ultimate:dice-bold" size="sm" color="neutral"
                                        variant="solid" @click="randomize_team(team.slot)">
                                    </UButton>
                                    <UButton icon="material-symbols:delete-forever" size="sm" color="neutral"
                                        variant="subtle" @click="clear_team(team.slot)">
                                    </UButton>
                                </div>
                            </template>
                            <div class="grid gap-1">
                                <TransitionGroup name="team">
                                    <UBadge v-for="member in team.members" :key="member.id" draggable="true"
                                        @dragstart="startDrag($event, member.id, team.slot)" color="neutral"
                                        variant="outline" class="cursor-grab">
                                        {{ member.name }} {{ member.sirname }} ({{ member.age }}) - {{ member.num_slots }} - {{ count_day(member.id, team.slot) }} - {{ count_dish(member.id, team.slot) }}
                                    </UBadge>
                                </TransitionGroup>
                            </div>
                            <template #footer v-if="team.members.length > 0">
                                <div class="flex flex-col">
                                    <span>Durchschnittsalter: {{ getAverageAge(team) }} Jahre</span>
                                    <span class="text-primary-500">Anzahl: {{ team.members.length }}</span>


                                </div>
                            </template>
                        </UCard>
                    </div>
                </div>

    </TextSection>
</template>

<script lang="ts" setup>
import { createClient } from '@supabase/supabase-js'
const runtimeConfig = useRuntimeConfig()
const supabase = createClient(runtimeConfig.public.SUPABASE_URL, runtimeConfig.public.SUPABASE_KEY)

const toast = useToast()

definePageMeta({
    middleware: ['auth']
})

const { data: participants, refresh: refresh_participants } = await useAsyncData("getParticipants", async () => {
    const { data, error } = await supabase.from("numbered_participants")
        .select("id, name, sirname, gender, birthday")
        .order("number", { ascending: true })
    if (error) throw error
    return data
})

const { data: assignment, refresh: refresh_assignment } = await useAsyncData("getDishServiceAssignment", async () => {
    const { data, error } = await supabase.from("dish_service")
        .select("participant, slot ")
        .order("slot")
    if (error) throw error
    return data
})


function calculateAge(birthday: string) {
    var ageDifMs = Date.now() - new Date(birthday);
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}
function getAverageAge({ members }) {
    return Math.round((members.reduce((total: number, { age }) => total + age, 0) / members.length) * 10) / 10
}

const p_slot_counts = computed(() => {
    return participants.value?.map(({ id, name, sirname, birthday }) => {
        const age = calculateAge(birthday)
        const num_slots = assignment.value?.filter(({ participant: p }) => p === id).length
        return { id, name, sirname, birthday, age, num_slots }
    }) || []
})

const weekdays = ["Sa", "So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"]
const slots = ["Frühstück", "Mittagessen", "Abendessen"]

const teams = computed(() => {
    let result = []
    for (let i = 0; i < weekdays.length; i++) {
        for (let j = 0; j < slots.length; j++) {
            const slot = i * slots.length + j
            const name = weekdays[i] + " - " + slots[j]
            const members = assignment.value?.filter(({ slot: s }) => s === slot)
                .map(({ participant }) => p_slot_counts.value!.find(p => p.id === participant)!) || []
            members.sort((a, b) => new Date(a.birthday).getTime() - new Date(b.birthday).getTime())
            result.push({ name, slot, members })
        }
    }
    return result
})

const slot_count = ref(7)

function randomize_team(team: number) {
    let members: any[] = []
    while (members.length < slot_count.value) {
        if (members.length >= p_slot_counts.value.length) {
            toast.add({
                title: "Nicht genug Teilnehmer",
                description: "Es gibt nicht genug Teilnehmer für die gewählte Anzahl an Slots.",
                color: "warning",
                duration: 3000
            });
            return;
        }
        const random_index = Math.floor(Math.random() * p_slot_counts.value.length)
        const id = p_slot_counts.value[random_index].id
        if (!members.find(m => m.participant === id)) {
            members.push({ participant: id, slot: team })
        }
    }
    assignment.value = (assignment.value?.filter(({ slot }) => slot !== team) || []).concat(members)
}

function clear_team(team: number) {
    assignment.value = assignment.value?.filter(({ slot }) => slot !== team)
}

function clear_all_teams() {
    assignment.value = []
}

function randomize() {
    for (const team of teams.value) {
        randomize_team(team.slot)
    }
}

function startDrag(evt: DragEvent, id: string, slot: number | null) {
    if (!evt.dataTransfer) return
    evt.dataTransfer.dropEffect = 'move'
    evt.dataTransfer.effectAllowed = 'move'
    evt.dataTransfer.setData('participant', String(id))
    if (slot !== null) {
        assignment.value = assignment.value?.filter(({ participant, slot: s }) => !(participant === id && s === slot)) || []
    }
}

function onDrop(evt: DragEvent, slot: number) {
    if (!evt.dataTransfer) return
    const id = parseInt(evt.dataTransfer.getData('participant'))
    if (id === null)
        return
    assignment.value = assignment.value?.filter(({ participant, slot: s }) => !(participant === id && s === slot)) || []
    assignment.value.push({ participant: id, slot })
}


async function save() {
    {
        const { error } = await supabase.from("dish_service").delete().gt("slot", -1)
        if (error) {
            toast.add({
                title: "Fehler beim Löschen der alten Daten",
                description: error.message,
                color: "error",
                duration: 5000
            });
            return;
        }
    }
    {
        const { error } = await supabase.from("dish_service").insert(assignment.value)
        if (error) {
            toast.add({
                title: "Fehler beim Speichern der Daten",
                description: error.message,
                color: "error",
                duration: 5000
            });
            return;
        }
    }
    toast.add({
        title: "Daten gespeichert",
        color: "success",
        duration: 1000,
    })
    refresh_assignment()
}

function count_day(id: number, slot: number) {
    const min_slot = Math.floor(slot / slots.length) * slots.length
    const max_slot = min_slot + slots.length - 1
    return assignment.value?.filter(({ participant: p, slot: s }) => p === id && s >= min_slot && s <= max_slot).length || 0
}

function count_dish(id: number, slot: number) {
    return assignment.value?.filter(({ participant: p, slot: s }) => p === id && (s % slots.length) === (slot % slots.length)).length || 0
}


const excel_data = computed(() => {
    let rows: any[] = []
    for (const team of teams.value) {
        team.members.forEach((member, index) => {
            if (index >= rows.length) {
                rows.push({})
            }
            rows[index][team.name] = `${member.name} ${member.sirname} (${member.age})`
        })
    }
    return [{ name: "Spüldienst", rows, columnVisibility: {} }]
})

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