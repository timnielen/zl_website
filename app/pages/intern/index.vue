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
                <div class="flex gap-2 items-center">
                    <USelect v-model="selectedYear" :items="yearOptions" class="w-32" />
                    <UInput v-model="globalFilter" class="max-w-sm" placeholder="Filtern..." :ui="{ trailing: 'pe-1' }">
                        <template v-if="globalFilter?.length" #trailing>
                            <UButton color="neutral" variant="link" size="sm" icon="i-material-symbols-close"
                                aria-label="Clear input" @click="clearFilter" />
                        </template>
                    </UInput>
                    <UCheckbox label="Namen anpinnen" v-model="name_pinned"></UCheckbox>
                </div>
                <div class="flex gap-2">
                    <UDropdownMenu :items="column_items" :content="{ align: 'end' }" :ui="{ content: 'max-h-96' }">
                        <UButton label="Spalten" color="neutral" variant="subtle"
                            trailing-icon="i-lucide-chevron-down" />
                    </UDropdownMenu>
                    <ToExcel name="Anmeldungen" :sheets="[{ name: 'Anmeldungen', rows: registrations ?? [], columnVisibility }]" :refresh="refresh"></ToExcel>
                </div>
            </div>

            <!-- <div class="flex justify-between py-3.5 px-4 border-b  border-(--ui-border-accented)">
                
            </div> -->
            <UTable ref="myTable" v-model:column-visibility="columnVisibility" v-model:column-pinning="columnPinning"
                v-model:global-filter="globalFilter" :data="registrations || undefined" :columns="columns"/>
        </div>

        <USeparator />
        <Games :year="selectedYear"></Games>
        <USeparator />
        <Scores :year="selectedYear"></Scores>
        <USeparator />
        <ProseH2><ULink :to="`/intern/dish_service/${selectedYear}`">Spüldienst</ULink></ProseH2>
    </TextSection>
</template>

<script setup lang="ts">
import { UBadge, UButton, UCheckbox } from '#components'
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui'
import { createClient } from '@supabase/supabase-js'
import type { CellContext, HeaderContext } from '@tanstack/vue-table'
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

type Registration = Record<string, unknown> & { id: number, created_at: string, year: number, number: number }

const selectedYear = ref(new Date().getFullYear())

const { data: availableYears } = await useRegistrationYears()

const yearOptions = computed(() => {
    const years = new Set(availableYears.value ?? [])
    years.add(selectedYear.value)
    return [...years].sort((a, b) => b - a)
})

const { data: registrations, refresh } = await useAsyncData('getRegistrations', async () => {
    const { data, error } = await supabase
        .from('registrations_view')
        .select('*')
        .eq('year', selectedYear.value)
        .order('birthday', { ascending: true })
    if (error) throw error

    return data.map((row, index) => {
        const { data: details, ...persistent } = row as { data: Record<string, unknown> | null } & Record<string, unknown>
        return { ...persistent, ...(details ?? {}), number: index + 1 } as Registration
    })
}, { watch: [selectedYear] })

const table = useTemplateRef('myTable')

const column_items = computed<DropdownMenuItem[]>((): DropdownMenuItem[] => {
    const columns = table.value?.tableApi.getAllColumns() ?? []
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

// Cells are formatted automatically, purely from the column's name/value shape.
// No per-key configuration: a "_filename" column becomes a download button, a
// boolean column becomes a Ja/Nein badge, and date/timestamp-shaped strings get
// localized formatting. Anything else renders as-is.

function isDateOnly(value: unknown): value is string {
    return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function isTimestamp(value: unknown): value is string {
    return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)
}

function downloadCell({ row, column }: CellContext<Registration, unknown>) {
    const filename = row.getValue(column.id) as string
    if (!filename) return null
    return h(UButton, {
        variant: 'ghost',
        icon: 'i-material-symbols-download',
        async onClick() {
            const { data, error } = await supabase.storage.from('consent').download(filename)
            if (error) throw error
            const url = URL.createObjectURL(data)

            const a = document.createElement('a')
            a.href = url
            a.target = '_blank'
            a.download = filename
            document.body.appendChild(a)
            a.click()
            a.remove()

            URL.revokeObjectURL(url)
        }
    }, () => filename)
}

function booleanBadgeCell({ row, column }: CellContext<Registration, unknown>) {
    const value = row.getValue(column.id) as boolean
    return h(UBadge, { class: 'capitalize', variant: 'subtle', color: value ? 'success' : 'error' }, () => value ? 'Ja' : 'Nein')
}

function dateCell({ row, column }: CellContext<Registration, unknown>) {
    const value = row.getValue(column.id) as string
    if (!value) return ''
    return new Date(value).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

function timestampCell({ row, column }: CellContext<Registration, unknown>) {
    const value = row.getValue(column.id) as string
    if (!value) return ''
    return new Date(value).toLocaleString('de-DE', {
        day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false
    })
}

function inferCell(key: string, sample: unknown) {
    if (key.endsWith('_filename')) return downloadCell
    if (typeof sample === 'boolean') return booleanBadgeCell
    if (isDateOnly(sample)) return dateCell
    if (isTimestamp(sample)) return timestampCell
    return undefined
}

const columns = computed<TableColumn<Registration>[]>(() => {
    const rows = registrations.value ?? []
    const cols: TableColumn<Registration>[] = [
        { accessorKey: 'number', header: getHeader('Nr.'), cell: ({ row }) => row.getValue('number') }
    ]

    const keys = new Set<string>()
    for (const row of rows) {
        for (const key of Object.keys(row)) {
            if (key !== 'number') keys.add(key)
        }
    }

    for (const key of keys) {
        const sample = rows.find((row) => row[key] !== null && row[key] !== undefined)?.[key]
        const cell = inferCell(key, sample)
        cols.push({ accessorKey: key, header: getHeader(key), ...(cell ? { cell } : {}) })
    }

    return cols
})

const columnVisibility = ref({
    id: false,
    created_at: false,
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
function clearFilter() {
    globalFilter.value = ''
}

</script>
