import { createClient } from '@supabase/supabase-js'

export function useRegistrationYears() {
    const runtimeConfig = useRuntimeConfig()
    const supabase = createClient(runtimeConfig.public.SUPABASE_URL, runtimeConfig.public.SUPABASE_KEY)

    return useAsyncData('getRegistrationYears', async () => {
        const { data, error } = await supabase.from('registrations').select('year')
        if (error) throw error
        return [...new Set(data.map((row) => row.year as number))].sort((a, b) => b - a)
    })
}
