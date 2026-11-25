import { Resend } from "resend";
import { getSiteUrl } from "./utils";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("Missing RESEND_API_KEY");
  }
  return new Resend(key);
}

function getFrom() {
  return process.env.EMAIL_FROM || "Cozy Cloud <onboarding@resend.dev>";
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function layout(content: string, preheader: string) {
  return `<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Cozy Cloud</title>
  </head>
  <body style="margin:0;padding:0;background:#FFF5F8;font-family:'Nunito',Arial,sans-serif;color:#55434A;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFF5F8;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFDF8;border-radius:28px;overflow:hidden;box-shadow:0 8px 30px rgba(247,201,216,0.25);">
            <tr>
              <td style="padding:32px 28px 8px;text-align:center;">
                <div style="font-size:28px;font-weight:800;color:#55434A;letter-spacing:0.5px;">☁️ Cozy Cloud</div>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 28px 32px;">
                ${content}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 28px 28px;text-align:center;font-size:12px;color:#7A666D;background:#FFF5F8;">
                <p style="margin:0 0 8px;">Cozy Cloud · Gemütliche Hosen für deine schönsten Wohlfühlmomente</p>
                <p style="margin:0;">Du erhältst diese E-Mail, weil du dich auf unserer Website dafür eingetragen hast.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function button(label: string, href: string) {
  const safeLabel = escapeHtml(label);
  const safeHref = escapeHtml(href);
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto;">
    <tr>
      <td style="background:#F4AFC6;border-radius:999px;">
        <a href="${safeHref}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:800;letter-spacing:0.5px;color:#55434A;text-decoration:none;">${safeLabel}</a>
      </td>
    </tr>
  </table>`;
}

export async function sendConfirmationEmail(params: {
  to: string;
  productName: string;
  confirmToken: string;
}) {
  const resend = getResend();
  const siteUrl = getSiteUrl();
  const confirmUrl = `${siteUrl}/api/waitlist/confirm?token=${encodeURIComponent(params.confirmToken)}`;
  const safeProduct = escapeHtml(params.productName);

  const content = `
    <h1 style="margin:0 0 12px;font-size:30px;line-height:1.15;text-align:center;color:#55434A;">Just one more step! ☁️</h1>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.7;text-align:center;color:#55434A;">
      Du hast dich für die Restock-Benachrichtigung zu <strong>${safeProduct}</strong> eingetragen.
    </p>
    <p style="margin:0 0 8px;font-size:16px;line-height:1.7;text-align:center;color:#55434A;">
      Bitte bestätige deine E-Mail-Adresse, damit wir dich beim nächsten Restock benachrichtigen können.
    </p>
    ${button("CONFIRM MY EMAIL", confirmUrl)}
    <p style="margin:0;font-size:13px;line-height:1.6;text-align:center;color:#7A666D;">
      Falls du dich nicht eingetragen hast, kannst du diese E-Mail einfach ignorieren. Der Link ist zeitlich begrenzt.
    </p>
  `;

  await resend.emails.send({
    from: getFrom(),
    to: params.to,
    subject: `Bitte bestätige deine Restock-Anmeldung ☁️`,
    html: layout(content, `Bitte bestätige deine Anmeldung für ${params.productName}.`),
  });
}

export async function sendRestockEmail(params: {
  to: string;
  productName: string;
  productSlug: string;
  unsubscribeToken: string;
}) {
  const resend = getResend();
  const siteUrl = getSiteUrl();
  const productUrl = `${siteUrl}/#produkt-${encodeURIComponent(params.productSlug)}`;
  const unsubscribeUrl = `${siteUrl}/api/waitlist/unsubscribe?token=${encodeURIComponent(params.unsubscribeToken)}`;
  const safeProduct = escapeHtml(params.productName);

  const content = `
    <p style="margin:0 0 8px;font-size:14px;font-weight:800;letter-spacing:1.5px;text-align:center;color:#F4AFC6;">GOOD NEWS!</p>
    <h1 style="margin:0 0 16px;font-size:32px;line-height:1.15;text-align:center;color:#55434A;">Your favorite pants are back! ☁️</h1>
    <p style="margin:0 0 12px;font-size:16px;line-height:1.7;text-align:center;color:#55434A;">
      Die Cozy Cloud Hosen sind wieder verfügbar!
    </p>
    <p style="margin:0 0 8px;font-size:16px;line-height:1.7;text-align:center;color:#55434A;">
      Du hast dich für <strong>${safeProduct}</strong> eingetragen und wir wollten dich natürlich als Erstes informieren.
    </p>
    ${button("JETZT ANSEHEN", productUrl)}
    <p style="margin:24px 0 0;font-size:12px;line-height:1.6;text-align:center;color:#7A666D;">
      Du möchtest keine weiteren Benachrichtigungen zu diesem Produkt erhalten?
      <a href="${escapeHtml(unsubscribeUrl)}" style="color:#55434A;text-decoration:underline;">Hier abmelden</a>.
    </p>
  `;

  await resend.emails.send({
    from: getFrom(),
    to: params.to,
    subject: `Your favorite pants are back! ☁️`,
    html: layout(content, `${params.productName} ist wieder verfügbar bei Cozy Cloud.`),
  });
}

export async function sendAdminWaitlistNotification(params: {
  email: string;
  productName: string;
  confirmedAt: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;
  const resend = getResend();
  const siteUrl = getSiteUrl();

  const content = `
    <h1 style="margin:0 0 12px;font-size:28px;line-height:1.2;text-align:center;color:#55434A;">Neue bestätigte Anmeldung ☁️</h1>
    <p style="margin:0 0 8px;font-size:16px;line-height:1.7;color:#55434A;"><strong>Produkt:</strong> ${escapeHtml(params.productName)}</p>
    <p style="margin:0 0 8px;font-size:16px;line-height:1.7;color:#55434A;"><strong>E-Mail:</strong> ${escapeHtml(params.email)}</p>
    <p style="margin:0 0 8px;font-size:16px;line-height:1.7;color:#55434A;"><strong>Bestätigt am:</strong> ${escapeHtml(params.confirmedAt)}</p>
    ${button("ZUM ADMIN-DASHBOARD", `${siteUrl}/admin`)}
  `;

  await resend.emails.send({
    from: getFrom(),
    to: adminEmail,
    subject: `Neue Cozy Cloud Wartelisten-Bestätigung: ${params.productName}`,
    html: layout(content, `Neue bestätigte Anmeldung für ${params.productName}.`),
  });
}
