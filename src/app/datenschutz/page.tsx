import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Datenschutz",
};

export default function DatenschutzPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-rose-bg pt-32 pb-20 px-4">
        <div className="mx-auto max-w-3xl rounded-[2rem] bg-cream border border-rose-soft/35 shadow-card p-8 md:p-12">
          <p className="font-display text-sm tracking-[0.2em] text-rose-soft-deep mb-3">RECHTLICHES</p>
          <h1 className="font-display text-4xl md:text-5xl text-cocoa mb-8">Datenschutzhinweise</h1>

          <div className="space-y-8 text-cocoa-light leading-relaxed">
            <div className="rounded-2xl bg-accent-red/10 border border-accent-red/20 p-4 text-sm text-cocoa">
              <strong>Wichtig:</strong> Diese Datenschutzhinweise sind ein sorgfältig vorbereiteter Entwurf/Platzhalter für Cozy Cloud. Vor dem Livegang müssen die tatsächlichen Betreiberangaben, Rechtsgrundlagen im Detail, Auftragsverarbeitungsverträge, Speicherdauern und ggf. weitere Dienste rechtlich geprüft und ergänzt werden. Es wurden keine rechtlichen Betreiberinformationen erfunden.
            </div>

            <section>
              <h2 className="font-display text-2xl text-cocoa mb-2">1. Verantwortliche Stelle</h2>
              <p>[Vor- und Nachname / Firmenname eintragen]</p>
              <p>[Adresse eintragen]</p>
              <p>E-Mail: [Kontakt-E-Mail eintragen]</p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-cocoa mb-2">2. Worum es auf dieser Website geht</h2>
              <p>
                Cozy Cloud ist ein Onlineshop für gemütliche Pyjama- und Loungehosen. Aktuell können noch keine Käufe abgeschlossen werden. Stattdessen bieten wir eine produktbezogene Restock-Warteliste an: Du kannst dich für ein bestimmtes Produkt eintragen und erhältst eine einmalige E-Mail, sobald genau dieses Produkt wieder verfügbar ist.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-cocoa mb-2">3. Restock-Warteliste (Double Opt-in)</h2>
              <p className="mb-3">
                Wenn du dich für eine Restock-Benachrichtigung einträgst, verarbeiten wir folgende Daten:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>E-Mail-Adresse</li>
                <li>Ausgewähltes Produkt / Produktzuordnung</li>
                <li>Zeitpunkt der Anmeldung und der Einwilligung</li>
                <li>IP-Adresse und User-Agent (zur Missbrauchs-/Spam-Abwehr und Sicherheitsprotokollierung)</li>
                <li>Bestätigungsstatus (ausstehend, bestätigt, benachrichtigt, abgemeldet)</li>
                <li>Zeitpunkt der Bestätigung, Benachrichtigung oder Abmeldung</li>
              </ul>
              <p className="mt-3">
                <strong>Ablauf:</strong> Nach deiner Anmeldung senden wir dir eine Bestätigungs-E-Mail (Double Opt-in). Erst nachdem du den Bestätigungslink angeklickt hast, wird deine E-Mail-Adresse als aktiv in die Warteliste aufgenommen. Ohne Bestätigung erhältst du keine Restock-E-Mail.
              </p>
              <p className="mt-3">
                <strong>Zweck:</strong> Einmalige Benachrichtigung, wenn das von dir ausgewählte Produkt wieder verfügbar ist.
              </p>
              <p className="mt-3">
                <strong>Rechtsgrundlage:</strong> Deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Die Einwilligung ist freiwillig und nicht für einen Kauf erforderlich. Du kannst sie jederzeit mit Wirkung für die Zukunft widerrufen, z. B. über den Abmeldelink in der E-Mail oder durch Kontaktaufnahme.
              </p>
              <p className="mt-3">
                <strong>Keine allgemeine Werbung:</strong> Deine E-Mail-Adresse wird für diese produktbezogene Restock-Benachrichtigung verwendet und nicht ohne gesonderte Einwilligung für andere Werbezwecke genutzt.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-cocoa mb-2">4. E-Mail-Versand</h2>
              <p>
                Für den Versand von Bestätigungs-, Restock- und ggf. administrativen Benachrichtigungs-E-Mails verwenden wir den Dienst <strong>Resend</strong>. Dabei werden die für den Versand notwendigen Daten (z. B. E-Mail-Adresse, Inhalt, Metadaten) an Resend übermittelt. Vor dem Livegang ist ein Auftragsverarbeitungsvertrag (AVV/DPA) mit dem Anbieter zu prüfen/abzuschließen und die Anbieterinformation in diesen Hinweisen zu vervollständigen.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-cocoa mb-2">5. Hosting, Datenbank und Authentifizierung</h2>
              <p className="mb-3">
                Wir nutzen folgende technische Dienste:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Vercel</strong> für Hosting und Auslieferung der Website.</li>
                <li><strong>Supabase</strong> für Datenbank, Speicherung der Wartelisten-Einträge und Admin-Authentifizierung.</li>
              </ul>
              <p className="mt-3">
                Die Daten werden in der eingerichteten Supabase-Instanz gespeichert. Vor dem Livegang sind die Datenstandorte, AVV/DPA, technische und organisatorische Maßnahmen sowie ggf. Drittlandübermittlungen rechtlich zu prüfen und hier konkret zu dokumentieren.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-cocoa mb-2">6. Speicherdauer</h2>
              <p>
                Wir speichern Wartelisten-Daten nur so lange, wie es für den Zweck der Restock-Benachrichtigung erforderlich ist oder gesetzliche Pflichten bestehen. Nach Versand der Restock-Benachrichtigung oder nach Abmeldung/Widerruf werden die Daten gelöscht oder eingeschränkt, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen. Die konkrete Speicherdauer muss vor dem Livegang final festgelegt und hier eingetragen werden.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-cocoa mb-2">7. Deine Rechte</h2>
              <p className="mb-3">Du hast nach Maßgabe der DSGVO insbesondere folgende Rechte:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Auskunft über deine verarbeiteten Daten</li>
                <li>Berichtigung unrichtiger Daten</li>
                <li>Löschung deiner Daten</li>
                <li>Einschränkung der Verarbeitung</li>
                <li>Datenübertragbarkeit</li>
                <li>Widerspruch gegen bestimmte Verarbeitungen</li>
                <li>Widerruf einer erteilten Einwilligung</li>
                <li>Beschwerde bei einer Datenschutz-Aufsichtsbehörde</li>
              </ul>
              <p className="mt-3">
                Für Österreich ist zuständige Aufsichtsbehörde in der Regel die Österreichische Datenschutzbehörde (dsb). Bitte prüfe vor dem Livegang, ob diese Angabe für deinen Sitz zutrifft.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-cocoa mb-2">8. Sicherheit</h2>
              <p>
                Wir setzen technische und organisatorische Maßnahmen ein, um deine Daten zu schützen. Dazu gehören unter anderem serverseitige Validierung, Double Opt-in, geschützter Admin-Bereich, Zugriffsbeschränkungen, Row Level Security in der Datenbank und die Verwendung von Service-Rollen-Schlüsseln ausschließlich serverseitig.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-cocoa mb-2">9. Kontakt</h2>
              <p>
                Bei Fragen zum Datenschutz kontaktiere uns unter: <strong>[Datenschutz-Kontakt-E-Mail eintragen]</strong>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
