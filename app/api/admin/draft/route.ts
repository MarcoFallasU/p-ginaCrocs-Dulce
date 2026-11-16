import { NextResponse } from "next/server";
import { repo } from "@/lib/db";
import { sanitizeCatalog } from "@/lib/validate";

// TODO(auth): todo lo que cuelga de /api/admin y /admin debe pedir sesión cuando se implemente la autenticación.

/** Borrador actual (o el publicado si no hay cambios) junto con lo publicado. */
export async function GET() {
  const [published, draft] = await Promise.all([repo.getPublished(), repo.getDraft()]);
  return NextResponse.json({ published, draft: draft ?? published });
}

export async function PUT(req: Request) {
  try {
    const catalog = sanitizeCatalog(await req.json());
    await repo.saveDraft(catalog);
    return NextResponse.json({ draft: catalog });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "No se pudo guardar" }, { status: 400 });
  }
}
