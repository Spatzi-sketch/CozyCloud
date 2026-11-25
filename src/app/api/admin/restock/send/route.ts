import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { sendRestockNotifications } from "@/lib/waitlist";

export const runtime = "nodejs";

const schema = z.object({
  productSlug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/),
  confirm: z.literal(true),
});

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }

  try {
    const result = await sendRestockNotifications(parsed.data.productSlug, auth.email);
    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
    }
    return NextResponse.json(result);
  } catch (err) {
    console.error("restock send route error", err);
    return NextResponse.json({ ok: false, error: "Versand fehlgeschlagen." }, { status: 500 });
  }
}
