import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Impressum",
};

export default function ImpressumPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-rose-bg pt-32 pb-20 px-4">
        <div className="mx-auto max-w-3xl rounded-[2rem] bg-cream border border-rose-soft/35 shadow-card p-8 md:p-12">
          <p className="font-display text-sm tracking-[0.2em] text-rose-soft-deep mb-3">RECHTLICHES</p>
          <h1 className="font-display text-4xl md:text-5xl text-cocoa mb-8">Impressum</h1>

          <div className="space-y-6 text-cocoa-light leading-relaxed">
            <div className="rounded-2xl bg-accent-red/10 border border-accent-red/20 p-4 text-sm text-cocoa">
              <strong>Wichtig:</strong> Dieses Impressum ist ein Platzhalter. Vor dem Livegang müssen hier die tatsächlichen Betreiberangaben gemäß den gesetzlichen Anforderungen für Österreich/EU eingetragen werden. Es wurden keine Unternehmensdaten erfunden.
            </div>

            <section>
              <h2 className="font-display text-2xl text-cocoa mb-2">Medieninhaber / Betreiber</h2>
              <p>[Vor- und Nachname / Firmenname eintragen]</p>
              <p>[Straße und Hausnummer eintragen]</p>
              <p>[PLZ, Ort, Österreich eintragen]</p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-cocoa mb-2">Kontakt</h2>
              <p>E-Mail: [E-Mail-Adresse eintragen]</p>
              <p>Telefon: [optional eintragen]</p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-cocoa mb-2">Unternehmensgegenstand</h2>
              <p>[Unternehmensgegenstand eintragen]</p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-cocoa mb-2">Aufsichtsbehörde / Gewerbeberechtigung</h2>
              <p>[Falls zutreffend: Gewerbebehörde, Gewerbeordnung, Mitgliedschaften etc. eintragen]</p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-cocoa mb-2">UID-Nummer</h2>
              <p>[Falls vorhanden eintragen]</p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-cocoa mb-2">Offenlegung nach Mediengesetz / ECG</h2>
              <p>[Bei Bedarf ergänzen: Grundlegende Richtung des Mediums, verantwortliche Person etc.]</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
