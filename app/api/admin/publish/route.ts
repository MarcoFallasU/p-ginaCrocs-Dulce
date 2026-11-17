import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { repo } from "@/lib/db";
import { CATALOG_TAG } from "@/lib/storefront";

export async function POST() {
  try {
    await repo.publish();
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "No se pudo publicar" }, { status: 500 });
  }
  // El siguiente visitante ya ve el catálogo nuevo
  revalidateTag(CATALOG_TAG, { expire: 0 });
  return NextResponse.json({ ok: true });
}
