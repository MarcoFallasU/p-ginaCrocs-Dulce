"use client";

import { useState } from "react";
import Button from "@/components/Button";
import { PlusIcon } from "@/components/Icons";
import { colorsOf } from "@/lib/palettes";
import { useAdmin } from "./AdminProvider";
import ProductThumb from "./ProductThumb";

export default function CategoriesList() {
  const { draft } = useAdmin();
  const [open, setOpen] = useState<Record<string, boolean>>({});

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, paddingTop: 16 }}>
      <Button href="/admin/categorias/nueva" style={{ alignSelf: "flex-start", height: 52, padding: "0 22px" }}><PlusIcon />Nueva categoría</Button>

      <section aria-label="Lista de categorías" style={{ display: "flex", flexDirection: "column" }}>
        {draft.categories.map((c) => {
          const on = !!open[c.id];
          const products = draft.products.filter((p) => p.cat === c.id);
          const first = products.find((p) => p.photo);
          return (
            <article key={c.id} style={{ display: "flex", flexDirection: "column", borderTop: "2px solid #F3E8F9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button type="button" aria-expanded={on} aria-label={`${on ? "Ocultar" : "Ver"} los productos de ${c.name}`} onClick={() => setOpen((o) => ({ ...o, [c.id]: !on }))} className="hq-acc" style={{ flex: 1, minWidth: 0, boxSizing: "border-box", padding: "20px 8px", display: "flex", alignItems: "center", gap: 20, border: 0, borderRadius: 8, background: "transparent", color: "#34184A", font: "inherit", textAlign: "left", cursor: "pointer" }}>
                  <span aria-hidden="true" style={{ flex: "none" }}>
                    <ProductThumb photo={c.photo ?? first?.photo} body={colorsOf(c.color).bg} bg={colorsOf(c.color).bg} width={88} round />
                  </span>
                  <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: ".04em", textTransform: "uppercase", lineHeight: 1.25 }}>{c.name}</span>
                  </span>
                  <span aria-hidden="true" className="hq-chev" style={{ flex: "none", width: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "#F9F4FC", transform: `rotate(${on ? 180 : 0}deg)` }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                  </span>
                </button>
                <Button href={`/admin/categorias/${c.id}`} variant="soft" aria-label={`Editar la categoría ${c.name}`} style={{ flex: "none", height: 46, minHeight: 46, padding: "0 18px", fontSize: 13, letterSpacing: ".06em" }}>Editar</Button>
              </div>
              {on && (
                <div className="hq-open" style={{ display: "flex", flexDirection: "column", margin: "0 0 20px", padding: "4px 20px", borderRadius: 16, background: "#F9F4FC" }}>
                  {products.length === 0 && <p style={{ margin: 0, padding: "14px 0", color: "#604872" }}>Todavía no hay productos en esta categoría.</p>}
                  {products.map((p, i) => (
                    <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "12px 20px", flexWrap: "wrap", padding: "14px 0", borderTop: `2px solid ${i === 0 ? "transparent" : "#EDDDF7"}` }}>
                      <div style={{ flex: "1 1 240px", minWidth: 0, display: "flex", alignItems: "center", gap: 16 }}>
                        <ProductThumb photo={p.photo} body={p.body} width={72} dim={!p.visible} />
                        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, letterSpacing: ".04em", textTransform: "uppercase", lineHeight: 1.25 }}>{p.name} {p.color}</h3>
                      </div>
                      <span style={{ flex: "0 0 90px", display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, color: "#604872" }}>
                        <span aria-hidden="true" style={{ width: 10, height: 10, boxSizing: "border-box", borderRadius: "50%", border: "2px solid #34184A", background: p.visible ? "#34184A" : "transparent" }} />
                        {p.visible ? "Visible" : "Oculto"}
                      </span>
                      <Button href={`/admin/productos/${p.id}`} variant="soft" aria-label={`Editar ${p.name} ${p.color}`} style={{ flex: "none", height: 46, minHeight: 46, padding: "0 18px", fontSize: 13, letterSpacing: ".06em" }}>Editar</Button>
                    </div>
                  ))}
                </div>
              )}
            </article>
          );
        })}
        <Button href="/admin/categorias/nueva" variant="outline" className="hq-add" style={{ marginTop: 8, minHeight: 88, padding: "16px 20px", border: "2px dashed #B571DC", borderRadius: 16, background: "transparent", fontSize: 14 }}>
          <PlusIcon />Añadir categoría
        </Button>
      </section>
    </div>
  );
}
