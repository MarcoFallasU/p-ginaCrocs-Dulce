"use client";

import { useEffect, useState } from "react";
import type { StatsResult } from "@/lib/stats";
import { useAdmin } from "./AdminProvider";
import { Field, SelectInput } from "./fields";

const fmt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const H2: React.CSSProperties = { margin: 0, fontSize: 20, fontWeight: 900, letterSpacing: ".03em", textTransform: "uppercase", lineHeight: 1.25 };

function Bars({ rows, height, label }: { rows: { label: string; value: number; note?: string }[]; height: number; label: string }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  const total = rows.reduce((t, r) => t + r.value, 0);
  return (
    <div role="table" aria-label={label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {rows.map((r) => (
        <div key={r.label} role="row" title={`${r.label}: ${fmt(r.value)}${total ? ` (${Math.round((r.value / total) * 100)} %)` : ""}`} className="hq-row" style={{ display: "flex", alignItems: "center", gap: 16, minHeight: height + 24, padding: "0 8px", margin: "0 -8px", borderRadius: 6 }}>
          <span role="cell" style={{ flex: "0 0 clamp(110px,18vw,190px)", fontSize: 15, fontWeight: 800 }}>{r.label}</span>
          <span role="cell" style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 10 }}>
            <span aria-hidden="true" className="hq-stat" style={{ height, minWidth: 4, borderRadius: "0 4px 4px 0", background: "#34184A", width: `${(r.value / max) * 82}%` }} />
            <span style={{ flex: "none", display: "flex", flexDirection: "column", lineHeight: 1.25 }}>
              <span style={{ fontSize: 15, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{fmt(r.value)}</span>
              {r.note && <span style={{ fontSize: 13, color: "#604872" }}>{r.note}</span>}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

export default function StatsView() {
  const { draft } = useAdmin();
  const [q, setQ] = useState({ event: "quiero", cat: "todas", group: "", weeks: "4", product: "" });
  const [data, setData] = useState<StatsResult | null>(null);
  const [failed, setFailed] = useState(false);
  const product = q.product || draft.products[0]?.id || "";

  useEffect(() => {
    const ctrl = new AbortController();
    const params = new URLSearchParams({ event: q.event, cat: q.cat, weeks: q.weeks, product });
    if (q.group) params.set("group", q.group);
    fetch(`/api/admin/stats?${params}`, { signal: ctrl.signal, cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: StatsResult) => { setData(d); setFailed(false); })
      .catch((e) => { if (e?.name !== "AbortError") setFailed(true); });
    return () => ctrl.abort();
  }, [q.event, q.cat, q.group, q.weeks, product]);

  const set = (k: keyof typeof q) => (e: React.ChangeEvent<HTMLSelectElement>) => setQ((s) => ({ ...s, [k]: e.target.value }));
  const funnel = data?.funnel ?? [];
  const base = funnel[0]?.value ?? 0;
  const pct = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)} % del paso anterior` : "");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 48, paddingTop: 16 }}>
      <section aria-label="Consulta" style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <p style={{ margin: 0, fontSize: 15, color: "#604872" }}>Los eventos son anónimos y guardan los atributos del producto en ese momento.</p>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
          <Field label="Qué se mide" htmlFor="evento">
            <SelectInput id="evento" value={q.event} onChange={(e) => setQ((s) => ({ ...s, event: e.target.value, group: "" }))}>
              <option value="quiero">«Lo quiero»</option>
              <option value="quitar">Quitar de la lista</option>
              <option value="pedir">«Pedir por WhatsApp»</option>
              <option value="vistas">Vistas de categoría</option>
              <option value="filtros">Filtros usados</option>
            </SelectInput>
          </Field>
          <Field label="Categoría" htmlFor="cat">
            <SelectInput id="cat" value={q.cat} onChange={(e) => setQ((s) => ({ ...s, cat: e.target.value, group: "" }))}>
              <option value="todas">Todas</option>
              {draft.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </SelectInput>
          </Field>
          <Field label="Agrupar por" htmlFor="grupo">
            <SelectInput id="grupo" value={data?.group ?? ""} onChange={set("group")} style={{ borderColor: "#34184A", background: "#FFFFFF", fontWeight: 800 }}>
              {(data?.groupOptions ?? []).map((g) => <option key={g.id} value={g.id}>{g.label}</option>)}
            </SelectInput>
          </Field>
          <Field label="Periodo" htmlFor="periodo">
            <SelectInput id="periodo" value={q.weeks} onChange={set("weeks")}>
              <option value="1">Esta semana</option>
              <option value="4">Últimas 4 semanas</option>
              <option value="12">Últimos 3 meses</option>
            </SelectInput>
          </Field>
        </div>
        {data && <p style={{ margin: "-12px 0 0", fontSize: 15, color: "#604872" }}>{data.hint}</p>}
        {failed && <p role="alert" style={{ margin: 0, fontWeight: 700, color: "#8A43B5" }}>No se pudieron cargar las estadísticas.</p>}

        {data && (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap", paddingBottom: 12, borderBottom: "3px solid #34184A" }}>
              <h2 style={H2}>{data.chartTitle}</h2>
              <span aria-live="polite" style={{ fontSize: 15, fontWeight: 800, color: "#604872", fontVariantNumeric: "tabular-nums" }}>{fmt(data.total)} en total</span>
            </div>
            {data.eventsInPeriod === 0 && <p style={{ margin: "12px 0 0", color: "#604872" }}>Todavía no hay eventos en este periodo. Aparecen cuando la gente usa la tienda.</p>}
            {data.rows.length > 0 && <Bars rows={data.rows} height={20} label={data.chartTitle} />}
          </div>
        )}
      </section>

      <section aria-label="Embudo por producto" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", paddingBottom: 12, borderBottom: "3px solid #34184A" }}>
          <h2 style={H2}>Embudo por producto</h2>
          <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase" }}>
            Producto
            <SelectInput value={product} onChange={set("product")} style={{ height: 48, fontSize: 16, letterSpacing: 0, textTransform: "none" }}>
              {draft.products.map((p) => <option key={p.id} value={p.id}>{p.name} {p.color}</option>)}
            </SelectInput>
          </label>
        </div>
        {data && (
          <Bars
            label="Embudo"
            height={32}
            rows={funnel.map((f, i) => ({ label: f.label, value: f.value, note: i === 0 ? "" : pct(f.value, funnel[i - 1].value) }))}
          />
        )}
        {base === 0 && data && <p style={{ margin: 0, color: "#604872" }}>Este producto todavía no tiene vistas en el periodo.</p>}
        <p style={{ margin: 0, maxWidth: 640, fontSize: 15, color: "#604872" }}>Un clic en «Pedir por WhatsApp» cuenta como intención de compra. Todavía no es una venta confirmada.</p>
      </section>
    </div>
  );
}
