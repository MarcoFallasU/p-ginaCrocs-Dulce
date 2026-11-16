"use client";

import { createContext, useContext, useMemo } from "react";
import type { StoreCatalog, StoreProduct } from "@/lib/types";

interface CatalogContextValue {
  catalog: StoreCatalog;
  byId: Record<string, StoreProduct>;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

/** Entrega a los componentes de cliente el catálogo que el servidor ya leyó (publicado o borrador). */
export function CatalogProvider({ catalog, children }: { catalog: StoreCatalog; children: React.ReactNode }) {
  const value = useMemo(() => ({ catalog, byId: Object.fromEntries(catalog.products.map((p) => [p.id, p])) }), [catalog]);
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog debe usarse dentro de CatalogProvider");
  return ctx;
}
