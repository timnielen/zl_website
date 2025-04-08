
import { createClient } from '@supabase/supabase-js'
import {row_schema} from '@/types/registration'
import * as v from 'valibot'
const runtimeConfig = useRuntimeConfig()
const supabase = createClient(runtimeConfig.SUPABASE_URL, runtimeConfig.SUPABASE_KEY)

export default defineEventHandler(async (event) => {
    let body : Record<string, any> = {}
    try {
        body = await readBody(event)
        v.parse(row_schema, body)
    } catch (e) {
        console.error(e)
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid or missing form data',
        })
    }
    return supabase.from("Registrations").insert(body)
})
