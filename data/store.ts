/* ===== Datos de la tienda: editá aquí ===== */

// Número de WhatsApp con código de país, solo números. Ejemplo: 50688887777
export const WHATSAPP = "";
// Usuario de Instagram, por ejemplo @huequitos.cr
export const INSTAGRAM = "[@usuario]";

export type CategoryId = "clasicos" | "plataforma" | "bolsos" | "ninos";

export interface Photo {
  src: string;
  width: number;
  height: number;
}

export interface Product {
  id: string;
  name: string;
  color: string;
  cat: CategoryId;
  photo: Photo;
  body: string;
  price: string; // ej. '₡25.000'. Si queda vacío se muestra ₡XX.XXX
  sizes: string[];
  isNew?: boolean;
  noSize?: boolean;
}

export const IMG: Record<string, Photo> = {
  verde: { src: "/img/verde.webp", width: 1100, height: 606 },
  rosado: { src: "/img/rosado.webp", width: 1100, height: 591 },
  azul: { src: "/img/azul.webp", width: 1100, height: 603 },
  gris: { src: "/img/gris.webp", width: 1100, height: 680 },
  mochila: { src: "/img/mochila.webp", width: 1215, height: 900 },
  crush: { src: "/img/crush.webp", width: 1100, height: 702 },
  kids: { src: "/img/kids.webp", width: 1100, height: 609 },
};

export const PRODUCTS: Product[] = [
  { id: "p1", name: "Classic Clog", color: "Verde", cat: "clasicos", photo: IMG.verde, body: "#35F411", price: "", sizes: ["37", "38", "39", "41", "42"] },
  { id: "p2", name: "Classic Clog", color: "Rosado", cat: "clasicos", photo: IMG.rosado, body: "#F63EA7", price: "", sizes: ["36", "37", "38"] },
  { id: "p3", name: "Classic Clog", color: "Azul", cat: "clasicos", photo: IMG.azul, body: "#0472FB", price: "", sizes: ["36", "38", "40"] },
  { id: "p5", name: "Clog con tacón", color: "Gris", cat: "plataforma", photo: IMG.gris, body: "#898B8F", price: "", sizes: ["38", "40"] },
  { id: "p6", name: "Mochila", color: "Rosado", cat: "bolsos", photo: IMG.mochila, body: "#EE99BF", isNew: true, noSize: true, price: "", sizes: [] },
  { id: "p4", name: "Crush Clog", color: "Rosado", cat: "plataforma", photo: IMG.crush, body: "#F663B5", isNew: true, price: "", sizes: ["37", "39"] },
  { id: "p7", name: "Classic Clog Kids", color: "Amarillo", cat: "ninos", photo: IMG.kids, body: "#FBCB04", price: "", sizes: ["25", "27", "29"] },
];

// Modelos destacados en "Los modelos de hoy" del inicio (el catálogo muestra todos)
export const FEATURED = ["p3", "p4", "p6"];

export const CATS: { id: CategoryId | "todos"; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "clasicos", label: "Clásicos" },
  { id: "plataforma", label: "Plataforma" },
  { id: "bolsos", label: "Bolsos" },
  { id: "ninos", label: "Niños" },
];

/* ===== Utilidades ===== */
export const byId: Record<string, Product> = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
export const LABELS: Record<string, string> = Object.fromEntries(CATS.map((c) => [c.id, c.label]));
export const PRICE_PLACEHOLDER = "₡XX.XXX";

export function tintOf(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.round(255 - (255 - v) * 0.38));
  return "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
}

export function shownCats() {
  return CATS.filter((c) => c.id === "todos" || PRODUCTS.some((p) => p.cat === c.id));
}

function sortedSizes(products: Product[]): string[] {
  const zs = new Set<string>();
  products.forEach((p) => p.sizes.forEach((z) => zs.add(z)));
  return [...zs].sort((a, b) => Number(a) - Number(b));
}

export function allSizes(): string[] {
  return sortedSizes(PRODUCTS);
}

export function sizesOf(cat: CategoryId): string {
  const zs = sortedSizes(PRODUCTS.filter((p) => p.cat === cat));
  if (!zs.length) return "";
  return zs.length === 1 ? "Talla " + zs[0] : "Tallas " + zs.slice(0, -1).join(", ") + " y " + zs[zs.length - 1];
}

export function modelsWord(n: number): string {
  return n === 1 ? " modelo" : " modelos";
}

export function whatsappDigits(): string {
  return WHATSAPP.replace(/\D/g, "");
}
