
import { createClient } from '@supabase/supabase-js'
import { schema, persistentFields } from '~~/types/registration'
import type { RegistrationState } from '~~/types/registration'
import { getRegistrationPeriodFromRuntimeConfig, isRegistrationOpenAt } from '~~/utils/registration-period'
import mail from 'nodemailer'
import * as v from 'valibot'
import path from 'path'

const runtimeConfig = useRuntimeConfig()
const supabase = createClient(runtimeConfig.public.SUPABASE_URL, runtimeConfig.SUPABASE_PRIVATE_KEY)

const transporter = mail.createTransport({
    service: runtimeConfig.EMAIL_SERVICE,
    auth: {
        user: runtimeConfig.EMAIL,
        pass: runtimeConfig.EMAIL_PASSWORD
    }
})

console.log('Verifying connection...')
transporter.verify().then(() => {
    console.log('Connection to email service verified successfully.')
}).catch((error) => {
    console.error('Error verifying connection to email service:', error)
})

const publicPath = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : path.join(process.cwd(), 'public')

function sanitizeFilename(filename: string) {
    return filename
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-zA-Z0-9._-]/g, '_')
}

function withTimestamp(filename: string) {
    const parts = filename.split('.')
    if (parts.length < 2) return `${filename}_${Date.now()}`
    parts[parts.length - 2] += `_${Date.now()}`
    return parts.join('.')
}

function throwInsertError(error: { code?: string } | null): never {
    const isUndefinedTable = error?.code === '42P01'
    throw createError({
        statusCode: isUndefinedTable ? 503 : 500,
        statusMessage: isUndefinedTable
            ? 'Registration tables do not exist. Please contact the administrator.'
            : "Couldn't insert data. Please try again later."
    })
}

/** Reassembles the multipart body into one plain object: `_data` is parsed as JSON, every other part becomes a Blob under its own field name. */
function extractParts(parts: NonNullable<Awaited<ReturnType<typeof readMultipartFormData>>>) {
    const raw: Record<string, unknown> = {}
    const filenames = new Map<string, string>()

    for (const part of parts) {
        if (!part?.name) continue

        if (part.name === '_data') {
            Object.assign(raw, JSON.parse(Buffer.from(part.data).toString('utf8')))
        } else {
            raw[part.name] = new Blob([new Uint8Array(part.data)], { type: part.type })
            if (part.filename) filenames.set(part.name, part.filename)
        }
    }

    return { raw, filenames }
}

export default defineEventHandler(async (event) => {
    const registrationPeriod = getRegistrationPeriodFromRuntimeConfig(runtimeConfig.public)
    if (!isRegistrationOpenAt(registrationPeriod.startDate, registrationPeriod.endDate))
        throw createError({ statusCode: 423, statusMessage: 'Registration not open!' })

    let parts: Awaited<ReturnType<typeof readMultipartFormData>>
    try {
        parts = await readMultipartFormData(event)
    } catch (e) {
        console.error(e)
        throw createError({ statusCode: 400, statusMessage: 'Invalid or missing registration form data' })
    }

    if (!parts || parts.length === 0)
        throw createError({ statusCode: 400, statusMessage: 'Registration form data is incomplete' })

    const { raw, filenames } = extractParts(parts)

    let parsedRow: RegistrationState
    try {
        parsedRow = v.parse(schema, raw) as RegistrationState
    } catch (e) {
        console.error(e)
        throw createError({ statusCode: 400, statusMessage: 'Invalid or missing form data' })
    }

    const persistent: RegistrationState = {}
    const details: RegistrationState = {}
    const filesToUpload: Record<string, Blob> = {}

    for (const [key, value] of Object.entries(parsedRow)) {
        if ((persistentFields as readonly string[]).includes(key)) persistent[key] = value
        else if (value instanceof Blob) filesToUpload[key] = value
        else details[key] = value
    }

    for (const [key, blob] of Object.entries(filesToUpload)) {
        const safeFilename = withTimestamp(sanitizeFilename(filenames.get(key) ?? `${key}-upload`))
        const storagePath = `${registrationPeriod.registrationYear}/${key}_${safeFilename}`

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('consent')
            .upload(storagePath, blob)

        if (uploadError || !uploadData?.path) {
            console.error(uploadError)
            throw createError({ statusCode: 500, statusMessage: "Couldn't upload file. Please try again later." })
        }

        details[`${key}_filename`] = uploadData.path
    }

    const { data: registrationRow, error: registrationError } = await supabase
        .from('registrations')
        .insert(persistent)
        .select('id')
        .single()

    if (registrationError || !registrationRow) {
        console.error(registrationError)
        throwInsertError(registrationError)
    }

    const { error: detailsError } = await supabase
        .from('registration_details')
        .insert({ id: registrationRow.id, data: details })

    if (detailsError) {
        console.error(detailsError)
        await supabase.from('registrations').delete().eq('id', registrationRow.id)
        throwInsertError(detailsError)
    }

    const fullRow: RegistrationState = { ...persistent, ...details }

    try {
        await transporter.sendMail({
            from: `"Orgateam Zeltlager" <${runtimeConfig.EMAIL}>`,
            to: String(fullRow.email),
            subject: `Bestätigung Anmeldung Zeltlager ${registrationPeriod.registrationYear}`,
            text: generateEmailText(fullRow, registrationPeriod.registrationYear),
            attachments: [
                { filename: '08_Reisebedingungen_fur_Kirchenstiftungen_11.01.2016-1.pdf', path: `${publicPath}/files/08_Reisebedingungen_fur_Kirchenstiftungen_11.01.2016-1.pdf` },
                { filename: 'Packliste.pdf', path: `${publicPath}/files/Packliste.pdf` },
                { filename: 'Wegbeschreibung.pdf', path: `${publicPath}/files/Wegbeschreibung.pdf` },
            ],
        })
    } catch (e) {
        console.error(e)
        throw createError({ statusCode: 500, statusMessage: "Couldn't send email. Please try again later." })
    }

    setResponseStatus(event, 201)
})

function generateEmailText(data: RegistrationState, registrationYear: number) {
    return `Liebe(r) ${data.name},

hiermit bestätigen wir deine Anmeldung fürs Zeltlager ${registrationYear}. Wir freuen uns schon tierisch auf dich!

Anbei findet ihr nochmal die Reisebedingungen und die Packliste, sowie die Wegbeschreibungen zu Kirche & Zeltplatz.
Der Elternabend findet am 06.07.2026 um 18:00 Uhr im Pfarrheim neben der Kirche statt.

Wir haben die folgenden Daten von dir erhalten:

${Object.entries(data).map((entry) => `${entry[0]}: ${entry[1] || 'k. A.'}`).join('\n')}

Bitte überprüfe nochmal, ob alles richtig ist. Wenn nicht, antworte auf diese E-Mail und korrigiere die falschen Angaben.
Sollten bei dir oder deinen Eltern weitere Probleme oder Fragen auftreten, kontaktiert uns gerne direkt unter +49 176 81229107.

Liebe Grüße
euer Zeltlager Team`
}
