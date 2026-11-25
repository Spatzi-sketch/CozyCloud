# Cozy Cloud ☁️

Eine vollständige, verspielte E-Commerce-/Wartelisten-Website für **Cozy Cloud** – gemütliche Pyjama- und Loungehosen in einer kleinen, niedlichen Cozy-Welt.

> **Status:** Produkt-Warteliste / Restock-Benachrichtigung (noch kein Checkout, kein Warenkorb, keine Zahlungen).

## Tech Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** für Animationen
- **Supabase** für Datenbank, RLS und Admin-Authentifizierung
- **Resend** für E-Mails (Double Opt-in, Restock, optionale Admin-Benachrichtigung)
- **Vercel**-ready Deployment

## Was bereits funktioniert

### Frontend / Design
- Vollständige deutsche One-Page-Startseite mit Navigation, Hero, Produktübersicht, „Why We Love Cozy Days“, „Our Little Cozy Corner“, Restock-Bereich und Footer.
- Verspieltes Cozy-Design in Pastellrosa/Creme/Lavendel mit runden Formen, weichen Schatten, großen Fredoka-Überschriften und Nunito-Fließtext.
- Kawaii-SVG-Illustrationen (Wolken, Herzen, Sterne, Schleifen, Capybara, Teddybär) direkt im Projekt.
- Animationen mit Framer Motion + CSS (schwebende Elemente, sanfte Scroll-Eintritte, Hover-Effekte, dezente fallende Deko). `prefers-reduced-motion` wird berücksichtigt.
- Responsive für Mobile, Tablet und Desktop.
- Rechtliche Seiten: `/impressum` und `/datenschutz` als klare Platzhalter mit TODO-Hinweisen (keine erfundenen Betreiberdaten).

### Produkte
- Zentrale Produktverwaltung in `src/data/products.ts`.
- 4 Beispielprodukte mit Platzhalter-Produktbildern in `public/images/products/`.
- Jedes Produkt zeigt: Bild, Name, Preis **24,99 €**, Status **DERZEIT NICHT VERFÜGBAR**, Text „Restock kommt bald! ☁️“ und Button „BENACHRICHTIGE MICH BEIM RESTOCK“.
- Kein Kaufen-Button, kein Warenkorb, keine Zahlungsfunktion.

### Warteliste / Double Opt-in
- Produktbezogenes Wartelistenformular im Modal (E-Mail + explizite, nicht vorangekreuzte Checkbox + Datenschutzhinweis-Link).
- Honeypot-Feld und serverseitiges Rate Limiting als Spam-/Missbrauchsschutz.
- Serverseitige Validierung: Formatprüfung, Normalisierung, Wegwerf-Domain-Blockliste (pragmatische Built-in-Liste), DNS/MX/A-Check.
- Double Opt-in: Bestätigungs-E-Mail mit sicherem, zufälligem Token; nur Token-Hash in DB; zeitlich begrenzt; einmalig verwendbar.
- Bestätigte Einträge werden produktbezogen gespeichert. Unbestätigte/abgemeldete Kontakte erhalten keine Restock-Mail.
- Abmeldelink in Restock-E-Mails (`/api/waitlist/unsubscribe`).
- Optionale Admin-Benachrichtigung bei neuer bestätigter Anmeldung (wenn `ADMIN_EMAIL` + Resend konfiguriert).

### Admin-Bereich
- Geschützter Bereich unter `/admin` mit Supabase-Auth-Login (`/admin/login`).
- Serverseitige Prüfung: nur eingeloggter User mit E-Mail = `ADMIN_EMAIL` erhält Zugriff.
- Dashboard zeigt: Gesamtzahlen, bestätigte/ausstehende/benachrichtigte Kontakte, Produktübersicht mit Counts.
- Suche nach E-Mail, Filter nach Produkt und Status, Anzeige von Anmelde-/Bestätigungs-/Benachrichtigungsdatum.
- CSV-Export bestätigter Kontakte (oder nach Status/Produkt gefiltert).
- Restock-Versand pro Produkt mit Vorschau, Sicherheitsabfrage, Versand nur an bestätigte/nicht abgemeldete/nicht benachrichtigte Kontakte, Status-Update und Versandprotokoll in `restock_send_logs`.

