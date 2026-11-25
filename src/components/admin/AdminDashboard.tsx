"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, LogOut, Mail, RefreshCw, Search, Send, X } from "lucide-react";
import { products, formatPrice } from "@/data/products";
import { createClient } from "@/lib/supabase/client";

type Entry = {
  id: string;
  email: string;
  product_slug: string;
  product_name: string;
  status: "pending" | "confirmed" | "notified" | "unsubscribed";
  created_at: string;
  confirmed_at: string | null;
  notified_at: string | null;
  unsubscribed_at: string | null;
};

type Stats = {
  total: number;
  confirmed: number;
  pending: number;
  notified: number;
  byProduct: Record<string, { total: number; confirmed: number; pending: number; notified: number; unsubscribed: number }>;
};

const statusLabels: Record<Entry["status"], string> = {
  pending: "Ausstehend",
  confirmed: "Bestätigt",
  notified: "Benachrichtigt",
  unsubscribed: "Abgemeldet",
};

const statusClasses: Record<Entry["status"], string> = {
  pending: "bg-lavender/40 text-cocoa",
  confirmed: "bg-rose-soft/40 text-cocoa",
  notified: "bg-[#DDF3E4] text-cocoa",
  unsubscribed: "bg-cocoa/10 text-cocoa-light",
};

