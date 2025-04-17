<template>
    <section class="bg-white xl:mx-auto max-w-7xl p-10 rounded-xl shadow-xl m-2">
        <h1 class="my-4 text-primary-700">Anmeldung</h1>
        <UForm :schema="schema" :state="state" class="space-y-4 grid gap-4 " @submit="onSubmit">
            <USeparator />
            <h2>
                Allgemeine Informationen zum teilnehmenden Kind
            </h2>

            <UFormField label="Vorname" name="name" required>
                <UInput v-model="state.name" class="w-full" />
            </UFormField>
            <UFormField label="Nachname" name="sirname" required>
                <UInput v-model="state.sirname" class="w-full" />
            </UFormField>
            <UFormField label="Geschlecht" name="gender" required>
                <USelect placeholder="bitte auswählen" v-model="state.gender" :items="genders" class="w-full" />
            </UFormField>
            <UFormField label="Geburtsdatum" name="birthday" required>
                <UInput v-model="state.birthday" type="date" class="w-full" />
            </UFormField>
            <UFormField label="Adresse" name="address" description="Straße, Hausnummer, Postleitzahl, Ort" required>
                <UInput v-model="state.address" class="w-full" />
            </UFormField>
            <UFormField label="E-Mail" name="email" required
                description="An diese E-Mail senden wir alle weiteren Informationen und die Einladung fürs nächste Jahr">
                <UInput v-model="state.email" class="w-full" />
            </UFormField>

            <UFormField label="Fitness" name="fitness" required>
                <UCheckbox v-model="state.fitness"
                    label="Der/Die Teilnehmer/in ist in einer gesunden körperlichen und psychischen Verfassung und kann und darf grundsätzlich an Freizeitaktivitäten wie Wandern, Sport, Geländespiele, Schwimmbadbesuch etc. uneingeschränkt teilnehmen" />
            </UFormField>

            <UFormField label="Schwimmlevel" name="swimmer" required description="Der/Die Teilnehmende ist...">
                <USelect placeholder="bitte auswählen" v-model="state.swimmer" :items="swimLevels" class="w-full" />
            </UFormField>
            <UFormField label="Essen" name="food" required description="Der/Die Teilnehmende isst...">
                <USelect placeholder="bitte auswählen" v-model="state.food" :items="foodOptions" class="w-full" />
            </UFormField>
            <UFormField label="Erkrankungen" name="diseases">
                <USelectMenu multiple placeholder="wähle alle, die zutreffen" v-model="state.diseases" :items="diseases"
                    class="w-full" :search-input="false" />
            </UFormField>
            <UFormField
                label="Falls bei der vorangegangen Frage mindestens eines ausgewählt wurde, bitten wir um möglichst exakte Beschreibung inkl. der Einnahme benötigter Medikamente diesbezüglich:"
                name="disease_description">
                <UTextarea v-model="state.disease_description" class="w-full" />
            </UFormField>

            <UFormField required label="Wundversorgung"
                description="Oberflächliche Wunden dürfen mit Hilfe von handelsüblichen Desinfektionsmitteln und Wundschnellverband versorgt werden?"
                name="wound_care">
                <URadioGroup v-model="state.wound_care" :items="yesno" />
            </UFormField>

            <UFormField required label="Zecken dürfen gezogen werden?" name="pull_ticks">
                <URadioGroup v-model="state.pull_ticks" :items="yesno" />
            </UFormField>

            <UFormField required label="Impfstatus"
                description="Der/Die Teilnehmer/in verfügt über einen ausreichenden Impfschutz (v.a. Tetanus und FSME/Zecken)?"
                name="vaccination">
                <URadioGroup v-model="state.vaccination" :items="yesno" />
            </UFormField>

            <UFormField
                label='Falls bei der vorangegangenen Frage "Nein" ausgewählt wurde, bitten wir um eine genaue Beschreibung des Umfangs des Impfschutzes bzw. um die Information, wenn gar kein Impfschutz besteht:'
                name="vaccination_description">
                <UTextarea v-model="state.vaccination_description" class="w-full" />
            </UFormField>

            <UFormField label="Aufsichtspflicht: Gruppenaktivitäten" name="group_activity_consent" required>
                <UCheckbox v-model="state.group_activity_consent"
                    label="Der/die Teilnehmer/in darf zusammen mit mindestens zwei weiteren Teilnehmer/innen und dem Wissen der Verantwortlichen ohne Betreuer auch manchmal alleine auf entweder bekannten oder genau gekennzeichneten Wegen gehen? Für diesen Zeitraum sind die Verantwortlichen von der Aufsichtspflicht entbunden." />
            </UFormField>

            <UFormField label="Kontaktdaten Hausarzt" name="contact_doctor" required>
                <UTextarea v-model="state.contact_doctor" class="w-full" />
            </UFormField>

            <USeparator />
            <h2>
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
                    Unterstützung angewiesen und bitten Sie um Angabe freier Plätze und den Verzicht auf
                    überflüssige
                    Beifahrer (z.B. die Mitnahme beider Elternteile eines Kindes zur Verabschiedung am
                    Zeltplatz).
                </span>
            </div>

            <UFormField label="Wie kommt Ihr Kind zum Zeltplatz?" name="arrival" required>
                <URadioGroup placeholder="bitte auswählen" v-model="state.arrival" :items="arrival" class="w-full" />
            </UFormField>


            <UFormField
                label="Wenn bei der vorangegangenen Frage 3. ausgewählt wurde, bitte hier den Namen des/der Fahrers/in angeben, bei welchem/welcher das Kind mitfährt und den Namen des zum/zur Fahrers/in gehörenden teilnehmenden Kindes."
                name="driver">
                <UFormField label="Fahrer/in Hinfahrt, Name des Kindes" name="arrival_driver">
                    <UInput v-model="state.arrival_driver" class="w-full" />
                </UFormField>
                <UFormField label="Fahrer/in Rückfahrt, Name des Kindes" name="return_driver">
                    <UInput v-model="state.return_driver" class="w-full" />
                </UFormField>
            </UFormField>

            <div class="grid gap-2">
                <UFormField
                    label="Wenn bei der vorangegangenen Frage 1. ausgewählt wurde, bitte hier angeben wie viele Plätze in dem Auto insgesamt (sprich mit dem eigenen Kind) zur Verfügung stehen:"
                    description="Alle Plätze außer dem Fahrersitz sollen angegeben werden" name="places">
                </UFormField>
                <UFormField label="Hinfahrt" name="arrival_places">
                    <USelect placeholder="bitte auswählen" v-model="state.arrival_places" :items="places"
                        class="w-full" />
                </UFormField>

                <UFormField label="Rückfahrt" name="return_places">
                    <USelect placeholder="bitte auswählen" v-model="state.return_places" :items="places"
                        class="w-full" />
                </UFormField>
            </div>

            <div class="grid gap-2">
                <UFormField label="Wir bekommen eventuell Probleme mit der Unterbringung des gesamten Gepäcks und bitten um Umverteilung.
                Bzw. wir haben voraussichtlich noch ausreichen Platz für das Gepäck weiterer Kinder, welche nicht bei
                uns mitfahren.">
                </UFormField>
                <UFormField label="Gepäck Hinfahrt" name="arrival_baggage" required>
                    <URadioGroup v-model="state.arrival_baggage" :items="baggage" class="w-full" />
                </UFormField>

                <UFormField label="Gepäck Rückfahrt" name="return_baggage" required>
                    <URadioGroup v-model="state.return_baggage" :items="baggage" class="w-full" />
                </UFormField>
            </div>

            <USeparator />

            <h2>
                Notfallkontakt
            </h2>
            <UFormField label="Vor und Nachname" name="emergency_name" required>
                <UInput v-model="state.emergency_name" class="w-full" />
            </UFormField>
            <UFormField label="Grad der Verwandtschaft" name="emergency_relationship" required>
                <UInput placeholder="z.B. Mutter / Vater" v-model="state.emergency_relationship" class="w-full" />
            </UFormField>


            <UFormField label="Telefonnummer" name="emergency_phone_number" required>
                <UInput type="tel" v-model="state.emergency_phone_number" class="w-full" />
            </UFormField>

            <UFormField label="E-Mail" name="emergency_email" required>
                <UInput type="email" v-model="state.emergency_email" class="w-full" />
            </UFormField>

            <UFormField label="Weitere Angaben / Kommentare (z.B. weitere Notfallkontakte)" name="comments">
                <UTextarea v-model="state.comments" class="w-full" />
            </UFormField>

            <USeparator />
            <h2>Rechtliches</h2>

            <span class="text-sm">
                Während des Lagers machen wir natürlich viele Bilder. Diese können Sie sich beim Nachtreffen gerne
                abholen.
                Bitte bringen Sie dazu einen USB-Stick mit, auf den wir die Bilder kopieren. Die Bilder enthalten
                Aufnahmen aller Kinder,
                deren Eltern der Aufnahme zugestimmt haben.
                Im Folgenden bitten wir Sie auszuwählen, ob Sie generell der Aufnahme von Fotos/Videos Ihres Kindes
                zustimmen
                und ob diese ggf. auch im Internet veröffentlicht werden dürfen.
            </span>
            <UFormField required label="Von dem/der Teilnehmenden dürfen " name="photos">
                <URadioGroup v-model="state.photos" :items="photos" />
            </UFormField>

            <UFormField name="consent" required>
                <UInput type="file" @change="uploadFile" accept="image/jpeg, image/png, application/pdf"
                    class="w-full" />
                <template #label>
                    Lesen Sie nun bitte die
                    <a href="/files/08_Reisebedingungen_fur_Kirchenstiftungen_11.01.2016-1.pdf"
                        target="_blank">Reisebestimmungen</a>
                    aufmerksam durch. Daraufhin bitten wir Sie darum die
                    <a href="/files/Einverständniserklärung.pdf" target="_blank">Einverständniserklärung</a>
                    auszufüllen und im folgenden Feld hochzuladen.
                </template>
            </UFormField>

            <UFormField label="Datenschutzerklärung" name="privacy_agreement" required>
                <UCheckbox v-model="state.privacy_agreement">
                    <template #label>
                        <span>Ich habe die
                            <NuxtLink to="/datenschutz">Datenschutzerklärung</NuxtLink>
                            gelesen und bin damit einverstanden, dass die angegebenen Daten vom Zeltlagerteam im
                            Rahmen
                            der
                            Durchführung des diesjährigen Zeltlagers verarbeitet und gespeichert werden dürfen.
                        </span>
                    </template>
                </UCheckbox>
            </UFormField>

            <UFormField label="Einladung nächstes Jahr" name="invitation_next_year">
                <UCheckbox v-model="state.invitation_next_year"
                    label="Ich möchte im nächsten Jahr eine Einladung per E-Mail erhalten. (Sie können dieser Einwilligung jederzeit widersprechen)" />
            </UFormField>

            <UFormField>
                <UButton type="submit" :loading="loading">
                    Anmeldung abschicken
                </UButton>
            </UFormField>

        </UForm>
    </section>

