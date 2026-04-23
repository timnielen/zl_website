
import { createClient } from '@supabase/supabase-js'
import { file_schema, getRegistrationTableColumnsFromState, row_schema, registrationStateColumnTypes } from '~~/types/registration'
import type { RegistrationDbColumnType, RowSchema } from '~~/types/registration'
import { getRegistrationPeriodFromRuntimeConfig, isRegistrationOpenAt } from '~~/utils/registration-period'
import mail from 'nodemailer'
import * as v from 'valibot'
import path from 'path';
const runtimeConfig = useRuntimeConfig()
const supabase = createClient(runtimeConfig.public.SUPABASE_URL, runtimeConfig.SUPABASE_PRIVATE_KEY)
const registrationTableColumns = getRegistrationTableColumnsFromState()
const persistedColumnNames = new Set(registrationTableColumns.map((column) => column.name))

const transporter = mail.createTransport({
    host: "mail.gmx.net",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: runtimeConfig.EMAIL,
        pass: runtimeConfig.EMAIL_PASSWORD,
    },
});
const publicPath = process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : path.join(process.cwd(), "public");

type MultipartPart = NonNullable<Awaited<ReturnType<typeof readMultipartFormData>>>[number]

function parsePrimitiveFieldValue(rawValue: string, columnType: RegistrationDbColumnType, currentValue: unknown) {
    if (columnType === 'boolean') {
        return rawValue === 'true' || rawValue === '1' || rawValue === 'on'
    }

    if (columnType === 'integer') {
        if (rawValue.trim() === '') {
            return undefined
        }
        return Number(rawValue)
    }

    if (columnType === 'text[]') {
        if (rawValue.trim() === '') {
            return []
        }

        try {
            const parsed = JSON.parse(rawValue)
            if (Array.isArray(parsed)) {
                return parsed.map((item) => String(item))
            }
        } catch {
            // Fall through to simple value handling.
        }

        if (Array.isArray(currentValue)) {
            return [...currentValue, rawValue]
        }

        return [rawValue]
    }

    return rawValue
}

function sanitizeFilename(filename: string) {
    return filename
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9.-_]/g, '_')
}

function withTimestamp(filename: string) {
    const parts = filename.split('.')

    if (parts.length < 2) {
        return `${filename}_${Date.now()}`
    }

    parts[parts.length - 2] += `_${Date.now()}`
    return parts.join('.')
}

function parseMultipartPayload(parts: NonNullable<Awaited<ReturnType<typeof readMultipartFormData>>>) {
    const payload: Record<string, unknown> = {}
    let consentPart: MultipartPart | null = null

    for (const part of parts) {
        if (!part?.name) {
            continue
        }

        if (part.name === 'consent') {
            consentPart = part
            continue
        }

        if (!(part.name in registrationStateColumnTypes)) {
            continue
        }

        const columnType = registrationStateColumnTypes[part.name as keyof typeof registrationStateColumnTypes]
        const rawValue = Buffer.from(part.data).toString('utf8')
        const currentValue = payload[part.name]
        payload[part.name] = parsePrimitiveFieldValue(rawValue, columnType, currentValue)
    }

    return {
        payload,
        consentPart
    }
}

