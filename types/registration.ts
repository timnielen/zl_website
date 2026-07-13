import * as v from 'valibot'

type OptionValue = string | number | boolean

export type FormOption<T extends OptionValue = OptionValue> = {
    value: T
    label: string
}

export type FormValue = string | number | boolean | File | null | undefined | OptionValue[]

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

export interface FieldValidation {
    /** Error message shown when the field fails validation. */
    message?: string
    minLength?: number
    /** Regex source (no flags), overrides the fieldType's built-in pattern (date/tel). */
    pattern?: string
    mimeTypes?: string[]
    maxSizeMB?: number
}

/**
 * Declarative, JSON-serializable definition of a single form field: its type,
 * default value and validation rules. This is the single source of truth
 * `RegistrationState`, the valibot schema and default values are all derived from it.
 */
export interface FieldDef {
    fieldType: RegistrationFieldType
    label?: string
    description?: string
    placeholder?: string
    required?: boolean
    default?: OptionValue | null
    items?: ReadonlyArray<OptionValue | FormOption>
    checkboxLabel?: string
    accept?: string
    searchInput?: boolean
    validation?: FieldValidation
}

// ---------------------------------------------------------------------------
// Field definitions (JSON-serializable "database" of form fields)
// ---------------------------------------------------------------------------

