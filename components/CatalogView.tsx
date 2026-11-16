"use client";

import { useEffect, useState } from "react";
import { modelsWord } from "@/data/store";
import { useCatalog } from "@/context/CatalogContext";
import { allSizes, shownCategories } from "@/lib/catalog-utils";
import { paletteOf } from "@/lib/palettes";
import { track } from "@/lib/track";
import Button from "./Button";
import ProductGrid from "./ProductGrid";
import SizeButton from "./SizeButton";

const SMALL: React.CSSProperties = { fontSize: 12, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", color: "#604872" };
const CLEAR: React.CSSProperties = { fontSize: 14, fontWeight: 700, color: "#8A43B5", background: "transparent", border: 0, minHeight: 44, padding: 0, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 4 };

export default function CatalogView({ initialCat = "todos" }: { initialCat?: string }) {
  const { catalog } = useCatalog();
  const cats = shownCategories(catalog);
  const [cat, setCat] = useState(cats.some((c) => c.id === initialCat) ? initialCat : "todos");
  const [size, setSize] = useState("");

  const current = cats.find((c) => c.id === cat);
  const palette = paletteOf(current?.palette ?? "lila-superficie");
  const filtered = cat !== "todos" || !!size;
  const list = catalog.products.filter((p) => (cat === "todos" || p.cat === cat) && (!size || p.sizes.includes(size)));
  const clear = () => { setCat("todos"); setSize(""); };

  useEffect(() => {
    track({ type: "vistas", detail: current?.name ?? "Todos" });
  }, [current?.name]);

  return (
    <>
      <section id="catalogo" style={{ padding: "8px 16px 0", scrollMarginTop: 80 }}>
        <div className="hq-cathead" style={{ maxWidth: 1280, margin: "0 auto", background: palette.bg, color: palette.ink, borderRadius: 28, padding: "36px clamp(24px,5vw,72px) 44px", display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "12px 32px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>
            <h1 className="display hq-rise hq-cattitle" style={{ margin: 0, fontSize: "clamp(56px,8vw,120px)", lineHeight: 1, overflowWrap: "anywhere" }}>{current?.name ?? "Catálogo"}</h1>
            {current?.description && <p style={{ margin: 0, fontSize: 20, fontWeight: 700, lineHeight: 1.4 }}>{current.description}</p>}
          </div>
          <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: palette.sub }}>{catalog.products.length}{modelsWord(catalog.products.length)}</p>
        </div>
      </section>

      <section aria-label="Modelos" className="hq-sec" style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px 96px", display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: "32px 40px" }}>
        <aside className="hq-aside" aria-label="Filtros" style={{ flex: "1 1 240px", minWidth: 0, background: "#F9F4FC", borderRadius: 16, padding: 22, display: "flex", flexDirection: "column", gap: 26 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, letterSpacing: ".04em", textTransform: "uppercase" }}>Filtrar</h2>
            {filtered && <button type="button" onClick={clear} style={CLEAR}>Quitar filtros</button>}
          </div>

          <div role="group" aria-label="Categoría" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={SMALL}>Categoría</span>
            <div className="hq-fcats" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {[{ id: "todos", name: "Todos" }, ...cats].map((c) => {
                const on = c.id === cat;
                const count = c.id === "todos" ? catalog.products.length : catalog.products.filter((p) => p.cat === c.id).length;
                return (
                  <button key={c.id} type="button" className={`hq-press hq-fcat${on ? "" : " hq-opt"}`} onClick={() => { setCat(c.id); track({ type: "filtros", detail: "Categoría" }); }} aria-pressed={on} style={{ width: "100%", minHeight: 44, padding: "0 14px", borderRadius: 8, border: 0, background: on ? "#34184A" : "transparent", color: on ? "#FFFFFF" : "#34184A", fontSize: 15, fontWeight: on ? 800 : 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, textAlign: "left" }}>
                    {c.name}
                    <span style={{ fontSize: 13, fontWeight: 700, color: on ? "#D6B1EC" : "#604872", fontVariantNumeric: "tabular-nums" }}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {allSizes(catalog).length > 0 && (
            <div role="group" aria-label="Talla" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <span style={SMALL}>Talla</span>
              <div className="hq-fsizes" style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {allSizes(catalog).map((z) => (
                  <SizeButton key={z} size={z} active={z === size} onClick={() => { setSize(size === z ? "" : z); if (size !== z) track({ type: "filtros", detail: "Talla" }); }} />
                ))}
              </div>
            </div>
          )}
        </aside>

        <div style={{ flex: "999 1 560px", minWidth: 0, display: "flex", flexDirection: "column", gap: 20 }}>
          {filtered && (
            <p aria-live="polite" style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#604872" }}>
              Mostrando {list.length} de {catalog.products.length}{modelsWord(catalog.products.length)}
            </p>
          )}
          {list.length === 0 ? (
            <div style={{ border: "2px dashed #EDDDF7", borderRadius: 16, padding: "48px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{catalog.products.length === 0 ? "Pronto tendremos modelos nuevos." : "No tengo modelos con esa combinación."}</p>
              {filtered && <Button variant="outline" onClick={clear} style={{ minHeight: 48, padding: "0 20px", fontSize: 14 }}>Quitar filtros</Button>}
            </div>
          ) : (
            <ProductGrid key={`${cat}-${size}`} products={list} filterSize={size} animation="pop" />
          )}
        </div>
      </section>
    </>
  );
}
