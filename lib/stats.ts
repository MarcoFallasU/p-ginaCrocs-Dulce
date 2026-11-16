import { PRICE_RANGES } from "./catalog-utils";
import type { Catalog, EventType, StatEvent } from "./types";

export type GroupId = "categoria" | "color" | "precio" | "talla" | "filtro";

export const GROUP_NAMES: Record<GroupId, string> = {
  categoria: "Categoría",
  color: "Color",
  precio: "Rango de precio",
  talla: "Talla",
  filtro: "Filtro usado",
};

export const EVENT_NAMES: Record<string, string> = {
  quiero: "«Lo quiero»",
  quitar: "Quitar de la lista",
  pedir: "«Pedir por WhatsApp»",
  vistas: "Vistas de categoría",
  filtros: "Filtros usados",
};

export interface StatsQuery {
  event: string;
  /** Id de categoría o "todas". */
  cat: string;
  group?: string;
  weeks: number;
  product?: string;
}

export interface StatsResult {
  groupOptions: { id: GroupId; label: string }[];
  group: GroupId;
  hint: string;
  chartTitle: string;
  total: number;
  rows: { label: string; value: number }[];
  funnel: { label: string; value: number }[];
  /** Cantidad de eventos registrados en el periodo (para mostrar el estado vacío). */
  eventsInPeriod: number;
}

const WEEK = 7 * 24 * 3600 * 1000;

/**
 * Las estadísticas se agrupan por atributos del producto, no por conceptos fijos de zapatos:
 * la lista de atributos sale de la categoría (la talla solo existe si la categoría lleva tallas).
 */
export function groupOptionsFor(event: string, catId: string, catalog: Catalog): GroupId[] {
  if (event === "vistas") return ["categoria"];
  if (event === "filtros") return ["filtro"];
  if (catId === "todas") return ["categoria", "color", "precio", ...(catalog.categories.some((c) => c.sizes.length) ? (["talla"] as GroupId[]) : [])];
  const cat = catalog.categories.find((c) => c.id === catId);
  return ["color", "precio", ...(cat && cat.sizes.length ? (["talla"] as GroupId[]) : [])];
}

export function computeStats(events: StatEvent[], catalog: Catalog, q: StatsQuery, now = Date.now()): StatsResult {
  const since = now - q.weeks * WEEK;
  const inPeriod = events.filter((e) => e.t >= since);
  const options = groupOptionsFor(q.event, q.cat, catalog);
  const group = (options.includes(q.group as GroupId) ? q.group : options[0]) as GroupId;
  const cat = catalog.categories.find((c) => c.id === q.cat);
  const all = q.cat === "todas" || !cat;
  const catList = all ? catalog.categories : [cat!];

  // Etiquetas conocidas (para mostrar también lo que nadie tocó) y orden natural
  let known: string[] = [];
  let ordered = false;
  if (group === "categoria") known = catalog.categories.map((c) => c.name);
  else if (group === "color") known = [...new Set(catalog.products.filter((p) => all || p.cat === cat!.id).map((p) => p.color).filter(Boolean))];
  else if (group === "precio") { known = PRICE_RANGES; ordered = true; }
  else if (group === "talla") {
    known = [...new Set(catList.flatMap((c) => c.sizes))].sort((a, b) => Number(a) - Number(b));
    ordered = true;
  } else if (group === "filtro") known = ["Categoría", "Talla"];

  const counts = new Map<string, number>(known.map((k) => [k, 0]));
  const relevant = inPeriod.filter((e) => e.type === (q.event as EventType) && (e.type === "vistas" || e.type === "filtros" || all || e.attrs?.categoria === cat!.name));
  for (const e of relevant) {
    const label = group === "filtro" || (group === "categoria" && e.type === "vistas") ? e.detail : e.attrs?.[group as keyof NonNullable<StatEvent["attrs"]>];
    if (!label) continue;
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  let rows = [...counts].map(([label, value]) => ({ label, value }));
  if (!ordered) rows = rows.sort((a, b) => b.value - a.value);

  const countOf = (type: EventType) => inPeriod.filter((e) => e.type === type && e.productId === q.product).length;
  const funnel = [
    { label: "Vistas", value: countOf("vista_producto") },
    { label: "«Lo quiero»", value: countOf("quiero") },
    { label: "«Pedir por WhatsApp»", value: countOf("pedir") },
  ];

  let hint: string;
  if (q.event === "vistas") hint = "Las vistas se cuentan por categoría.";
  else if (q.event === "filtros") hint = "Los filtros se cuentan por tipo de filtro.";
  else if (all) hint = "Con todas las categorías, «Talla» solo cuenta las que llevan tallas.";
  else hint = `${cat!.name} tiene estos atributos: ${options.map((o) => GROUP_NAMES[o].toLowerCase()).join(", ")}.`;

  return {
    groupOptions: options.map((id) => ({ id, label: GROUP_NAMES[id] })),
    group,
    hint,
    chartTitle: `${EVENT_NAMES[q.event] ?? q.event} por ${GROUP_NAMES[group].toLowerCase()} en ${all ? "todas las categorías" : cat!.name}`,
    total: rows.reduce((t, r) => t + r.value, 0),
    rows,
    funnel,
    eventsInPeriod: inPeriod.length,
  };
}
