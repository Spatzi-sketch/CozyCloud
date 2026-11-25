"use client";

import { useEffect, useState } from "react";
import { Heart, Star, Sparkle } from "@/components/illustrations/CozyIllustrations";

type Item = { id: number; left: number; delay: number; duration: number; size: number; type: "heart" | "star" | "sparkle" };

export function FallingDecor() {
  const [items, setItems] = useState<Item[]>([]);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    if (mq.matches) return;
    const types: Item["type"][] = ["heart", "star", "sparkle", "heart", "star"];
    setItems(
      types.map((type, i) => ({
        id: i,
        left: 8 + i * 18 + Math.random() * 8,
        delay: i * 3.2 + Math.random() * 2,
        duration: 14 + Math.random() * 8,
        size: type === "sparkle" ? 14 : 18,
        type,
      })),
    );
  }, []);

  if (reduced || items.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden" aria-hidden="true">
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute -top-8 opacity-40"
          style={{
            left: `${item.left}%`,
            animation: `fall-gentle ${item.duration}s linear ${item.delay}s infinite`,
          }}
        >
          {item.type === "heart" && <Heart size={item.size} color="#F4AFC6" />}
          {item.type === "star" && <Star size={item.size} color="#E8DDF7" />}
          {item.type === "sparkle" && <Sparkle size={item.size} color="#F7C9D8" />}
        </div>
      ))}
    </div>
  );
}
