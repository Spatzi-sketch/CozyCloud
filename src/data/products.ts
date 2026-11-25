export type ProductStatus = "unavailable" | "available";

export interface Product {
  /** Stable slug used in URLs, DB rows, and file names */
  slug: string;
  /** Display name shown on product cards */
  name: string;
  /** Price in EUR (displayed as 24,99 €) */
  price: number;
  /** Path relative to /public (e.g. "/images/products/my-pants.jpg") */
  image: string;
  /** Alt text for the product image */
  alt: string;
  /** Current availability status */
  status: ProductStatus;
  /** Optional short description */
  description?: string;
}

/**
 * ZENTRALE PRODUKTDATEI
 * ---------------------
 * So fügst du ein neues Produkt hinzu:
 * 1. Lege das Produktfoto in /public/images/products/ ab.
 * 2. Kopiere einen der Einträge unten und passe slug, name, image, alt an.
 * 3. Speichern - das Produkt erscheint automatisch auf der Website.
 *
 * WICHTIG:
 * - "slug" muss eindeutig sein und darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten.
 * - "price" ist in Euro angegeben (24.99 = 24,99 €).
 * - "status" ist "unavailable" oder "available".
 * - Jedes Produkt hat seine eigene Warteliste (über den slug zugeordnet).
 */
export const products: Product[] = [
  {
    slug: "cozy-pink-dream",
    name: "Cozy Pink Dream",
    price: 24.99,
    image: "/images/products/cozy-pink-dream.jpg",
    alt: "Cozy Pink Dream Pyjamahose in Rosa",
    status: "unavailable",
    description: "Weiche Rosa-Töne für deine gemütlichsten Abende.",
  },
  {
    slug: "lavender-cloud",
    name: "Lavender Cloud",
    price: 24.99,
    image: "/images/products/lavender-cloud.jpg",
    alt: "Lavender Cloud Pyjamahose in Lavendel",
    status: "unavailable",
    description: "Sanftes Lavendel wie ein Traum aus Wolken.",
  },
  {
    slug: "creamy-stars",
    name: "Creamy Stars",
    price: 24.99,
    image: "/images/products/creamy-stars.jpg",
    alt: "Creamy Stars Pyjamahose in Creme mit Sternen",
    status: "unavailable",
    description: "Cremeweiß mit kleinen Sternen für sternenklare Cozy-Nächte.",
  },
  {
    slug: "christmas-cocoa",
    name: "Christmas Cocoa",
    price: 24.99,
    image: "/images/products/christmas-cocoa.jpg",
    alt: "Christmas Cocoa Pyjamahose mit weihnachtlichem Design",
    status: "unavailable",
    description: "Weihnachtliche Gemütlichkeit mit einer Tasse Kakao-Gefühl.",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("de-AT", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}
