<template>
    <div>
        <h1 class="text-green-600 text-2xl mb-2">Anmeldung</h1>
        <UForm :schema="v.safeParser(schema)" :state="state" class="space-y-4" @submit="onSubmit">
            <h2 class="text-lg">
                Allgemeine Informationen zum teilnehmenden Kind
            </h2>
            <UFormGroup label="Vorname" name="name" required>
                <UInput v-model="state.name" />
            </UFormGroup>
            <UFormGroup label="Nachname" name="sirname" required>
                <UInput v-model="state.sirname" />
            </UFormGroup>
            <UFormGroup label="Geschlecht" name="gender" required>
                <USelect placeholder="bitte auswählen" v-model="state.gender" :options="genders" />
            </UFormGroup>
            <UFormGroup label="Geburtsdatum" name="birthday" required>
                <UInput v-model="state.birthday" type="date" />
            </UFormGroup>
            <UFormGroup label="Adresse" name="address" description="Straße, Hausnummer, Postleitzahl, Ort" required>
                <UInput v-model="state.address" />
            </UFormGroup>
            <UFormGroup label="Email" name="email" required
                description="An diese E-Mail senden wir alle weiteren Informationen und die Einladung fürs nächste Jahr">
                <UInput v-model="state.email" />
            </UFormGroup>

            <UFormGroup label="Fitness" name="fitness" required>
                <UCheckbox v-model="state.fitness"
                    label="Der/Die Teilnehmer/in ist in einer gesunden körperlichen und psychischen Verfassung und kann und darf grundsätzlich an Freizeitaktivitäten wie Wandern, Sport, Geländespiele, Schwimmbadbesuch etc. uneingeschränkt teilnehmen" />
            </UFormGroup>

            <UFormGroup label="Schwimmlevel" name="swimmer" required description="Der/Die Teilnehmende ist...">
                <USelect placeholder="bitte auswählen" v-model="state.swimmer" :options="swimLevels" />
            </UFormGroup>
            <UFormGroup label="Essen" name="food" required description="Der/Die Teilnehmende isst...">
                <USelect placeholder="bitte auswählen" v-model="state.food" :options="foodOptions" />
            </UFormGroup>
            <UFormGroup label="Erkrankungen" name="diseases">
                <USelectMenu multiple placeholder="wähle alle, die zutreffen" v-model="state.diseases"
                    :options="diseases" />
            </UFormGroup>
            <UFormGroup
                label="Falls bei der vorangegangen Frage mindestens eines ausgewählt wurde, bitten wir um möglichst exakte Beschreibung inkl. der Einnahme benötigter Medikamente diesbezüglich:"
                name="disease_description">
                <UTextarea v-model="state.disease_description" />
            </UFormGroup>

            <UFormGroup required label="Wundversorgung"
                description="Oberflächliche Wunden dürfen mit Hilfe von handelsüblichen Desinfektionsmitteln und Wundschnellverband versorgt werden?"
                name="wound_care">
                <URadioGroup v-model="state.wound_care" :options="yesno" />
            </UFormGroup>

            <UFormGroup required label="Zecken dürfen gezogen werden?" name="pull_ticks">
                <URadioGroup v-model="state.pull_ticks" :options="yesno" />
            </UFormGroup>

            <UFormGroup required label="Impfstatus"
                description="Der/Die Teilnehmer/in verfügt über einen ausreichenden Impfschutz (v.a. Tetanus und FSME/Zecken)?"
                name="vaccination">
                <URadioGroup v-model="state.vaccination" :options="yesno" />
            </UFormGroup>

            <UFormGroup
                label='Falls bei der vorangegangenen Frage "Nein" ausgewählt wurde, bitten wir um eine genaue Beschreibung des Umfangs des Impfschutzes bzw. um die Information, wenn gar kein Impfschutz besteht:'
                name="vaccination_description">
                <UTextarea v-model="state.vaccination_description" />
            </UFormGroup>

            <UFormGroup label="Aufsichtspflicht: Gruppenaktivitäten" name="group_activity_consent" required>
                <UCheckbox v-model="state.group_activity_consent"
                    label="Der/die Teilnehmer/in darf zusammen mit mindestens zwei weiteren Teilnehmer/innen und dem Wissen der Verantwortlichen ohne Betreuer auch manchmal alleine auf entweder bekannten oder genau gekennzeichneten Wegen gehen? Für diesen Zeitraum sind die Verantwortlichen von der Aufsichtspflicht entbunden." />
            </UFormGroup>

            <UFormGroup label="Kontaktdaten Hausarzt" name="contact_doctor" required>
                <UTextarea v-model="state.contact_doctor" />
            </UFormGroup>


            <h2 class="text-lg">
                Anmeldedaten zum Bring- und Holdienst
            </h2>
            <div>
                <span class="text-sm">
                    Die Anreise zum Zeltplatz ist grundsätzlich privat organisiert. Der offizielle
                    Beginn der Veranstaltung
                    ist am Zeltplatz selber und nicht an der Pfarrei in München. Trotzdem helfen wir gerne beim
                    Organisieren
                    und Vermitteln zwischen, denjenigen denen es nicht möglich ist ihr Kind selbst zu fahren und
                    denjenigen,
                    welche noch einen Platz im eigenen Auto frei haben. Diesbezüglich sind wir aber auch auf Ihre
                    Unterstützung angewiesen und bitten Sie um Angabe freier Plätze und den Verzicht auf überflüssige
                    Beifahrer (z.B. die Mitnahme beider Elternteile eines Kindes zur Verabschiedung am
                    Zeltplatz).
                </span>
            </div>

            <UFormGroup label="Wie kommt Ihr Kind zum Zeltplatz?" name="arrival" required>
                <USelect placeholder="bitte auswählen" v-model="state.arrival" :options="arrival" />
            </UFormGroup>


            <UFormGroup
                label="Wenn bei der vorangegangenen Frage 3. ausgewählt wurde, bitte hier den Namen des/der Fahrers/in angeben, bei welchem/welcher das Kind mitfährt und den Namen des zum/zur Fahrers/in gehörenden teilnehmenden Kindes."
                name="driver">
                <UFormGroup label="Fahrer/in Hinfahrt, Name des Kindes" name="arrival_driver">
                    <UInput v-model="state.arrival_driver" />
                </UFormGroup>
                <UFormGroup label="Fahrer/in Rückfahrt, Name des Kindes" name="return_driver">
                    <UInput v-model="state.return_driver" />
                </UFormGroup>
            </UFormGroup>

            <UFormGroup
                label="Wenn bei der vorangegangenen Frage 1. ausgewählt wurde, bitte hier angeben wie viele Plätze in dem Auto insgesamt (sprich mit dem eigenen Kind) zur Verfügung stehen:"
                description="Alle Plätze außer dem Fahrersitz sollen angegeben werden" name="places">
                <UFormGroup label="Hinfahrt" name="arrival_places">
                    <USelect placeholder="bitte auswählen" v-model="state.arrival_places"
                        :options="[0, 1, 2, 3, 4, 5]" />
                </UFormGroup>

                <UFormGroup label="Rückfahrt" name="return_places">
                    <USelect placeholder="bitte auswählen" v-model="state.return_places"
                        :options="[0, 1, 2, 3, 4, 5]" />
                </UFormGroup>
            </UFormGroup>

            <UFormGroup
                label="Wir bekommen eventuell Probleme mit der Unterbringung des gesamten Gepäcks und bitten um Umverteilung. Bzw. wir haben voraussichtlich noch ausreichen Platz für das Gepäck weiterer Kinder, welche nicht bei uns mitfahren."
                name="baggage">
                <UFormGroup label="Hinfahrt" name="arrival_baggage">
                    <USelect placeholder="bitte auswählen" v-model="state.arrival_baggage" :options="baggage" />
                </UFormGroup>

                <UFormGroup label="Rückfahrt" name="return_baggage">
                    <USelect placeholder="bitte auswählen" v-model="state.return_baggage" :options="baggage" />
                </UFormGroup>
            </UFormGroup>

            <h2 class="text-lg">
                Notfallkontakt
            </h2>
            <UFormGroup label="Vor und Nachname" name="emergency_name" required>
                <UInput v-model="state.emergency_name" />
            </UFormGroup>
            <UFormGroup label="Grad der Verwandtschaft" name="emergency_relationship" required>
                <UInput placeholder="z.B. Mutter / Vater" v-model="state.emergency_relationship" />
            </UFormGroup>


            <UFormGroup label="Telefonnummer" name="emergency_phone_number" required>
                <UInput type="tel" v-model="state.emergency_phone_number" />
            </UFormGroup>

            <UFormGroup label="E-Mail" name="emergency_email" required>
                <UInput type="email" v-model="state.emergency_email" />
            </UFormGroup>

            <UFormGroup label="Weitere Angaben / Kommentare (z.B. weitere Notfallkontakte)" name="comments">
                <UTextarea v-model="state.comments" />
            </UFormGroup>

            <h2 class="text-lg">
                Rechtliches
            </h2>

            <span class="text-sm">
                Während des Lagers machen wir natürlich viele Bilder. Diese könnt Sie sich beim Nachtreffen gerne
                abholen.
                Dazu bringt bitte einen USB-Stick mit auf den wir die Bilder kopieren können.
                Im Folgenden bitten wir Sie auszuwählen, ob Sie der Aufnahme von Fotos/Videos Ihres Kindes generell
                zustimmen bzw. ob wir diese auch im Internet veröffentlichen dürfen.
            </span>
            <UFormGroup required label="Von dem/der Teilnehmenden dürfen " name="photos">
                <URadioGroup v-model="state.photos" :options="photos" />
            </UFormGroup>

            <UFormGroup name="consent" required>
                <UInput type="file" @change="state.consent = $event[0]" />
                <template #label>
                    Lesen Sie nun bitte die
                    <a href="/files/08_Reisebedingungen_fur_Kirchenstiftungen_11.01.2016-1.pdf"
                        target="_blank">Reisebestimmungen</a>
                    aufmerksam durch. Daraufhin bitten wir Sie darum die
                    <a href="/files/Einverständniserklärung_2024.pdf" target="_blank">Einverständniserklärung</a>
                    auszufüllen und im folgenden Feld hochzuladen.
                </template>
            </UFormGroup>

            <UFormGroup label="Datenschutzerklärung" name="privacy_agreement" required>
                <UCheckbox v-model="state.privacy_agreement">
                    <template #label>
                        <span>Ich habe die
                            <NuxtLink to="/datenschutz">Datenschutzerklärung</NuxtLink>
                            gelesen und bin damit einverstanden, dass die angegebenen Daten vom Zeltlagerteam im Rahmen
                            der
                            Durchführung des diesjährigen Zeltlagers verarbeitet und gespeichert werden dürfen.
                        </span>
                    </template>
                </UCheckbox>
            </UFormGroup>

            <UButton type="submit">
                Anmeldung abschicken
            </UButton>
        </UForm>
    </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import * as v from 'valibot'
