"use client";

import { useState } from "react";
import { products, type Product } from "@/data/products";
import { ProductCard } from "./ProductCard";
import { WaitlistModal } from "./WaitlistModal";
import { CloudFace, Star, Heart } from "@/components/illustrations/CozyIllustrations";

export function ProductsSection() {
  const [selected, setSelected] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);

  const onNotify = (product: Product) => {
    setSelected(product);
    setOpen(true);
  };

  return (
    <section id="produkte" className="relative py-20 md:py-28 px-4 bg-rose-bg overflow-hidden">
      <div className="absolute top-12 left-4 md:left-12 opacity-50 animate-float-slow pointer-events-none">
        <CloudFace size={90} />
      </div>
      <div className="absolute top-24 right-8 md:right-16 opacity-60 animate-sparkle pointer-events-none">
        <Star size={28} color="#E8DDF7" />
      </div>
      <div className="absolute bottom-16 left-1/2 opacity-40 animate-float pointer-events-none">
        <Heart size={24} />
      </div>

      <div className="mx-auto max-w-6xl relative">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <p className="font-display text-sm tracking-[0.22em] text-rose-soft-deep mb-3">UNSERE COZY FAVORITEN</p>
          <h2 className="font-display text-4xl md:text-6xl text-cocoa leading-tight mb-4">
            Alle Hosen auf einen Blick
          </h2>
          <p className="text-cocoa-light text-lg leading-relaxed">
            Entdecke unsere gemütlichen Lieblingsmodelle. Alle Hosen sind aktuell noch nicht verfügbar – trage dich aber gerne für den Restock ein.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} onNotify={onNotify} />
          ))}
        </div>
      </div>

      <WaitlistModal product={selected} open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
