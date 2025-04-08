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
                        :options="places" />
                </UFormGroup>

                <UFormGroup label="Rückfahrt" name="return_places">
                    <USelect placeholder="bitte auswählen" v-model="state.return_places"
                        :options="places" />
                </UFormGroup>
            </UFormGroup>

            <UFormGroup
                label="Wir bekommen eventuell Probleme mit der Unterbringung des gesamten Gepäcks und bitten um Umverteilung. Bzw. wir haben voraussichtlich noch ausreichen Platz für das Gepäck weiterer Kinder, welche nicht bei uns mitfahren."
                name="baggage">
                <UFormGroup label="Hinfahrt" name="arrival_baggage" required>
                    <USelect placeholder="bitte auswählen" v-model="state.arrival_baggage" :options="baggage" />
                </UFormGroup>

                <UFormGroup label="Rückfahrt" name="return_baggage" required>
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
                <UInput type="file" @change="uploadFile" accept="image/jpeg, image/png, application/pdf" />
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
import { schema, arrival, baggage, diseases, foodOptions, genders, photos, swimLevels, yesno, places } from '@/types/registration'
import type { Schema } from '@/types/registration'

// Create reactive state
const state = reactive<Record<string, any>>({
    name: 'tim',
    sirname: 'nielen',
    gender: 'männlich',
    birthday: '2002-08-20',
    address: 'ingolstädter str 111a',
    email: 'tim.nielen@online.de',
    swimmer: 'Schwimmer/in',
    food: 'vegetarisch',
    diseases: [], // Can be empty or contain selected options
    disease_description: undefined,
    wound_care: true,
    pull_ticks: true,
    vaccination: true,
    vaccination_description: undefined,
    emergency_name: 'doro nielen',
    emergency_relationship: 'mutter',
    emergency_phone_number: '0123456789',
    emergency_email: 'doro.nielen@online.de',
    photos: 'Ja, veröffentlichen',
    contact_doctor: 'abc',

    // Travel-related fields
    arrival: 'Selbst (und hat noch PLATZ frei)',
    arrival_driver: undefined,
    arrival_places: undefined,
    arrival_baggage: 'passt perfekt',
    return_driver: undefined,
    return_places: undefined,
    return_baggage: 'passt perfekt',

    // Additional checkboxes
    fitness: true,
    group_activity_consent: true,
    privacy_agreement: true,
    comments: undefined,
    consent: null, // For file upload
    consent_filename: undefined
})

watch(state, () => {
    console.log(state)
})

function uploadFile(files: FileList) {
    state.consent_filename = files[0].name
    state.consent = files[0]
}

const toast = useToast()
// const supabase = useSupabaseClient()
async function onSubmit(event: FormSubmitEvent<Schema>) {
    toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
    console.log(event.data)

    const body: Record<string, any> = {}

    for (const [key, value] of Object.entries(event.data)) {
        if (key == "consent")
            continue
        body[key] = value
    }
    const filename = body.name + "_" + body.sirname + "_" + body["consent_filename"]

    const form_data = new FormData()
    form_data.append(filename, event.data["consent"] as Blob)

    let result = await $fetch('/api/upload', {
        method: 'POST',
        body: form_data,
    })
    if (result.error) {
        console.error(result.error)
        alert("Die Datei konnte nicht hochgeladen werden. Bitte überprüfen Sie Ihre eingaben und versuchen Sie es erneut.")
        return
    }
    body["consent_filename"] = result.data?.path
    result = await $fetch('/api/register', {
        method: 'POST',
        body: body,
    })
    if (result.error) {
        console.error(result.error)
        alert("Die Anmeldung konnte nicht abgeschlossen werden. Bitte überprüfen Sie Ihre eingaben und versuchen Sie es erneut.")
        return
    }
}

</script>

<style scoped>
a {
    @apply text-green-600 underline;
}
</style>