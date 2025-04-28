<template>
    <TextSection>

        <ProseH1 class="text-primary-500">Interne Übersicht</ProseH1>
        <USeparator />
        <ProseH2>Anmeldungen</ProseH2>

        <div class="grid w-full border-(--ui-border-accented) border rounded-lg">
            <div class="flex justify-between py-3.5 px-4 border-b  border-(--ui-border-accented)">
                <UInput v-model="globalFilter" class="max-w-sm" placeholder="Filtern..." :ui="{ trailing: 'pe-1' }">
                    <template v-if="globalFilter?.length" #trailing>
                        <UButton color="neutral" variant="link" size="sm" icon="i-material-symbols-close"
                            aria-label="Clear input" @click="globalFilter = ''" />
                    </template>
                </UInput>
                <UDropdownMenu :items="column_items" :content="{ align: 'end' }" :ui="{ content: 'max-h-96' }">
                    <UButton label="Spalten" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-down" />
                </UDropdownMenu>
            </div>

            <UTable ref="myTable" v-model:column-visibility="columnVisibility" v-model:column-pinning="columnPinning"
                v-model:global-filter="globalFilter" :data="registrations || undefined" :columns="columns" />
            <div class="flex justify-between py-3.5 px-4 border-b  border-(--ui-border-accented)">
                <UCheckbox label="Vornamen anpinnen" v-model="name_pinned"></UCheckbox>
            </div>
        </div>
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
import type { CellContext, HeaderContext } from '@tanstack/vue-table'
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
            label: column.id,
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
    { accessorKey: 'id', header: getHeader('id') },
    {
        accessorKey: 'created_at',
        header: getHeader('Anmeldezeitpunkt'),
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
    { accessorKey: 'name', header: getHeader("Vorname") },
    { accessorKey: 'sirname', header: getHeader('Nachname') },
    { accessorKey: 'gender', header: getHeader('Geschlecht') },
    {
        accessorKey: 'birthday',
        header: getHeader('Geburtsdatum'),
        cell: ({ row }) => {
            return new Date(row.getValue('birthday')).toLocaleDateString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            })
        }
    },
    { accessorKey: 'address', header: getHeader('Adresse') },
    { accessorKey: 'email', header: getHeader('Email') },
    { accessorKey: 'fitness', header: getHeader('Fitness'), cell: yesno('fitness') },
    { accessorKey: 'swimmer', header: getHeader('Schwimmlevel') },
    { accessorKey: 'food', header: getHeader('Essenswunsch') },
    { accessorKey: 'diseases', header: getHeader('Erkrankungen (Auswahl)') },
    { accessorKey: 'disease_description', header: getHeader('Erkrankungen') },
    { accessorKey: 'wound_care', header: getHeader('Wundversorgung?'), cell: yesno('wound_care') },
    { accessorKey: 'pull_ticks', header: getHeader('Zecken entfernen?'), cell: yesno('pull_ticks') },
    { accessorKey: 'vaccination', header: getHeader('Impfstatus ausreichend?'), cell: yesno('vaccination') },
    { accessorKey: 'vaccination_description', header: getHeader('Impfstatus') },
    { accessorKey: 'group_activity_consent', header: getHeader('Aufsichtspflicht-Entbindung') },
    { accessorKey: 'contact_doctor', header: getHeader('Hausarzt') },
    { accessorKey: 'arrival', header: getHeader('Anreiseart') },
    { accessorKey: 'arrival_driver', header: getHeader('Fahrer*in (Hinfahrt)') },
    { accessorKey: 'arrival_places', header: getHeader('Plätze (Hinfahrt)') },
    { accessorKey: 'arrival_baggage', header: getHeader('Gepäck (Hinfahrt)') },
    { accessorKey: 'return_driver', header: getHeader('Fahrer*in (Rückfahrt)') },
    { accessorKey: 'return_places', header: getHeader('Plätze (Rückfahrt)') },
    { accessorKey: 'return_baggage', header: getHeader('Gepäck (Rückfahrt)') },
    {
        accessorKey: 'emergency',
        header: getHeader('Notfall'),
        cell: ({ row }) => {
            return `${row.getValue("emergency_name")} (${row.getValue("emergency_relationship")}), ${row.getValue("emergency_phone_number")}, ${row.getValue("emergency_email")}`
        }
    },
    { accessorKey: 'emergency_name', header: getHeader('Name (Notfall)') },
    { accessorKey: 'emergency_relationship', header: getHeader('Verwandtschaftsgrad (Notfall)') },
    { accessorKey: 'emergency_phone_number', header: getHeader('Telefonnummer (Notfall)') },
    { accessorKey: 'emergency_email', header: getHeader('Email (Notfall)') },
    { accessorKey: 'comments', header: getHeader('Kommentare') },
    {
        accessorKey: 'photos', header: getHeader('Fotos'), cell: ({ row }) => {
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
        accessorKey: 'consent_filename', header: getHeader('Einverständniserklärung'), cell: ({ row }) => {
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
    { accessorKey: 'privacy_agreement', header: getHeader('Zustimmung Datenschutzerklärung'), cell: yesno('privacy_agreement') },
    { accessorKey: 'invitation_next_year', header: getHeader("Zustimmung Einladung"), cell: yesno('invitation_next_year') },
    {
        accessorKey: 'paid', header: getHeader("Bezahlt?"), cell: ({ row }) => {
            const paid = row.getValue('paid') as boolean;
            return h(ConfirmationButton, {
                title: "Möchtest du den Status ändern?",
                label_confirm: "Ändern",
                label_cancel: "Abbrechen",
                action: async () => {
                    const { data, error } = await supabase.from("Registrations")
                        .update({ paid: !paid })
                        .eq('id', row.getValue('id') as number)
                    if (error) console.error(error)
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

function getHeader(label: string) {
    return ({ column }: HeaderContext<Registration, unknown>) => {
        const isSorted = column.getIsSorted()
        return h(UButton, {
            color: 'neutral',
            variant: 'ghost',
            label,
            icon: isSorted
                ? isSorted === 'asc'
                    ? 'i-lucide-arrow-up-narrow-wide'
                    : 'i-lucide-arrow-down-wide-narrow'
                : 'i-lucide-arrow-up-down',
            class: '-mx-2.5',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
        })
    }
}

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
const name_pinned = ref(true)
const left_pinned = computed(() => {
    return [name_pinned.value ? "name" : undefined]
})
const columnPinning = reactive({
    left: left_pinned,
    right: []
})

const globalFilter = ref('')

</script>