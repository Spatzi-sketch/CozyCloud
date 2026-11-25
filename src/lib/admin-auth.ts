import { createClient } from "@/lib/supabase/server";

export type AdminAuthResult =
  | { ok: true; email: string }
  | { ok: false; status: number; error: string };

export async function requireAdmin(): Promise<AdminAuthResult> {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!adminEmail) {
    return { ok: false, status: 500, error: "ADMIN_EMAIL ist nicht konfiguriert." };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user?.email) {
      return { ok: false, status: 401, error: "Nicht angemeldet." };
    }

    if (user.email.toLowerCase() !== adminEmail) {
      return { ok: false, status: 403, error: "Kein Zugriff." };
    }

    return { ok: true, email: user.email.toLowerCase() };
  } catch (err) {
    console.error("requireAdmin error", err);
    return { ok: false, status: 500, error: "Authentifizierung fehlgeschlagen." };
  }
}
