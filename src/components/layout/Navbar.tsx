"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { CozyCloudLogo } from "@/components/illustrations/CozyIllustrations";

const navLinks = [
  { href: "/#home", label: "Home" },
  { href: "/#produkte", label: "Alle Hosen" },
  { href: "/#ueber-uns", label: "Über uns" },
  { href: "/#kontakt", label: "Kontakt" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 md:px-6 pt-3 md:pt-4">
      <nav className="mx-auto max-w-6xl rounded-full bg-cream/90 backdrop-blur-md border border-rose-soft/40 shadow-card px-4 md:px-6 py-3 flex items-center justify-between">
        <Link href="/#home" className="shrink-0" aria-label="Cozy Cloud Startseite">
          <CozyCloudLogo />
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-full font-display font-medium text-cocoa/80 hover:text-cocoa hover:bg-rose-soft/30 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-full text-cocoa hover:bg-rose-soft/30 transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden mx-auto max-w-6xl mt-2 rounded-3xl bg-cream/95 backdrop-blur-md border border-rose-soft/40 shadow-cozy p-4">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-2xl font-display font-medium text-cocoa/80 hover:text-cocoa hover:bg-rose-soft/30 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
