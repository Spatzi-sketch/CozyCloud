"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CozyCloudLogo } from "@/components/illustrations/CozyIllustrations";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (signInError) {
        setError("Anmeldung fehlgeschlagen. Bitte prüfe E-Mail und Passwort.");
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError("Anmeldung fehlgeschlagen. Bitte prüfe deine Supabase-Konfiguration.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-[2rem] bg-cream border border-rose-soft/40 shadow-cozy p-8">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4"><CozyCloudLogo /></div>
        <p className="font-display text-sm tracking-[0.2em] text-rose-soft-deep mb-2">ADMIN-BEREICH</p>
        <h1 className="font-display text-3xl text-cocoa">Anmeldung</h1>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="admin-email" className="block font-display font-medium text-cocoa mb-2">E-Mail</label>
          <input
            id="admin-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-rose-soft/60 bg-white-soft px-4 py-3.5 text-cocoa focus:outline-none focus:ring-2 focus:ring-rose-soft-deep/50"
          />
        </div>
        <div>
          <label htmlFor="admin-password" className="block font-display font-medium text-cocoa mb-2">Passwort</label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-rose-soft/60 bg-white-soft px-4 py-3.5 text-cocoa focus:outline-none focus:ring-2 focus:ring-rose-soft-deep/50"
          />
        </div>
        {error && (
          <div className="rounded-2xl bg-accent-red/10 border border-accent-red/20 px-4 py-3 text-sm text-cocoa" role="alert">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-rose-soft-deep px-6 py-4 font-display font-bold text-cocoa shadow-cozy hover:scale-[1.01] transition-transform disabled:opacity-60"
        >
          {loading ? "Anmeldung..." : "Anmelden"}
        </button>
      </form>

      <p className="text-xs text-cocoa-light/80 mt-6 text-center leading-relaxed">
        Nur für autorisierte Cozy Cloud Administratoren. Der Admin-User muss in Supabase Auth angelegt sein.
      </p>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-rose-bg px-4 py-16 flex items-center justify-center">
      <Suspense fallback={<div className="text-cocoa-light">Lädt...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
