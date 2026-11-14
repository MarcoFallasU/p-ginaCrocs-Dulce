import type { Metadata } from "next";
import { Suspense } from "react";
import CatalogFilters from "@/components/CatalogFilters";
import { PRODUCTS, modelsWord } from "@/data/store";

export const metadata: Metadata = { title: "Catálogo · Dulce Crocs" };

export default function CatalogoPage() {
  return (
    <main>
      <section id="catalogo" style={{ padding: "8px 16px 0", scrollMarginTop: 80 }}>
        <div className="hq-cathead" style={{ maxWidth: 1280, margin: "0 auto", background: "#F3E8F9", borderRadius: 28, padding: "36px clamp(24px,5vw,72px) 44px", display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "12px 32px" }}>
          <h1 className="display hq-rise hq-cattitle" style={{ margin: 0, fontSize: "clamp(56px,8vw,120px)", lineHeight: 1 }}>Catálogo</h1>
          <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#604872" }}>{PRODUCTS.length}{modelsWord(PRODUCTS.length)}</p>
        </div>
      </section>
      <Suspense>
        <CatalogFilters />
      </Suspense>
    </main>
  );
}
