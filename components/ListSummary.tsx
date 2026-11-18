import { PRICE_PLACEHOLDER } from "@/data/store";
import type { Product } from "@/lib/types";
import ShoeTile from "./ShoeTile";

/** Lista de productos de un enlace compartido (la ve quien recibe el mensaje). */
export default function ListSummary({ rows }: { rows: { product: Product; size: string }[] }) {
  if (rows.length === 0) return <p style={{ margin: 0, color: "#604872" }}>Esta lista está vacía o los modelos ya no están disponibles.</p>;
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {rows.map(({ product: p, size }) => (
        <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 0", borderBottom: "1px solid #F3E8F9" }}>
          <div style={{ width: 96, flex: "none" }}>
            <ShoeTile product={p} ratio="100/80" width="84%" />
          </div>
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
            <strong style={{ fontSize: 16, fontWeight: 800, letterSpacing: ".03em", textTransform: "uppercase" }}>{p.name}</strong>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#604872" }}>{p.color + (size ? ` · Talla ${size}` : "")}</span>
          </div>
          <span style={{ fontSize: 16, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{p.price || PRICE_PLACEHOLDER}</span>
        </div>
      ))}
    </div>
  );
}
