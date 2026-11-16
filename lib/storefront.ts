import { cacheTag } from "next/cache";
import { toStorefront } from "./catalog-utils";
import { repo } from "./db";
import type { StoreCatalog } from "./types";

export const CATALOG_TAG = "catalog";

/** Catálogo publicado tal como lo ve la tienda. Se invalida al publicar desde el admin. */
export async function getStorefrontCatalog(): Promise<StoreCatalog> {
  "use cache";
  cacheTag(CATALOG_TAG);
  return toStorefront(await repo.getPublished());
}
