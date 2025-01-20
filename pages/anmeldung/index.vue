<template>
    <div>
        <h1 class="text-green-600 text-2xl mb-2">Anmeldung</h1>
        <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
            <h2 class="text-lg">
                Allgemeine Informationen zum teilnehmenden Kind
            </h2>
            <UFormGroup label="Vorname" name="name" required>
                <UInput v-model="state.Vorname" />
            </UFormGroup>
            <UFormGroup label="Nachname" name="sirname" required>
                <UInput v-model="state.Nachname" />
            </UFormGroup>
            <UFormGroup label="Geschlecht" name="gender" required>
                <USelect placeholder="bitte auswählen" v-model="state.Geschlecht" :options="genders" />
            </UFormGroup>
            <UFormGroup label="Geburtsdatum" name="birthday" required>
                <UInput v-model="state.Geburtsdatum" type="date" />
            </UFormGroup>
            <UFormGroup label="Adresse" name="address" description="Straße, Hausnummer, Postleitzahl, Ort" required>
                <UInput v-model="state.Adresse" />
            </UFormGroup>
            <UFormGroup label="Email" name="email" required
                description="An diese E-Mail senden wir alle weiteren Informationen und die Einladung fürs nächste Jahr">
                <UInput v-model="state.Email" />
            </UFormGroup>
            <UCheckbox label="Fitness"
                help="Der/Die Teilnehmer/in ist in einer gesunden körperlichen und psychischen Verfassung und kann und darf grundsätzlich an Freizeitaktivitäten wie Wandern, Sport, Geländespiele, Schwimmbadbesuch etc. uneingeschränkt teilnehmen"
                required :model-value="false" />
            <UFormGroup label="Schwimmlevel" name="swimmer" required description="Der/Die Teilnehmende ist...">
                <USelect placeholder="bitte auswählen" v-model="state.Schwimmer" :options="swimLevels" />
            </UFormGroup>
            <UFormGroup label="Essen" name="food" required description="Der/Die Teilnehmende isst...">
                <USelect placeholder="bitte auswählen" v-model="state.Essen" :options="foodOptions" />
            </UFormGroup>
            <UFormGroup label="Erkrankungen" name="disease">
                <USelectMenu multiple placeholder="wähle alle, die zutreffen" v-model="state.Erkrankungen"
                    :options="diseases" />
            </UFormGroup>
            <UFormGroup
                label="Falls bei der vorangegangen Frage mindestens ein Haken gesetzt wurde, bitten wir um möglichst exakte Beschreibung inkl. der Einnahme benötigter Medikamente diesbezüglich:"
                name="diseaseDescription">
                <UTextarea v-model="state.Beschreibung_Erkrankung_Medikamente" />
            </UFormGroup>

            <UFormGroup required label="Wundversorgung"
                description="Oberflächliche Wunden dürfen mit Hilfe von handelsüblichen Desinfektionsmitteln und Wundschnellverband versorgt werden?"
                name="wounds">
                <URadioGroup v-model="state.Behandlung_Oberflaechliche_Wunden" :options="yesno" />
            </UFormGroup>

            <UFormGroup required label="Zecken dürfen gezogen werden?" name="zecken">
                <URadioGroup v-model="state.Zecken_Ziehen" :options="yesno" />
            </UFormGroup>

            <UFormGroup required label="Impfstatus"
                description="Der/Die Teilnehmer/in verfügt über einen ausreichenden Impfschutz (v.a. Tetanus und FSME/Zecken)?"
                name="impfschutz">
                <URadioGroup v-model="state.Impfschutz" :options="yesno" />
            </UFormGroup>

            <UFormGroup
                label="Falls bei der vorangegangen Frage mindestens ein Haken gesetzt wurde, bitten wir um möglichst exakte Beschreibung inkl. der Einnahme benötigter Medikamente diesbezüglich:"
                name="impfschutzBeschreibung">
                <UTextarea v-model="state.Beschreibung_Impfschutz" />
            </UFormGroup>

            <UCheckbox label="Aufsichtspflicht: Gruppenaktivitäten"
                help="Der/die Teilnehmer/in darf zusammen mit mindestens zwei weiteren Teilnehmer/innen und dem Wissen der Verantwortlichen ohne Betreuer auch manchmal alleine auf entweder bekannten oder genau gekennzeichneten Wegen gehen? Für diesen Zeitraum sind die Verantwortlichen von der Aufsichtspflicht entbunden."
                required :model-value="false" />

            <UFormGroup label="Kontaktdaten Hausarzt" name="kontaktHausarzt">
                <UTextarea v-model="state.Kontakt_Hausarzt" />
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

            <UFormGroup label="Wie kommt Ihr Kind zum Zeltplatz?" name="anreise" required>
                <USelect placeholder="bitte auswählen" v-model="state.Anreise" :options="arrival" />
            </UFormGroup>


            <UFormGroup
                label="Wenn bei der vorangegangenen Frage 3. ausgewählt wurde, bitte hier den Namen des/der Fahrers/in angeben, bei welchem/welcher das Kind mitfährt und den Namen des zum/zur Fahrers/in gehörenden teilnehmenden Kindes."
                name="driver">
                <UInput placeholder="Hinfahrt" v-model="state.Fahrer_Hinfahrt" />
                <UInput placeholder="Rückfahrt" v-model="state.Fahrer_Rueckfahrt" />
            </UFormGroup>

            <UFormGroup
                label="Wenn bei der vorangegangenen Frage 1. ausgewählt wurde, bitte hier angeben wie viele Plätze in dem Auto insgesamt (sprich mit dem eigenen Kind) zur Verfügung stehen:"
                description="Alle Plätze außer dem Fahrersitz sollen angegeben werden" name="places">
                <UFormGroup label="Hinfahrt" name="places_arrival">
                    <USelect placeholder="bitte auswählen" v-model="state.Plaetze_Hinfahrt"
                        :options="[0, 1, 2, 3, 4, 5]" />
                </UFormGroup>

                <UFormGroup label="Rückfahrt" name="places_return">
                    <USelect placeholder="bitte auswählen" v-model="state.Plaetze_Rückfahrt"
                        :options="[0, 1, 2, 3, 4, 5]" />
                </UFormGroup>
            </UFormGroup>

            <UFormGroup
                label="Wir bekommen eventuell Probleme mit der Unterbringung des gesamten Gepäcks und bitten um Umverteilung. Bzw. wir haben voraussichtlich noch ausreichen Platz für das Gepäck weiterer Kinder, welche nicht bei uns mitfahren."
                name="baggage">
                <UFormGroup label="Hinfahrt" name="baggage_arrival">
                    <USelect placeholder="bitte auswählen" v-model="state.Gepaeck_Hinfahrt" :options="baggage" />
                </UFormGroup>

                <UFormGroup label="Rückfahrt" name="baggage_return">
                    <USelect placeholder="bitte auswählen" v-model="state.Gepaeck_Rückfahrt" :options="baggage" />
                </UFormGroup>
            </UFormGroup>

            <h2 class="text-lg">
                Notfallkontakt
            </h2>
            <UFormGroup label="Vor und Nachname" name="emergency_name" required>
                <UInput v-model="state.Notfall_Name" />
            </UFormGroup>
            <UFormGroup label="Grad der Verwandtschaft" name="emergency_relationship" required>
                <UInput placeholder="z.B. Mutter / Vater" v-model="state.Notfall_Verwandtschaftsgrad" />
            </UFormGroup>


            <UFormGroup label="Telefonnummer" name="emergency_phone_number" required>
                <UInput type="tel" v-model="state.Notfall_Telefon" />
            </UFormGroup>

            <UFormGroup label="E-Mail" name="emergency_email" required>
                <UInput type="email" v-model="state.Notfall_Email" />
            </UFormGroup>

            <UFormGroup label="Weitere Angaben / Kommentare (z.B. weitere Notfallkontakte)" name="comments">
                <UTextarea v-model="state.Kommentare" />
            </UFormGroup>

            <h2 class="text-lg">
                Rechtliches
            </h2>

            <UFormGroup required label="Von dem/der Teilnehmenden dürfen " name="photos">
                <URadioGroup v-model="state.Fotos" :options="photos" />
            </UFormGroup>

            <UFormGroup name="consent" required>
                <template #label>
                    Lesen Sie nun bitte die
                    <a href="/files/08_Reisebedingungen_fur_Kirchenstiftungen_11.01.2016-1.pdf"
                        target="_blank">Reisebestimmungen</a>
                    aufmerksam durch. Daraufhin bitten wir Sie darum die
                    <a href="/files/Einverständniserklärung_2024.pdf" target="_blank">Einverständniserklärung</a>
                    auszufüllen und im folgenden Feld hochzuladen.
                </template>
                <UInput type="file" v-model="state.Notfall_Email" />
            </UFormGroup>

            <UCheckbox label="Fitness"
                required :model-value="false">
                <template #label>
                    <span>Ich habe die
                        <NuxtLink to="/datenschutz">Datenschutzerklärung</NuxtLink>
                        gelesen und bin damit einverstanden, dass die angegebenen Daten vom Zeltlagerteam im Rahmen der
                        Durchführung des diesjährigen Zeltlagers verarbeitet und gespeichert werden dürfen.
                    </span>
                </template>
            </UCheckbox>

            <UButton type="submit">
                Anmeldung abschicken
            </UButton>
        </UForm>
    </div>
