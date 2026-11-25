import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function csvEscape(value: unknown): string {
  const str = value === null || value === undefined ? "" : String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(request.url);
  const productSlug = searchParams.get("product") || undefined;
  const status = searchParams.get("status") || "confirmed";

  try {
    const supabase = createAdminClient();
    let query = supabase
      .from("waitlist_entries")
      .select("email, product_slug, product_name, status, created_at, confirmed_at, notified_at, unsubscribed_at, consent_given_at")
      .order("created_at", { ascending: false });

    if (productSlug) query = query.eq("product_slug", productSlug);
    if (status) query = query.eq("status", status);

    const { data, error } = await query;
    if (error) throw error;

    const header = [
      "email",
      "product_slug",
      "product_name",
      "status",
      "created_at",
      "consent_given_at",
      "confirmed_at",
      "notified_at",
      "unsubscribed_at",
    ];

    const rows = (data || []).map((row) =>
      header.map((key) => csvEscape((row as Record<string, unknown>)[key])).join(","),
    );
    const csv = "\uFEFF" + [header.join(","), ...rows].join("\n");

    const filename = `cozycloud-waitlist-${status}${productSlug ? `-${productSlug}` : ""}.csv`;
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("admin export error", err);
    return NextResponse.json({ ok: false, error: "Export fehlgeschlagen." }, { status: 500 });
  }
}
