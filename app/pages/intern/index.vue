<template>
    <TextSection>

        <ProseH1 class="text-primary-500">Interne Übersicht</ProseH1>
        <div>
            <UButton color="neutral" @click="logOut" :loading="loading">Abmelden</UButton>
        </div>
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
                <div class="flex gap-2">
                    <UDropdownMenu :items="column_items" :content="{ align: 'end' }" :ui="{ content: 'max-h-96' }">
                        <UButton label="Spalten" color="neutral" variant="subtle"
                            trailing-icon="i-lucide-chevron-down" />
                    </UDropdownMenu>
                    <ToExcel name="Anmeldungen" :sheets="[{ name: 'Anmeldungen', rows: registrations, columnVisibility }]" :refresh="refresh"></ToExcel>
                </div>
            </div>

            <UTable ref="myTable" v-model:column-visibility="columnVisibility" v-model:column-pinning="columnPinning"
                v-model:global-filter="globalFilter" :data="registrations || undefined" :columns="columns"/>
            <div class="flex justify-between py-3.5 px-4 border-b  border-(--ui-border-accented)">
                <UCheckbox label="Namen anpinnen" v-model="name_pinned"></UCheckbox>
            </div>
        </div>

        <USeparator />
        <Games></Games>
        <USeparator />
        <Scores></Scores>
        <USeparator />
        <ProseH2><ULink to="/intern/dish_service">Spüldienst</ULink></ProseH2>
    </TextSection>
</template>

<script setup lang="ts">
import { UBadge, UButton, UCheckbox } from '#components'
import type { DropdownMenuItem, TableColumn, } from '@nuxt/ui'
import { createClient } from '@supabase/supabase-js'
import type { SQLSchema } from '~~/types/registration'
import type { CellContext, HeaderContext } from '@tanstack/vue-table'
import { title, type variant } from 'valibot'
import ConfirmationButton from '~/components/ConfirmationButton.vue'
import { Games, Scores, ToExcel } from '#components'

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

const table_name = "Registrations_" + new Date(runtimeConfig.public.REGISTRATION_END_DATE).getFullYear();
const { data: registrations, refresh } = await useAsyncData("getRegistrations", async () => {
    const { data, error } = await supabase.from(table_name)
        .select("*")
        .order("birthday", { ascending: true })
    if (error) throw error
    
    const new_data = data.map((registration, index) => ({
        ...registration,
        number: index + 1
    }))
    console.log("registrations", new_data)
    return new_data
})

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


type Registration = SQLSchema & { id: number, number: number, created_at: string, paid: boolean }
function yesno(column: string) {
    return ({ row }: CellContext<Registration, unknown>) => {
        const color = row.getValue(column) ? 'success' : 'error';

        return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
            row.getValue(column) ? "Ja" : "Nein"
        )
    }
}

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

const columns: TableColumn<Registration>[] = []
columns.push(
    {
        accessorKey: 'number',
        header: getHeader('Nr.'),
        cell: ({ row }) => row.getValue('number')
    }
)
for (const key in registrations.value?.[0] ?? {}) {
    if (columns.find(c => c.accessorKey === key || c.id === key)) continue
    columns.push({
        accessorKey: key,
        header: getHeader(key)
    })
}
function setCell(key: string, cell: (context: CellContext<Registration, unknown>) => any) {
    const column = columns.find(c => c.accessorKey === key)
    if (column) column.cell = cell
}
function setBeforeCell(key: string, column: TableColumn<Registration>) {
    const index = columns.findIndex(c => c.accessorKey === key)
    if (index !== -1) columns.splice(index, 0, column)
}

setCell("created_at", ({ row }) => {
    return new Date(row.getValue('created_at')).toLocaleString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    })
})

setBeforeCell("name", {
        id: "full_name",
        header: getHeader('Name'),
        cell: ({ row }) => `${row.getValue('name')} ${row.getValue('sirname')}`
    }
)

setBeforeCell("emergency_1_name", {
        accessorKey: 'emergency1',
        header: getHeader('Notfall1'),
        cell: ({ row }) => {
            console.log(row)
            return `${row.getValue("emergency_1_name")} (${row.getValue("emergency_1_relationship")}), ${row.getValue("emergency_1_phone_number")}, ${row.getValue("emergency_1_email")}`
        }
    }
)
setBeforeCell("emergency_2_name", {
        accessorKey: 'emergency2',
        header: getHeader('Notfall2'),
        cell: ({ row }) => {
            console.log(row)
            return `${row.getValue("emergency_2_name")} (${row.getValue("emergency_2_relationship")}), ${row.getValue("emergency_2_phone_number")}, ${row.getValue("emergency_2_email")}`
        }
    }
)

setBeforeCell("birthday", {
        id: "age",
        header: getHeader('Alter'),
        cell: ({ row }) => {
            const birthday = new Date(row.getValue('birthday'))
            const today = new Date()
            let age = today.getFullYear() - birthday.getFullYear()
            const m = today.getMonth() - birthday.getMonth()
            if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
                age--
            }
            return age
        }
    }
)

setCell("birthday", ({ row }) => new Date(row.getValue('birthday')).toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
    })
)

setCell("photos", ({ row }) => {
    const color = {
        'Ja, veröffentlichen': 'success' as const,
        'Ja, NICHT veröffentlichen': 'neutral' as const,
        'Nein': 'error' as const
    }[row.getValue('photos') as string]

    return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
        row.getValue('photos')
    )
})

setCell("consent_filename", ({ row }) => {
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
})

setCell("paid", ({ row }) => {
    const paid = row.getValue('paid') as boolean;
    return h(ConfirmationButton, {
        title: "Möchtest du den Status ändern?",
        label_confirm: "Ändern",
        label_cancel: "Abbrechen",
        action: async () => {
            const { data, error } = await supabase.from(table_name)
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
})



const columnVisibility = ref({
    id: false,
    name: false,
    sirname: false,
    created_at: false,
    fitness: false,
    group_activity_consent: false,
    privacy_agreement: false,
    disease_description: false,
    vaccination_description: false,
    emergency_1_name: false,
    emergency_1_relationship: false,
    emergency_1_phone_number: false,
    emergency_1_email: false,
    emergency_2_name: false,
    emergency_2_relationship: false,
    emergency_2_phone_number: false,
    emergency_2_email: false,
})
const name_pinned = ref(true)
const left_pinned = computed(() => {
    return [name_pinned.value ? "full_name" : undefined]
})
const columnPinning = reactive({
    left: left_pinned,
    right: []
})

const globalFilter = ref('')

</script>