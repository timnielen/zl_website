import * as v from 'valibot'

const login_schema = v.object({
    email: v.pipe(v.string(), v.email('Bitte geben Sie eine gültige E-Mail-Adresse ein')),
    password: v.pipe(v.string(), v.minLength(2, 'Das Passwort muss mindestens 2 Zeichen lang sein')),
})

export type LoginSchema = v.InferOutput<typeof login_schema>

export {login_schema}