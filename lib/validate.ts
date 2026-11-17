import { ALL_SIZES } from "./catalog-utils";
import { DEFAULT_CATEGORY_COLOR, LEGACY_PALETTES, isHex } from "./palettes";
import type { Catalog, Category, Photo, Product } from "./types";

const str = (v: unknown, max = 120): string => (typeof v === "string" ? v.trim().slice(0, max) : "");
const strArr = (v: unknown, max = 60, len = 8): string[] =>
  Array.isArray(v) ? [...new Set(v.filter((x): x is string => typeof x === "string").map((x) => x.trim().slice(0, len)))].slice(0, max) : [];

function photo(v: unknown): Photo | undefined {
  if (!v || typeof v !== "object") return undefined;
  const o = v as Record<string, unknown>;
  const src = str(o.src, 500);
  const okSrc = (s: string) => s.startsWith("/") || /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//.test(s);
  if (!okSrc(src) || !Number.isFinite(o.width) || !Number.isFinite(o.height)) return undefined;
  const thumb = str(o.thumb, 500);
  return { src, width: Number(o.width), height: Number(o.height), ...(thumb && okSrc(thumb) ? { thumb } : {}) };
}

/** Valida y limpia lo que llega del navegador antes de guardarlo. Lanza Error con mensaje legible. */
export function sanitizeCatalog(input: unknown): Catalog {
  if (!input || typeof input !== "object") throw new Error("Catálogo inválido");
  const raw = input as Record<string, unknown>;
  if (!Array.isArray(raw.categories) || !Array.isArray(raw.products)) throw new Error("Catálogo inválido");

  const categories: Category[] = raw.categories.map((c: Record<string, unknown>) => {
    const id = str(c.id, 60);
    const name = str(c.name, 60);
    if (!id || !name) throw new Error("Toda categoría necesita nombre");
    const color = isHex(c.color) ? c.color.toUpperCase() : (typeof c.palette === "string" && LEGACY_PALETTES[c.palette]) || DEFAULT_CATEGORY_COLOR;
    const ph = photo(c.photo);
    return { id, name, description: str(c.description, 60), color, sized: typeof c.sized === "boolean" ? c.sized : strArr(c.sizes).length > 0, ...(ph ? { photo: ph } : {}) };
  });
  const catIds = new Set(categories.map((c) => c.id));
  if (catIds.size !== categories.length) throw new Error("Hay categorías repetidas");

  const products: Product[] = raw.products.map((p: Record<string, unknown>) => {
    const id = str(p.id, 60);
    const cat = str(p.cat, 60);
    if (!id || !str(p.name, 80)) throw new Error("Todo producto necesita nombre");
    if (!catIds.has(cat)) throw new Error("Un producto tiene una categoría que no existe");
    const body = typeof p.body === "string" && /^#[0-9a-fA-F]{6}$/.test(p.body) ? p.body.toUpperCase() : "#B571DC";
    const sized = categories.find((c) => c.id === cat)!.sized;
    const ph = photo(p.photo);
    return {
      id,
      name: str(p.name, 80),
      color: str(p.color, 40),
      body,
      cat,
      price: str(p.price, 20),
      sizes: sized ? strArr(p.sizes).filter((z) => ALL_SIZES.includes(z)) : [],
      isNew: !!p.isNew,
      visible: p.visible !== false,
      ...(ph ? { photo: ph } : {}),
    };
  });
  if (new Set(products.map((p) => p.id)).size !== products.length) throw new Error("Hay productos repetidos");

  const pids = new Set(products.map((p) => p.id));
  const featured = strArr(raw.featured, 50, 60).filter((id) => pids.has(id));
  return { categories, products, featured };
}
