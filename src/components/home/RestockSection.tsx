"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Bell, Sparkles } from "lucide-react";
import { CloudFace, Star, Heart } from "@/components/illustrations/CozyIllustrations";

export function RestockSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="restock" className="relative py-20 md:py-28 px-4 bg-cream overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-10 left-[10%] opacity-40 animate-float-slow"><CloudFace size={90} /></div>
        <div className="absolute bottom-10 right-[10%] opacity-40 animate-float"><Heart size={28} /></div>
        <div className="absolute top-16 right-[20%] opacity-50 animate-sparkle"><Star size={24} color="#E8DDF7" /></div>
      </div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-4xl relative rounded-[2.5rem] bg-gradient-to-br from-rose-soft/35 via-rose-bg to-lavender/30 border border-rose-soft/40 p-8 md:p-14 text-center shadow-cozy"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cream shadow-card text-rose-soft-deep mb-6">
          <Sparkles size={30} />
        </div>
        <p className="font-display text-sm tracking-[0.22em] text-rose-soft-deep mb-3">RESTOCK COMING SOON</p>
        <h2 className="font-display text-4xl md:text-6xl text-cocoa leading-tight mb-5">
          Verpasse deinen Cozy-Favoriten nicht ☁️
        </h2>
        <p className="text-cocoa-light text-lg leading-relaxed max-w-2xl mx-auto mb-8">
          Unsere gemütlichen Hosen sind gerade nicht verfügbar, aber der nächste Restock kommt bald. Wähle dein Lieblingsmodell aus und trage dich für die einmalige Benachrichtigung ein.
        </p>
        <Link
          href="#produkte"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-soft-deep px-8 py-4 font-display font-bold text-cocoa shadow-cozy hover:scale-[1.02] active:scale-[0.99] transition-transform"
        >
          <Bell size={20} />
          ZU DEN HOSEN & BENACHRICHTIGUNG
        </Link>
        <p className="text-sm text-cocoa-light/80 mt-5">
          Du erhältst nur eine einmalige E-Mail zum gewählten Produkt – kein Newsletter.
        </p>
      </motion.div>
    </section>
  );
}