## Projektstruktur

```text
.
├── public/
│   └── images/
│       ├── illustrations/      # Platz für Illustrationen/Assets
│       ├── logo/               # Platz für Logo-Assets
│       └── products/           # Produktfotos (hier neue Bilder ablegen)
├── src/
│   ├── app/
│   │   ├── admin/              # Admin Login + Dashboard
│   │   ├── api/                # Waitlist, Admin, Export, Restock, Logout
│   │   ├── datenschutz/
│   │   ├── impressum/
│   │   ├── warteliste/         # Bestätigt/Abgemeldet Statusseiten
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── admin/
│   │   ├── home/
│   │   ├── illustrations/
│   │   ├── layout/
│   │   └── ui/
│   ├── data/
│   │   └── products.ts         # ZENTRALE Produktdatei
│   └── lib/
│       ├── supabase/           # Browser/Server/Admin/Middleware Clients
│       ├── admin-auth.ts
│       ├── constants.ts
│       ├── disposable-domains.ts
│       ├── email-validation.ts
│       ├── email.ts            # Resend Templates/Versand
│       ├── rate-limit.ts
│       ├── tokens.ts
│       ├── utils.ts
│       └── waitlist.ts         # Waitlist Business Logic
├── supabase/
│   └── migrations/
│       └── 20261125000000_init_cozycloud.sql
├── .env.example
├── package.json
└── README.md
```

## Neues Produkt hinzufügen

1. Produktfoto in `public/images/products/` ablegen (z. B. `meine-hose.jpg`).
2. In `src/data/products.ts` einen neuen Eintrag ergänzen:

```ts
{
  slug: "mein-neues-modell",
  name: "Mein neues Modell",
  price: 24.99,
  image: "/images/products/meine-hose.jpg",
  alt: "Beschreibung des Produktfotos",
  status: "unavailable", // oder "available"
  description: "Kurzer Cozy-Text.",
}
```

3. Speichern – das Produkt erscheint automatisch auf der Website.  
   Der `slug` muss eindeutig sein und wird für die produktbezogene Warteliste verwendet.

## Lokale Entwicklung

### 1) Voraussetzungen
- Node.js 20+ empfohlen
- npm
- Supabase-Projekt
- Resend-Account/API-Key

### 2) Installieren

```bash
npm install
```

### 3) Umgebungsvariablen anlegen

```bash
cp .env.example .env.local
```

Dann Werte eintragen (siehe unten).

### 4) Dev-Server starten

```bash
npm run dev
```

