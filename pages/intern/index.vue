<template>
    <TextSection>

        <ProseH1>Interne Übersicht</ProseH1>
        <ProseH2>Anmeldungen</ProseH2>
        <div>
            <UDropdownMenu :items="column_items" :ui="{ group: 'max-h-96' }">
                <UButton label="Angezeigte Spalten" color="neutral" variant="outline"
                    trailing-icon="i-lucide-chevron-down" />
            </UDropdownMenu>
        </div>
        <UTable ref="myTable" :data="registrations || undefined" :columns="columns"
            v-model:column-visibility="columnVisibility" />
        <div>
            <UButton color="neutral" @click="logOut" :loading="loading">Abmelden</UButton>
        </div>

    </TextSection>
</template>

<script setup lang="ts">
import { UBadge, UButton, UCheckbox } from '#components'
import type { DropdownMenuItem, TableColumn, } from '@nuxt/ui'
import { createClient } from '@supabase/supabase-js'
import type { RowSchema } from '~/types/registration'
import type { CellContext } from '@tanstack/vue-table'
import { title, type variant } from 'valibot'
import ConfirmationButton from '~/components/ConfirmationButton.vue'
definePageMeta({
    middleware: ['auth']
})
const loading = ref(false)
const runtimeConfig = useRuntimeConfig()
const supabase = createClient(runtimeConfig.public.SUPABASE_URL, runtimeConfig.public.SUPABASE_KEY)
const router = useRouter()
async function logOut() {
    loading.value = true
    const { error } = await supabase.auth.signOut()
    if (error)
        console.error(error)
    router.push("/")
    loading.value = false
}

const { data: registrations, refresh } = await useAsyncData("getRegistrations", async () => {
    const { data, error } = await supabase.from("Registrations").select("*")
    if (error) throw error
    return data
})
console.log(registrations.value)

const table = useTemplateRef('myTable')

const column_items = computed<DropdownMenuItem[]>((): DropdownMenuItem[] => {
    const columns = table.value?.tableApi.getAllColumns() ?? []
    console.log(columns)
    return columns.filter((column) => column.getCanHide())
        .map((column) => ({
            label: column.columnDef.header as string,
            type: 'checkbox' as const,
            checked: column.getIsVisible(),
            onUpdateChecked(checked: boolean) {
                table.value?.tableApi?.getColumn(column.id)?.toggleVisibility(checked)
            },
            onSelect(e?: Event) {
                e?.preventDefault()
            }
        }))
})


