<template>
    <UButton icon="material-symbols:download" @click="to_xlsx(props.name, props.sheets, props.refresh)">Excel
    </UButton>
</template>

<script setup lang="ts">
import XLSX from "xlsx";

export interface Sheet {
    name: string;
    rows: any[];
    columnVisibility?: Record<string, boolean>;
}

const props = defineProps<{
    name: string,
    sheets: Sheet[],
    refresh: () => Promise<void>,
}>()


async function to_xlsx(name: string, sheets: Sheet[], refresh: () => Promise<void>) {
    await refresh()
    console.log(sheets)
    if (!sheets || sheets.length === 0) {
        useToast().add({
            title: "Keine Daten zum Exportieren",
            description: "Die Tabelle enthält keine Daten.",
            color: "warning",
            duration: 3000
        });
        return;
    }

    const workbook = XLSX.utils.book_new();
    for (const { name, rows, columnVisibility } of sheets) {

        const worksheet = XLSX.utils.json_to_sheet(rows.map(row => {
            const filteredRow: Record<string, any> = {};
            for (const [key, value] of Object.entries(row)) {
                if (!(key in columnVisibility) || columnVisibility[key] === true || key === "name" || key === "sirname") {
                    filteredRow[key] = value;
                }
            }
            return filteredRow;
        }), { skipHeader: false });
        XLSX.utils.book_append_sheet(workbook, worksheet, name);
    }

    // Generate Excel file as Blob
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });

    // Create a download link and trigger it
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}_${new Date().getTime()}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
</script>