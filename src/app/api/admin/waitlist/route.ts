import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getWaitlistEntries, getWaitlistStats } from "@/lib/waitlist";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(request.url);
  const productSlug = searchParams.get("product") || undefined;
  const status = searchParams.get("status") || undefined;
  const q = searchParams.get("q") || undefined;

  try {
    const [stats, entries] = await Promise.all([
      getWaitlistStats(),
      getWaitlistEntries({ productSlug, status, q }),
    ]);
    return NextResponse.json({ ok: true, stats, entries });
  } catch (err) {
    console.error("admin waitlist error", err);
    return NextResponse.json({ ok: false, error: "Daten konnten nicht geladen werden." }, { status: 500 });
  }
}
