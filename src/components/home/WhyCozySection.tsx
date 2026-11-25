"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CloudFace, Heart, Star, SleepingBear } from "@/components/illustrations/CozyIllustrations";

const items = [
  {
    icon: <CloudFace size={72} />,
    title: "Weiche Wohlfühlmomente",
    text: "Cozy Cloud steht für gemütliche Abende, warme Kakao-Tassen und Hosen, in denen man am liebsten den ganzen Tag bleiben möchte.",
  },
  {
    icon: <SleepingBear size={110} />,
    title: "Gemütlichkeit zum Verlieben",
    text: "Wir lieben alles, was sich weich, warm und niedlich anfühlt. Genau dieses Gefühl wollen wir mit Cozy Cloud teilen.",
  },
  {
    icon: (
      <div className="flex items-center gap-1">
        <Heart size={34} color="#F4AFC6" />
        <Star size={30} color="#E8DDF7" />
        <Heart size={26} color="#F7C9D8" />
      </div>
    ),
    title: "Kleine Cozy-Glücksmomente",
    text: "Ob Sofa, Filmabend oder Sonntagsfrühstück – Cozy Cloud soll dich in deinen schönsten Wohlfühlmomenten begleiten.",
  },
];

export function WhyCozySection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="ueber-uns" className="relative py-20 md:py-28 px-4 bg-cream overflow-hidden">
      <div className="absolute top-10 right-10 opacity-30 pointer-events-none animate-float-slow">
        <Star size={34} color="#E8DDF7" />
      </div>
      <div className="mx-auto max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <p className="font-display text-sm tracking-[0.22em] text-rose-soft-deep mb-3">WARUM WIR COZY DAYS LIEBEN</p>
          <h2 className="font-display text-4xl md:text-6xl text-cocoa leading-tight mb-4">
            WHY WE LOVE COZY DAYS
          </h2>
          <p className="text-cocoa-light text-lg leading-relaxed">
            Cozy Cloud ist mehr als ein Shop – es ist ein kleines Gefühl von Zuhause, das du anziehen kannst.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="rounded-[2rem] bg-rose-bg/60 border border-rose-soft/30 p-7 md:p-8 text-center shadow-card"
            >
              <div className="h-28 flex items-center justify-center mb-4">{item.icon}</div>
              <h3 className="font-display text-2xl text-cocoa mb-3">{item.title}</h3>
              <p className="text-cocoa-light leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
