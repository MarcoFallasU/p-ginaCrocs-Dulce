"use client";

import { useState } from "react";
import Button from "@/components/Button";
import { PlusIcon } from "@/components/Icons";
import { PRICE_PLACEHOLDER } from "@/data/store";
import { useAdmin } from "./AdminProvider";
import { TextInput } from "./fields";
import ProductThumb from "./ProductThumb";

const CHIP = (on: boolean): React.CSSProperties => ({ height: 52, padding: "0 16px", border: 0, borderRadius: 6, background: on ? "#34184A" : "#EDDDF7", color: on ? "#FFFFFF" : "#34184A", font: "inherit", fontSize: 13, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", cursor: "pointer" });
const BADGE: React.CSSProperties = { padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 900, letterSpacing: ".1em" };

export default function ProductsList() {
  const { draft, changes, update } = useAdmin();
  const [cat, setCat] = useState("todos");
  const [q, setQ] = useState("");

  const catName = (id: string) => draft.categories.find((c) => c.id === id)?.name ?? id;
  const needle = q.trim().toLowerCase();
  const list = draft.products.filter((p) => (cat === "todos" || p.cat === cat) && (!needle || `${p.name} ${p.color}`.toLowerCase().includes(needle)));
  const hidden = draft.products.filter((p) => !p.visible).length;
  const count = `${draft.products.length} ${draft.products.length === 1 ? "producto" : "productos"}, ${hidden === 1 ? "1 oculto" : hidden + " ocultos"}`;

  const toggle = (id: string) => void update((c) => ({ ...c, products: c.products.map((p) => (p.id === id ? { ...p, visible: !p.visible } : p)) }));

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 24, paddingTop: 16 }}>
        <p aria-live="polite" style={{ margin: 0, fontSize: 17, color: "#604872" }}>{count}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div role="group" aria-label="Filtrar por categoría" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[{ id: "todos", name: "Todos" }, ...draft.categories].map((c) => (
              <button key={c.id} type="button" aria-pressed={cat === c.id} className="hq-press" onClick={() => setCat(c.id)} style={CHIP(cat === c.id)}>{c.name}</button>
            ))}
          </div>
          <label style={{ flex: "1 1 240px", display: "flex", alignItems: "center", gap: 10, height: 52, padding: "0 14px", boxSizing: "border-box", background: "#F9F4FC", borderRadius: 6, color: "#604872" }}>
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}><circle cx="11" cy="11" r="6" /><path d="M20 20l-4-4" /></svg>
            <TextInput type="search" aria-label="Buscar producto" placeholder="Buscá por nombre o color" value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: 1, height: "auto", border: 0, background: "transparent", padding: 0 }} />
          </label>
          <Button href="/admin/productos/nuevo" style={{ flex: "none", height: 52, padding: "0 22px" }}><PlusIcon />Nuevo producto</Button>
        </div>
      </div>

      <section aria-label="Lista de productos" style={{ display: "flex", flexDirection: "column" }}>
        {list.length === 0 && <p style={{ margin: 0, padding: "24px 0", color: "#604872" }}>{draft.products.length === 0 ? "Todavía no hay productos. Creá el primero." : "Ningún producto coincide."}</p>}
        {list.map((p) => (
          <article key={p.id} style={{ display: "flex", alignItems: "center", gap: "12px 24px", flexWrap: "wrap", padding: "16px 0", borderTop: "2px solid #F3E8F9" }}>
            <div style={{ flex: "1 1 300px", minWidth: 0, display: "flex", alignItems: "center", gap: 16 }}>
              <ProductThumb photo={p.photo} body={p.body} dim={!p.visible} />
              <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                <h2 style={{ margin: 0, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", fontSize: 16, fontWeight: 900, letterSpacing: ".04em", textTransform: "uppercase", lineHeight: 1.25 }}>
                  {p.name} {p.color}
                  {p.isNew && <span style={{ ...BADGE, background: "#34184A", color: "#D6B1EC" }}>Nuevo</span>}
                  {changes.productIds.has(p.id) && <span style={{ ...BADGE, background: "#FDEBA0", color: "#3B3A16" }}>Sin publicar</span>}
                </h2>
                <span style={{ fontSize: 14, color: "#604872", fontVariantNumeric: "tabular-nums" }}>
                  {p.sizes.length ? "Tallas " + [...p.sizes].sort((a, b) => Number(a) - Number(b)).join(", ") : "Sin tallas"}
                </span>
              </div>
            </div>
            <span style={{ flex: "0 0 110px", fontSize: 15, fontWeight: 700 }}>{catName(p.cat)}</span>
            <span style={{ flex: "0 0 90px", fontSize: 16, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{p.price || PRICE_PLACEHOLDER}</span>
            <span style={{ flex: "0 0 90px", display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, color: "#604872" }}>
              <span aria-hidden="true" style={{ width: 10, height: 10, boxSizing: "border-box", borderRadius: "50%", border: "2px solid #34184A", background: p.visible ? "#34184A" : "transparent" }} />
              {p.visible ? "Visible" : "Oculto"}
            </span>
            <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 8 }}>
              <button type="button" onClick={() => toggle(p.id)} className="hq-text" style={{ width: 88, height: 46, padding: 0, border: 0, background: "transparent", color: "#34184A", font: "inherit", fontSize: 15, fontWeight: 700, textDecoration: "underline", cursor: "pointer" }}>{p.visible ? "Ocultar" : "Mostrar"}</button>
              <Button href={`/admin/productos/${p.id}`} variant="soft" style={{ height: 46, minHeight: 46, padding: "0 18px", fontSize: 13, letterSpacing: ".06em" }} aria-label={`Editar ${p.name} ${p.color}`}>Editar</Button>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
