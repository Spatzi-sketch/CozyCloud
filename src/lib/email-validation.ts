import dns from "dns/promises";
import { isDisposableDomain } from "./disposable-domains";
import { isValidEmailFormat, normalizeEmail } from "./utils";

export type EmailValidationResult =
  | { ok: true; email: string; domain: string }
  | { ok: false; error: string };

export async function validateEmailAddress(raw: string): Promise<EmailValidationResult> {
  const email = normalizeEmail(raw);

  if (!email) {
    return { ok: false, error: "Bitte gib eine E-Mail-Adresse ein." };
  }

  if (email.length > 254) {
    return { ok: false, error: "Die E-Mail-Adresse ist zu lang." };
  }

  if (!isValidEmailFormat(email)) {
    return { ok: false, error: "Bitte gib eine gültige E-Mail-Adresse ein." };
  }

  const [, domain] = email.split("@");
  if (!domain) {
    return { ok: false, error: "Bitte gib eine gültige E-Mail-Adresse ein." };
  }

  if (isDisposableDomain(domain)) {
    return {
      ok: false,
      error: "Bitte verwende eine dauerhafte E-Mail-Adresse (keine Wegwerf-Adresse).",
    };
  }

  // Domain reachability check: accept if MX records exist, or as fallback if A/AAAA exists.
  try {
    const mx = await dns.resolveMx(domain);
    if (!mx || mx.length === 0) {
      // fall through to A/AAAA check
      await dns.resolve(domain);
    }
  } catch {
    try {
      await dns.resolve4(domain);
    } catch {
      try {
        await dns.resolve6(domain);
      } catch {
        return {
          ok: false,
          error:
            "Die E-Mail-Domain scheint nicht erreichbar zu sein. Bitte prüfe deine E-Mail-Adresse.",
        };
      }
    }
  }

  return { ok: true, email, domain };
}
