import { NextResponse } from "next/server";
import { repo } from "@/lib/db";
import { priceRange } from "@/lib/catalog-utils";
import type { EventType, StatEvent } from "@/lib/types";

const TYPES: EventType[] = ["vista_producto", "vistas", "quiero", "quitar", "pedir", "filtros"];

/** Público y anónimo: registra qué hace la gente en la tienda. No guarda datos personales. */
export async function POST(req: Request) {
  let body: { type?: string; productId?: string; size?: string; detail?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Evento inválido" }, { status: 400 });
  }
  if (!body.type || !TYPES.includes(body.type as EventType)) {
    return NextResponse.json({ error: "Evento inválido" }, { status: 400 });
  }

  const event: StatEvent = { t: Date.now(), type: body.type as EventType };
  if (typeof body.detail === "string") event.detail = body.detail.slice(0, 60);

  if (typeof body.productId === "string") {
    // Los atributos se leen del catálogo, no del navegador, para que no se puedan falsear.
    const catalog = await repo.getPublished();
    const p = catalog.products.find((x) => x.id === body.productId);
    if (!p) return NextResponse.json({ ok: true });
    const cat = catalog.categories.find((c) => c.id === p.cat);
    event.productId = p.id;
    event.attrs = {
      categoria: cat?.name ?? p.cat,
      color: p.color,
      precio: priceRange(p.price),
      ...(typeof body.size === "string" && p.sizes.includes(body.size) ? { talla: body.size } : {}),
    };
  }

  await repo.addEvents([event]);
  return NextResponse.json({ ok: true });
}