export default defineEventHandler(async (event) => {
    const registrationPeriod = getRegistrationPeriodFromRuntimeConfig(runtimeConfig.public)
    if (!isRegistrationOpenAt(registrationPeriod.startDate, registrationPeriod.endDate))
        throw createError({
            statusCode: 423,
            statusMessage: 'Registration not open!',
        })

    let parts: Awaited<ReturnType<typeof readMultipartFormData>>
    try {
        parts = await readMultipartFormData(event)
    } catch (e) {
        console.error(e)
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid or missing registration form data',
        })
    }

    if (!parts || parts.length === 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Registration form data is incomplete',
        })
    }

    const { payload, consentPart } = parseMultipartPayload(parts)

    if (!consentPart?.type || !consentPart.data) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Consent file is missing',
        })
    }

    let consentBlob: Blob
    try {
        consentBlob = new Blob([new Uint8Array(consentPart.data)], { type: consentPart.type })
        v.parse(file_schema, { consent: consentBlob })
    } catch (e) {
        console.error(e)
        throw createError({
            statusCode: 400,
            statusMessage: "Consent file couldn't be read",
        })
    }

    const rawFilename = consentPart.filename ?? 'consent-upload'
    const safeFilename = withTimestamp(sanitizeFilename(rawFilename))
    const yearlyFilename = `${registrationPeriod.registrationYear}/${safeFilename}`

    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('consent')
        .upload(yearlyFilename, consentBlob)

    if (uploadError || !uploadData?.path) {
        console.error(uploadError)
        throw createError({
            statusCode: 500,
            statusMessage: "Couldn't upload file. Please try again later.",
        })
    }

    payload.consent_filename = uploadData.path

    let parsedRow: RowSchema
    try {
        parsedRow = v.parse(row_schema, payload)
    } catch (e) {
        console.error(e)
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid or missing form data',
        })
    }

    const persistedBody = Object.fromEntries(
        Object.entries(parsedRow).filter(([key]) => persistedColumnNames.has(key))
    )

    const { data: tableName, error: ensureTableError } = await supabase
        .rpc('ensure_yearly_registrations_table', {
            target_year: registrationPeriod.registrationYear,
            fields: registrationTableColumns
        })

    if (ensureTableError || !tableName) {
        console.error(ensureTableError)
        throw createError({
            statusCode: 500,
            statusMessage: "Couldn't prepare yearly registrations table. Please try again later.",
        })
    }

    const { error } = await supabase.from(tableName as string).insert(persistedBody)
    if (error) {
        console.error(error)
        throw createError({
            statusCode: 500,
            statusMessage: "Couldn't insert data. Please try again later.",
        })
    }
    try {
        await transporter.sendMail({
            from: `"Orgateam Zeltlager" <${runtimeConfig.EMAIL}>`, // sender address
            to: parsedRow.email, // list of receivers
            subject: `Bestätigung Anmeldung Zeltlager ${registrationPeriod.registrationYear}`, // Subject line
            text: generateEmailText(parsedRow, registrationPeriod.registrationYear), // plain text body
            attachments: [{
                filename: "08_Reisebedingungen_fur_Kirchenstiftungen_11.01.2016-1.pdf",
                path: publicPath + "/files/08_Reisebedingungen_fur_Kirchenstiftungen_11.01.2016-1.pdf"
            }, 
            {
                filename: "Packliste.pdf",
                path: publicPath + "/files/Packliste.pdf"
            }, 
            {
                filename: "Wegbeschreibung.pdf",
                path: publicPath + "/files/Wegbeschreibung.pdf"
            }
            ]
        });
    } catch (e) {
        console.error(e)
        throw createError({
            statusCode: 500,
            statusMessage: "Couldn't send email. Please try again later.",
        })
    }

    setResponseStatus(event, 201)
    // await sendRedirect(event, '/', 302)
})


function generateEmailText(data: RowSchema, registrationYear: number) {
    return `Liebe(r) ${data.name},
            
hiermit bestätigen wir deine Anmeldung fürs Zeltlager ${registrationYear}. Wir freuen uns schon tierisch auf dich!

Anbei findet ihr nochmal die Reisebedingungen und die Packliste, sowie die Wegbeschreibungen zu Kirche & Zeltplatz.
Der Elternabend findet am 23.06.2025 um 18:00 Uhr im Pfarrheim neben der Kirche statt. 
    
Wir haben die folgenden Daten von dir erhalten:

${Object.entries(data).map((entry) => `${entry[0]}: ${entry[1] || "k. A."}`).join("\n")}

Bitte überprüfe nochmal, ob alles richtig ist. Wenn nicht, antworte auf diese E-Mail und korrigiere die falschen Angaben.
Sollten bei dir oder deinen Eltern weitere Probleme oder Fragen auftreten, kontaktiert mich gerne direkt unter +49 176 81229107.
    
LG Johannes Heiß
(Ortsgruppenleitung der KjG Ortsgruppe Zeltlager Milbertshofen)`
}