---
title: Datenschutzerklärung
date: April 2025 
---

::TextSection
# Datenschutzerklärung
::USeparator
::

## Verantwortliche Stelle

**KjG Ortsgruppe Zeltlager Milbertshofen**  
Milbertshofener Platz 2  
80809 München  
Telefon: +49 176 61906287  
E-Mail: [zeltlager-milbertshofen@gmx.de](mailto:zeltlager-milbertshofen@gmx.de)

## Datenschutzbeauftragter 
Ein Datenschutzbeauftragter wird nach §38 BDSG nicht benannt, da die Voraussetzungen hierfür nicht vorliegen.

## Zweck der Datenverarbeitung

Im Rahmen der Anmeldung zum Zeltlager werden personenbezogene Daten erhoben, um die Veranstaltung organisatorisch und medizinisch sicher durchführen zu können. Diese Daten dienen ausschließlich der Durchführung des Zeltlagers sowie damit unmittelbar zusammenhängender Veranstaltungen (z. B. Nachtreffen).

Die E-Mail-Adresse nutzen wir:
- zur Kommunikation wichtiger Informationen rund um das Zeltlager
- zur Einladung zu einem Nachtreffen zum aktuellen Lagerjahr
- **nur mit Ihrem ausdrücklichen Hinweis bei der Anmeldung** auch zur Einladung im Folgejahr

Eine Weitergabe der Daten an Dritte erfolgt ausschließlich, sofern dies zur Organisation notwendig ist (z. B. medizinische Notfälle, Fahrgemeinschaftsvermittlung).

## Erhobene Daten

Folgende Daten werden über das Formular erhoben und unter dem angegebenen Schlüssel gespeichert:

### Allgemeine Informationen zum Kind

- Vorname (`name`)
- Nachname (`sirname`)
- Geschlecht (`gender`)
- Geburtsdatum (`birthday`)
- Adresse (`address`)
- E-Mail-Adresse (`email`)
- Fitness (`fitness`)
- Schwimmlevel (`swimmer`)
- Essenswunsch (`food`)
- Erkrankungen (Auswahl) (`diseases`)
- Erkrankungen – Beschreibung (`disease_description`)
- Wundversorgung erlaubt? (`wound_care`)
- Zecken entfernen erlaubt? (`pull_ticks`)
- Impfstatus ausreichend? (`vaccination`)
- Impfstatus – Beschreibung (`vaccination_description`)
- Aufsichtspflicht bei Gruppenaktivitäten (`group_activity_consent`)
- Kontaktdaten Hausarzt (`contact_doctor`)

### Bring- und Holdienst

- Anreiseart (`arrival`)
- Fahrer*in Hinfahrt, Name des Kindes (`arrival_driver`)
- Fahrer*in Rückfahrt, Name des Kindes (`return_driver`)
- Plätze im Auto (Hinfahrt) (`arrival_places`)
- Plätze im Auto (Rückfahrt) (`return_places`)
- Gepäckmitnahme (Hinfahrt) (`arrival_baggage`)
- Gepäckmitnahme (Rückfahrt) (`return_baggage`)

### Notfallkontakt

- Vor- und Nachname (`emergency_name`)
- Verwandtschaftsgrad (`emergency_relationship`)
- Telefonnummer (`emergency_phone_number`)
- E-Mail-Adresse (`emergency_email`)
- Weitere Kommentare (`comments`)

### Rechtliches

- Foto-/Video-Einwilligung (`photos`)
- Hochgeladene Einverständniserklärung (`consent`)
- Dateiname der Einverständniserklärung (`consent_filename`)
- Zustimmung zur Datenschutzerklärung (`privacy_agreement`)

## Speicherdauer

Die im Formular erhobenen personenbezogenen Daten werden nur so lange gespeichert, wie es für die Durchführung und Organisation des Ferienlagers erforderlich ist - in der Regel **bis zum Ende des jeweiligen Lagerjahres (31. Dezember)**. Danach werden die Daten gelöscht.

Sofern Sie im Formular der **Einladung zum Lager im Folgejahr** zugestimmt haben, dürfen wir Ihre **E-Mail-Adresse** bis zur Versendung dieser Einladung speichern (maximal bis zum Ende des Folgejahres).

**Einverständniserklärungen** (inkl. Name, Datum und Unterschrift) dienen dem rechtlichen Nachweis und können bis zu **3 Jahre nach Ende des Lagerjahres** gespeichert werden, um mögliche zivilrechtliche Ansprüche (z.B. gemäß §195 BGB) abdecken zu können.

Eine darüber hinausgehende Speicherung erfolgt nur, wenn rechtliche Aufbewahrungspflichten bestehen oder Sie **ausdrücklich eingewilligt** haben (z.B. durch erneute Anmeldung im Folgejahr).

## Rechtsgrundlagen der Datenverarbeitung

- **Art. 6 Abs. 1 lit. b DSGVO** - Erfüllung eines Vertrags (Teilnahme am Zeltlager)  
- **Art. 6 Abs. 1 lit. a DSGVO** - Einwilligung (z.B. Fotoerlaubnis, Einladung nächstes Jahr)  
- **Art. 6 Abs. 1 lit. f DSGVO** - berechtigtes Interesse (Nachtreffen, Informationsversand)

## Ihre Rechte

Sie haben jederzeit das Recht auf:

- Auskunft über Ihre gespeicherten Daten
- Berichtigung oder Löschung Ihrer Daten
- Einschränkung der Verarbeitung
- Widerspruch gegen die Verarbeitung
- Datenübertragbarkeit
- Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft

Bitte wenden Sie sich dazu an die oben genannte Kontaktadresse.

## Frontend-Technologien

Unsere Webseite nutzt folgende Tools ausschließlich zur Darstellung und Funktionalität:

- **Nuxt 3, Nuxt UI, NuxtContent, NuxtIcons (Material Symbols), Tailwind CSS**
- **Valibot** zur Formularvalidierung

Diese Tools speichern oder analysieren **keine personenbezogenen Daten**. Es werden **keine Tracking-Tools** wie Google Analytics oder Facebook Pixel verwendet.

## Hosting, Datenbank & E-Mailversand

- **Supabase** (Datenbank): Speicherung innerhalb der EU nach DSGVO-Standards  
- **Nodemailer**: Nodemailer wird für den E-Mailversand verwendet. Die E-Mails werden über den SMTP-Server unseres Hosting-Providers GMX versendet. 
Dabei werden ausschließlich die im Formular eingegebenen Informationen wie z.B. Name, E-Mail-Adresse und Formularinhalte für den Zweck der Kommunikation (z.B. Bestätigung, Einladung, Nachtreffen) verarbeitet.

## Cookies & Sitzungsdaten

Unsere Webseite verwendet **keine Tracking-Cookies**.  
Technisch notwendige Session-Cookies können ggf. durch Nuxt oder zukünftig durch Authentifizierung (z. B. mit JWT via Supabase) gesetzt werden. Diese dienen ausschließlich der sicheren Nutzung und werden nicht zur Analyse verwendet.

::