"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Heart, Star, Bow, CloudFace, Sparkle } from "@/components/illustrations/CozyIllustrations";

const cards = [
  { emoji: "🧸", title: "Kuschelige Abende", text: "Wenn der Tag vorbei ist und nur noch Sofa, Decke und deine Lieblingshose zählen." },
  { emoji: "☕", title: "Heiße Kakao-Momente", text: "Wärmende Tassen, weiche Stoffe und das gute Gefühl, einfach anzukommen." },
  { emoji: "🌙", title: "Cozy Nights", text: "Sternenklare Nächte, sanfte Farben und gemütliche Outfits für dein Zuhause." },
];

export function CozyCornerSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative py-20 md:py-28 px-4 bg-rose-bg overflow-hidden">
      <div className="absolute top-8 left-8 opacity-40 animate-float pointer-events-none"><Bow size={56} /></div>
      <div className="absolute bottom-10 right-10 opacity-40 animate-sparkle pointer-events-none"><Sparkle size={24} color="#F4AFC6" /></div>
      <div className="mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="font-display text-sm tracking-[0.22em] text-rose-soft-deep mb-3">OUR LITTLE COZY CORNER</p>
            <h2 className="font-display text-4xl md:text-6xl text-cocoa leading-tight mb-5">
              Deine kleine Cozy-Welt
            </h2>
            <p className="text-cocoa-light text-lg leading-relaxed mb-8 max-w-xl">
              Bei Cozy Cloud dreht sich alles um die kleinen Momente, die den Alltag weicher machen. Unsere Welt ist verspielt, warm und voller niedlicher Details – genau wie deine liebsten Cozy-Tage.
            </p>
            <div className="flex items-center gap-3 text-cocoa-light">
              <CloudFace size={64} />
              <div className="flex gap-2">
                <Heart size={22} color="#F4AFC6" />
                <Star size={20} color="#E8DDF7" />
                <Heart size={18} color="#F7C9D8" />
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {cards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={reduceMotion ? false : { opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="rounded-[1.75rem] bg-cream border border-rose-soft/35 p-6 shadow-card flex gap-4 items-start"
              >
                <div className="w-14 h-14 rounded-2xl bg-rose-soft/25 flex items-center justify-center text-3xl shrink-0">
                  {card.emoji}
                </div>
                <div>
                  <h3 className="font-display text-xl text-cocoa mb-1">{card.title}</h3>
                  <p className="text-cocoa-light leading-relaxed">{card.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
