/**
 * Small built-in blocklist of common disposable/throwaway email domains.
 * This is a pragmatic first line of defense; it is not exhaustive.
 * The server also performs format, MX, honeypot, rate-limit, and double opt-in checks.
 */
const DISPOSABLE_DOMAINS = new Set([
  "10minutemail.com",
  "10minutemail.net",
  "20minutemail.com",
  "33mail.com",
  "bugmenot.com",
  "dayrep.com",
  "discard.email",
  "discardmail.com",
  "dispostable.com",
  "dropmail.me",
  "emailondeck.com",
  "fakeinbox.com",
  "getairmail.com",
  "getnada.com",
  "guerrillamail.com",
  "guerrillamail.de",
  "guerrillamail.net",
  "guerrillamail.org",
  "inboxbear.com",
  "mailcatch.com",
  "maildrop.cc",
  "mailinator.com",
  "mailnesia.com",
  "mailnull.com",
  "mailsac.com",
  "mohmal.com",
  "mytemp.email",
  "nada.email",
  "sharklasers.com",
  "spam4.me",
  "temp-mail.org",
  "temp-mail.io",
  "tempmail.com",
  "tempmail.net",
  "tempail.com",
  "trashmail.com",
  "trashmail.de",
  "trashmail.net",
  "yopmail.com",
  "yopmail.fr",
  "yopmail.net",
]);

export function isDisposableDomain(domain: string): boolean {
  const d = domain.toLowerCase().trim();
  if (DISPOSABLE_DOMAINS.has(d)) return true;
  // Block obvious subdomains of known disposable providers
  for (const blocked of DISPOSABLE_DOMAINS) {
    if (d.endsWith("." + blocked)) return true;
  }
  return false;
}