App: [http://localhost:3000](http://localhost:3000)

## Umgebungsvariablen

| Variable | Benötigt | Beschreibung |
|---|---:|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Ja | Supabase Projekt-URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Ja | Öffentlicher Supabase Key (Anon/Publishable, je nach Supabase-Setup) |
| `SUPABASE_SERVICE_ROLE_KEY` | Ja (serverseitig) | Service-Role-Key für serverseitige DB-Operationen. **Nie im Frontend verwenden!** |
| `RESEND_API_KEY` | Ja für E-Mails | Resend API Key |
| `EMAIL_FROM` | Ja für E-Mails | Absender, z. B. `Cozy Cloud <hello@deine-domain.de>` |
| `ADMIN_EMAIL` | Ja für Admin | Einzige erlaubte Admin-E-Mail-Adresse |
| `NEXT_PUBLIC_SITE_URL` | Ja | Basis-URL ohne Slash, lokal `http://localhost:3000`, in Produktion Vercel-URL/Domain |

## Supabase einrichten

1. **Projekt erstellen** auf [supabase.com](https://supabase.com).
2. **Migration ausführen**: Inhalt von `supabase/migrations/20261125000000_init_cozycloud.sql` im Supabase SQL Editor ausführen (oder Supabase CLI nutzen).
3. **Keys kopieren**: Project Settings → API.
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (öffentlicher Key)
   - `SUPABASE_SERVICE_ROLE_KEY` (nur Server/Env, nie öffentlich)
4. **Admin-User anlegen**: Authentication → Users → Add user.  
   Die E-Mail muss exakt der `ADMIN_EMAIL` entsprechen. Passwort setzen (für Login unter `/admin/login`).
5. **RLS prüfen**: Die Migration aktiviert RLS und entzieht anon/authenticated Rechten. Alle Wartelistenoperationen laufen serverseitig über den Service-Role-Key.
6. **Auth-URL-Konfiguration** (für Produktion): In Supabase Auth URL Configuration die Site URL und Redirect URLs auf deine Vercel-Domain setzen.

## Resend einrichten

1. Account bei [resend.com](https://resend.com) erstellen.
2. API Key erzeugen → `RESEND_API_KEY`.
3. **Domain verifizieren** (für Produktion dringend empfohlen). Für lokale Tests kann ggf. die Resend-Testadresse verwendet werden, je nach Resend-Einschränkungen.
4. `EMAIL_FROM` auf eine verifizierte Absenderadresse setzen, z. B. `Cozy Cloud <hello@deinedomain.de>`.
5. E-Mail-Flows testen:
   - Wartelistenanmeldung → Bestätigungs-E-Mail
   - Bestätigungslink → Status wird bestätigt
   - Admin-Dashboard → Restock-E-Mail-Vorschau und Versand

## Vercel Deployment

1. Repository zu GitHub pushen (bereits dieses Repo).
2. In [Vercel](https://vercel.com) „New Project“ → GitHub-Repo importieren.
3. Framework Preset: **Next.js** (automatisch erkannt).
4. Environment Variables in Vercel eintragen (alle aus `.env.example`).
5. Deploy auslösen.
6. Nach erstem Deploy `NEXT_PUBLIC_SITE_URL` auf die finale Domain setzen und ggf. neu deployen.
7. Supabase Auth Redirect/Site URLs auf die Produktionsdomain aktualisieren.

## Sicherheitshinweise

- **Service Role Key nur serverseitig** (`SUPABASE_SERVICE_ROLE_KEY` darf nie in Client-Code).
- RLS ist aktiv; anon/authenticated haben keine Tabellenrechte.
- Admin-Zugriff wird serverseitig über Supabase Auth + `ADMIN_EMAIL` geprüft.
- Double Opt-in ist Pflicht vor aktiver Warteliste.
- Rate Limiting ist aktuell in-memory (gut als Basis). Für hohen Traffic/multi-instance härteres Rate Limiting über shared Store (z. B. Upstash Redis) ergänzen.
- DNS/MX-Check verbessert Qualität, garantiert aber nicht die Existenz eines Postfachs – deshalb Double Opt-in.

## Vor dem tatsächlichen Verkaufsstart

- [ ] Echte Betreiberangaben in Impressum & Datenschutz eintragen (keine Platzhalter).
- [ ] Datenschutzhinweise rechtlich prüfen (AT/EU, DSGVO, ePrivacy, Newsletter-/Einwilligungstexte, Speicherdauern).
- [ ] AVV/DPA mit Supabase, Resend, Vercel prüfen/abschließen.
- [ ] Eigene Domain verbinden, SPF/DKIM/DMARC für E-Mail-Zustellbarkeit einrichten.
- [ ] Echte Produktfotos in `public/images/products/` ablegen und `src/data/products.ts` aktualisieren.
- [ ] Admin-User in Supabase anlegen und `ADMIN_EMAIL` korrekt setzen.
- [ ] Restock-Flow end-to-end testen (Anmeldung, Bestätigung, Admin-Ansicht, CSV, Versand, Abmeldung).
- [ ] Social Links, Kontakt-E-Mail und Brand-Infos in `src/lib/constants.ts` ersetzen.
- [ ] Bei Bedarf Cookie-Banner/Consent-Management ergänzen (abhängig von eingesetzten Diensten/Tracking).
- [ ] Preise/Verfügbarkeit/Rechtstexte vor Launch final prüfen.

## Nützliche Befehle

```bash
npm run dev     # Entwicklung
npm run lint    # Linting
npm run build   # Produktionsbuild
npm run start   # Produktionsserver lokal
```
