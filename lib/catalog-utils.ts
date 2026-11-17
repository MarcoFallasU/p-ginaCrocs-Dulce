import type { Catalog, Category, Product, StoreCatalog } from "./types";

/** Convierte el catálogo del admin en el de la tienda: solo visibles, con categoría resuelta. */
export function toStorefront(c: Catalog): StoreCatalog {
  const cats = new Map(c.categories.map((x) => [x.id, x]));
  const products = c.products
    .filter((p) => p.visible && cats.has(p.cat))
    .map((p) => {
      const cat = cats.get(p.cat)!;
      return { ...p, catName: cat.name, noSize: !cat.sized };
    });
  const ids = new Set(products.map((p) => p.id));
  return { categories: c.categories, products, featured: c.featured.filter((id) => ids.has(id)) };
}

/** Categorías con al menos un producto visible (la tienda no muestra categorías vacías). */
export function shownCategories(c: StoreCatalog): Category[] {
  return c.categories.filter((cat) => c.products.some((p) => p.cat === cat.id));
}

/** Tallas que se pueden marcar al crear o editar un producto. */
export const ALL_SIZES = Array.from({ length: 32 }, (_, i) => String(17 + i)); // 17 a 48

function sortedSizes(products: Pick<Product, "sizes">[]): string[] {
  const zs = new Set<string>();
  products.forEach((p) => p.sizes.forEach((z) => zs.add(z)));
  return [...zs].sort((a, b) => Number(a) - Number(b));
}

export function allSizes(c: StoreCatalog): string[] {
  return sortedSizes(c.products);
}

export function sizesLabel(c: StoreCatalog, catId: string): string {
  const zs = sortedSizes(c.products.filter((p) => p.cat === catId));
  if (!zs.length) return "";
  return zs.length === 1 ? "Talla " + zs[0] : "Tallas " + zs.slice(0, -1).join(", ") + " y " + zs[zs.length - 1];
}

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Rango de precio para estadísticas. Precios en colones, p. ej. "₡25.000". */
export function priceNumber(price: string): number | null {
  const digits = price.replace(/\D/g, "");
  return digits ? Number(digits) : null;
}

export function priceRange(price: string): string {
  const n = priceNumber(price);
  if (n === null) return "Sin precio";
  if (n < 15000) return "Menos de ₡15.000";
  if (n <= 25000) return "₡15.000 a ₡25.000";
  return "Más de ₡25.000";
}

export const PRICE_RANGES = ["Menos de ₡15.000", "₡15.000 a ₡25.000", "Más de ₡25.000", "Sin precio"];
