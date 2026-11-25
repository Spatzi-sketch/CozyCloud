import { createAdminClient } from "@/lib/supabase/admin";
import { generateToken, hashToken } from "@/lib/tokens";
import { sendAdminWaitlistNotification, sendConfirmationEmail, sendRestockEmail } from "@/lib/email";
import { getProductBySlug } from "@/data/products";
import { WAITLIST_STATUS, type WaitlistStatus } from "@/lib/constants";

const CONFIRM_TOKEN_TTL_HOURS = 48;

export type WaitlistEntry = {
  id: string;
  email: string;
  email_normalized: string;
  product_slug: string;
  product_name: string;
  status: WaitlistStatus;
  consent_given_at: string;
  confirmed_at: string | null;
  notified_at: string | null;
  unsubscribed_at: string | null;
  created_at: string;
};

function nowIso() {
  return new Date().toISOString();
}

function expiresInHours(hours: number) {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}

export async function createOrRefreshWaitlistSignup(params: {
  email: string;
  productSlug: string;
  consentText: string;
  sourceIp: string;
  userAgent: string;
}) {
  const product = getProductBySlug(params.productSlug);
  if (!product) {
    return { ok: false as const, error: "Dieses Produkt wurde nicht gefunden." };
  }

  const supabase = createAdminClient();
  const emailNormalized = params.email.toLowerCase();

  const { data: existing, error: existingError } = await supabase
    .from("waitlist_entries")
    .select("id, status")
    .eq("product_slug", params.productSlug)
    .eq("email_normalized", emailNormalized)
    .maybeSingle();

  if (existingError) {
    console.error("waitlist lookup error", existingError);
    return { ok: false as const, error: "Die Anmeldung konnte gerade nicht gespeichert werden. Bitte versuche es später erneut." };
  }

  if (existing && (existing.status === WAITLIST_STATUS.CONFIRMED || existing.status === WAITLIST_STATUS.NOTIFIED)) {
    return {
      ok: true as const,
      alreadyConfirmed: true,
      message: "Diese E-Mail-Adresse ist für dieses Produkt bereits bestätigt. Wir melden uns beim Restock!",
    };
  }

  const confirmToken = generateToken(32);
  const confirmTokenHash = hashToken(confirmToken);
  const confirmTokenExpiresAt = expiresInHours(CONFIRM_TOKEN_TTL_HOURS);
  const timestamp = nowIso();

  if (existing) {
    // Pending or unsubscribed - refresh as pending with new token/consent
    const { error: updateError } = await supabase
      .from("waitlist_entries")
      .update({
        email: params.email,
        status: WAITLIST_STATUS.PENDING,
        consent_given_at: timestamp,
        consent_text: params.consentText,
        confirm_token_hash: confirmTokenHash,
        confirm_token_expires_at: confirmTokenExpiresAt,
        confirmed_at: null,
        notified_at: null,
        unsubscribed_at: null,
        unsubscribe_token_hash: null,
        source_ip: params.sourceIp,
        user_agent: params.userAgent.slice(0, 500),
      })
      .eq("id", existing.id);

    if (updateError) {
      console.error("waitlist update error", updateError);
      return { ok: false as const, error: "Die Anmeldung konnte gerade nicht gespeichert werden. Bitte versuche es später erneut." };
    }
  } else {
    const { error: insertError } = await supabase.from("waitlist_entries").insert({
      email: params.email,
      email_normalized: emailNormalized,
      product_slug: params.productSlug,
      product_name: product.name,
      status: WAITLIST_STATUS.PENDING,
      consent_given_at: timestamp,
      consent_text: params.consentText,
      confirm_token_hash: confirmTokenHash,
      confirm_token_expires_at: confirmTokenExpiresAt,
      source_ip: params.sourceIp,
      user_agent: params.userAgent.slice(0, 500),
    });

    if (insertError) {
      console.error("waitlist insert error", insertError);
      return { ok: false as const, error: "Die Anmeldung konnte gerade nicht gespeichert werden. Bitte versuche es später erneut." };
    }
  }

  try {
    await sendConfirmationEmail({
      to: params.email,
      productName: product.name,
      confirmToken,
    });
  } catch (err) {
    console.error("confirmation email error", err);
    return {
      ok: false as const,
      error:
        "Deine Anmeldung wurde gespeichert, aber die Bestätigungs-E-Mail konnte nicht versendet werden. Bitte versuche es später erneut oder kontaktiere uns.",
    };
  }

  return {
    ok: true as const,
    alreadyConfirmed: false,
    message: "Fast geschafft! Bitte bestätige deine E-Mail-Adresse über den Link, den wir dir gerade gesendet haben.",
  };
}

