"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/Button";
import ShoeTile from "@/components/ShoeTile";
import SizeButton from "@/components/SizeButton";
import { ALL_SIZES, priceNumber } from "@/lib/catalog-utils";
import type { Photo, Product } from "@/lib/types";
import { useAdmin } from "./AdminProvider";
import { BackLink, CheckRow, FORM_TITLE, Field, LABEL, SelectInput, TextInput } from "./fields";
import PhotoUploader from "./PhotoUploader";

const formatPrice = (text: string) => {
  const n = priceNumber(text);
  return n === null ? "" : "₡" + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

/** Crea (`/admin/productos/nuevo`) o edita (`/admin/productos/<id>`) un producto del borrador. */
export default function ProductForm() {
  // /admin/productos/nuevo no tiene parámetro; /admin/productos/<id> sí
  const { id = "nuevo" } = useParams<{ id?: string }>();
  const creating = id === "nuevo";
  const { draft, update } = useAdmin();
  const router = useRouter();
  const existing = draft.products.find((p) => p.id === id);

  if (!creating && !existing) {
    return (
      <div style={{ paddingTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        <BackLink href="/admin">Todos los productos</BackLink>
        <p style={{ margin: 0 }}>No encontré ese producto.</p>
      </div>
    );
  }
  const initial: Product = existing ?? { id: "", name: "", color: "", body: "#C3A1E0", cat: draft.categories[0]?.id ?? "", price: "", sizes: [], isNew: false, visible: true };
  return <Form key={id} initial={initial} creating={creating} update={update} categories={draft.categories} onDone={() => router.push("/admin")} />;
}

function Form({ initial, creating, update, categories, onDone }: { initial: Product; creating: boolean; update: ReturnType<typeof useAdmin>["update"]; categories: ReturnType<typeof useAdmin>["draft"]["categories"]; onDone: () => void }) {
  const [p, setP] = useState<Product>({ ...initial, price: initial.price.replace("₡", "") });
  const [saving, setSaving] = useState(false);
  const [problem, setProblem] = useState("");
  const set = <K extends keyof Product>(k: K, v: Product[K]) => setP((s) => ({ ...s, [k]: v }));
  const cat = categories.find((c) => c.id === p.cat);

  async function save() {
    if (!p.name.trim()) return setProblem("Falta el nombre.");
    if (!cat) return setProblem("Elegí una categoría.");
    setProblem("");
    setSaving(true);
    const saved: Product = { ...p, name: p.name.trim(), color: p.color.trim(), price: formatPrice(p.price), id: creating ? crypto.randomUUID().slice(0, 8) : p.id };
    const ok = await update((c) => ({ ...c, products: creating ? [...c.products, saved] : c.products.map((x) => (x.id === saved.id ? saved : x)) }));
    setSaving(false);
    if (ok) onDone();
  }

  if (categories.length === 0) {
    return (
      <div style={{ paddingTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        <BackLink href="/admin">Todos los productos</BackLink>
        <p style={{ margin: 0 }}>Antes de crear un producto necesitás al menos una categoría.</p>
        <Button href="/admin/categorias/nueva" style={{ alignSelf: "flex-start" }}>Crear categoría</Button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, paddingTop: 8 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <BackLink href="/admin">Todos los productos</BackLink>
        <h2 style={FORM_TITLE}>{creating ? "Nuevo producto" : `Editar ${initial.name} ${initial.color}`}</h2>
      </div>

      <div style={{ display: "flex", gap: 40, flexWrap: "wrap", alignItems: "flex-start" }}>
        <section aria-label="Foto" style={{ flex: "1 1 320px", maxWidth: 440, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ aspectRatio: "4 / 3" }}>
            <ShoeTile product={{ ...p, price: "" }} ratio="4 / 3" width="62%" />
          </div>
          <PhotoUploader label={p.photo ? "Reemplazar foto" : "Subir foto"} onUploaded={(photo: Photo) => set("photo", photo)} />
        </section>

        <section aria-label="Datos del producto" style={{ flex: "999 1 420px", minWidth: 0, display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <Field label="Nombre" htmlFor="nombre">
              <TextInput id="nombre" value={p.name} onChange={(e) => set("name", e.target.value)} maxLength={80} />
            </Field>
            <Field label="Color" htmlFor="color">
              <div style={{ display: "flex", gap: 8 }}>
                <TextInput id="color" value={p.color} onChange={(e) => set("color", e.target.value)} maxLength={40} style={{ flex: 1 }} />
                <input type="color" aria-label="Color real del zapato" value={p.body} onChange={(e) => set("body", e.target.value.toUpperCase())} style={{ flex: "none", width: 52, height: 52, boxSizing: "border-box", padding: 4, border: "2px solid #E7D2F4", borderRadius: 6, background: "#F9F4FC", cursor: "pointer" }} />
              </div>
            </Field>
          </div>

          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <Field label="Categoría" htmlFor="categoria">
              <SelectInput id="categoria" value={p.cat} onChange={(e) => setP((s) => ({ ...s, cat: e.target.value, sizes: [] }))}>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </SelectInput>
            </Field>
            <Field label="Precio" htmlFor="precio">
              <div style={{ display: "flex", alignItems: "center", gap: 8, height: 52, boxSizing: "border-box", padding: "0 14px", border: "2px solid #E7D2F4", borderRadius: 6, background: "#F9F4FC" }}>
                <span aria-hidden="true" style={{ fontWeight: 800 }}>₡</span>
                <TextInput id="precio" inputMode="numeric" placeholder="25.000" value={p.price} onChange={(e) => set("price", e.target.value)} style={{ flex: 1, height: "auto", border: 0, background: "transparent", padding: 0, fontWeight: 800, fontVariantNumeric: "tabular-nums" }} />
              </div>
            </Field>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <span id="tallas-label" style={LABEL}>Tallas disponibles</span>
            {cat?.sized ? (
              <>
                <div role="group" aria-labelledby="tallas-label" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {ALL_SIZES.map((z) => (
                    <SizeButton key={z} size={z} active={p.sizes.includes(z)} onClick={() => setP((s) => ({ ...s, sizes: s.sizes.includes(z) ? s.sizes.filter((x) => x !== z) : [...s.sizes, z] }))} />
                  ))}
                </div>
              </>
            ) : (
              <p style={{ margin: 0, padding: "14px 16px", borderRadius: 8, background: "#F9F4FC", fontSize: 15, color: "#604872" }}>La categoría {cat?.name} no lleva tallas.</p>
            )}
          </div>

          <div style={{ display: "flex", gap: "12px 32px", flexWrap: "wrap" }}>
            <CheckRow checked={p.isNew} onChange={() => set("isNew", !p.isNew)}>Marcar como «Nuevo»</CheckRow>
            <CheckRow checked={p.visible} onChange={() => set("visible", !p.visible)}>Visible en la tienda</CheckRow>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px 20px", flexWrap: "wrap", paddingTop: 24, borderTop: "2px solid #F3E8F9" }}>
            <Button onClick={() => void save()} disabled={saving} style={{ height: 56, padding: "0 24px" }}>{saving ? "Guardando…" : "Guardar borrador"}</Button>
            <Button href="/admin" variant="outline" style={{ height: 52, minHeight: 52, padding: "0 20px", fontSize: 14 }}>Cancelar</Button>
            {problem && <span role="alert" style={{ fontSize: 15, fontWeight: 800, color: "#8A43B5" }}>{problem}</span>}
          </div>
        </section>
      </div>
    </div>
  );
}
