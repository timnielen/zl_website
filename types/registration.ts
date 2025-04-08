import type { FormSubmitEvent } from '#ui/types'
import * as v from 'valibot'

const genders = ['männlich', 'weiblich', 'divers'] as const;
const swimLevels = ["Schwimmer/in", "Schwimmanfänger/in", "Nichtschwimmer/in"] as const;
const foodOptions = ["alles", "vegan", "vegetarisch", "kein Schweinefleisch"] as const;
const diseases = [
    "Herzbeschwerden, bekannte Herzfehler, Herzkrankheiten, Blutdruckanomalien",
    "Asthma, Bronchitis oder ähnliche Beschwerden der Atemwege",
    "Diabetes oder andere Stoffwechselerkrankungen",
    "Schwindelzustände, Ohnmachtsanfälle, Migräne, häufig starke Kopfschmerzen",
    "Epilepsie",
    "Allergien (auch Lebensmittel- und/oder Medikamentenallergie)",
    "Sonstige"
] as const;
const yesno = [{ value: true, label: "Ja" }, { value: false, label: "Nein" }]
const arrival = [
    { value: "Selbst (und hat noch PLATZ frei)", label: "Ich fahre mein Kind selber und habe noch Plätze frei" },
    { value: "Selbst (und hat KEINEN platz mehr frei)", label: "Ich fahre mein Kind selber, habe aber leider KEINE Plätze mehr frei" },
    { value: "Fährt WOANDERS mit", label: "Es ist bereits abgesprochen, dass mein Kind bei Freunden mitfahren wird (bitte unten benennen)" },
    { value: "BRAUCHT Mitfahrgelegenheit", label: "Mein Kind hat noch keine Mitfahrgelegenheit" },
] as const;
const baggage = [
    { value: "noch extra platz", label: "Ich habe noch Platz für Gepäck zusätzlich zu dem der Kinder, welche ich mitnehme" },
    { value: "passt perfekt", label: "Bei mir reicht der Platz genau für das Gepäck der Kinder, welche ich mitnehme" },
    { value: "nicht genug platz", label: "Ich habe nicht genug Platz für das Gepäck der Kinder, welche ich mitnehme und bitte um Umverteilung" },
    { value: "ich fahre nicht", label: "Ich selber fahre keine Kinder" },
] as const;
const photos = [
    { value: "Ja, veröffentlichen", label: "Bilder/Videos gemacht und auf den sozialen Medien oder der Webseite der KJG Ortsgruppe Milbertshofen veröffentlicht werden" },
    { value: "Ja, NICHT veröffentlichen", label: "Bilder/Videos gemacht, aber NICHT im Internet veröffentlicht werden." },
    { value: "Nein", label: "KEINE Bilder/Videos gemacht werden" },
] as const;
const places = [0, 1, 2, 3, 4, 5] as const

const row_schema = v.object({
    name: v.pipe(v.string(), v.minLength(2, 'Der Vorname muss mindestens 2 Zeichen lang sein')),
    sirname: v.pipe(v.string(), v.minLength(2, 'Der Nachname muss mindestens 2 Zeichen lang sein')),
    gender: v.pipe(v.string(), v.picklist(genders, 'Bitte wählen Sie ein Geschlecht aus')),
    birthday: v.pipe(v.string(), v.regex(/^\d{4}-\d{2}-\d{2}$/, 'Bitte geben Sie ein gültiges Datum ein')),
    address: v.pipe(v.string(), v.minLength(5, 'Bitte geben Sie eine gültige Adresse ein')),
    email: v.pipe(v.string(), v.email('Bitte geben Sie eine gültige E-Mail-Adresse ein')),
    swimmer: v.pipe(v.string(), v.picklist(swimLevels, 'Bitte wählen Sie eine Schwimmstufe aus')),
    food: v.pipe(v.string(), v.picklist(foodOptions, 'Bitte wählen Sie eine Ernährungsweise aus')),
    diseases: v.optional(v.array(v.string())),
    disease_description: v.optional(v.string()),
    wound_care: v.boolean('Bitte wählen Sie eine Option'),
    pull_ticks: v.boolean('Bitte wählen Sie eine Option'),
    vaccination: v.boolean('Bitte wählen Sie eine Option'),
    vaccination_description: v.optional(v.string()),
    contact_doctor: v.pipe(v.string(), v.minLength(2, 'Bitte geben Sie die Kontaktdaten des Hausarztes ein')),
    arrival: v.pipe(v.string(), v.picklist(arrival.map(p => p.value), 'Bitte wählen Sie eine Option')),
    arrival_driver: v.optional(v.string()),
    arrival_places: v.optional(v.pipe(v.any(), v.transform((input) => Number(input)), v.number())),
    arrival_baggage: v.pipe(v.string(), v.minLength(2, 'Bitte wählen Sie eine Option')),
    return_driver: v.optional(v.string()),
    return_places: v.optional(v.pipe(v.any(), v.transform((input) => Number(input)), v.number())),
    return_baggage: v.pipe(v.string(), v.minLength(2, 'Bitte wählen Sie eine Option')),
    emergency_name: v.pipe(v.string(), v.minLength(2, 'Bitte geben Sie den Notfallkontakt-Namen ein')),
    emergency_relationship: v.pipe(v.string(), v.minLength(2, 'Bitte geben Sie die Beziehung an')),
    emergency_phone_number: v.pipe(v.string(), v.regex(/^\+?\d{7,15}$/, 'Bitte geben Sie eine gültige Telefonnummer ein')),
    emergency_email: v.pipe(v.string(), v.email('Bitte geben Sie eine gültige E-Mail-Adresse ein')),
    photos: v.pipe(v.string(), v.picklist(photos.map(p => p.value), 'Bitte wählen Sie eine Option aus')),
    fitness: v.literal(true, "Bitte geben Sie uns hier Ihre Einverständnins"),
    group_activity_consent: v.literal(true, "Bitte geben Sie uns hier Ihre Einverständnins"),
    privacy_agreement: v.literal(true, "Bitte geben Sie uns hier Ihre Einverständnins"),
    consent_filename: v.string(),
    comments: v.optional(v.string()),
})

const file_schema = v.object({
    consent: v.pipe(
        v.union([v.file(), v.blob()], 'Bitte laden Sie die Einverständniserklärung hoch'),
        v.mimeType(['image/jpeg', 'image/png', 'application/pdf'], 'Bitte lade nur JPEG, PNG, oder PDF Dateien hoch'),
        v.maxSize(1024 * 1024 * 5, 'Die Datei muss unter 5 MB groß sein')
    ),
})

const schema = v.intersect([
    row_schema,
    file_schema
])

export type Schema = v.InferOutput<typeof schema>
export type RowSchema = v.InferOutput<typeof row_schema>
export type FileSchema = v.InferOutput<typeof file_schema>
export { schema, row_schema, file_schema, arrival, baggage, diseases, foodOptions, genders, photos, swimLevels, yesno, places }