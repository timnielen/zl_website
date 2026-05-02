
import { createClient } from '@supabase/supabase-js'
import { file_schema, sql_schema } from '~~/types/registration'
import type { SQLSchema } from '~~/types/registration'
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

type MultipartPart = NonNullable<Awaited<ReturnType<typeof readMultipartFormData>>>[number]

function sanitizeFilename(filename: string) {
    return filename
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-zA-Z0-9.-_]/g, '_')
}

function withTimestamp(filename: string) {
    const parts = filename.split('.')
    if (parts.length < 2) return `${filename}_${Date.now()}`
    parts[parts.length - 2] += `_${Date.now()}`
    return parts.join('.')
}

function extractParts(parts: NonNullable<Awaited<ReturnType<typeof readMultipartFormData>>>) {
    let data: unknown = null
    let consentPart: MultipartPart | null = null

    for (const part of parts) {
        if (!part?.name) continue
        if (part.name === 'consent') consentPart = part
        else if (part.name === 'data') data = JSON.parse(Buffer.from(part.data).toString('utf8'))
    }

    return { data, consentPart }
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

    const { data, consentPart } = extractParts(parts)

    if (!data || typeof data !== 'object')
        throw createError({ statusCode: 400, statusMessage: 'Missing data field' })

    if (!consentPart?.type || !consentPart.data)
        throw createError({ statusCode: 400, statusMessage: 'Consent file is missing' })

    let consentBlob: Blob
    try {
        consentBlob = new Blob([new Uint8Array(consentPart.data)], { type: consentPart.type })
        v.parse(file_schema, { consent: consentBlob })
    } catch (e) {
        console.error(e)
        throw createError({ statusCode: 400, statusMessage: "Consent file couldn't be read" })
    }

    const safeFilename = withTimestamp(sanitizeFilename(consentPart.filename ?? 'consent-upload'))
    const yearlyFilename = `${registrationPeriod.registrationYear}/${safeFilename}`

    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('consent')
        .upload(yearlyFilename, consentBlob)

    if (uploadError || !uploadData?.path) {
        console.error(uploadError)
        throw createError({ statusCode: 500, statusMessage: "Couldn't upload file. Please try again later." })
    }

    let parsedRow: SQLSchema
    try {
        parsedRow = v.parse(sql_schema, { ...data, consent_filename: uploadData.path })
    } catch (e) {
        console.error(e)
        throw createError({ statusCode: 400, statusMessage: 'Invalid or missing form data' })
    }

    const tableName = `Registrations_${registrationPeriod.registrationYear}`

    const { error } = await supabase.from(tableName).insert(parsedRow)
    if (error) {
        console.error(error)
        const isUndefinedTable = error.code === '42P01'
        throw createError({
            statusCode: isUndefinedTable ? 503 : 500,
            statusMessage: isUndefinedTable
                ? `Registration table for ${registrationPeriod.registrationYear} does not exist. Please contact the administrator.`
                : "Couldn't insert data. Please try again later.",
        })
    }

    try {
        await transporter.sendMail({
            from: `"Orgateam Zeltlager" <${runtimeConfig.EMAIL}>`,
            to: parsedRow.email,
            subject: `Bestätigung Anmeldung Zeltlager ${registrationPeriod.registrationYear}`,
            text: generateEmailText(parsedRow, registrationPeriod.registrationYear),
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

function generateEmailText(data: SQLSchema, registrationYear: number) {
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
