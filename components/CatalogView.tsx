"use client";

import { useState } from "react";
import { PRODUCTS, allSizes, modelsWord, shownCats, type CategoryId } from "@/data/store";
import Button from "./Button";
import ProductGrid from "./ProductGrid";
import SizeButton from "./SizeButton";

type CatFilter = CategoryId | "todos";

const SMALL: React.CSSProperties = { fontSize: 12, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", color: "#604872" };
const CLEAR: React.CSSProperties = { fontSize: 14, fontWeight: 700, color: "#8A43B5", background: "transparent", border: 0, minHeight: 44, padding: 0, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 4 };

export default function CatalogView({ initialCat = "todos" }: { initialCat?: CatFilter }) {
  const [cat, setCat] = useState<CatFilter>(initialCat);
  const [size, setSize] = useState("");

  const filtered = cat !== "todos" || !!size;
  const list = PRODUCTS.filter((p) => (cat === "todos" || p.cat === cat) && (!size || p.sizes.includes(size)));
  const clear = () => { setCat("todos"); setSize(""); };

  return (
    <section aria-label="Modelos" className="hq-sec" style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px 96px", display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: "32px 40px" }}>
      <aside className="hq-aside" aria-label="Filtros" style={{ flex: "1 1 240px", minWidth: 0, background: "#F9F4FC", borderRadius: 16, padding: 22, display: "flex", flexDirection: "column", gap: 26 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, letterSpacing: ".04em", textTransform: "uppercase" }}>Filtrar</h2>
          {filtered && <button type="button" onClick={clear} style={CLEAR}>Quitar filtros</button>}
        </div>

        <div role="group" aria-label="Categoría" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={SMALL}>Categoría</span>
          <div className="hq-fcats" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {shownCats().map((c) => {
              const on = c.id === cat;
              const count = c.id === "todos" ? PRODUCTS.length : PRODUCTS.filter((p) => p.cat === c.id).length;
              return (
                <button key={c.id} type="button" className={`hq-press hq-fcat${on ? "" : " hq-opt"}`} onClick={() => setCat(c.id)} aria-pressed={on} style={{ width: "100%", minHeight: 44, padding: "0 14px", borderRadius: 8, border: 0, background: on ? "#34184A" : "transparent", color: on ? "#FFFFFF" : "#34184A", fontSize: 15, fontWeight: on ? 800 : 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, textAlign: "left" }}>
                  {c.label}
                  <span style={{ fontSize: 13, fontWeight: 700, color: on ? "#D6B1EC" : "#604872", fontVariantNumeric: "tabular-nums" }}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div role="group" aria-label="Talla" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <span style={SMALL}>Talla</span>
          <div className="hq-fsizes" style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {allSizes().map((z) => (
              <SizeButton key={z} size={z} active={z === size} onClick={() => setSize(size === z ? "" : z)} />
            ))}
          </div>
        </div>
      </aside>

      <div style={{ flex: "999 1 560px", minWidth: 0, display: "flex", flexDirection: "column", gap: 20 }}>
        {filtered && (
          <p aria-live="polite" style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#604872" }}>
            Mostrando {list.length} de {PRODUCTS.length}{modelsWord(PRODUCTS.length)}
          </p>
        )}
        {list.length === 0 ? (
          <div style={{ border: "2px dashed #EDDDF7", borderRadius: 16, padding: "48px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>No tengo modelos con esa combinación.</p>
            <Button variant="outline" onClick={clear} style={{ minHeight: 48, padding: "0 20px", fontSize: 14 }}>Quitar filtros</Button>
          </div>
        ) : (
          <ProductGrid key={`${cat}-${size}`} products={list} filterSize={size} animation="pop" />
        )}
      </div>
    </section>
  );
}

