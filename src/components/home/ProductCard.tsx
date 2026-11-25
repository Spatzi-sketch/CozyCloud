"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Bell } from "lucide-react";
import { formatPrice, type Product } from "@/data/products";

type Props = {
  product: Product;
  onNotify: (product: Product) => void;
};

export function ProductCard({ product, onNotify }: Props) {
  const reduceMotion = useReducedMotion();
  const unavailable = product.status === "unavailable";

  return (
    <motion.article
      layout
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="group bg-cream rounded-[2rem] border border-rose-soft/35 shadow-card hover:shadow-cozy-hover transition-shadow duration-300 overflow-hidden flex flex-col"
      id={`produkt-${product.slug}`}
    >
      <div className="relative aspect-[4/5] bg-rose-bg overflow-hidden">
        <Image
          src={product.image}
          alt={product.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {unavailable && (
          <div className="absolute top-4 left-4 rounded-full bg-cream/95 backdrop-blur-sm border border-rose-soft/50 px-3 py-1.5 text-xs font-display font-semibold text-cocoa shadow-sm">
            Bald wieder da
          </div>
        )}
      </div>

      <div className="p-5 md:p-6 flex flex-col flex-1">
        <h3 className="font-display text-2xl text-cocoa leading-tight">{product.name}</h3>
        {product.description && (
          <p className="text-cocoa-light text-sm mt-1.5 leading-relaxed">{product.description}</p>
        )}

        <div className="mt-4 flex items-baseline gap-2">
          <span className="font-display text-2xl font-semibold text-cocoa">{formatPrice(product.price)}</span>
        </div>

        <div className="mt-4 rounded-2xl bg-rose-soft/15 border border-rose-soft/30 px-4 py-3">
          <p className="font-display font-semibold text-cocoa text-sm tracking-wide">DERZEIT NICHT VERFÜGBAR</p>
          <p className="text-cocoa-light text-sm mt-0.5">Restock kommt bald! ☁️</p>
        </div>

        <div className="mt-5 pt-1">
          <button
            type="button"
            onClick={() => onNotify(product)}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-rose-soft-deep px-5 py-3.5 font-display font-semibold text-cocoa shadow-cozy hover:scale-[1.01] active:scale-[0.99] transition-transform"
          >
            <Bell size={18} />
            BENACHRICHTIGE MICH BEIM RESTOCK
          </button>
        </div>
      </div>
    </motion.article>
  );
}