type Registration = RowSchema & { id: number, created_at: string, paid: boolean }
function yesno(column: string) {
    return ({ row }: CellContext<Registration, unknown>) => {
        const color = row.getValue(column) ? 'success' : 'error';

        return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
            row.getValue(column) ? "Ja" : "Nein"
        )
    }
}
const columns: TableColumn<Registration>[] = [
    { accessorKey: 'id', header: 'id' },
    {
        accessorKey: 'created_at',
        header: 'Anmeldezeitpunkt',
        cell: ({ row }) => {
            return new Date(row.getValue('created_at')).toLocaleString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            })
        }
    },
    { accessorKey: 'name', header: 'Vorname' },
    { accessorKey: 'sirname', header: 'Nachname' },
    { accessorKey: 'gender', header: 'Geschlecht' },
    {
        accessorKey: 'birthday',
        header: 'Geburtsdatum',
        cell: ({ row }) => {
            return new Date(row.getValue('birthday')).toLocaleDateString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            })
        }
    },
    { accessorKey: 'address', header: 'Adresse' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'fitness', header: 'Fitness', cell: yesno('fitness') },
    { accessorKey: 'swimmer', header: 'Schwimmlevel' },
    { accessorKey: 'food', header: 'Essenswunsch' },
    { accessorKey: 'diseases', header: 'Erkrankungen (Auswahl)' },
    { accessorKey: 'disease_description', header: 'Erkrankungen' },
    { accessorKey: 'wound_care', header: 'Wundversorgung?', cell: yesno('wound_care') },
    { accessorKey: 'pull_ticks', header: 'Zecken entfernen?', cell: yesno('pull_ticks') },
    { accessorKey: 'vaccination', header: 'Impfstatus ausreichend?', cell: yesno('vaccination') },
    { accessorKey: 'vaccination_description', header: 'Impfstatus' },
    { accessorKey: 'group_activity_consent', header: 'Aufsichtspflicht-Entbindung' },
    { accessorKey: 'contact_doctor', header: 'Hausarzt' },
    { accessorKey: 'arrival', header: 'Anreiseart' },
    { accessorKey: 'arrival_driver', header: 'Fahrer*in (Hinfahrt)' },
    { accessorKey: 'arrival_places', header: 'Plätze (Hinfahrt)' },
    { accessorKey: 'arrival_baggage', header: 'Gepäck (Hinfahrt)' },
    { accessorKey: 'return_driver', header: 'Fahrer*in (Rückfahrt)' },
    { accessorKey: 'return_places', header: 'Plätze (Rückfahrt)' },
    { accessorKey: 'return_baggage', header: 'Gepäck (Rückfahrt)' },
    {
        accessorKey: 'emergency',
        header: 'Notfall',
        cell: ({ row }) => {
            return `${row.getValue("emergency_name")} (${row.getValue("emergency_relationship")}), ${row.getValue("emergency_phone_number")}, ${row.getValue("emergency_email")}`
        }
    },
    { accessorKey: 'emergency_name', header: 'Name (Notfall)' },
    { accessorKey: 'emergency_relationship', header: 'Verwandtschaftsgrad (Notfall)' },
    { accessorKey: 'emergency_phone_number', header: 'Telefonnummer (Notfall)' },
    { accessorKey: 'emergency_email', header: 'Email (Notfall)' },
    { accessorKey: 'comments', header: 'Kommentare' },
    {
        accessorKey: 'photos', header: 'Fotos', cell: ({ row }) => {
            const color = {
                'Ja, veröffentlichen': 'success' as const,
                'Ja, NICHT veröffentlichen': 'neutral' as const,
                'Nein': 'error' as const
            }[row.getValue('photos') as string]

            return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
                row.getValue('photos')
            )
        }
    },
    {
        accessorKey: 'consent_filename', header: 'Einverständniserklärung', cell: ({ row }) => {
            const filename = row.getValue('consent_filename') as string;
            return h(UButton, {
                variant: "ghost",
                icon: "i-material-symbols-download",
                async onClick() {
                    const { data, error } = await supabase.storage.from("consent").download(filename)
                    if (error) throw error
                    const url = URL.createObjectURL(data)
                    
                    const a = document.createElement('a')
                    a.href = url
                    a.target = "_blank"
                    a.download = filename // set desired filename
                    document.body.appendChild(a)
                    a.click()
                    a.remove()

                    URL.revokeObjectURL(url)
                }
            }, () => filename)
        }
    },
    { accessorKey: 'privacy_agreement', header: 'Zustimmung Datenschutzerklärung', cell: yesno('privacy_agreement') },
    { accessorKey: 'invitation_next_year', header: "Zustimmung Einladung", cell: yesno('invitation_next_year') },
    {
        accessorKey: 'paid', header: "Bezahlt?", cell: ({ row }) => {
            const paid = row.getValue('paid') as boolean;
            return h(ConfirmationButton, {
                title: "Möchtest du den Status ändern?",
                label_confirm: "Ändern",
                label_cancel: "Abbrechen",
                action: async () => {
                    const { data, error } = await supabase.from("Registrations")
                        .update({ paid: !paid })
                        .eq('id', row.getValue('id') as number)
                    if(error) console.error(error)
                    await refresh()
                }
            }, () => h(UButton, {
                label: paid ? "Ja" : "Nein",
                color: paid ? "success" : "error",
                variant: 'subtle',
                size: "xs",
                icon: "i-material-symbols-edit"
            }))
        }
    },
]
const columnVisibility = ref({
    id: false,
    created_at: false,
    fitness: false,
    group_activity_consent: false,
    privacy_agreement: false,
    disease_description: false,
    vaccination_description: false,
    arrival_driver: false,
    arrival_places: false,
    arrival_baggage: false,
    return_driver: false,
    return_places: false,
    return_baggage: false,
    emergency_name: false,
    emergency_relationship: false,
    emergency_phone_number: false,
    emergency_email: false,
})

</script>