import { promises as fs } from "fs";
import path from "path";
import { put } from "@vercel/blob";
import sharp from "sharp";
import { NextResponse } from "next/server";

// Corre en el runtime Node por defecto (sharp no funciona en edge): no declarar `runtime = "edge"`.

// Las funciones de Vercel aceptan ~4,5 MB de cuerpo: dejamos margen.
const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

// TODO(admin): proteger este endpoint cuando exista el portal de administración.
export async function POST(req: Request) {
  let file: File | null = null;
  try {
    file = (await req.formData()).get("file") as File | null;
  } catch {
    return NextResponse.json({ error: "Formulario inválido" }, { status: 400 });
  }

  if (!file || !ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Archivo inválido: usá JPEG, PNG o WebP" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "La imagen supera los 4 MB" }, { status: 413 });
  }

  try {
    const input = Buffer.from(await file.arrayBuffer());
    const [main, thumb] = await Promise.all([
      sharp(input).rotate().resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer(),
      sharp(input).rotate().resize({ width: 400, withoutEnlargement: true }).webp({ quality: 75 }).toBuffer(),
    ]);

    const d = new Date();
    const dir = `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}`;
    const id = crypto.randomUUID();
    const { width = 0, height = 0 } = await sharp(main).metadata();
    const opts = { access: "public" as const, contentType: "image/webp", cacheControlMaxAge: 31536000 };

    // Sin token de Blob (desarrollo local) se guarda en public/uploads
    if (!process.env.BLOB_READ_WRITE_TOKEN && process.env.NODE_ENV !== "production") {
      const base = path.join(process.cwd(), "public", "uploads", dir);
      await fs.mkdir(base, { recursive: true });
      await Promise.all([fs.writeFile(path.join(base, id + ".webp"), main), fs.writeFile(path.join(base, id + "-thumb.webp"), thumb)]);
      return NextResponse.json({ url: `/uploads/${dir}/${id}.webp`, thumb: `/uploads/${dir}/${id}-thumb.webp`, width, height });
    }

    const [big, small] = await Promise.all([
      put(`${dir}/${id}.webp`, main, opts),
      put(`${dir}/${id}-thumb.webp`, thumb, opts),
    ]);
    return NextResponse.json({ url: big.url, thumb: small.url, width, height });
  } catch (e) {
    console.error("Error al subir imagen", e);
    return NextResponse.json({ error: "No se pudo procesar la imagen" }, { status: 500 });
  }
}