const fieldDefs = {
    name: { fieldType: 'text', label: 'Vorname', required: true, validation: { minLength: 2, message: 'Der Vorname muss mindestens 2 Zeichen lang sein' } },
    sirname: { fieldType: 'text', label: 'Nachname', required: true, validation: { minLength: 2, message: 'Der Nachname muss mindestens 2 Zeichen lang sein' } },
    gender: { fieldType: 'select', label: 'Geschlecht', placeholder: 'bitte auswählen', required: true, items: ['männlich', 'weiblich', 'divers'], validation: { message: 'Bitte wählen Sie ein Geschlecht aus' } },
    birthday: { fieldType: 'date', label: 'Geburtsdatum', required: true, validation: { message: 'Bitte geben Sie ein gültiges Datum ein' } },
    address: { fieldType: 'text', label: 'Adresse', description: 'Straße, Hausnummer', required: true, validation: { minLength: 5, message: 'Bitte geben Sie eine gültige Adresse ein' } },
    plz: { fieldType: 'text', label: 'Postleitzahl', required: true, validation: { pattern: '^\\d{5}$', message: 'Bitte geben Sie eine gültige Postleitzahl ein' } },
    city: { fieldType: 'text', label: 'Ort', required: true, validation: { minLength: 2, message: 'Bitte geben Sie eine gültige Stadt ein' } },
    email: { fieldType: 'email', label: 'E-Mail', description: 'An diese E-Mail senden wir alle weiteren Informationen', required: true, validation: { message: 'Bitte geben Sie eine gültige E-Mail-Adresse ein' } },
    fitness: {
        fieldType: 'checkbox', label: 'Fitness', required: true,
        checkboxLabel: 'Der/Die Teilnehmer/in ist in einer gesunden körperlichen und psychischen Verfassung und kann und darf grundsätzlich an Freizeitaktivitäten wie Wandern, Sport, Gelände- und Waldspielen, Schwimmbadbesuch etc. uneingeschränkt teilnehmen',
        validation: { message: 'Bitte geben Sie uns hier Ihre Einverständnins' }
    },
    group_activity_consent: {
        fieldType: 'checkbox', label: 'Gruppenaktivitäten', required: true,
        checkboxLabel: 'Ich bin damit einverstanden, dass der/die Teilnehmer/in zusammen mit mindestens zwei weiteren Teilnehmer/innen und dem Wissen der Verantwortlichen zeitweise ohne Betreuer auf bekannten oder gekennzeichneten Wegen gehen darf. ',
        validation: { message: 'Bitte geben Sie uns hier Ihre Einverständnins' }
    },

    food: { fieldType: 'select', label: 'Essen', description: 'Der/Die Teilnehmende isst...', placeholder: 'bitte auswählen', required: true, items: ['alles', 'vegan', 'vegetarisch', 'kein Schweinefleisch'], validation: { message: 'Bitte wählen Sie eine Ernährungsweise aus' } },
    swimmer: { fieldType: 'select', label: 'Schwimmlevel', description: 'Der/Die Teilnehmende ist...', placeholder: 'bitte auswählen', required: true, items: ['Schwimmer/in', 'Schwimmanfänger/in', 'Nichtschwimmer/in'], validation: { message: 'Bitte wählen Sie eine Schwimmstufe aus' } },
    diseases_allergies: {
        fieldType: 'textarea', label: 'Allergien und Vorerkrankungen',
        description: 'Hat ihr Kind Allergien oder Vorerkrankungen? (bspw. Asthma, Diabetes, Epilepsie, Schwindel/Ohnmacht, Migräne, Herzbeschwerden)\n Wenn ja, bitten wir um möglichst exakte Beschreibung inkl. der Einnahme benötigter Medikamente.'
    },
    wound_care: { fieldType: 'radio', label: 'Wundversorgung', description: 'Oberflächliche Wunden dürfen mit handelsüblichen Desinfektionsmitteln und Wundschnellverband versorgt werden?', required: true, items: [{ value: true, label: 'Ja' }, { value: false, label: 'Nein' }], validation: { message: 'Bitte wählen Sie eine Option' } },
    pull_ticks: { fieldType: 'radio', label: 'Zecken dürfen gezogen werden?', required: true, items: [{ value: true, label: 'Ja' }, { value: false, label: 'Nein' }], validation: { message: 'Bitte wählen Sie eine Option' } },
    vaccination_tetanus: { fieldType: 'checkbox', label: 'Tetanus-Impfung' },
    vaccination_fsme: { fieldType: 'checkbox', label: 'FSME/Zecken-Impfung' },
    contact_doctor: { fieldType: 'textarea', label: 'Kontaktdaten Hausarzt', required: true, validation: { minLength: 2, message: 'Bitte geben Sie die Kontaktdaten des Hausarztes ein' } },

    arrival: { fieldType: 'radio', label: 'Hat ihr Kind eine Mitfahrgelegenheit für An- und Abreise?', required: true, items: [{ value: true, label: 'Ja' }, { value: false, label: 'Nein, mein Kind braucht eine Mitfahrgelegenheit' }], validation: { message: 'Bitte wählen Sie eine Option' } },
    return_driver: { fieldType: 'text', label: 'Fahrer/in Rückfahrt, Name des Kindes', description: 'Falls das Kind bei anderen mitfährt, geben Sie bitte den Namen des/der Fahrers/in an.' },
    places_arrival: { fieldType: 'select', label: 'Freie Plätze Hinfahrt', placeholder: 'bitte auswählen', items: [0, 1, 2, 3, 4, 5], default: 0 },
    places_return: { fieldType: 'select', label: 'Freie Plätze Rückfahrt', placeholder: 'bitte auswählen', items: [0, 1, 2, 3, 4, 5], default: 0 },

    emergency_1_name: { fieldType: 'text', label: 'Vor- und Nachname', required: true, validation: { minLength: 2, message: 'Bitte geben Sie den Notfallkontakt-Namen ein' } },
    emergency_1_relationship: { fieldType: 'text', label: 'Grad der Verwandtschaft', placeholder: 'z.B. Mutter / Vater', required: true, validation: { minLength: 2, message: 'Bitte geben Sie den Verwandschaftsgrad an' } },
    emergency_1_phone_number: { fieldType: 'tel', label: 'Telefonnummer', required: true, validation: { message: 'Bitte geben Sie eine gültige Telefonnummer ein' } },
    emergency_1_email: { fieldType: 'email', label: 'E-Mail', required: true, validation: { message: 'Bitte geben Sie eine gültige E-Mail-Adresse ein' } },
    emergency_2_name: { fieldType: 'text', label: 'Vor- und Nachname', required: true, validation: { minLength: 2, message: 'Bitte geben Sie den Notfallkontakt-Namen ein' } },
    emergency_2_relationship: { fieldType: 'text', label: 'Grad der Verwandtschaft', placeholder: 'z.B. Mutter / Vater', required: true, validation: { minLength: 2, message: 'Bitte geben Sie den Verwandschaftsgrad an' } },
    emergency_2_phone_number: { fieldType: 'tel', label: 'Telefonnummer', required: true, validation: { message: 'Bitte geben Sie eine gültige Telefonnummer ein' } },
    emergency_2_email: { fieldType: 'email', label: 'E-Mail', required: true, validation: { message: 'Bitte geben Sie eine gültige E-Mail-Adresse ein' } },

    photos: {
        fieldType: 'radio', label: 'Von dem/der Teilnehmenden dürfen', required: true,
        items: [
            { value: 'Ja, veröffentlichen', label: 'Bilder/Videos gemacht und beim Nachtreffen geteilt werden, sowie auf den sozialen Medien oder der Webseite der KJG Ortsgruppe Zeltlager Milbertshofen veröffentlicht werden.' },
            { value: 'Ja, NICHT veröffentlichen', label: 'Bilder/Videos gemacht und beim Nachtreffen geteilt werden, aber NICHT online veröffentlicht werden.' },
            { value: 'Nein', label: 'KEINE Bilder/Videos gemacht werden bzw. schnellstmöglich gelöscht werden.' },
        ],
        validation: { message: 'Bitte wählen Sie eine Option aus' }
    },
    consent: {
        fieldType: 'file', label: 'Einverständniserklärung hochladen', required: true,
        validation: { mimeTypes: ['image/jpeg', 'image/png', 'application/pdf'], maxSizeMB: 5, message: 'Bitte laden Sie die Einverständniserklärung hoch' }
    },
    comments: { fieldType: 'textarea', label: 'Weitere Angaben / Kommentare (z.B. weitere Notfallkontakte)' },
    privacy_agreement: { fieldType: 'checkbox', label: 'Datenschutzerklärung', required: true, validation: { message: 'Bitte geben Sie uns hier Ihre Einverständnins' } },
} as const satisfies Record<string, FieldDef>

