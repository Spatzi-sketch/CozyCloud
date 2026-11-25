import type { Metadata } from "next";
import "@fontsource/fredoka/400.css";
import "@fontsource/fredoka/500.css";
import "@fontsource/fredoka/600.css";
import "@fontsource/fredoka/700.css";
import "@fontsource/nunito/400.css";
import "@fontsource/nunito/500.css";
import "@fontsource/nunito/600.css";
import "@fontsource/nunito/700.css";
import "@fontsource/nunito/800.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Cozy Cloud – Gemütliche Pyjama- & Loungehosen",
    template: "%s | Cozy Cloud",
  },
  description:
    "Cozy Cloud ist dein Onlineshop für gemütliche Pyjama- und Loungehosen. Entdecke deine neuen Cozy-Favoriten und trage dich für den Restock ein.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "Cozy Cloud – Gemütliche Pyjama- & Loungehosen",
    description:
      "Gemütliche Hosen für deine schönsten Wohlfühlmomente. Trage dich jetzt für den Restock ein.",
    type: "website",
    locale: "de_AT",
    siteName: "Cozy Cloud",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="antialiased bg-rose-bg text-cocoa font-body">
        {children}
      </body>
    </html>
  );
}
