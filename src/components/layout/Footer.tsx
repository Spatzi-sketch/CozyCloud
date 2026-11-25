import Link from "next/link";
import { Instagram } from "lucide-react";
import { CozyCloudLogo, Heart } from "@/components/illustrations/CozyIllustrations";
import { BRAND } from "@/lib/constants";

function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.3 0 .59.04.88.1V9.01a6.33 6.33 0 0 0-.88-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.02-.06z"/>
    </svg>
  );
}

export function Footer() {
  return (
    <footer id="kontakt" className="relative bg-cream border-t border-rose-soft/40 pt-16 pb-8 px-4 overflow-hidden">
      <div className="absolute top-6 right-8 opacity-40 pointer-events-none">
        <Heart size={32} />
      </div>
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <CozyCloudLogo />
            <p className="mt-4 text-cocoa-light leading-relaxed max-w-sm">
              Gemütliche Hosen für deine schönsten Wohlfühlmomente. Eine kleine Cozy-Welt voller Wärme, Komfort und guter Laune.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href={BRAND.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-11 h-11 rounded-full bg-rose-soft/30 text-cocoa flex items-center justify-center hover:bg-rose-soft/60 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href={BRAND.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-11 h-11 rounded-full bg-rose-soft/30 text-cocoa flex items-center justify-center hover:bg-rose-soft/60 transition-colors"
              >
                <TikTokIcon size={20} />
              </a>
            </div>
          </div>

          <div>
            <p className="font-display font-semibold text-cocoa mb-4">Navigation</p>
            <ul className="space-y-2">
              <li><Link href="/#home" className="text-cocoa-light hover:text-cocoa transition-colors">Home</Link></li>
              <li><Link href="/#produkte" className="text-cocoa-light hover:text-cocoa transition-colors">Produkte</Link></li>
              <li><Link href="/#ueber-uns" className="text-cocoa-light hover:text-cocoa transition-colors">Über uns</Link></li>
              <li><Link href="/#kontakt" className="text-cocoa-light hover:text-cocoa transition-colors">Kontakt</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-display font-semibold text-cocoa mb-4">Rechtliches</p>
            <ul className="space-y-2">
              <li><Link href="/impressum" className="text-cocoa-light hover:text-cocoa transition-colors">Impressum</Link></li>
              <li><Link href="/datenschutz" className="text-cocoa-light hover:text-cocoa transition-colors">Datenschutz</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-display font-semibold text-cocoa mb-4">Kontakt</p>
            <p className="text-cocoa-light leading-relaxed">
              Fragen oder liebe Worte?
              <br />
              <a href={`mailto:${BRAND.email}`} className="underline decoration-rose-soft-deep/60 underline-offset-4 hover:text-cocoa transition-colors">
                {BRAND.email}
              </a>
            </p>
            <p className="text-xs text-cocoa-light/70 mt-4 leading-relaxed">
              Hinweis: Kontaktdaten sind Platzhalter und müssen vor dem Livegang durch echte Betreiberangaben ersetzt werden.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-rose-soft/30 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-cocoa-light">
          <p>© {new Date().getFullYear()} Cozy Cloud. Mit viel Gemütlichkeit gemacht.</p>
          <p className="flex items-center gap-1">Made with <Heart size={14} color="#F4AFC6" /> for cozy days</p>
        </div>
      </div>
    </footer>
  );
}
