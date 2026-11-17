/* ===== Datos fijos de la tienda: editá aquí =====
 * Los productos, categorías y destacados ya no viven acá: se administran desde /admin
 * (versión publicada en data/db/catalog.json). */

// Número de WhatsApp con código de país, solo números. Ejemplo: 50688887777
export const WHATSAPP = "";
// Usuario de Instagram, por ejemplo @huequitos.cr
export const INSTAGRAM = "[@usuario]";

export const PRICE_PLACEHOLDER = "₡XX.XXX";

/** Foto del hero del inicio. */
export const HERO_PHOTO = { src: "/img/morado.webp", width: 1639, height: 960 };

export function tintOf(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.round(255 - (255 - v) * 0.38));
  return "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
}

export function modelsWord(n: number): string {
  return n === 1 ? " modelo" : " modelos";
}

export function whatsappDigits(): string {
  return WHATSAPP.replace(/\D/g, "");
}

/** Banners del inicio (los edita el dev). Un banner solo sale si su categoría tiene productos visibles. */
export const BANNERS = [
  { cat: "plataforma", bg: "#E3C9F2", title: "¡Ya llegaron las de plataforma!", subColor: "#45275C", label: "Ver las de plataforma", rotate: -6 },
  { cat: "ninos", bg: "#FDEBA0", title: "Para los chiquitos", subColor: "#3B3A16", label: "Ver las de niños", rotate: -8 },
];
