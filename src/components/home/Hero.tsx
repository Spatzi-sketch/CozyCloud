"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { CapybaraMug, CloudFace, Heart, Star, Sparkle } from "@/components/illustrations/CozyIllustrations";

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="home" className="relative min-h-[92vh] pt-28 md:pt-32 pb-16 px-4 overflow-hidden bg-gradient-to-b from-rose-bg via-rose-bg to-cream">
      {/* Background decor */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-28 left-[6%] opacity-70 animate-drift">
          <CloudFace size={110} />
        </div>
        <div className="absolute top-40 right-[8%] opacity-50 animate-float-slow hidden sm:block">
          <CloudFace size={80} />
        </div>
        <div className="absolute top-32 right-[30%] animate-sparkle">
          <Star size={26} color="#E8DDF7" />
        </div>
        <div className="absolute bottom-24 left-[12%] animate-float">
          <Heart size={26} color="#F4AFC6" />
        </div>
        <div className="absolute top-52 left-[45%] animate-sparkle hidden md:block">
          <Sparkle size={18} color="#F4AFC6" />
        </div>
        <div className="absolute bottom-32 right-[18%] animate-float-slow hidden md:block">
          <Heart size={22} color="#E8DDF7" />
        </div>
        <div className="absolute bottom-20 left-[40%] animate-sparkle hidden lg:block">
          <Star size={20} color="#F7C9D8" />
        </div>
      </div>

      <div className="mx-auto max-w-6xl grid lg:grid-cols-2 gap-10 lg:gap-6 items-center relative">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center lg:text-left"
        >
          <p className="inline-flex items-center gap-2 rounded-full bg-cream/80 border border-rose-soft/50 px-4 py-2 font-display text-sm text-cocoa-light mb-6 shadow-sm">
            <span className="text-base">☁️</span> Dein cozy Lieblingsort
          </p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl xl:text-[5.5rem] leading-[0.95] tracking-tight text-cocoa text-balance">
            YOUR NEW{" "}
            <span className="text-rose-soft-deep">FAVORITE</span>{" "}
            COZY MOMENT <span className="inline-block animate-wiggle">☁️</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-cocoa-light leading-relaxed max-w-xl mx-auto lg:mx-0">
            Gemütliche Hosen für deine schönsten Wohlfühlmomente.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              href="#produkte"
              className="inline-flex items-center justify-center rounded-full bg-rose-soft-deep px-8 py-4 font-display font-bold text-cocoa text-base md:text-lg shadow-cozy hover:scale-[1.02] active:scale-[0.99] transition-transform"
            >
              UNSERE HOSEN ENTDECKEN
            </Link>
            <Link
              href="#restock"
              className="inline-flex items-center justify-center rounded-full bg-cream border border-rose-soft/60 px-8 py-4 font-display font-semibold text-cocoa hover:bg-rose-soft/20 transition-colors"
            >
              Restock-Benachrichtigung
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="relative flex items-center justify-center"
        >
          <div className="relative w-full max-w-[520px] aspect-square">
            <div className="absolute inset-8 rounded-full bg-rose-soft/25 blur-2xl" />
            <div className="absolute inset-0 rounded-[3rem] bg-cream/60 border border-rose-soft/30 shadow-cozy" />
            <div className="absolute -top-4 -left-2 md:-left-6 animate-float-slow">
              <CloudFace size={100} />
            </div>
            <div className="absolute top-8 right-4 animate-sparkle">
              <Star size={30} color="#F4AFC6" />
            </div>
            <div className="absolute bottom-10 -left-2 animate-float">
              <Heart size={28} color="#E8DDF7" />
            </div>
            <div className="absolute -bottom-2 right-10 animate-sparkle">
              <Sparkle size={22} color="#F4AFC6" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center p-8 md:p-12">
              <div className="animate-float">
                <CapybaraMug size={320} className="w-full max-w-[320px] h-auto drop-shadow-sm" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-cocoa-light/60 hidden md:flex flex-col items-center gap-1" aria-hidden="true">
        <span className="text-xs font-display tracking-widest">SCROLL</span>
        <ArrowDown size={18} className="animate-bounce" />
      </div>
    </section>
  );
}