</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import { schema, arrival, baggage, diseases, foodOptions, genders, photos, swimLevels, yesno, places } from '@/types/registration'
import type { Schema } from '@/types/registration'

useHead({
    title: "Anmeldung",
    meta: [
        { name: 'description', content: "Hier können Sie Ihr Kind zum kommenden Zeltlager anmelden" }
    ]
})

// Create reactive state
const state = reactive<Record<string, any>>({
    name: "",
    sirname: "",
    gender: "",
    birthday: "",
    address: "",
    email: "",
    swimmer: "",
    food: "",
    wound_care: null,
    pull_ticks: null,
    vaccination: null,
    contact_doctor: "",
    arrival: "",
    arrival_baggage: "",
    return_baggage: "",
    emergency_name: "",
    emergency_relationship: "",
    emergency_phone_number: "",
    emergency_email: "",
    photos: "",
    fitness: false,
    group_activity_consent: false,
    privacy_agreement: null,
    consent_filename: "",
    consent: null,
    invitation_next_year: false
})

function uploadFile(event: Event) {
    const target = event.target as HTMLInputElement
    if (target?.files && target.files[0]) {
        state.consent_filename = target.files[0].name
        state.consent = target.files[0]
    }
}

const toast = useToast()
const loading = ref(false)
async function onSubmit(event: FormSubmitEvent<Schema>) {
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

    loading.value = true
    try {
        body["consent_filename"] = await $fetch('/api/upload', {
            method: 'POST',
            body: form_data,
        })
        await $fetch('/api/register', {
            method: 'POST',
            body: body,
        })
    } catch (e) {
        let description = ''
        if (e.status === 400) {
            description = 'Die Anmeldung konnte nicht abgeschlossen werden. Bitte überprüfen Sie Ihre eingaben und versuchen Sie es erneut.'
        }
        else if (e.status === 423) {
            description = 'Die Anmeldung ist leider geschlossen. Versuche es wärend des Anmeldezeitraums erneut.'
        }
        else {
            description = 'Ein interner Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.'
        }
        toast.add({
            title: 'Anmeldung fehlgeschlagen!',
            description: description,
            color: "error"
        })
        loading.value = false
        return
    }
    loading.value = false
    toast.add({
        title: 'Anmeldung abgeschlossen!',
        description: 'Die Anmeldung wurde abgeschlossen. Wir haben eine Bestätigungsmail an ' + body["email"] + " gesandt. Bitte überprüfen Sie Ihr Postfach.",
        color: 'success',
        duration: 10000
    })
    navigateTo('/')
}

</script>

<style scoped>
@import "tailwindcss";

a {
    @apply text-green-600 underline;
}

h1 {
    @apply text-3xl md:text-5xl;
}

h2 {
    @apply text-2xl md:text-3xl;
}
</style>