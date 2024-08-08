<template>
    <div>
        <h1 class="text-green-600 text-2xl">Anmeldung</h1>
        <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
            <UFormGroup label="Vorname" name="name" required>
                <UInput v-model="state.TN_Vorname" />
            </UFormGroup>
            <UFormGroup label="Nachname" name="sirname" required>
                <UInput v-model="state.TN_Nachname" />
            </UFormGroup>
            <UFormGroup label="Geschlecht" name="gender" required>
                <USelect v-model="state.TN_Geschlecht" :options="genders" />
            </UFormGroup>
            <UFormGroup label="Geburtsdatum" name="birthday" required>
                <UInput v-model="state.TN_Geburtsdatum" type="date"/>
            </UFormGroup>
            <UFormGroup label="Adresse" name="address" description="Straße, Hausnummer, Postleitzahl, Ort" required>
                <UInput v-model="state.TN_Adresse" />
            </UFormGroup>
            <UFormGroup label="Email" name="email" required description="An diese E-Mail senden wir alle weiteren Informationen und die Einladung fürs nächste Jahr">
                <UInput v-model="state.TN_Email" />
            </UFormGroup>
            <UCheckbox label="Fitness" help="Der/Die Teilnehmer/in ist in einer gesunden körperlichen und psychischen Verfassung und kann und darf grundsätzlich an Freizeitaktivitäten wie Wandern, Sport, Geländespiele, Schwimmbadbesuch etc. uneingeschränkt teilnehmen" required :model-value="false" />
            <UFormGroup label="Schwimmlevel" name="swimmer" required description="Der/Die Teilnehmende ist...">
                <USelect v-model="state.TN_Schwimmer" :options="swimLevels"/>
            </UFormGroup>
            <UFormGroup label="Essen" name="food" required description="Der/Die Teilnehmende isst...">
                <USelect v-model="state.TN_Essen" :options="foodOptions"/>
            </UFormGroup>
            <UFormGroup label="Erkrankungen" name="disease">
                <USelectMenu multiple placeholder="Wähle alle, die zutreffen" v-model="state.TN_Erkrankungen" :options="diseases"/>
            </UFormGroup>
            <UFormGroup label="Falls bei der vorangegangen Frage mindestens ein Haken gesetzt wurde, bitten wir um möglichst exakte Beschreibung inkl. der Einnahme benötigter Medikamente diesbezüglich:" name="diseaseDescription">
                <UTextarea v-model="state.TN_Beschreibung_Erkrankung_Medikamente" />
            </UFormGroup>
            
            <UButton type="submit">
                Submit
            </UButton>
        </UForm>
        <form action="/registerTN" method="post" enctype="multipart/form-data">
            <div class="form grid gap-5 lg:grid-cols-2 my-4 overflow-ellipsis">
                <div>
                    <div class="grid gap-5 sm:grid-cols-2 items-start">
                        <h3 class="font-bold sm:col-span-2 text-lg">
                            Allgemeine Informationen zum teilnehmenden Kind
                        </h3>
                        <div>
                            <label>Vorname*</label>
                            <input required type="Text" name="TN_Vorname" placeholder="Vorname" />
                        </div>
                        <div>
                            <label>Nachname*</label>
                            <input required type="Text" name="TN_Nachname" placeholder="Nachname" />
                        </div>
                        <div>
                            <label>Geschlecht*</label>
                            <select required name="TN_Geschlecht">
                                <option value="" disabled selected="selected">
                                    bitte auswählen
                                </option>
                                <option value="männlich">männlich</option>
                                <option value="weiblich">weiblich</option>
                                <option value="divers">divers</option>
                            </select>
                        </div>
                        <div>
                            <label>Geburtsdatum*</label>
                            <input required type="date" name="TN_Geburtsdatum" />
                        </div>
                        <div>
                            <label>Straße*</label>
                            <input required type="text" name="TN_Strasse" placeholder="Straße" />
                        </div>
                        <div>
                            <label>Hausnummer*</label>
                            <input required type="text" name="TN_Hausnummer" placeholder="Hausnummer" />
                        </div>
                        <div>
                            <label>Postleitzahl*</label>
                            <input required type="text" name="TN_PLZ" placeholder="Postleitzahl" />
                        </div>
                        <div>
                            <label>Stadt*</label>
                            <input required type="text" name="TN_Stadt" placeholder="Stadt" />
                        </div>
                        <div class="sm:col-span-2">
                            <label>Addresszusatz</label>
                            <input type="text" name="TN_Addresszusatz" placeholder="Addresszusatz" />
                        </div>
                        <div class="sm:col-span-2">
                            <label>E-Mail* (An diese E-Mail senden wir alle weiteren
                                Informationen und die Einladung fürs nächste Jahr)</label>
                            <input required type="email" name="TN_Email" placeholder="z.B. max.mustermann@gmail.com" />
                        </div>
                        <h3 class="text-lg text-bold font-bold sm:col-span-2">
                            Angaben zur Gesundheit und Ernährung
                        </h3>
                        <div class="sm:col-span-2">
                            <label>Der/Die Teilnehmer/in ist in einer gesunden körperlichen und psychischen Verfassung
                                und kann und darf grundsätzlich an Freizeitaktivitäten wie Wandern, Sport,
                                Geländespiele,
                                Schwimmbadbesuch etc. uneingeschränkt teilnehmen?*</label>
                            <select required name="TN_Fitness">
                                <option value="" disabled selected="selected">
                                    bitte auswählen
                                </option>
                                <option value="Ja">Ja</option>
                                <option value="Nein">Nein</option>
                            </select>
                        </div>
                        <div class="sm:col-span-2">
                            <label>Der/Die Teilnehmer/in ist...*</label>
                            <select required name="TN_Schwimmer">
                                <option value="" disabled selected="selected">
                                    bitte auswählen
                                </option>
                                <option value="Schwimmer/in">Schwimmer/in</option>
                                <option value="Schwimmanfänger/in">
                                    Schwimmanfänger/in
                                </option>
                                <option value="Nichtschwimmer/in">Nichtschwimmer/in</option>
                            </select>
                        </div>
                        <div class="sm:col-span-2">
                            <label>Der/Die Teilnehmer/in isst...*</label>
                            <select required name="TN_Essen">
                                <option value="" disabled selected="selected">
                                    bitte auswählen
                                </option>
                                <option value="alles">alles</option>
                                <option value="vegetarisch">vegetarisch</option>
                                <option value="vegan">vegan</option>
                                <option value="kein Schweinefleisch">
                                    kein Schweinefleisch
                                </option>
                            </select>
                        </div>
                        <div class="sm:col-span-2 ">
                            <label>Besteht oder Bestehen bei dem/der Teilnehmer/in folgende Erkrankungen oder
                                Beschwerden?</label>
                            <span>
                                <input type="checkbox" name="Herzbeschwerden/Herzfehler/Herzkrankheiten" />
                                <label>Herzbeschwerden, bekannte Herzfehler, Herzkrankheiten</label>
                            </span>
                            <span>
                                <input type="checkbox" name="Blutdruckanomalien" />
                                <label>Blutdruckanomalien</label>
                            </span>
                            <span>
                                <input type="checkbox" name="Asthma/Bronchitis/Atemwege" />
                                <label>Asthma, Bronchitis oder ähnliche Beschwerden der Atemwege</label>
                            </span>
                            <span>
                                <input type="checkbox" name="Diabetes/Stoffwechselerkrankungen" />
                                <label>Diabetes oder andere Stoffwechselerkrankungen</label>
                            </span>
                            <span>
                                <input type="checkbox"
                                    name="Schwindelzustände/Ohnmachtsanfälle/Migräne/Kopfschmerzen" />
                                <label>Schwindelzustände, Ohnmachtsanfälle, Migräne, häufig starke Kopfschmerzen</label>
                            </span>
                            <span>
                                <input type="checkbox" name="Epilepsie" />
                                <label>Epilepsie</label>
                            </span>
                            <span>
                                <input type="checkbox" name="Allergien" />
                                <label>Allergien (auch Lebensmittel- und/oder Medikamentenallergie)</label>
                            </span>
                            <span>
                                <input type="checkbox" name="Sonstige Krankheiten" />
                                <label>Sonstige</label>
                            </span>
                        </div>
                        <div class="sm:col-span-2">
                            <label>Falls bei der vorangegangen Frage mindestens ein Haken gesetzt wurde, bitten wir um
                                möglichst
                                exakte Beschreibung inkl. der Einnahme benötigter Medikamente diesbezüglich:</label>
                            <textarea name="TN_Beschreibung_Erkrankung_Medikamente" rows="3"></textarea>
                        </div>
                        <div>
                            <label>Oberflächliche Wunden dürfen mit Hilfe von handelsüblichen Desinfektionsmitteln und
                                Wundschnellverband versorgt werden?*</label>
                            <select required name="TN_Oberflaechliche_Wundversorgung">
                                <option value="" disabled selected="selected">
                                    bitte auswählen
                                </option>
                                <option value="Ja">Ja</option>
                                <option value="Nein">Nein</option>
                            </select>
                        </div>
                        <div>
                            <label>Zecken dürfen gezogen werden?*</label>
                            <select required name="TN_Zecken_ziehen">
                                <option value="" disabled selected="selected">
                                    bitte auswählen
                                </option>
                                <option value="Ja">Ja</option>
                                <option value="Nein">Nein</option>
                            </select>
                        </div>
                        <div class="sm:col-span-2">
                            <label>Der/Die Teilnehmer/in verfügt über einen ausreichenden Impfschutz (v.a. Tetanus und
                                FSME/Zecken)?*</label>
                            <select required name="TN_Impfschutz">
                                <option value="" disabled selected="selected">
                                    bitte auswählen
                                </option>
                                <option value="Ja">Ja</option>
                                <option value="Nein">Nein</option>
                            </select>
                        </div>
                        <div class="sm:col-span-2">
                            <label>Falls bei der vorangegangenen Frage "Nein" ausgewählt wurde, bitten wir um eine
                                genaue
                                Beschreibung des Umfangs des Impfschutzes bzw. um die Information, wenn gar kein
                                Impfschutz
                                besteht:</label>
                            <textarea rows="3" name="TN_Erklaerung_Impfschutz"></textarea>
                        </div>
                        <div class="sm:col-span-2">
                            <label>Der/die Teilnehmer/in darf zusammen mit mindestens zwei weiteren Teilnehmer/innen
                                und dem Wissen der Verantwortlichen ohne Betreuer auch manchmal alleine auf
                                entweder bekannten oder genau gekennzeichneten Wegen gehen? Für diesen Zeitraum
                                sind die Verantwortlichen von der Aufsichtspflicht entbunden.*</label>
                            <select required name="TN_in_3er_Gruppen_unbeaufsichtigt">
                                <option value="" disabled selected="selected">
                                    bitte auswählen
                                </option>
                                <option value="Ja">Ja</option>
                                <option value="Nein">Nein</option>
                            </select>
                        </div>
                        <div class="sm:col-span-2">
                            <label>Kontaktdaten Hausarzt*</label>
                            <input required type="text" name="TN_Kontakt_Hausarzt"
                                placeholder="Name, Adresse, Telefonnummer" />
                        </div>
                    </div>
                </div>
                <div>
                    <div class="grid gap-5 sm:grid-cols-2 items-start">
                        <h3 class="text-lg font-bold sm:col-span-2">
                            Anmeldedaten zum Bring- und Holdienst
                        </h3>
                        <span class="sm:col-span-2">
                            Die Anreise zum Zeltplatz ist grundsätzlich privat organisiert. Der offizielle Beginn der
                            Veranstaltung ist am Zeltplatz selber und nicht an der Pfarrei in München. Trotzdem helfen
                            wir gerne
                            beim Organisieren und Vermitteln zwischen, denjenigen denen es nicht möglich ist ihr Kind
                            selbst zu
                            fahren und denjenigen, welche noch einen Platz im eigenen Auto frei haben. Diesbezüglich
                            sind wir aber
                            auch auf Ihre Unterstützung angewiesen und bitten Sie um Angabe freier Plätze und den
                            Verzicht auf
                            überflüssige Beifahrer (z.B. die Mitnahme beider Elternteile eines Kindes zur Verabschiedung
                            am
                            Zeltplatz).
                        </span>
                        <div class="sm:col-span-2">
                            <label>Wie kommt Ihr Kind zum Zeltplatz?*</label>
                            <select required name="Anfahrt">
                                <option value="" disabled selected="selected">
                                    bitte auswählen
                                </option>
                                <option value="Selbst (und hat noch PLATZ frei)">
                                    Ich fahre mein Kind selber und habe noch Plätze frei
                                </option>
                                <option value="Selbst (und hat KEINEN platz mehr frei)">
                                    Ich fahre mein Kind selber, habe aber leider KEINE Plätze mehr frei
                                </option>
                                <option value="Fährt WOANDERS mit">Es ist bereits abgesprochen, dass mein Kind bei
                                    Freunden
                                    mitfahren wird (bitte unten benennen)</option>
                                <option value="BRAUCHT Mitfahrgelegenheit">
                                    Mein Kind hat noch keine Mitfahrgelegenheit
                                </option>
                            </select>
                        </div>
                        <span class="sm:col-span-2 -mb-4">Wenn bei der vorangegangenen Frage 3. ausgewählt wurde, bitte
                            hier den
                            Namen
                            des/der Fahrers/in
                            angeben, bei welchem/welcher das Kind mitfährt und den Namen des zum/zur Fahrers/in
                            gehörenden
                            teilnehmenden Kindes.</span>
                        <div>
                            <label>Hinfahrt</label>
                            <input type="text" name="Hinfahrt_Fahrer" placeholder="Name des Fahrers, Name des Kindes" />
                        </div>
                        <div>
                            <label>Rückfahrt</label>
                            <input type="text" name="Rueckfahrt_Fahrer"
                                placeholder="Name des Fahrers, Name des Kindes" />
                        </div>
                        <span class="sm:col-span-2 -mb-4">Wenn bei der vorangegangenen Frage 1. ausgewählt wurde, bitte
                            hier
                            angeben wie viele Plätze in dem
                            Auto insgesamt (sprich mit dem eigenen Kind) zur Verfügung stehen:
                        </span>
                        <span class="sm:col-span-2 text-xs -mb-4">
                            Alle Plätze außer dem Fahrersitz sollen angegeben werden
                        </span>
                        <div>
                            <label>Hinfahrt Plätze</label>
                            <select name="Hinfahrt_Plaetze">
                                <option value="" disabled selected="selected">
                                    bitte auswählen
                                </option>
                                <option value=0>0</option>
                                <option value=1>1</option>
                                <option value=2>2</option>
                                <option value=3>3</option>
                                <option value=4>4</option>
                                <option value=5>5</option>
                            </select>
                        </div>
                        <div>
                            <label>Rückfahrt Plätze</label>
                            <select name="Rueckfahrt_Plaetze">
                                <option value="" disabled selected="selected">
                                    bitte auswählen
                                </option>
                                <option value=0>0</option>
                                <option value=1>1</option>
                                <option value=2>2</option>
                                <option value=3>3</option>
                                <option value=4>4</option>
                                <option value=5>5</option>
                            </select>
                        </div>
                        <span class="sm:col-span-2 -mb-4">Wir bekommen eventuell
                            Probleme mit der Unterbringung des gesamten Gepäcks und bitten um Umverteilung.
                            Bzw. wir haben voraussichtlich noch ausreichen Platz für das Gepäck weiterer Kinder, welche
                            nicht bei
                            uns mitfahren.</span>
                        <div>
                            <label>Hinfahrt Gepäcksituation*</label>
                            <select required name="Hinfahrt_Gepaecksituation">
                                <option value="" disabled selected="selected">
                                    bitte auswählen
                                </option>
                                <option value="noch extra platz">
                                    Ich habe noch Platz für Gepäck zusätzlich zu dem der Kinder, welche ich mitnehme
                                </option>
                                <option value="passt perfekt">
                                    Bei mir reicht der Platz genau für das Gepäck der Kinder, welche ich mitnehme
                                </option>
                                <option value="nicht genug platz">
                                    Ich habe nicht genug Platz für das Gepäck der Kinder, welche ich mitnehme und bitte
                                    um
                                    Umverteilung
                                </option>
                                <option value="ich fahre nicht">Ich selber fahre keine Kinder</option>
                            </select>
                        </div>
                        <div>
                            <label>Rückfahrt Gepäcksituation*</label>
                            <select required name="Rueckfahrt_Gepaecksituation">
                                <option value="" disabled selected="selected">
                                    bitte auswählen
                                </option>
                                <option value="noch extra platz">
                                    Ich habe noch Platz für Gepäck zusätzlich zu dem der Kinder, welche ich mitnehme
                                </option>
                                <option value="passt perfekt">
                                    Bei mir reicht der Platz genau für das Gepäck der Kinder, welche ich mitnehme
                                </option>
                                <option value="nicht genug platz">
                                    Ich habe nicht genug Platz für das Gepäck der Kinder, welche ich mitnehme und bitte
                                    um
                                    Umverteilung
                                </option>
                                <option value="ich fahre nicht">Ich selber fahre keine Kinder</option>
                            </select>
                        </div>
                        <h3 class="text-lg font-bold sm:col-span-2">
                            Notfallkontakt
                        </h3>
                        <div>
                            <label>Vorname*</label>
                            <input required type="Text" name="Notfall_Vorname" placeholder="Vorname" />
                        </div>
                        <div>
                            <label>Nachname*</label>
                            <input required type="Text" name="Notfall_Nachname" placeholder="Nachname" />
                        </div>
                        <div class="sm:col-span-2">
                            <label>Grad der Verwandtschaft*</label>
                            <input required type="Text" name="Notfall_Verwandschaftsgrad"
                                placeholder="z.B. Mutter / Vater" />
                        </div>
                        <div>
                            <label>Telefonnummer*</label>
                            <input required type="tel" name="Notfall_Telefon" />
                        </div>
                        <div>
                            <label>E-Mail*</label>
                            <input required type="email" name="Notfall_Email" />
                        </div>
                        <div class="sm:col-span-2">
                            <label>Weitere Angaben / Kommentare (z.B. weitere Notfallkontakte)</label>
                            <textarea name="Kommentare" rows="3"></textarea>
                        </div>
                        <div class="lg:col-span-2">
                            <label>Lesen Sie nun bitte die <a
                                    href="/files/08_Reisebedingungen_fur_Kirchenstiftungen_11.01.2016-1.pdf"
                                    target="_blank">Reisebestimmungen</a>
                                aufmerksam
                                durch. Daraufhin bitten wir Sie darum die
                                <a href="/files/Einverständniserklärung_2024.pdf"
                                    target="_blank">Einverständniserklärung</a> auszufüllen und im folgenden
                                Feld
                                hochzuladen.*
                            </label>
                            <input required type="file" name="Einverstaendniserklaerung" accept="image/*,.pdf" />
                        </div>
                    </div>
                </div>
            </div>
            <span>(*) erforderliche Felder</span>
            <br>
            <br>
            <input required type="checkbox" name="Datenschutzvereinbarung" />
            <span class="text-sm">Ich habe die <a class="text-green-600 underline" href="/datenschutz"
                    target="_blank">Datenschutzerklärung</a> gelesen und bin damit einverstanden, dass die angegebenen
                Daten
                vom Zeltlagerteam im Rahmen der Durchführung des diesjährigen Zeltlagers verarbeitet und gespeichert
                werden
                dürfen.</span>
            <!--br />
        <input type="checkbox" name="keineEinladung" />
        <span class="text-sm">Ich möchte im nächsten Jahr <span class="font-bold">KEINE</span> Einladung zum Zeltlager erhalten</span!-->
            <br />
            <button
                class="text-white bg-green-500 sm:col-span-2 p-2 rounded-md font-bold hover:bg-green-400 border border-green-300 my-2"
                type="submit">
                Anmeldung abschicken
            </button>
        </form>
    </div>
</template>

<script setup lang="ts">
// import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'
const genders = ['männlich', 'weiblich', 'divers']
const swimLevels = ["Schwimmer/in", "Schwimmanfänger/in", "Nichtschwimmer/in"]
const foodOptions = ["alles", "vegan", "vegetarisch", "kein Schweinefleisch"]
const diseases = ["Herzbeschwerden, bekannte Herzfehler, HerzkrankheitenBlutdruckanomalien", "Asthma, Bronchitis oder ähnliche Beschwerden der Atemwege", "Diabetes oder andere Stoffwechselerkrankungen", "Schwindelzustände, Ohnmachtsanfälle, Migräne, häufig starke Kopfschmerzen", "Epilepsie", "Allergien (auch Lebensmittel- und/oder Medikamentenallergie)", "Sonstige"]
const state = reactive({
  TN_Vorname: undefined,
  password: undefined
})

async function onSubmit (event: any) {
  // Do something with event.data
  console.log(event.data)
}
</script>