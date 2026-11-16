import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { repo } from "@/lib/db";
import { CATALOG_TAG } from "@/lib/storefront";

export async function POST() {
  await repo.publish();
  // El siguiente visitante ya ve el catálogo nuevo
  revalidateTag(CATALOG_TAG, { expire: 0 });
  return NextResponse.json({ ok: true });
}
