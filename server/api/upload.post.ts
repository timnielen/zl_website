import { createClient } from '@supabase/supabase-js'
import { file_schema } from '@/types/registration'
import * as v from 'valibot'
const runtimeConfig = useRuntimeConfig()
const supabase = createClient(runtimeConfig.SUPABASE_URL, runtimeConfig.SUPABASE_KEY)

export default defineEventHandler(async (event) => {
    let form_data;
    try {
        form_data = await readMultipartFormData(event)
    } catch (e) {
        console.error(e)
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid or missing form data',
        })
    }
    if (!form_data || form_data.length != 1 || !form_data[0].type || !form_data[0].name)
        throw createError({
            statusCode: 400,
            statusMessage: 'Form data is incomplete',
        })

    // const file = form_data[0].data as Blob
    let file: Blob;
    try {
        file = new Blob([form_data[0].data], { type: form_data[0].type })
        v.parse(file_schema, { consent: file })
    } catch (e) {
        console.error(e)
        throw createError({
            statusCode: 400,
            statusMessage: "File data couldn't be read",
        })
    }
    let filename = form_data[0].name
        .normalize('NFD') // Decomposes accented characters
        .replace(/[\u0300-\u036f]/g, '') // Removes the accents
        .replace(/[^a-zA-Z0-9.-_]/g, '_') // Replaces non-alphanumeric characters with underscores

    let partial = filename.split(".")
    if (partial.length < 2) throw createError({
        statusCode: 400,
        statusMessage: "Invalid filename!",
    })
    partial[partial.length-2] += "_" + new Date().getTime()
    filename = partial.join('.')

    return supabase.storage
    .from('consent')
    .upload(filename, file)

})