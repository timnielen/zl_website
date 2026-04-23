import * as v from 'valibot'

type OptionValue = string | number | boolean

export type FormOption<T extends OptionValue = OptionValue> = {
    value: T
    label: string
}

export type RegistrationFieldType =
    | 'text'
    | 'email'
    | 'date'
    | 'tel'
    | 'textarea'
    | 'select'
    | 'multiselect'
    | 'radio'
    | 'checkbox'
    | 'file'

export interface RegistrationState {
    name: string
    sirname: string
    gender: string
    birthday: string
    address: string
    plz: string
    city: string
    email: string
    swimmer: string
    fitness: boolean
    group_activity_consent: boolean
    
    food: string
    diseases_allergies: string
    wound_care?: boolean
    pull_ticks?: boolean
    vaccination_tetanus: boolean
    vaccination_fsme: boolean
    contact_doctor: string

    arrival: boolean
    return_driver: string
    places_arrival?: number
    places_return?: number

    emergency_1_name: string
    emergency_1_relationship: string
    emergency_1_phone_number: string
    emergency_1_email: string
    emergency_2_name: string
    emergency_2_relationship: string
    emergency_2_phone_number: string
    emergency_2_email: string

    photos: string
    privacy_agreement: boolean
    consent_filename: string
    consent: File | Blob | null
    comments: string
}

export interface RegistrationFieldConfig {
    kind: 'field'
    key: keyof RegistrationState
    fieldType: RegistrationFieldType
    label?: string
    description?: string
    placeholder?: string
    required?: boolean
    items?: Array<string | number | FormOption>
    checkboxLabel?: string
    accept?: string
    searchInput?: boolean
    className?: string
    visibleWhen?: (state: RegistrationState) => boolean
}

export interface RegistrationFieldRowConfig {
    kind: 'row'
    label?: string
    description?: string
    fields: RegistrationFieldConfig[]
    className?: string
}

export interface RegistrationInfoConfig {
    kind: 'info'
    content: string
    className?: string
}

export type RegistrationStageElement = RegistrationFieldConfig | RegistrationFieldRowConfig | RegistrationInfoConfig

export interface RegistrationStageConfig {
    id: string
    title: string
    description?: string
    elements: RegistrationStageElement[]
}


const genderValues = ['männlich', 'weiblich', 'divers'] as const
const swimmerValues = ["Schwimmer/in", "Schwimmanfänger/in", "Nichtschwimmer/in"] as const
const foodValues = ["alles", "vegan", "vegetarisch", "kein Schweinefleisch"] as const
const genders = [...genderValues]
const swimLevels = [...swimmerValues]
const foodOptions = [...foodValues]

const yesno: FormOption<boolean>[] = [{ value: true, label: "Ja" }, { value: false, label: "Nein" }]
const arrival: FormOption<boolean>[] = [{value: true, label: "Ja"}, {value: false, label: "Nein, mein Kind braucht eine Mitfahrgelegenheit"}]
const places = [0, 1, 2, 3, 4, 5]
const photos = [
    { value: "Ja, veröffentlichen", label: "Bilder/Videos gemacht und beim Nachtreffen geteilt werden, sowie auf den sozialen Medien oder der Webseite der KJG Ortsgruppe Zeltlager Milbertshofen veröffentlicht werden." },
    { value: "Ja, NICHT veröffentlichen", label: "Bilder/Videos gemacht und beim Nachtreffen geteilt werden, aber NICHT online veröffentlicht werden." },
    { value: "Nein", label: "KEINE Bilder/Videos gemacht werden bzw. schnellstmöglich gelöscht werden." },
] as const

const toPicklist = <T extends OptionValue>(values: readonly T[]) => values as [T, ...T[]]
const photoValues = toPicklist(photos.map((item) => item.value))

