import type { Catalog } from "./types";

export interface Changes {
  count: number;
  /** Productos nuevos o modificados respecto a lo publicado. */
  productIds: Set<string>;
}

/** Compara borrador y publicado. Cuenta cada producto o categoría nueva, cambiada o eliminada, más el orden de destacados. */
export function diffCatalogs(draft: Catalog, published: Catalog): Changes {
  const productIds = new Set<string>();
  let count = 0;
  const pub = new Map(published.products.map((p) => [p.id, JSON.stringify(p)]));
  for (const p of draft.products) {
    if (pub.get(p.id) !== JSON.stringify(p)) { productIds.add(p.id); count++; }
  }
  const draftIds = new Set(draft.products.map((p) => p.id));
  count += published.products.filter((p) => !draftIds.has(p.id)).length;

  const pubCats = new Map(published.categories.map((c) => [c.id, JSON.stringify(c)]));
  for (const c of draft.categories) if (pubCats.get(c.id) !== JSON.stringify(c)) count++;
  const draftCatIds = new Set(draft.categories.map((c) => c.id));
  count += published.categories.filter((c) => !draftCatIds.has(c.id)).length;

  if (JSON.stringify(draft.featured) !== JSON.stringify(published.featured)) count++;
  return { count, productIds };
}
