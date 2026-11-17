/** Colores sugeridos del sistema de diseño (atajos junto al selector de color). */
export const SUGGESTED_COLORS = [
  { name: "Lila superficie", hex: "#F3E8F9" },
  { name: "Lila claro", hex: "#EDDDF7" },
  { name: "Lila banner", hex: "#E3C9F2" },
  { name: "Morado acento", hex: "#B571DC" },
  { name: "Amarillo banner", hex: "#FDEBA0" },
  { name: "Tinta", hex: "#34184A" },
];

export const DEFAULT_CATEGORY_COLOR = "#F3E8F9";

/** Colores equivalentes de las paletas antiguas (categorías guardadas antes del selector libre). */
export const LEGACY_PALETTES: Record<string, string> = {
  "lila-superficie": "#F3E8F9",
  "lila-claro": "#EDDDF7",
  "lila-banner": "#E3C9F2",
  morado: "#B571DC",
  amarillo: "#FDEBA0",
  tinta: "#34184A",
};

export const isHex = (v: unknown): v is string => typeof v === "string" && /^#[0-9a-fA-F]{6}$/.test(v);

/** A partir del color de fondo elegido calcula tinta y texto secundario legibles (contraste). */
export function colorsOf(color: string | undefined) {
  const bg = isHex(color) ? color.toUpperCase() : DEFAULT_CATEGORY_COLOR;
  const n = parseInt(bg.slice(1), 16);
  const lin = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const luminance = 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
  // Tinta oscura salvo que el fondo sea tan oscuro que el texto claro contraste más
  return luminance > 0.18 ? { bg, ink: "#34184A", sub: "#604872" } : { bg, ink: "#FFFFFF", sub: "#D6B1EC" };
}
