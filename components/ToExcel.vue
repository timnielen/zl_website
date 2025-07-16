<template>
<UButton icon="material-symbols:download" @click="to_xlsx(props.name, props.rows, props.columnVisibility)">Excel</UButton>
</template>

<script setup lang="ts">
import XLSX from "xlsx";

const props = defineProps<{
    name: string,
    rows: any[] | null,
    refresh: () => Promise<void>,
    columnVisibility: Record<string, boolean>
}>()
const runtimeConfig = useRuntimeConfig()

async function to_xlsx(name: string, rows: any[] | null, columnVisibility: Record<string, boolean>) {
    await props.refresh()
    if (!rows || rows.length === 0) {
        useToast().add({
            title: "Keine Daten zum Exportieren",
            description: "Die Tabelle enthält keine Daten.",
            color: "warning",
            duration: 3000
        });
        return;
    }
    const worksheet = XLSX.utils.json_to_sheet(rows.map(row => {
        const filteredRow: Record<string, any> = {};
        for (const [key, value] of Object.entries(row)) {
            if (!(key in columnVisibility) || columnVisibility[key] === true) {
                filteredRow[key] = value;
            }
        }
        return filteredRow;
    }), { skipHeader: false });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Anmeldungen');

    // Generate Excel file as Blob
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });

    // Create a download link and trigger it
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}_${runtimeConfig.public.YEAR}_${new Date().getTime()}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
</script>