// ---------------------------------------------------------------------------
// State/schema types. These stay a flat, loosely typed dictionary on purpose:
// once fieldDefs/registrationStages are loaded from a database, their exact
// shape can't be known at compile time anyway, so there's little value in
// deriving precise per-field TS types from the (currently in-code) data below.
// ---------------------------------------------------------------------------

export type RegistrationState = Record<string, FormValue>

/**
 * Keys stored as fixed columns on the `registrations` table. Everything else
 * in fieldDefs goes into the `registration_details.data` jsonb column instead.
 * This list is the only thing tying fieldDefs to that table split, so fieldDefs
 * itself can stay a single flat structure.
 */
export const persistentFields = ['name', 'sirname', 'email', 'gender', 'birthday', 'address', 'plz', 'city'] as const satisfies readonly (keyof typeof fieldDefs)[]

// ---------------------------------------------------------------------------
// Layout (lean, JSON-serializable): only ordering/grouping, referencing field
// keys. The UI looks up each key's fieldDefs entry directly when rendering.
// ---------------------------------------------------------------------------

export type FieldKey = keyof typeof fieldDefs

export type RegistrationStageElement =
    | { kind: 'field'; key: FieldKey; className?: string }
    | { kind: 'row'; label?: string; description?: string; className?: string; fields: FieldKey[] }
    | { kind: 'info'; content: string; className?: string }
    | { kind: 'checkboxgroup'; label?: string; description?: string; required?: boolean; className?: string; fields: FieldKey[] }

