"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/Button";
import SizeButton from "@/components/SizeButton";
import { slugify } from "@/lib/catalog-utils";
import { PALETTES, paletteOf } from "@/lib/palettes";
import type { Category, Photo } from "@/lib/types";
import { useAdmin } from "./AdminProvider";
import { BackLink, CheckRow, FORM_TITLE, Field, HELP, LABEL, TextInput } from "./fields";
import PhotoUploader from "./PhotoUploader";
import ProductThumb from "./ProductThumb";

const ALL_SIZES = Array.from({ length: 19 }, (_, i) => String(24 + i));

/** Crea (`/admin/categorias/nueva`) o edita (`/admin/categorias/<id>`) una categoría del borrador. */
export default function CategoryForm() {
  // /admin/categorias/nueva no tiene parámetro; /admin/categorias/<id> sí
  const { id = "nueva" } = useParams<{ id?: string }>();
  const creating = id === "nueva";
  const { draft, update } = useAdmin();
  const router = useRouter();
  const existing = draft.categories.find((c) => c.id === id);

  if (!creating && !existing) {
    return (
      <div style={{ paddingTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        <BackLink href="/admin/categorias">Todas las categorías</BackLink>
        <p style={{ margin: 0 }}>No encontré esa categoría.</p>
      </div>
    );
  }
  const initial: Category = existing ?? { id: "", name: "", description: "", palette: "lila-superficie", sizes: [] };
  return <Form key={id} initial={initial} creating={creating} update={update} takenIds={draft.categories.map((c) => c.id)} firstPhoto={draft.products.find((p) => p.cat === initial.id && p.photo)?.photo} onDone={() => router.push("/admin/categorias")} />;
}

function Form({ initial, creating, update, takenIds, firstPhoto, onDone }: { initial: Category; creating: boolean; update: ReturnType<typeof useAdmin>["update"]; takenIds: string[]; firstPhoto?: Photo; onDone: () => void }) {
  const [c, setC] = useState<Category>(initial);
  const [sized, setSized] = useState(initial.sizes.length > 0 || creating);
  const [palOpen, setPalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [problem, setProblem] = useState("");
  const pal = paletteOf(c.palette);
  const picked = ALL_SIZES.filter((z) => c.sizes.includes(z));

  async function save() {
    const name = c.name.trim();
    if (!name) return setProblem("Falta el nombre.");
    let id = initial.id;
    if (creating) {
      const base = slugify(name) || "categoria";
      id = base;
      for (let n = 2; takenIds.includes(id); n++) id = `${base}-${n}`;
    }
    setProblem("");
    setSaving(true);
    const saved: Category = { ...c, id, name, description: c.description.trim(), sizes: sized ? picked : [] };
    const ok = await update((cat) => ({ ...cat, categories: creating ? [...cat.categories, saved] : cat.categories.map((x) => (x.id === id ? saved : x)) }));
    setSaving(false);
    if (ok) onDone();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, paddingTop: 8 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <BackLink href="/admin/categorias">Todas las categorías</BackLink>
        <h2 style={FORM_TITLE}>{creating ? "Nueva categoría" : `Editar ${initial.name}`}</h2>
      </div>

      <div style={{ display: "flex", gap: "40px 56px", flexWrap: "wrap", alignItems: "flex-start" }}>
        <section aria-label="Datos de la categoría" style={{ flex: "1 1 360px", minWidth: 0, display: "flex", flexDirection: "column", gap: 28 }}>
          <Field label="Nombre" htmlFor="nombre">
            <TextInput id="nombre" value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} maxLength={60} />
          </Field>
          <Field label={<>Descripción corta <span style={{ fontWeight: 700, letterSpacing: ".04em", color: "#604872" }}>(opcional)</span></>} htmlFor="descripcion" help="Una frase. Sale debajo del nombre en la cabecera.">
            <TextInput id="descripcion" maxLength={60} placeholder="Más altura, mismo confort" value={c.description} onChange={(e) => setC({ ...c, description: e.target.value })} />
          </Field>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <span id="paleta-label" style={LABEL}>Paleta de colores</span>
            <div style={{ position: "relative", alignSelf: "flex-start", width: "min(320px, 100%)" }}>
              <button type="button" aria-haspopup="listbox" aria-expanded={palOpen} aria-labelledby="paleta-label" onClick={() => setPalOpen(!palOpen)} onKeyDown={(e) => e.key === "Escape" && setPalOpen(false)} className="hq-press" style={{ width: "100%", height: 52, boxSizing: "border-box", padding: "0 12px", display: "flex", alignItems: "center", gap: 12, border: "2px solid #E7D2F4", borderRadius: 6, background: "#F9F4FC", color: "#34184A", font: "inherit", fontWeight: 700, textAlign: "left", cursor: "pointer" }}>
                <span aria-hidden="true" style={{ flex: "none", width: 28, height: 28, boxSizing: "border-box", borderRadius: "50%", border: "2px solid rgba(52,24,74,.2)", background: pal.bg }} />
                <span style={{ flex: 1, minWidth: 0 }}>{pal.name}</span>
                <span style={{ fontSize: 13, color: "#604872", fontVariantNumeric: "tabular-nums" }}>{pal.bg}</span>
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
              </button>
              {palOpen && (
                <div role="listbox" aria-labelledby="paleta-label" className="hq-menu" onKeyDown={(e) => e.key === "Escape" && setPalOpen(false)} style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 30, width: "100%", boxSizing: "border-box", padding: 8, display: "flex", flexDirection: "column", gap: 2, borderRadius: 16, background: "#FFFFFF", boxShadow: "0 16px 44px rgba(52,24,74,.12), 0 0 0 1px rgba(52,24,74,.08)" }}>
                  {PALETTES.map((p) => (
                    <button key={p.id} type="button" role="option" aria-selected={p.id === c.palette} onClick={() => { setC({ ...c, palette: p.id }); setPalOpen(false); }} className="hq-opt" style={{ width: "100%", minHeight: 48, boxSizing: "border-box", padding: "0 12px", display: "flex", alignItems: "center", gap: 12, border: 0, borderRadius: 8, background: p.id === c.palette ? "#EDDDF7" : "transparent", color: "#34184A", font: "inherit", fontWeight: 700, textAlign: "left", cursor: "pointer" }}>
                      <span aria-hidden="true" style={{ flex: "none", width: 28, height: 28, boxSizing: "border-box", borderRadius: "50%", border: "2px solid rgba(52,24,74,.2)", background: p.bg }} />
                      <span style={{ flex: 1, minWidth: 0 }}>{p.name}</span>
                      <span style={{ fontSize: 13, color: "#604872", fontVariantNumeric: "tabular-nums" }}>{p.bg}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span style={HELP}>Solo colores del sistema. Pinta la cabecera y el círculo del inicio.</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <CheckRow checked={sized} onChange={() => setSized(!sized)} controls="tallas">Lleva tallas</CheckRow>
            {sized && (
              <div id="tallas" className="hq-open" style={{ display: "flex", flexDirection: "column", gap: 12, padding: 16, borderRadius: 16, background: "#F9F4FC" }}>
                <div role="group" aria-label="Tallas de la categoría" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {ALL_SIZES.map((z) => (
                    <SizeButton key={z} size={z} active={c.sizes.includes(z)} onClick={() => setC((s) => ({ ...s, sizes: s.sizes.includes(z) ? s.sizes.filter((x) => x !== z) : [...s.sizes, z] }))} />
                  ))}
                </div>
                <span aria-live="polite" style={HELP}>
                  {picked.length === 0 ? "Marcá las tallas que ofrece esta categoría." : `${picked.length === 1 ? "1 talla marcada." : picked.length + " tallas marcadas."} Cada producto elige entre estas.`}
                </span>
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <span style={LABEL}>Foto</span>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <PhotoUploader label={c.photo ? "Reemplazar foto" : "Subir foto"} onUploaded={(photo) => setC({ ...c, photo })} />
              <span style={{ flex: "1 1 180px", ...HELP }}>Sale en el círculo de categorías del inicio. Si no subís una, se usa la de un producto.</span>
            </div>
          </div>
        </section>

        <section aria-label="Vista previa" aria-live="polite" style={{ flex: "999 1 460px", minWidth: 0, display: "flex", flexDirection: "column", gap: 28 }}>
          <h3 style={{ margin: 0, paddingBottom: 12, borderBottom: "3px solid #34184A", fontSize: 14, fontWeight: 900, letterSpacing: ".1em", textTransform: "uppercase" }}>Vista previa</h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#604872" }}>En el inicio</span>
            <div style={{ alignSelf: "flex-start", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "16px 20px", borderRadius: 16, background: "#FFFFFF", boxShadow: "0 16px 44px rgba(52,24,74,.12)" }}>
              <div aria-hidden="true" style={{ width: 88, height: 88, borderRadius: "50%", background: pal.bg, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {c.photo ?? firstPhoto ? <ProductThumb photo={c.photo ?? firstPhoto} body={pal.bg} bg={pal.bg} width={88} round /> : null}
              </div>
              <span style={{ maxWidth: 140, fontSize: 13, fontWeight: 900, letterSpacing: ".06em", textTransform: "uppercase", textAlign: "center", overflowWrap: "anywhere" }}>{c.name.trim() || "Nombre"}</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#604872" }}>En el catálogo</span>
            <div style={{ minHeight: 220, boxSizing: "border-box", padding: "clamp(24px,4vw,40px)", borderRadius: 28, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 10, background: pal.bg, color: pal.ink }}>
              <span className="display" style={{ lineHeight: 1, fontSize: "clamp(48px,6vw,88px)", overflowWrap: "anywhere" }}>{c.name.trim() || "Nombre"}</span>
              {c.description.trim() && <span style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.4 }}>{c.description}</span>}
              <span style={{ fontSize: 17, color: pal.sub }}>0 modelos</span>
            </div>
            {sized && picked.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: "12px 16px", flexWrap: "wrap", padding: 16, borderRadius: 16, background: "#F9F4FC" }}>
                <span style={{ fontSize: 13, fontWeight: 900, letterSpacing: ".1em", textTransform: "uppercase" }}>Talla</span>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {picked.map((z) => (
                    <span key={z} style={{ width: 44, height: 44, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #E7D2F4", borderRadius: "50%", background: "#FFFFFF", fontSize: 14, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{z}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px 20px", flexWrap: "wrap", paddingTop: 24, borderTop: "2px solid #F3E8F9" }}>
        <Button onClick={() => void save()} disabled={saving} style={{ height: 56, padding: "0 24px" }}>{saving ? "Guardando…" : "Guardar borrador"}</Button>
        <Button href="/admin/categorias" variant="outline" style={{ height: 52, minHeight: 52, padding: "0 20px", fontSize: 14 }}>Cancelar</Button>
        {problem && <span role="alert" style={{ fontSize: 15, fontWeight: 800, color: "#8A43B5" }}>{problem}</span>}
      </div>
    </div>
  );
}
