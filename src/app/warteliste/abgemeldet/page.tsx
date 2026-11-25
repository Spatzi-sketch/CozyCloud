import Link from "next/link";

export const metadata = {
  title: "Abmeldung | Cozy Cloud",
};

type Props = {
  searchParams: Promise<{ status?: string; product?: string }>;
};

export default async function WaitlistUnsubscribedPage({ searchParams }: Props) {
  const { status, product } = await searchParams;
  const productName = product || "dieses Produkt";

  let title = "Du bist abgemeldet ☁️";
  let message = `Du erhältst keine weiteren Restock-Benachrichtigungen mehr für ${productName}.`;
  let emoji = "🌙";

  if (status === "already") {
    title = "Bereits abgemeldet ☁️";
    message = `Deine E-Mail-Adresse ist für ${productName} bereits abgemeldet.`;
    emoji = "💤";
  } else if (status === "invalid" || status === "server") {
    title = "Link ungültig ☁️";
    message =
      "Dieser Abmeldelink ist ungültig oder konnte nicht verarbeitet werden. Wenn du Hilfe brauchst, kontaktiere uns bitte.";
    emoji = "🫧";
  }

  return (
    <main className="min-h-screen bg-rose-bg px-4 py-20 flex items-center justify-center">
      <div className="w-full max-w-lg rounded-[2rem] bg-cream p-8 md:p-12 text-center shadow-cozy border border-rose-soft/40">
        <div className="text-5xl mb-4">{emoji}</div>
        <p className="font-display text-sm tracking-[0.2em] text-rose-soft-deep mb-3">COZY CLOUD</p>
        <h1 className="font-display text-4xl md:text-5xl text-cocoa leading-tight mb-4">{title}</h1>
        <p className="text-cocoa-light text-lg leading-relaxed mb-8">{message}</p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-rose-soft-deep px-8 py-4 font-display font-semibold text-cocoa shadow-cozy hover:scale-[1.02] transition-transform"
        >
          Zurück zur Website
        </Link>
      </div>
    </main>
  );
}
