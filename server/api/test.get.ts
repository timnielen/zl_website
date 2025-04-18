import { createClient } from '@supabase/supabase-js'
import auth from '~/middleware/auth'
const runtimeConfig = useRuntimeConfig()
const supabase = createClient(runtimeConfig.public.SUPABASE_URL, runtimeConfig.SUPABASE_PRIVATE_KEY)
console.log(runtimeConfig.SUPABASE_PRIVATE_KEY)

export default defineEventHandler(async (event) => {
    const res = await supabase.from("Registrations").select("*")
    console.log(res)
})