export interface RegistrationStageConfig {
    id: string
    title: string
    description?: string
    elements: RegistrationStageElement[]
}

const registrationStages: RegistrationStageConfig[] = [
    {
        id: 'participant',
        title: 'Teilnehmendes Kind',
        description: 'Allgemeine Informationen und Grunddaten des Kindes.',
        elements: [
            { kind: 'row', fields: ['name', 'sirname'] },
            { kind: 'row', fields: ['gender', 'birthday'] },
            { kind: 'row', fields: ['address', 'plz', 'city'] },
            { kind: 'field', key: 'email' },
            { kind: 'field', key: 'fitness' },
            { kind: 'field', key: 'group_activity_consent' },
        ]
    },
    {
        id: 'health',
        title: 'Ernährung und Gesundheit',
        elements: [
            { kind: 'field', key: 'food' },
            { kind: 'field', key: 'swimmer' },
            { kind: 'field', key: 'diseases_allergies' },
            { kind: 'field', key: 'wound_care' },
            { kind: 'field', key: 'pull_ticks' },
            { kind: 'checkboxgroup', label: 'Impfstatus', description: 'Welche Impfungen hat Ihr Kind erhalten?', fields: ['vaccination_tetanus', 'vaccination_fsme'] },
            { kind: 'field', key: 'contact_doctor' },
        ]
    },
    {
        id: 'transport',
        title: 'An- und Abreise',
        elements: [
            { kind: 'info', className: 'text-sm', content: 'Die Anreise zum Zeltplatz ist grundsätzlich privat organisiert. Wir helfen gerne beim Organisieren und Vermitteln, sind aber auf Ihre Unterstützung bei freien Plätzen angewiesen.' },
            { kind: 'field', key: 'arrival' },
            { kind: 'field', key: 'return_driver' },
            {
                kind: 'row',
                label: 'Freie Plätze',
                description: 'Fahren Sie Ihr Kind selbst zum Zeltplatz hin und/oder zurück? Wenn ja, wie viele freie Plätze haben Sie jeweils (außer Fahrersitz)?',
                fields: ['places_arrival', 'places_return']
            }
        ]
    },
    {
        id: 'emergency',
        title: 'Notfallkontakt',
        description: 'Erreichbare Kontaktpersonen für den Notfall.',
        elements: [
            { kind: 'row', label: '1. Kontaktperson', fields: ['emergency_1_name', 'emergency_1_relationship'] },
            { kind: 'row', fields: ['emergency_1_phone_number', 'emergency_1_email'] },
            { kind: 'row', label: '2. Kontaktperson', fields: ['emergency_2_name', 'emergency_2_relationship'] },
            { kind: 'row', fields: ['emergency_2_phone_number', 'emergency_2_email'] },
        ]
    },
    {
        id: 'legal',
        title: 'Rechtliches',
        description: 'Fotoeinwilligung, Reisebestimmungen und Datenschutzerklärung.',
        elements: [
            {
                kind: 'row',
                label: 'Fotos',
                description: 'Während des Lagers machen wir viele Bilder. Bitte wählen Sie aus, ob Aufnahmen gemacht und ggf. online veröffentlicht werden dürfen.',
                fields: ['photos']
            },
            { kind: 'field', key: 'consent' },
            { kind: 'field', key: 'comments' },
            { kind: 'field', key: 'privacy_agreement' },
        ]
    }
]

function getStageFieldKeys(stage: RegistrationStageConfig): FieldKey[] {
    const keys: FieldKey[] = []
    for (const element of stage.elements) {
        if (element.kind === 'field') keys.push(element.key)
        else if (element.kind !== 'info') keys.push(...element.fields)
    }
    return keys
}

// ---------------------------------------------------------------------------
// Valibot schema, built generically from fieldDefs
// ---------------------------------------------------------------------------

