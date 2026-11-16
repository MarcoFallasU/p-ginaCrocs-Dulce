"use client";

import { useMemo, useState } from "react";
import CatalogView from "@/components/CatalogView";
import HomeView from "@/components/HomeView";
import { CatalogProvider } from "@/context/CatalogContext";
import { ListProvider } from "@/context/ListContext";
import { toStorefront } from "@/lib/catalog-utils";
import { useAdmin } from "./AdminProvider";

/** La tienda renderizada con el borrador: no publica nada ni cuenta estadísticas. */
export default function PreviewView() {
  const { draft, changes } = useAdmin();
  const [page, setPage] = useState<"inicio" | "catalogo">("inicio");
  const catalog = useMemo(() => toStorefront(draft), [draft]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingTop: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div role="group" aria-label="Página a previsualizar" style={{ display: "flex", gap: 8 }}>
          {(["inicio", "catalogo"] as const).map((p) => (
            <button key={p} type="button" aria-pressed={page === p} className="hq-press" onClick={() => setPage(p)} style={{ height: 48, padding: "0 16px", border: 0, borderRadius: 6, background: page === p ? "#34184A" : "#EDDDF7", color: page === p ? "#FFFFFF" : "#34184A", font: "inherit", fontSize: 13, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", cursor: "pointer" }}>
              {p === "inicio" ? "Inicio" : "Catálogo"}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 15, color: "#604872" }}>
          {changes.count ? `Así se vería con los ${changes.count} cambios sin publicar.` : "No hay cambios: esto es lo que ya está publicado."}
        </span>
      </div>
      <div style={{ border: "2px dashed #E7D2F4", borderRadius: 16, overflow: "hidden", background: "#FFFFFF", padding: "8px 0" }}>
        <CatalogProvider catalog={catalog}>
          <ListProvider storageKey="hq-preview">{page === "inicio" ? <HomeView catalog={catalog} /> : <CatalogView key={draft.products.length} />}</ListProvider>
        </CatalogProvider>
      </div>
    </div>
  );
}
