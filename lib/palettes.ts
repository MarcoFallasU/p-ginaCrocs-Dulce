import type { PaletteId } from "./types";

export interface Palette {
  id: PaletteId;
  name: string;
  bg: string;
  ink: string;
  sub: string;
}

/** Solo colores del sistema de diseño (ver DESIGN.md). */
export const PALETTES: Palette[] = [
  { id: "lila-superficie", name: "Lila superficie", bg: "#F3E8F9", ink: "#34184A", sub: "#604872" },
  { id: "lila-claro", name: "Lila claro", bg: "#EDDDF7", ink: "#34184A", sub: "#604872" },
  { id: "lila-banner", name: "Lila banner", bg: "#E3C9F2", ink: "#34184A", sub: "#45275C" },
  { id: "morado", name: "Morado acento", bg: "#B571DC", ink: "#34184A", sub: "#34184A" },
  { id: "amarillo", name: "Amarillo banner", bg: "#FDEBA0", ink: "#34184A", sub: "#3B3A16" },
  { id: "tinta", name: "Tinta", bg: "#34184A", ink: "#FFFFFF", sub: "#D6B1EC" },
];

export function paletteOf(id: string | undefined): Palette {
  return PALETTES.find((p) => p.id === id) ?? PALETTES[0];
}
