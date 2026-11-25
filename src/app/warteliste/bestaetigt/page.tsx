import Link from "next/link";

export const metadata = {
  title: "E-Mail bestätigt | Cozy Cloud",
};

type Props = {
  searchParams: Promise<{ status?: string; product?: string }>;
};

export default async function WaitlistConfirmedPage({ searchParams }: Props) {
  const { status, product } = await searchParams;
  const productName = product || "dein Produkt";

  let title = "YOU'RE ON THE LIST! ☁️";
  let message = `Wir informieren dich, sobald ${productName} wieder da ist.`;
  let emoji = "💌";

  if (status === "already") {
    title = "Schon bestätigt! ☁️";
    message = `Deine E-Mail-Adresse für ${productName} ist bereits bestätigt. Wir melden uns beim Restock!`;
    emoji = "✨";
  } else if (status === "expired") {
    title = "Link abgelaufen ☁️";
    message =
      "Dieser Bestätigungslink ist leider abgelaufen. Bitte trage dich erneut auf der Website ein, damit wir dir einen neuen Link senden können.";
    emoji = "⏳";
  } else if (status === "invalid") {
    title = "Link ungültig ☁️";
    message =
      "Dieser Bestätigungslink ist ungültig oder wurde bereits verwendet. Bitte trage dich bei Bedarf erneut ein.";
    emoji = "🫧";
  } else if (status === "unsubscribed") {
    title = "Anmeldung abgemeldet ☁️";
    message =
      "Diese Anmeldung wurde bereits abgemeldet. Wenn du wieder Benachrichtigungen erhalten möchtest, kannst du dich erneut auf der Website eintragen.";
    emoji = "🌙";
  } else if (status === "server") {
    title = "Ups, etwas ist schiefgelaufen ☁️";
    message = "Wir konnten deine Bestätigung gerade nicht verarbeiten. Bitte versuche es später erneut.";
    emoji = "💭";
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