const row_schema = v.object({
    name: v.pipe(v.string(), v.minLength(2, 'Der Vorname muss mindestens 2 Zeichen lang sein')),
    sirname: v.pipe(v.string(), v.minLength(2, 'Der Nachname muss mindestens 2 Zeichen lang sein')),
    gender: v.pipe(v.string(), v.picklist(toPicklist(genderValues), 'Bitte wählen Sie ein Geschlecht aus')),
    birthday: v.pipe(v.string(), v.regex(/^\d{4}-\d{2}-\d{2}$/, 'Bitte geben Sie ein gültiges Datum ein')),
    address: v.pipe(v.string(), v.minLength(5, 'Bitte geben Sie eine gültige Adresse ein')),
    plz: v.pipe(v.string(), v.regex(/^\d{5}$/, 'Bitte geben Sie eine gültige Postleitzahl ein')),
    city: v.pipe(v.string(), v.minLength(2, 'Bitte geben Sie eine gültige Stadt ein')),
    email: v.pipe(v.string(), v.email('Bitte geben Sie eine gültige E-Mail-Adresse ein')),
    fitness: v.literal(true, "Bitte geben Sie uns hier Ihre Einverständnins"),
    swimmer: v.pipe(v.string(), v.picklist(toPicklist(swimmerValues), 'Bitte wählen Sie eine Schwimmstufe aus')),
    food: v.pipe(v.string(), v.picklist(toPicklist(foodValues), 'Bitte wählen Sie eine Ernährungsweise aus')),

    diseases_allergies: v.optional(v.string()),
    wound_care: v.boolean('Bitte wählen Sie eine Option'),
    pull_ticks: v.boolean('Bitte wählen Sie eine Option'),
    vaccination_tetanus: v.optional(v.boolean(), false),
    vaccination_fsme: v.optional(v.boolean(), false),
    contact_doctor: v.pipe(v.string(), v.minLength(2, 'Bitte geben Sie die Kontaktdaten des Hausarztes ein')),

    arrival: v.boolean('Bitte wählen Sie eine Option'),
    return_driver: v.optional(v.string()),
    places_arrival: v.optional(v.number()),
    places_return: v.optional(v.number()),

    emergency_1_name: v.pipe(v.string(), v.minLength(2, 'Bitte geben Sie den Notfallkontakt-Namen ein')),
    emergency_1_relationship: v.pipe(v.string(), v.minLength(2, 'Bitte geben Sie den Verwandschaftsgrad an')),
    emergency_1_phone_number: v.pipe(v.string(), v.regex(/^\+?\d{7,15}$/, 'Bitte geben Sie eine gültige Telefonnummer ein')),
    emergency_1_email: v.pipe(v.string(), v.email('Bitte geben Sie eine gültige E-Mail-Adresse ein')),
    emergency_2_name: v.pipe(v.string(), v.minLength(2, 'Bitte geben Sie den Notfallkontakt-Namen ein')),
    emergency_2_relationship: v.pipe(v.string(), v.minLength(2, 'Bitte geben Sie den Verwandschaftsgrad an')),
    emergency_2_phone_number: v.pipe(v.string(), v.regex(/^\+?\d{7,15}$/, 'Bitte geben Sie eine gültige Telefonnummer ein')),
    emergency_2_email: v.pipe(v.string(), v.email('Bitte geben Sie eine gültige E-Mail-Adresse ein')),

    photos: v.pipe(v.string(), v.picklist(photoValues, 'Bitte wählen Sie eine Option aus')),
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

const registrationStages: RegistrationStageConfig[] = [
    {
        id: 'participant',
        title: 'Teilnehmendes Kind',
        description: 'Allgemeine Informationen und Grunddaten des Kindes.',
        elements: [
            {
                kind: 'row',
                fields: [
                    { kind: 'field', key: 'name', fieldType: 'text', label: 'Vorname', required: true },
                    { kind: 'field', key: 'sirname', fieldType: 'text', label: 'Nachname', required: true }
                ]
            },
            {
                kind: 'row',
                fields: [
                    { kind: 'field', key: 'gender', fieldType: 'select', label: 'Geschlecht', placeholder: 'bitte auswählen', required: true, items: genders },
                    { kind: 'field', key: 'birthday', fieldType: 'date', label: 'Geburtsdatum', required: true }
                ]
            },
            {
                    kind: 'row',
                    fields: [
                        { kind: 'field', key: 'address', fieldType: 'text', label: 'Adresse', description: 'Straße, Hausnummer, Postleitzahl, Ort', required: true },
                        { kind: 'field', key: 'plz', fieldType: 'text', label: 'Postleitzahl', required: true },
                        { kind: 'field', key: 'city', fieldType: 'text', label: 'Ort', required: true }
                    ]
            },
            { kind: 'field', key: 'email', fieldType: 'email', label: 'E-Mail', description: 'An diese E-Mail senden wir alle weiteren Informationen', required: true },
            {
                kind: 'field',
                key: 'fitness',
                fieldType: 'checkbox',
                label: 'Fitness',
                required: true,
                checkboxLabel: 'Der/Die Teilnehmer/in ist in einer gesunden körperlichen und psychischen Verfassung und kann und darf grundsätzlich an Freizeitaktivitäten wie Wandern, Sport, Gelände- und Waldspielen, Schwimmbadbesuch etc. uneingeschränkt teilnehmen'
            },
            {
                kind: 'field',
                key: 'group_activity_consent',
                fieldType: 'checkbox',
                label: 'Gruppenaktivitäten',
                required: true,
                checkboxLabel: 'Ich bin damit einverstanden, dass der/die Teilnehmer/in zusammen mit mindestens zwei weiteren Teilnehmer/innen und dem Wissen der Verantwortlichen zeitweise ohne Betreuer auf bekannten oder gekennzeichneten Wegen gehen darf. '
            },
        ]
    },
    {
        id: 'health',
        title: 'Ernährung und Gesundheit',
        elements: [
            { kind: 'field', key: 'food', fieldType: 'select', label: 'Essen', description: 'Der/Die Teilnehmende isst...', placeholder: 'bitte auswählen', required: true, items: foodOptions },
            { kind: 'field', key: 'swimmer', fieldType: 'select', label: 'Schwimmlevel', description: 'Der/Die Teilnehmende ist...', placeholder: 'bitte auswählen', required: true, items: swimLevels },
            { kind: 'field', key: 'diseases_allergies', fieldType: 'textarea', label: 'Allergien und Vorerkrankungen', description: 'Hat ihr Kind Allergien oder Vorerkrankungen? (bspw. Asthma, Diabetes, Epilepsie, Schwindel/Ohnmacht, Migräne, Herzbeschwerden)\n Wenn ja, bitten wir um möglichst exakte Beschreibung inkl. der Einnahme benötigter Medikamente.' },

            { kind: 'field', key: 'wound_care', fieldType: 'radio', label: 'Wundversorgung', description: 'Oberflächliche Wunden dürfen mit handelsüblichen Desinfektionsmitteln und Wundschnellverband versorgt werden?', required: true, items: yesno },
            { kind: 'field', key: 'pull_ticks', fieldType: 'radio', label: 'Zecken dürfen gezogen werden?', required: true, items: yesno },
            { kind: 'field', key: 'vaccination_tetanus', fieldType: 'checkbox', label: 'Impfstatus', description: 'Welche Impfungen hat Ihr Kind erhalten?', checkboxLabel: 'Tetanus-Impfung'},
            { kind: 'field', key: 'vaccination_fsme', fieldType: 'checkbox', checkboxLabel: 'FSME/Zecken-Impfung'},
            { kind: 'field', key: 'contact_doctor', fieldType: 'textarea', label: 'Kontaktdaten Hausarzt', required: true }
        ]
    },
    {
        id: 'transport',
        title: 'An- und Abreise',
        elements: [
            {
                kind: 'info',
                className: 'text-sm',
                content: 'Die Anreise zum Zeltplatz ist grundsätzlich privat organisiert. Wir helfen gerne beim Organisieren und Vermitteln, sind aber auf Ihre Unterstützung bei freien Plätzen angewiesen.'
            },
            { kind: 'field', key: 'arrival', fieldType: 'radio', label: 'Hat ihr Kind eine Mitfahrgelegenheit für An- und Abreise?', required: true, items: [...arrival] },
            { kind: 'field', key: 'return_driver', fieldType: 'text', label: 'Fahrer/in Rückfahrt, Name des Kindes', description: 'Falls das Kind bei anderen mitfährt, geben Sie bitte den Namen des/der Fahrers/in an.' },

            {
                kind: 'row',
                label: 'Freie Plätze',
                description: 'Fahren Sie Ihr Kind selbst zum Zeltplatz hin und/oder zurück? Wenn ja, wie viele freie Plätze haben Sie jeweils (außer Fahrersitz)?',
                fields: [
                    { kind: 'field', key: 'places_arrival', fieldType: 'select', label: 'Freie Plätze Hinfahrt', placeholder: 'bitte auswählen', items: places },
                    { kind: 'field', key: 'places_return', fieldType: 'select', label: 'Freie Plätze Rückfahrt', placeholder: 'bitte auswählen', items: places }
                ]
            }
        ]
    },
    {
        id: 'emergency',
        title: 'Notfallkontakt',
        description: 'Erreichbare Kontaktpersonen für den Notfall.',
        elements: [
            {
                kind: 'row',
                label: '1. Kontaktperson',
                fields: [
                    { kind: 'field', key: 'emergency_1_name', fieldType: 'text', label: 'Vor- und Nachname', required: true },
                    { kind: 'field', key: 'emergency_1_relationship', fieldType: 'text', label: 'Grad der Verwandtschaft', placeholder: 'z.B. Mutter / Vater', required: true }
                ]
            },
            {
                kind: 'row',
                fields: [
                    { kind: 'field', key: 'emergency_1_phone_number', fieldType: 'tel', label: 'Telefonnummer', required: true },
                    { kind: 'field', key: 'emergency_1_email', fieldType: 'email', label: 'E-Mail', required: true }
                ]
            },
            {
                kind: 'row',
                label: '2. Kontaktperson',
                fields: [
                    { kind: 'field', key: 'emergency_2_name', fieldType: 'text', label: 'Vor- und Nachname', required: true },
                    { kind: 'field', key: 'emergency_2_relationship', fieldType: 'text', label: 'Grad der Verwandtschaft', placeholder: 'z.B. Mutter / Vater', required: true }
                ]
            },
            {
                kind: 'row',
                fields: [
                    { kind: 'field', key: 'emergency_2_phone_number', fieldType: 'tel', label: 'Telefonnummer', required: true },
                    { kind: 'field', key: 'emergency_2_email', fieldType: 'email', label: 'E-Mail', required: true }
                ]
            },
        ]
    },
    {
        id: 'legal',
        title: 'Rechtliches',
        description: 'Fotoeinwilligung, Reisebestimmungen und Datenschutzerklärung.',
        elements: [
            {
                kind: 'info',
                className: 'text-sm',
                content: 'Während des Lagers machen wir viele Bilder. Bitte wählen Sie aus, ob Aufnahmen gemacht und ggf. online veröffentlicht werden dürfen.'
            },
            { kind: 'field', key: 'photos', fieldType: 'radio', label: 'Von dem/der Teilnehmenden dürfen', required: true, items: [...photos] },
            {
                kind: 'field',
                key: 'consent',
                fieldType: 'file',
                label: 'Einverständniserklärung hochladen',
                required: true,
                accept: 'image/jpeg, image/png, application/pdf'
            },
            { kind: 'field', key: 'comments', fieldType: 'textarea', label: 'Weitere Angaben / Kommentare (z.B. weitere Notfallkontakte)' },
            { kind: 'field', key: 'privacy_agreement', fieldType: 'checkbox', label: 'Datenschutzerklärung', required: true }
        ]
    }
]

function defaultRegistrationState(): RegistrationState {
    return {
        name: '',
        sirname: '',
        gender: '',
        birthday: '',
        address: '',
        plz: '',
        city: '',
        email: '',
        swimmer: '',
        fitness: false,
        food: '',
        diseases_allergies: '',
        wound_care: undefined,
        pull_ticks: undefined,
        vaccination_tetanus: false,
        vaccination_fsme: false,
        contact_doctor: '',
        arrival: false,
        return_driver: '',
        places_arrival: undefined,
        places_return: undefined,
        emergency_1_name: '',
        emergency_1_relationship: '',
        emergency_1_phone_number: '',
        emergency_1_email: '',
        emergency_2_name: '',
        emergency_2_relationship: '',
        emergency_2_phone_number: '',
        emergency_2_email: '',
        photos: '',
        group_activity_consent: false,
        privacy_agreement: false,
        consent_filename: '',
        consent: null,
        comments: '',
    }
}

function getStageFieldKeys(stage: RegistrationStageConfig, state: RegistrationState) {
    const keys: string[] = []

    for (const element of stage.elements) {
        if (element.kind === 'info') {
            continue
        }

        if (element.kind === 'field') {
            if (!element.visibleWhen || element.visibleWhen(state)) {
                keys.push(element.key)
            }
            continue
        }

        for (const field of element.fields) {
            if (!field.visibleWhen || field.visibleWhen(state)) {
                keys.push(field.key)
            }
        }
    }

    return keys
}


export type Schema = v.InferOutput<typeof schema>
export type RowSchema = v.InferOutput<typeof row_schema>
export type FileSchema = v.InferOutput<typeof file_schema>
export {
    schema,
    row_schema,
    file_schema,
    arrival,
    foodOptions,
    genders,
    photos,
    swimLevels,
    yesno,
    places,
    registrationStages,
    defaultRegistrationState,
    getStageFieldKeys
}