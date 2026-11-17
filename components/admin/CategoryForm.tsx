"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/Button";
import { slugify } from "@/lib/catalog-utils";
import { DEFAULT_CATEGORY_COLOR, SUGGESTED_COLORS, colorsOf, isHex } from "@/lib/palettes";
import type { Category, Photo } from "@/lib/types";
import { useAdmin } from "./AdminProvider";
import { BackLink, CheckRow, FORM_TITLE, Field, LABEL, TextInput } from "./fields";
import PhotoUploader from "./PhotoUploader";
import ProductThumb from "./ProductThumb";

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
  const initial: Category = existing ?? { id: "", name: "", description: "", color: DEFAULT_CATEGORY_COLOR, sized: true };
  return <Form key={id} initial={initial} creating={creating} update={update} takenIds={draft.categories.map((c) => c.id)} firstPhoto={draft.products.find((p) => p.cat === initial.id && p.photo)?.photo} onDone={() => router.push("/admin/categorias")} />;
}

function Form({ initial, creating, update, takenIds, firstPhoto, onDone }: { initial: Category; creating: boolean; update: ReturnType<typeof useAdmin>["update"]; takenIds: string[]; firstPhoto?: Photo; onDone: () => void }) {
  const [c, setC] = useState<Category>(initial);
  const [sized, setSized] = useState(initial.sized || creating);
  const [saving, setSaving] = useState(false);
  const [problem, setProblem] = useState("");
  const pal = colorsOf(c.color);
  const [hexText, setHexText] = useState(pal.bg);
  const pick = (hex: string) => { setC((s) => ({ ...s, color: hex.toUpperCase() })); setHexText(hex.toUpperCase()); };

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
    const saved: Category = { ...c, id, name, description: c.description.trim(), sized };
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
          <Field label={<>Descripción corta <span style={{ fontWeight: 700, letterSpacing: ".04em", color: "#604872" }}>(opcional)</span></>} htmlFor="descripcion">
            <TextInput id="descripcion" maxLength={60} placeholder="Más altura, mismo confort" value={c.description} onChange={(e) => setC({ ...c, description: e.target.value })} />
          </Field>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <span id="color-label" style={LABEL}>Color de la categoría</span>
            <div role="group" aria-labelledby="color-label" style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <input type="color" aria-label="Elegir color" value={pal.bg.toLowerCase()} onChange={(e) => pick(e.target.value)} className="hq-field" style={{ flex: "none", width: 72, height: 52, boxSizing: "border-box", padding: 4, border: "2px solid #E7D2F4", borderRadius: 6, background: "#F9F4FC", cursor: "pointer" }} />
              <TextInput aria-label="Código del color (hex)" value={hexText} onChange={(e) => { setHexText(e.target.value); if (isHex(e.target.value)) setC((s) => ({ ...s, color: e.target.value.toUpperCase() })); }} onBlur={() => setHexText(pal.bg)} maxLength={7} spellCheck={false} style={{ width: 120, fontVariantNumeric: "tabular-nums", textTransform: "uppercase" }} />
            </div>
            <div role="group" aria-label="Colores sugeridos" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {SUGGESTED_COLORS.map((s) => (
                <button key={s.hex} type="button" aria-label={s.name} aria-pressed={s.hex === pal.bg} title={s.name} onClick={() => pick(s.hex)} className="hq-press" style={{ width: 36, height: 36, boxSizing: "border-box", borderRadius: "50%", border: s.hex === pal.bg ? "3px solid #34184A" : "2px solid rgba(52,24,74,.2)", background: s.hex, cursor: "pointer" }} />
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <CheckRow checked={sized} onChange={() => setSized(!sized)}>Lleva tallas</CheckRow>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <span style={LABEL}>Foto</span>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <PhotoUploader label={c.photo ? "Reemplazar foto" : "Subir foto"} onUploaded={(photo) => setC({ ...c, photo })} />
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