import { createClient } from '@supabase/supabase-js'
const runtimeConfig = useRuntimeConfig()
const supabase = createClient(runtimeConfig.public.SUPABASE_URL, runtimeConfig.public.SUPABASE_KEY)

const genders = ['männlich', 'weiblich', 'divers'] as const;
const swimLevels = ["Schwimmer/in", "Schwimmanfänger/in", "Nichtschwimmer/in"] as const;
const foodOptions = ["alles", "vegan", "vegetarisch", "kein Schweinefleisch"] as const;
const diseases = [
    "Herzbeschwerden, bekannte Herzfehler, HerzkrankheitenBlutdruckanomalien",
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

const schema = v.object({
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
    emergency_name: v.pipe(v.string(), v.minLength(2, 'Bitte geben Sie den Notfallkontakt-Namen ein')),
    emergency_relationship: v.pipe(v.string(), v.minLength(2, 'Bitte geben Sie die Beziehung an')),
    emergency_phone_number: v.pipe(v.string(), v.regex(/^\+?\d{7,15}$/, 'Bitte geben Sie eine gültige Telefonnummer ein')),
    emergency_email: v.pipe(v.string(), v.email('Bitte geben Sie eine gültige E-Mail-Adresse ein')),
    photos: v.pipe(v.string(), v.picklist(photos.map(p => p.value), 'Bitte wählen Sie eine Option aus')),
    consent: v.pipe(
        v.file('Bitte laden Sie die Einverständniserklärung hoch'),
        v.mimeType(['image/jpeg', 'image/png', 'application/pdf'], 'Bitte lade nur JPEG, PNG, oder PDF Dateien hoch'),
        v.maxSize(1024 * 1024 * 5, 'Die Datei muss unter 5 MB groß sein')
    ),
    fitness: v.literal(true, "Bitte geben Sie uns hier Ihre Einverständnins"),
    group_activity_consent: v.literal(true, "Bitte geben Sie uns hier Ihre Einverständnins"),
    privacy_agreement: v.literal(true, "Bitte geben Sie uns hier Ihre Einverständnins"),
})

// Create reactive state
const state = reactive({
    name: '',
    sirname: '',
    gender: '',
    birthday: '',
    address: '',
    email: '',
    swimmer: '',
    food: '',
    diseases: [], // Can be empty or contain selected options
    disease_description: '',
    wound_care: '',
    pull_ticks: '',
    vaccination: '',
    vaccination_description: '',
    emergency_name: '',
    emergency_relationship: '',
    emergency_phone_number: '',
    emergency_email: '',
    photos: '',
    // consent: null, // For file upload
    contact_doctor: '',

    // Travel-related fields
    arrival: '',
    arrival_driver: '',
    arrival_places: null,
    arrival_baggage: '',
    return_driver: '',
    return_places: null,
    return_baggage: '',

    // Additional checkboxes
    fitness: false,
    group_activity_consent: false,
    privacy_agreement: false,

    comments: '',
})

watch(state, () => {
    console.log(state)
})

// function test(v) {
//     console.log(v)
// }

type Schema = v.InferOutput<typeof schema>
const toast = useToast()
// const supabase = useSupabaseClient()
async function onSubmit(event: FormSubmitEvent<Schema>) {
    console.log(event.data)
    let payload: Record<string, any> = {}
    for (const key in event.data) {
        if (key != "consent" && key != "deseases") {
            payload[key] = event.data[key]
        }
    }
    console.log("test", payload)
    toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
    console.log(event.data)
    try {
        const result = await supabase
            .from("Registrations")
            .insert(payload)
        console.log(result)
    } catch (e) {
        console.error("error", e)
    }
}

</script>

<style scoped>
a {
    @apply text-green-600 underline;
}
</style>