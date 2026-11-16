"use client";

import { useAdmin } from "./AdminProvider";
import ProductThumb from "./ProductThumb";

const H2: React.CSSProperties = { margin: 0, paddingBottom: 12, borderBottom: "3px solid #34184A", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, fontSize: 14, fontWeight: 900, letterSpacing: ".1em", textTransform: "uppercase" };
const ROW: React.CSSProperties = { display: "flex", alignItems: "center", gap: "12px 20px", flexWrap: "wrap", padding: "16px 0", borderBottom: "2px solid #F3E8F9" };
const SQUARE: React.CSSProperties = { width: 46, height: 46, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", border: 0, borderRadius: 6, background: "#F9F4FC", color: "#34184A", cursor: "pointer" };

export default function FeaturedEditor() {
  const { draft, update } = useAdmin();
  const byId = new Map(draft.products.map((p) => [p.id, p]));
  const catName = (id: string) => draft.categories.find((c) => c.id === id)?.name ?? id;
  const chosen = draft.featured.map((id) => byId.get(id)).filter((p): p is NonNullable<typeof p> => !!p);
  const rest = draft.products.filter((p) => !draft.featured.includes(p.id));
  const setIds = (fn: (ids: string[]) => string[]) => void update((c) => ({ ...c, featured: fn(c.featured) }));

  const move = (i: number, d: number) => setIds((ids) => {
    const j = i + d;
    if (j < 0 || j >= ids.length) return ids;
    const next = ids.slice();
    [next[i], next[j]] = [next[j], next[i]];
    return next;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40, paddingTop: 16 }}>
      <p style={{ margin: 0, maxWidth: 640, fontSize: 17, color: "#604872" }}>Elegí los productos de «Los modelos de hoy». Salen en el inicio en este orden.</p>

      <section aria-label="En el inicio" style={{ display: "flex", flexDirection: "column" }}>
        <h2 style={H2}>
          Los modelos de hoy
          <span aria-live="polite" style={{ fontSize: 13, fontWeight: 800, letterSpacing: ".06em", color: "#604872", fontVariantNumeric: "tabular-nums" }}>{chosen.length === 1 ? "1 producto" : `${chosen.length} productos`}</span>
        </h2>
        {chosen.length === 0 && <p style={{ margin: 0, padding: "20px 0", color: "#604872" }}>Todavía no hay destacados. Elegí algunos abajo.</p>}
        {chosen.map((p, i) => {
          const full = `${p.name} ${p.color}`;
          return (
            <article key={p.id} style={ROW}>
              <span aria-hidden="true" className="display" style={{ flex: "none", width: 32, fontSize: 28, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{i + 1}</span>
              <div style={{ flex: "1 1 260px", minWidth: 0, display: "flex", alignItems: "center", gap: 16 }}>
                <ProductThumb photo={p.photo} body={p.body} dim={!p.visible} />
                <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, letterSpacing: ".04em", textTransform: "uppercase", lineHeight: 1.25 }}>{full}</h3>
                  <span style={{ fontSize: 14, color: "#604872" }}>{catName(p.cat)}{!p.visible && " · Oculto: no se muestra en la tienda"}</span>
                </div>
              </div>
              <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 4 }}>
                <button type="button" aria-label={`Subir ${full}`} onClick={() => move(i, -1)} disabled={i === 0} className="hq-press" style={{ ...SQUARE, opacity: i === 0 ? 0.4 : 1 }}>
                  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 15l6-6 6 6" /></svg>
                </button>
                <button type="button" aria-label={`Bajar ${full}`} onClick={() => move(i, 1)} disabled={i === chosen.length - 1} className="hq-press" style={{ ...SQUARE, opacity: i === chosen.length - 1 ? 0.4 : 1 }}>
                  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                </button>
                <button type="button" onClick={() => setIds((ids) => ids.filter((x) => x !== p.id))} className="hq-text" style={{ width: 80, height: 46, padding: 0, border: 0, background: "transparent", color: "#34184A", font: "inherit", fontSize: 15, fontWeight: 700, textDecoration: "underline", cursor: "pointer" }}>Quitar</button>
              </div>
            </article>
          );
        })}
      </section>

      <section aria-label="Productos para destacar" style={{ display: "flex", flexDirection: "column" }}>
        <h2 style={H2}>Otros productos</h2>
        {rest.length === 0 && <p style={{ margin: 0, padding: "20px 0", color: "#604872" }}>Todos los productos ya están destacados.</p>}
        {rest.map((p) => (
          <article key={p.id} style={ROW}>
            <div style={{ flex: "1 1 260px", minWidth: 0, display: "flex", alignItems: "center", gap: 16 }}>
              <ProductThumb photo={p.photo} body={p.body} dim={!p.visible} />
              <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, letterSpacing: ".04em", textTransform: "uppercase", lineHeight: 1.25 }}>{p.name} {p.color}</h3>
                <span style={{ fontSize: 14, color: "#604872" }}>{catName(p.cat)}</span>
              </div>
            </div>
            {p.visible ? (
              <button type="button" onClick={() => setIds((ids) => [...ids, p.id])} className="hq-press" style={{ flex: "none", height: 46, padding: "0 18px", border: 0, borderRadius: 6, background: "#EDDDF7", color: "#34184A", font: "inherit", fontSize: 13, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", cursor: "pointer" }}>Destacar</button>
            ) : (
              <span style={{ flex: "none", fontSize: 14, fontWeight: 700, color: "#604872" }}>Está oculto. Mostralo para destacarlo.</span>
            )}
          </article>
        ))}
      </section>
    </div>
  );
}
