export const BRAND = {
  name: "Cozy Cloud",
  tagline: "Gemütliche Hosen für deine schönsten Wohlfühlmomente.",
  email: "hello@cozycloud.example", // TODO: Replace with real contact email
  instagram: "https://instagram.com/cozycloud", // TODO: Replace with real profile
  tiktok: "https://tiktok.com/@cozycloud", // TODO: Replace with real profile
} as const;

export const WAITLIST_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  NOTIFIED: "notified",
  UNSUBSCRIBED: "unsubscribed",
} as const;

export type WaitlistStatus = (typeof WAITLIST_STATUS)[keyof typeof WAITLIST_STATUS];