export async function confirmWaitlistToken(token: string) {
  if (!token || token.length < 16) {
    return { ok: false as const, error: "invalid" };
  }

  const supabase = createAdminClient();
  const tokenHash = hashToken(token);
  const timestamp = nowIso();

  const { data: entry, error } = await supabase
    .from("waitlist_entries")
    .select("id, email, email_normalized, product_slug, product_name, status, confirm_token_expires_at")
    .eq("confirm_token_hash", tokenHash)
    .maybeSingle();

  if (error || !entry) {
    return { ok: false as const, error: "invalid" };
  }

  if (entry.status === WAITLIST_STATUS.CONFIRMED || entry.status === WAITLIST_STATUS.NOTIFIED) {
    return { ok: true as const, already: true, productName: entry.product_name };
  }

  if (entry.status === WAITLIST_STATUS.UNSUBSCRIBED) {
    return { ok: false as const, error: "unsubscribed" };
  }

  if (!entry.confirm_token_expires_at || new Date(entry.confirm_token_expires_at).getTime() < Date.now()) {
    return { ok: false as const, error: "expired" };
  }

  const unsubscribeToken = generateToken(32);
  const unsubscribeTokenHash = hashToken(unsubscribeToken);

  const { error: updateError } = await supabase
    .from("waitlist_entries")
    .update({
      status: WAITLIST_STATUS.CONFIRMED,
      confirmed_at: timestamp,
      confirm_token_hash: null,
      confirm_token_expires_at: null,
      unsubscribe_token_hash: unsubscribeTokenHash,
    })
    .eq("id", entry.id)
    .eq("status", WAITLIST_STATUS.PENDING);

  if (updateError) {
    console.error("confirm update error", updateError);
    return { ok: false as const, error: "server" };
  }

  // Optional admin notification - fire and forget, don't fail confirmation
  sendAdminWaitlistNotification({
    email: entry.email,
    productName: entry.product_name,
    confirmedAt: timestamp,
  }).catch((err) => console.error("admin notification error", err));

  return { ok: true as const, already: false, productName: entry.product_name };
}

export async function unsubscribeWaitlistToken(token: string) {
  if (!token || token.length < 16) {
    return { ok: false as const, error: "invalid" };
  }

  const supabase = createAdminClient();
  const tokenHash = hashToken(token);
  const timestamp = nowIso();

  const { data: entry, error } = await supabase
    .from("waitlist_entries")
    .select("id, status, product_name")
    .eq("unsubscribe_token_hash", tokenHash)
    .maybeSingle();

  if (error || !entry) {
    return { ok: false as const, error: "invalid" };
  }

  if (entry.status === WAITLIST_STATUS.UNSUBSCRIBED) {
    return { ok: true as const, already: true, productName: entry.product_name };
  }

  const { error: updateError } = await supabase
    .from("waitlist_entries")
    .update({
      status: WAITLIST_STATUS.UNSUBSCRIBED,
      unsubscribed_at: timestamp,
      // Keep unsubscribe token hash so the same link shows "already unsubscribed" nicely? No, better null it.
      unsubscribe_token_hash: null,
    })
    .eq("id", entry.id);

  if (updateError) {
    console.error("unsubscribe error", updateError);
    return { ok: false as const, error: "server" };
  }

  return { ok: true as const, already: false, productName: entry.product_name };
}