function buildFieldSchema(def: FieldDef) {
    const required = def.required ?? false
    const message = def.validation?.message ?? 'Bitte füllen Sie dieses Feld korrekt aus'

    if (def.fieldType === 'checkbox') {
        return required ? v.literal(true, message) : v.optional(v.boolean(), false)
    }

    if (def.fieldType === 'file') {
        const mimeTypes = def.validation?.mimeTypes ?? ['image/jpeg', 'image/png', 'application/pdf']
        const maxSizeMB = def.validation?.maxSizeMB ?? 5
        const fileSchema = v.pipe(
            v.union([v.file(), v.blob()], message),
            v.mimeType(mimeTypes as [`${string}/${string}`, ...`${string}/${string}`[]], `Bitte lade nur ${mimeTypes.map((t) => t.split('/')[1]).join(', ')} Dateien hoch`),
            v.maxSize(1024 * 1024 * maxSizeMB, `Die Datei muss unter ${maxSizeMB} MB groß sein`)
        )
        return required ? fileSchema : v.optional(fileSchema)
    }

    if (def.items && def.items.length > 0) {
        const values = def.items.map((item) => typeof item === 'object' ? item.value : item) as [OptionValue, ...OptionValue[]]
        const kind = typeof values[0]

        if (kind === 'boolean') {
            return required ? v.boolean(message) : v.optional(v.boolean())
        }

        const picklist = v.picklist(values as [string | number, ...(string | number)[]], message)

        if (def.fieldType === 'multiselect') {
            return required
                ? v.pipe(v.array(picklist), v.minLength(1, message))
                : v.optional(v.array(picklist), [])
        }

        return required ? picklist : v.optional(picklist)
    }

    const actions: any[] = [v.string()]
    if (def.fieldType === 'email') actions.push(v.email(message))
    else if (def.fieldType === 'date') actions.push(v.regex(new RegExp(def.validation?.pattern ?? '^\\d{4}-\\d{2}-\\d{2}$'), message))
    else if (def.fieldType === 'tel') actions.push(v.regex(new RegExp(def.validation?.pattern ?? '^\\+?\\d{7,15}$'), message))
    else if (def.validation?.pattern) actions.push(v.regex(new RegExp(def.validation.pattern), message))

    const minLength = def.validation?.minLength ?? (required ? 1 : undefined)
    if (minLength) actions.push(v.minLength(minLength, message))

    const stringSchema = actions.length > 1 ? v.pipe(...(actions as [any, ...any[]])) : actions[0]
    return required ? stringSchema : v.optional(stringSchema, '')
}

const entries: Record<string, v.GenericSchema> = {}
for (const [key, def] of Object.entries(fieldDefs)) {
    entries[key] = buildFieldSchema(def)
}

/** The one schema for the whole form, including file fields. Used both for UI validation and for parsing the reassembled multipart body on the server. */
const schema = v.object(entries)

// ---------------------------------------------------------------------------
// Default state, built generically from fieldDefs
// ---------------------------------------------------------------------------

function fieldValueKind(def: FieldDef): 'string' | 'number' | 'boolean' | 'file' {
    if (def.fieldType === 'file') return 'file'
    if (def.fieldType === 'checkbox') return 'boolean'
    if (def.items && def.items.length > 0) {
        const first = def.items[0]
        const value = typeof first === 'object' ? first.value : first
        return typeof value as 'string' | 'number' | 'boolean'
    }
    return 'string'
}

function fieldDefault(def: FieldDef): FormValue {
    if (def.default !== undefined) return def.default
    const kind = fieldValueKind(def)
    if (kind === 'file') return null
    if (kind === 'boolean') return def.fieldType === 'checkbox' ? false : undefined
    if (kind === 'number') return undefined
    return ''
}

function defaultRegistrationState(): RegistrationState {
    const state: RegistrationState = {}
    for (const [key, def] of Object.entries(fieldDefs)) {
        state[key] = fieldDefault(def)
    }
    return state
}

export {
    fieldDefs,
    schema,
    registrationStages,
    defaultRegistrationState,
    getStageFieldKeys
}