</template>

<script setup lang="ts">
// import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'
const genders = ['männlich', 'weiblich', 'divers']
const swimLevels = ["Schwimmer/in", "Schwimmanfänger/in", "Nichtschwimmer/in"]
const foodOptions = ["alles", "vegan", "vegetarisch", "kein Schweinefleisch"]
const diseases = [
    "Herzbeschwerden, bekannte Herzfehler, HerzkrankheitenBlutdruckanomalien",
    "Asthma, Bronchitis oder ähnliche Beschwerden der Atemwege",
    "Diabetes oder andere Stoffwechselerkrankungen",
    "Schwindelzustände, Ohnmachtsanfälle, Migräne, häufig starke Kopfschmerzen",
    "Epilepsie",
    "Allergien (auch Lebensmittel- und/oder Medikamentenallergie)",
    "Sonstige"
]
const yesno = [{ value: "Ja", label: "Ja" }, { value: "Nein", label: "Nein" }]
const arrival = [
    { value: "Selbst (und hat noch PLATZ frei)", label: "Ich fahre mein Kind selber und habe noch Plätze frei" },
    { value: "Selbst (und hat KEINEN platz mehr frei)", label: "Ich fahre mein Kind selber, habe aber leider KEINE Plätze mehr frei" },
    { value: "Fährt WOANDERS mit", label: "Es ist bereits abgesprochen, dass mein Kind bei Freunden mitfahren wird (bitte unten benennen)" },
    { value: "BRAUCHT Mitfahrgelegenheit", label: "Mein Kind hat noch keine Mitfahrgelegenheit" },

]
const baggage = [
    { value: "noch extra platz", label: "Ich habe noch Platz für Gepäck zusätzlich zu dem der Kinder, welche ich mitnehme" },
    { value: "passt perfekt", label: "Bei mir reicht der Platz genau für das Gepäck der Kinder, welche ich mitnehme" },
    { value: "nicht genug platz", label: "Ich habe nicht genug Platz für das Gepäck der Kinder, welche ich mitnehme und bitte um Umverteilung" },
    { value: "ich fahre nicht", label: "Ich selber fahre keine Kinder" },
]
const photos = [
    { value: "Ja, veröffentlichen", label: "Bilder/Videos gemacht und auf den sozialen Medien oder der Webseite der KJG Ortsgruppe Milbertshofen veröffentlicht werden" },
    { value: "Ja, NICHT veröffentlichen", label: "Bilder/Videos gemacht aber nicht veröffentlicht werden" },
    { value: "Nein", label: "keine Bilder/Videos gemacht werden" },
]
const state = reactive({
    TN_Vorname: undefined,
    password: undefined
})

async function onSubmit(event: any) {
    // Do something with event.data
    console.log(event.data)
}
</script>

<style scoped>
a {
    @apply text-green-600 underline;
}
</style>