function fmtDate(iso: string | null) {
  if (!iso) return "–";
  try {
    return new Intl.DateTimeFormat("de-AT", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [restockProduct, setRestockProduct] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (productFilter) params.set("product", productFilter);
      if (statusFilter) params.set("status", statusFilter);
      if (q.trim()) params.set("q", q.trim());
      const res = await fetch(`/api/admin/waitlist?${params.toString()}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Daten konnten nicht geladen werden.");
      }
      setStats(data.stats);
      setEntries(data.entries);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Daten konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, [productFilter, statusFilter, q]);

  useEffect(() => {
    const t = setTimeout(() => { load(); }, 250);
    return () => clearTimeout(t);
  }, [load]);

  const selectedProduct = useMemo(
    () => products.find((p) => p.slug === restockProduct) || null,
    [restockProduct],
  );

  const selectedProductStats = restockProduct && stats?.byProduct[restockProduct]
    ? stats.byProduct[restockProduct]
    : null;

  async function onSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  async function onSendRestock() {
    if (!restockProduct) return;
    setSending(true);
    setSendResult(null);
    try {
      const res = await fetch("/api/admin/restock/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug: restockProduct, confirm: true }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setSendResult(`Fehler: ${data.error || "Versand fehlgeschlagen."}`);
      } else {
        setSendResult(`Erfolg: ${data.sentCount} von ${data.recipientCount} E-Mails versendet${data.failedCount ? `, ${data.failedCount} fehlgeschlagen` : ""}.`);
        await load();
      }
    } catch {
      setSendResult("Fehler: Versand fehlgeschlagen.");
    } finally {
      setSending(false);
    }
  }

  const exportUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.set("status", statusFilter || "confirmed");
    if (productFilter) params.set("product", productFilter);
    return `/api/admin/export?${params.toString()}`;
  }, [statusFilter, productFilter]);

  return (
    <main className="min-h-screen bg-rose-bg px-4 py-8 md:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <p className="font-display text-sm tracking-[0.2em] text-rose-soft-deep mb-2">COZY CLOUD</p>
            <h1 className="font-display text-4xl md:text-5xl text-cocoa">Admin Dashboard</h1>
            <p className="text-cocoa-light mt-2">Warteliste, Bestätigungen und Restock-Benachrichtigungen.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={load} className="inline-flex items-center gap-2 rounded-full bg-cream border border-rose-soft/50 px-4 py-2.5 font-display text-sm text-cocoa hover:bg-rose-soft/20">
              <RefreshCw size={16} /> Aktualisieren
            </button>
            <button onClick={onSignOut} className="inline-flex items-center gap-2 rounded-full bg-cream border border-rose-soft/50 px-4 py-2.5 font-display text-sm text-cocoa hover:bg-rose-soft/20">
              <LogOut size={16} /> Abmelden
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl bg-accent-red/10 border border-accent-red/20 px-4 py-3 text-cocoa">{error}</div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
          {[
            { label: "Gesamt", value: stats?.total ?? "–" },
            { label: "Bestätigt", value: stats?.confirmed ?? "–" },
            { label: "Ausstehend", value: stats?.pending ?? "–" },
            { label: "Benachrichtigt", value: stats?.notified ?? "–" },
          ].map((card) => (
            <div key={card.label} className="rounded-[1.5rem] bg-cream border border-rose-soft/35 p-5 shadow-card">
              <p className="text-sm font-display text-cocoa-light tracking-wide">{card.label}</p>
              <p className="font-display text-4xl text-cocoa mt-1">{loading && !stats ? "…" : card.value}</p>
            </div>
          ))}
        </div>

        <section className="mb-8">
          <h2 className="font-display text-2xl text-cocoa mb-4">Produkte</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {products.map((p) => {
              const s = stats?.byProduct[p.slug] || { total: 0, confirmed: 0, pending: 0, notified: 0, unsubscribed: 0 };
              const active = productFilter === p.slug;
              return (
                <div key={p.slug} className={`rounded-[1.5rem] bg-cream border p-5 shadow-card ${active ? "border-rose-soft-deep" : "border-rose-soft/35"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-xl text-cocoa">{p.name}</h3>
                      <p className="text-sm text-cocoa-light">{formatPrice(p.price)} · {p.status === "unavailable" ? "Nicht verfügbar" : "Verfügbar"}</p>
                    </div>
                    <button
                      onClick={() => setProductFilter(active ? "" : p.slug)}
                      className="text-xs rounded-full bg-rose-soft/25 px-3 py-1.5 font-display text-cocoa hover:bg-rose-soft/45"
                    >
                      {active ? "Filter aus" : "Filtern"}
                    </button>
                  </div>
                  <div className="mt-4 space-y-1.5 text-sm text-cocoa-light">
                    <p><span className="font-semibold text-cocoa">{s.confirmed}</span> bestätigte Interessenten</p>
                    <p><span className="font-semibold text-cocoa">{s.pending}</span> ausstehende Bestätigungen</p>
                    <p><span className="font-semibold text-cocoa">{s.notified}</span> bereits benachrichtigt</p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => { setRestockProduct(p.slug); setSendResult(null); }}
                      className="inline-flex items-center gap-1.5 rounded-full bg-rose-soft-deep px-4 py-2 text-sm font-display font-semibold text-cocoa hover:scale-[1.01] transition-transform"
                    >
                      <Send size={14} /> SEND RESTOCK EMAIL
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-[2rem] bg-cream border border-rose-soft/35 shadow-card p-5 md:p-6">
          <div className="flex flex-col lg:flex-row lg:items-end gap-4 mb-5">
            <div className="flex-1">
              <h2 className="font-display text-2xl text-cocoa mb-3">Wartelisten-Einträge</h2>
              <div className="grid sm:grid-cols-3 gap-3">
                <label className="block">
                  <span className="text-xs font-display text-cocoa-light mb-1 block">Suche E-Mail</span>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cocoa-light/60" />
                    <input
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder="E-Mail suchen..."
                      className="w-full rounded-xl border border-rose-soft/50 bg-white-soft pl-9 pr-3 py-2.5 text-sm text-cocoa"
                    />
                  </div>
                </label>
                <label className="block">
                  <span className="text-xs font-display text-cocoa-light mb-1 block">Produkt</span>
                  <select value={productFilter} onChange={(e) => setProductFilter(e.target.value)} className="w-full rounded-xl border border-rose-soft/50 bg-white-soft px-3 py-2.5 text-sm text-cocoa">
                    <option value="">Alle Produkte</option>
                    {products.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-display text-cocoa-light mb-1 block">Status</span>
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full rounded-xl border border-rose-soft/50 bg-white-soft px-3 py-2.5 text-sm text-cocoa">
                    <option value="">Alle Status</option>
                    <option value="pending">Ausstehend</option>
                    <option value="confirmed">Bestätigt</option>
                    <option value="notified">Benachrichtigt</option>
                    <option value="unsubscribed">Abgemeldet</option>
                  </select>
                </label>
              </div>
            </div>
            <a href={exportUrl} className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-soft/30 border border-rose-soft/50 px-5 py-3 font-display text-sm text-cocoa hover:bg-rose-soft/50 self-start">
              <Download size={16} /> CSV Export
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[760px]">
              <thead>
                <tr className="text-left text-cocoa-light border-b border-rose-soft/30">
                  <th className="py-3 pr-3 font-display font-medium">E-Mail</th>
                  <th className="py-3 pr-3 font-display font-medium">Produkt</th>
                  <th className="py-3 pr-3 font-display font-medium">Status</th>
                  <th className="py-3 pr-3 font-display font-medium">Anmeldung</th>
                  <th className="py-3 pr-3 font-display font-medium">Bestätigt</th>
                  <th className="py-3 font-display font-medium">Benachrichtigt</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="py-10 text-center text-cocoa-light">Lädt Einträge...</td></tr>
                ) : entries.length === 0 ? (
                  <tr><td colSpan={6} className="py-10 text-center text-cocoa-light">Keine Einträge gefunden.</td></tr>
                ) : entries.map((entry) => (
                  <tr key={entry.id} className="border-b border-rose-soft/20 last:border-0">
                    <td className="py-3 pr-3 text-cocoa">
                      <div className="flex items-center gap-2"><Mail size={14} className="text-cocoa-light/60" />{entry.email}</div>
                    </td>
                    <td className="py-3 pr-3 text-cocoa-light">{entry.product_name}</td>
                    <td className="py-3 pr-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-display ${statusClasses[entry.status]}`}>
                        {statusLabels[entry.status]}
                      </span>
                    </td>
                    <td className="py-3 pr-3 text-cocoa-light whitespace-nowrap">{fmtDate(entry.created_at)}</td>
                    <td className="py-3 pr-3 text-cocoa-light whitespace-nowrap">{fmtDate(entry.confirmed_at)}</td>
                    <td className="py-3 text-cocoa-light whitespace-nowrap">{fmtDate(entry.notified_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center px-4 py-8">
          <div className="absolute inset-0 bg-cocoa/30 backdrop-blur-sm" onClick={() => !sending && setRestockProduct(null)} />
          <div className="relative w-full max-w-2xl rounded-[2rem] bg-cream border border-rose-soft/40 shadow-cozy p-6 md:p-8">
            <button onClick={() => !sending && setRestockProduct(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-rose-soft/20 hover:bg-rose-soft/40 text-cocoa flex items-center justify-center" aria-label="Schließen">
              <X size={20} />
            </button>
            <p className="font-display text-sm tracking-[0.18em] text-rose-soft-deep mb-2">RESTOCK-E-MAIL VORSCHAU</p>
            <h2 className="font-display text-3xl text-cocoa mb-4">{selectedProduct.name}</h2>

            <div className="rounded-2xl bg-rose-bg/60 border border-rose-soft/30 p-5 mb-5">
              <p className="text-sm text-cocoa-light mb-1"><strong>Betreff:</strong> Your favorite pants are back! ☁️</p>
              <div className="mt-4 text-cocoa leading-relaxed space-y-3">
                <p className="font-display text-lg text-rose-soft-deep">GOOD NEWS!</p>
                <p className="font-display text-2xl">Die Cozy Cloud Hosen sind wieder verfügbar!</p>
                <p>Du hast dich für dieses Modell eingetragen und wir wollten dich natürlich als Erstes informieren.</p>
                <p>Jetzt ansehen und deinen Favoriten entdecken.</p>
                <p className="inline-flex rounded-full bg-rose-soft-deep px-5 py-2 font-display font-semibold text-cocoa">JETZT ANSEHEN</p>
              </div>
            </div>

            <div className="rounded-2xl bg-white-soft border border-rose-soft/30 p-4 text-sm text-cocoa-light mb-5 space-y-1">
              <p><strong className="text-cocoa">Empfänger:</strong> {selectedProductStats?.confirmed ?? 0} bestätigte, noch nicht benachrichtigte Kontakte</p>
              <p><strong className="text-cocoa">Ausstehend:</strong> {selectedProductStats?.pending ?? 0} (werden nicht angeschrieben)</p>
              <p><strong className="text-cocoa">Bereits benachrichtigt:</strong> {selectedProductStats?.notified ?? 0}</p>
              <p className="pt-2 text-xs">Nur bestätigte, nicht abgemeldete und noch nicht benachrichtigte Kontakte erhalten diese E-Mail. Jede E-Mail enthält einen Abmeldelink.</p>
            </div>

            {sendResult && (
              <div className={`rounded-2xl px-4 py-3 text-sm mb-4 ${sendResult.startsWith("Erfolg") ? "bg-[#DDF3E4] text-cocoa" : "bg-accent-red/10 text-cocoa"}`}>
                {sendResult}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button onClick={() => setRestockProduct(null)} disabled={sending} className="rounded-full bg-cream border border-rose-soft/50 px-5 py-3 font-display text-cocoa disabled:opacity-60">
                Abbrechen
              </button>
              <button
                onClick={onSendRestock}
                disabled={sending || (selectedProductStats?.confirmed ?? 0) === 0}
                className="rounded-full bg-rose-soft-deep px-6 py-3 font-display font-semibold text-cocoa shadow-cozy disabled:opacity-60"
              >
                {sending ? "Wird gesendet..." : "Wirklich senden"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