export async function getWaitlistStats() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("waitlist_entries")
    .select("product_slug, status");

  if (error) throw error;

  const total = data.length;
  const confirmed = data.filter((r) => r.status === WAITLIST_STATUS.CONFIRMED).length;
  const pending = data.filter((r) => r.status === WAITLIST_STATUS.PENDING).length;
  const notified = data.filter((r) => r.status === WAITLIST_STATUS.NOTIFIED).length;

  const byProduct: Record<string, { total: number; confirmed: number; pending: number; notified: number; unsubscribed: number }> = {};
  for (const row of data) {
    const slug = row.product_slug as string;
    if (!byProduct[slug]) byProduct[slug] = { total: 0, confirmed: 0, pending: 0, notified: 0, unsubscribed: 0 };
    byProduct[slug].total += 1;
    const s = row.status as WaitlistStatus;
    if (s === "confirmed") byProduct[slug].confirmed += 1;
    else if (s === "pending") byProduct[slug].pending += 1;
    else if (s === "notified") byProduct[slug].notified += 1;
    else if (s === "unsubscribed") byProduct[slug].unsubscribed += 1;
  }

  return { total, confirmed, pending, notified, byProduct };
}

export async function getWaitlistEntries(params?: {
  productSlug?: string;
  status?: string;
  q?: string;
}) {
  const supabase = createAdminClient();
  let query = supabase
    .from("waitlist_entries")
    .select("id, email, email_normalized, product_slug, product_name, status, consent_given_at, confirmed_at, notified_at, unsubscribed_at, created_at")
    .order("created_at", { ascending: false })
    .limit(500);

  if (params?.productSlug) query = query.eq("product_slug", params.productSlug);
  if (params?.status) query = query.eq("status", params.status);
  if (params?.q) query = query.ilike("email_normalized", `%${params.q.toLowerCase().replace(/%/g, "")}%`);

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as WaitlistEntry[];
}

export async function sendRestockNotifications(productSlug: string, adminEmail: string) {
  const product = getProductBySlug(productSlug);
  if (!product) return { ok: false as const, error: "Produkt nicht gefunden." };

  const supabase = createAdminClient();

  // Get confirmed entries only, not notified, not unsubscribed
  const { data: recipients, error } = await supabase
    .from("waitlist_entries")
    .select("id, email, unsubscribe_token_hash")
    .eq("product_slug", productSlug)
    .eq("status", WAITLIST_STATUS.CONFIRMED);

  if (error) {
    console.error("restock recipients error", error);
    return { ok: false as const, error: "Empfänger konnten nicht geladen werden." };
  }

  if (!recipients || recipients.length === 0) {
    return { ok: false as const, error: "Keine bestätigten, noch nicht benachrichtigten Kontakte für dieses Produkt." };
  }

  const { data: logRow } = await supabase
    .from("restock_send_logs")
    .insert({
      product_slug: productSlug,
      product_name: product.name,
      admin_email: adminEmail,
      recipient_count: recipients.length,
      status: "started",
    })
    .select("id")
    .single();

  let sentCount = 0;
  let failedCount = 0;
  const errors: string[] = [];

  for (const recipient of recipients) {
    // Ensure unsubscribe token exists
    let unsubToken: string | null = null;
    if (recipient.unsubscribe_token_hash) {
      // We don't have the plain token; generate a new one and update hash
    }
    unsubToken = generateToken(32);
    const unsubHash = hashToken(unsubToken);

    try {
      await sendRestockEmail({
        to: recipient.email,
        productName: product.name,
        productSlug: product.slug,
        unsubscribeToken: unsubToken,
      });

      const { error: updateError } = await supabase
        .from("waitlist_entries")
        .update({
          status: WAITLIST_STATUS.NOTIFIED,
          notified_at: nowIso(),
          unsubscribe_token_hash: unsubHash,
        })
        .eq("id", recipient.id)
        .eq("status", WAITLIST_STATUS.CONFIRMED); // guard against race

      if (updateError) {
        console.error("restock status update error", updateError);
        failedCount += 1;
        errors.push(recipient.email);
      } else {
        sentCount += 1;
      }
    } catch (err) {
      console.error("restock send error", recipient.email, err);
      failedCount += 1;
      errors.push(recipient.email);
    }
  }

  if (logRow?.id) {
    await supabase
      .from("restock_send_logs")
      .update({
        sent_count: sentCount,
        failed_count: failedCount,
        status: failedCount > 0 && sentCount === 0 ? "failed" : "completed",
        error_message: errors.length > 0 ? `Fehlgeschlagen: ${errors.slice(0, 10).join(", ")}` : null,
        completed_at: nowIso(),
      })
      .eq("id", logRow.id);
  }

  return {
    ok: true as const,
    sentCount,
    failedCount,
    recipientCount: recipients.length,
  };
}
