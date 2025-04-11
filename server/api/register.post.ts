
import { createClient } from '@supabase/supabase-js'
import { row_schema } from '@/types/registration'
import type { RowSchema } from '@/types/registration'
import mail from 'nodemailer'
import * as v from 'valibot'
import path from 'path';
const runtimeConfig = useRuntimeConfig()
const supabase = createClient(runtimeConfig.SUPABASE_URL, runtimeConfig.SUPABASE_KEY)
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

export default defineEventHandler(async (event) => {
    let body: Record<string, any> = {}
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

    const { error } = await supabase.from("Registrations").insert(body)
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
            to: body.email, // list of receivers
            subject: `Bestätigung Anmeldung Zeltlager ${runtimeConfig.YEAR}`, // Subject line
            text: generateEmailText(body as RowSchema), // plain text body
            attachments: [{
                filename: "08_Reisebedingungen_fur_Kirchenstiftungen_11.01.2016-1.pdf",
                path: publicPath + "/files/08_Reisebedingungen_fur_Kirchenstiftungen_11.01.2016-1.pdf"
            }, 
            {
                filename: "packliste.pdf",
                path: publicPath + "/files/packliste.pdf"
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


function generateEmailText(data: RowSchema) {
    return `Liebe(r) ${data.name},
            
hiermit bestätigen wir deine Anmeldung fürs Zeltlager ${runtimeConfig.YEAR}. Wir freuen uns schon tierisch auf dich!
    
Wir haben die folgenden Daten von dir erhalten:

${Object.entries(data).map((entry) => `${entry[0]}: ${entry[1] || "k. A."}`).join("\n")}

Bitte überprüfe nochmal, ob alles richtig ist. Wenn nicht, antworte auf diese E-Mail und korrigiere die falschen Angaben.
Anbei findet ihr nochmal die Reisebedingungen und die Packliste.
Sollten bei dir oder deinen Eltern weitere Probleme oder Fragen auftreten, kontaktiert mich gerne direkt unter +49 176 61906287.
    
MfG Johannes Heiß
(Ortsgruppenleitung der KjG Ortsgruppe Zeltlager Milbertshofen)`
}