import { NextResponse } from "next/server";
import { z } from "zod";
import { validateEmailAddress } from "@/lib/email-validation";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { createOrRefreshWaitlistSignup } from "@/lib/waitlist";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().min(1).max(254),
  productSlug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/),
  consent: z.literal(true),
  website: z.string().max(200).optional().default(""), // honeypot
});

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Bitte überprüfe deine Eingaben." },
        { status: 400 },
      );
    }

    const { email, productSlug, consent, website } = parsed.data;

    // Honeypot: bots often fill hidden fields
    if (website && website.trim().length > 0) {
      // Pretend success to avoid tipping off bots
      return NextResponse.json({ ok: true, message: "Fast geschafft! Bitte bestätige deine E-Mail-Adresse." });
    }

    const ip = getClientIp(request);
    const ipLimit = checkRateLimit(`waitlist:ip:${ip}`, { limit: 8, windowMs: 10 * 60 * 1000 });
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { ok: false, error: "Zu viele Anfragen. Bitte versuche es in ein paar Minuten erneut." },
        { status: 429 },
      );
    }

    const emailResult = await validateEmailAddress(email);
    if (!emailResult.ok) {
      return NextResponse.json({ ok: false, error: emailResult.error }, { status: 400 });
    }

    const emailLimit = checkRateLimit(`waitlist:email:${emailResult.email}`, {
      limit: 5,
      windowMs: 60 * 60 * 1000,
    });
    if (!emailLimit.allowed) {
      return NextResponse.json(
        { ok: false, error: "Für diese E-Mail-Adresse wurden zu viele Anfragen gestellt. Bitte versuche es später erneut." },
        { status: 429 },
      );
    }

    const consentText =
      "Ich möchte eine einmalige E-Mail erhalten, sobald dieses Produkt wieder verfügbar ist. Ich stimme der dafür notwendigen Verarbeitung meiner E-Mail-Adresse gemäß Datenschutzhinweisen zu.";

    if (!consent) {
      return NextResponse.json(
        { ok: false, error: "Bitte stimme der Benachrichtigung zu, damit wir dich informieren dürfen." },
        { status: 400 },
      );
    }

    const result = await createOrRefreshWaitlistSignup({
      email: emailResult.email,
      productSlug,
      consentText,
      sourceIp: ip,
      userAgent: request.headers.get("user-agent") || "",
    });

    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      message: result.message,
      alreadyConfirmed: result.alreadyConfirmed,
    });
  } catch (err) {
    console.error("waitlist signup error", err);
    return NextResponse.json(
      { ok: false, error: "Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es später erneut." },
      { status: 500 },
    );
  }
}
