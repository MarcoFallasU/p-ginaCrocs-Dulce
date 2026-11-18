import { ImageResponse } from "next/og";
import sharp from "sharp";
import { tintOf } from "@/data/store";
import { repo } from "@/lib/db";
import { decodeItems } from "@/lib/share";

const MAX_TILES = 6;

/** Descarga la foto del producto y la devuelve como PNG en data URI (satori no lee WebP). */
async function photoDataUri(src: string, origin: string): Promise<string | null> {
  try {
    const res = await fetch(new URL(src, origin));
    if (!res.ok) return null;
    const png = await sharp(Buffer.from(await res.arrayBuffer())).resize({ width: 420, withoutEnlargement: true }).png().toBuffer();
    return "data:image/png;base64," + png.toString("base64");
  } catch {
    return null;
  }
}

/** Imagen 1200×630 con los productos de la lista: es la miniatura que WhatsApp muestra junto al enlace. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const items = decodeItems(url.searchParams.get("items"));
  const catalog = await repo.getPublished();
  const byId = new Map(catalog.products.map((p) => [p.id, p]));
  const chosen = items.flatMap((i) => (byId.has(i.pid) ? [{ product: byId.get(i.pid)!, size: i.size }] : []));
  const shown = chosen.slice(0, MAX_TILES);
  const extra = chosen.length - shown.length;
  const photos = await Promise.all(shown.map((c) => (c.product.photo ? photoDataUri(c.product.photo.src, url.origin) : null)));

  const cols = shown.length <= 3 ? Math.max(shown.length, 1) : 3;
  const rows = shown.length > 3 ? 2 : 1;
  const gap = 20;
  const tileW = Math.floor((1200 - 80 - gap * (cols - 1)) / cols);
  const tileH = Math.floor((630 - 150 - gap * (rows - 1)) / rows);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#F3E8F9", color: "#34184A", padding: "36px 40px 40px", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", height: 74 }}>
          <div style={{ display: "flex", fontSize: 52, fontWeight: 800 }}>Mi lista de Crocs</div>
          <div style={{ display: "flex", fontSize: 28, fontWeight: 700, color: "#604872" }}>
            {(chosen.length === 1 ? "1 modelo" : `${chosen.length} modelos`) + (extra > 0 ? ` · +${extra} más` : "")}
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap }}>
          {shown.map((c, i) => (
            <div key={c.product.id} style={{ display: "flex", flexDirection: "column", width: tileW, height: tileH, background: "#FFFFFF", borderRadius: 20, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, background: tintOf(c.product.body) }}>
                {photos[i] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photos[i]!} alt="" style={{ height: "86%", maxWidth: "88%", objectFit: "contain" }} />
                ) : (
                  <div style={{ display: "flex", width: "50%", height: "40%", borderRadius: 60, background: c.product.body }} />
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", padding: "8px 16px 10px" }}>
                <div style={{ display: "flex", fontSize: 24, fontWeight: 800, textTransform: "uppercase" }}>{c.product.name}</div>
                <div style={{ display: "flex", fontSize: 22, fontWeight: 600, color: "#604872" }}>{c.product.color + (c.size ? ` · Talla ${c.size}` : "")}</div>
              </div>
            </div>
          ))}
          {shown.length === 0 && <div style={{ display: "flex", fontSize: 36, color: "#604872" }}>Dulce Crocs</div>}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
