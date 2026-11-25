"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X, Mail, Sparkles } from "lucide-react";
import Link from "next/link";
import type { Product } from "@/data/products";

type Props = {
  product: Product | null;
  open: boolean;
  onClose: () => void;
};

function WaitlistForm({ product, onClose }: { product: Product; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Bitte gib eine gültige E-Mail-Adresse ein.");
      return;
    }
    if (!consent) {
      setError("Bitte stimme der Benachrichtigung zu, damit wir dich informieren dürfen.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/waitlist/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          productSlug: product.slug,
          consent: true,
          website: honeypot,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Etwas ist schiefgelaufen. Bitte versuche es später erneut.");
        return;
      }
      setSuccess(data.message || "Fast geschafft! Bitte bestätige deine E-Mail-Adresse.");
    } catch {
      setError("Verbindung fehlgeschlagen. Bitte versuche es später erneut.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center py-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-soft/30 text-rose-soft-deep mb-4">
          <Sparkles size={32} />
        </div>
        <p className="font-display text-sm tracking-[0.18em] text-rose-soft-deep mb-2">FAST GESCHAFFT</p>
        <h2 className="font-display text-3xl md:text-4xl text-cocoa leading-tight mb-3">YOU&apos;RE ALMOST ON THE LIST! ☁️</h2>
        <p className="text-cocoa-light leading-relaxed mb-6">{success}</p>
        <div className="rounded-2xl bg-rose-soft/15 border border-rose-soft/30 px-4 py-4 text-sm text-cocoa-light leading-relaxed">
          Bitte klicke auf den Bestätigungslink in deiner E-Mail. Erst danach nehmen wir dich aktiv in die Warteliste auf.
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-rose-soft-deep px-8 py-3.5 font-display font-semibold text-cocoa shadow-cozy hover:scale-[1.02] transition-transform"
        >
          Alles klar
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-6 pr-8 pl-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-rose-soft/30 text-rose-soft-deep mb-4">
          <Mail size={28} />
        </div>
        <p className="font-display text-sm tracking-[0.18em] text-rose-soft-deep mb-2">RESTOCK-WARTELISTE</p>
        <h2 className="font-display text-3xl md:text-4xl text-cocoa leading-tight mb-2">
          Can&apos;t wait for the restock? ☁️
        </h2>
        <p className="text-cocoa-light leading-relaxed">
          Trage deine E-Mail-Adresse ein und wir informieren dich, sobald <span className="font-semibold text-cocoa">{product.name}</span> wieder verfügbar ist.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {/* Honeypot field for bots */}
        <div className="absolute -left-[9999px] top-auto w-1 h-1 overflow-hidden" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="waitlist-email" className="block font-display font-medium text-cocoa mb-2">
            E-Mail-Adresse
          </label>
          <input
            id="waitlist-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            maxLength={254}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="deine@email.de"
            className="w-full rounded-2xl border border-rose-soft/60 bg-white-soft px-4 py-3.5 text-cocoa placeholder:text-cocoa-light/50 focus:outline-none focus:ring-2 focus:ring-rose-soft-deep/50"
          />
        </div>

        <label className="flex gap-3 items-start text-sm text-cocoa-light leading-relaxed cursor-pointer">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-5 w-5 rounded-md border-rose-soft-deep/50 text-rose-soft-deep accent-[#F4AFC6]"
          />
          <span>
            Ich möchte eine einmalige E-Mail erhalten, sobald dieses Produkt wieder verfügbar ist. Ich stimme der dafür notwendigen Verarbeitung meiner E-Mail-Adresse gemäß{" "}
            <Link href="/datenschutz" className="underline decoration-rose-soft-deep/60 underline-offset-2 hover:text-cocoa" target="_blank">
              Datenschutzhinweisen
            </Link>{" "}
            zu.
          </span>
        </label>

        {error && (
          <div className="rounded-2xl bg-accent-red/10 border border-accent-red/20 px-4 py-3 text-sm text-cocoa" role="alert">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-rose-soft-deep px-6 py-4 font-display font-bold text-cocoa tracking-wide shadow-cozy hover:scale-[1.01] active:scale-[0.99] transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Wird gesendet..." : "NOTIFY ME ☁️"}
        </button>

        <p className="text-xs text-cocoa-light/80 text-center leading-relaxed">
          Kein Newsletter, keine Werbung. Nur eine einmalige Benachrichtigung für dieses Produkt. Abmeldung jederzeit möglich.
        </p>
      </form>
    </>
  );
}

export function WaitlistModal({ product, open, onClose }: Props) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && product && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center px-4 py-8"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0 }}
          aria-hidden={!open}
        >
          <div className="absolute inset-0 bg-cocoa/30 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Restock-Benachrichtigung für ${product.name}`}
            initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-lg rounded-[2rem] bg-cream border border-rose-soft/50 shadow-cozy p-6 md:p-8"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-rose-soft/20 hover:bg-rose-soft/40 text-cocoa flex items-center justify-center transition-colors"
              aria-label="Schließen"
            >
              <X size={20} />
            </button>
            <WaitlistForm key={product.slug} product={product} onClose={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
