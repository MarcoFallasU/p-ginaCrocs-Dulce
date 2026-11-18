import { tintOf } from "@/data/store";
import type { Product } from "@/lib/types";
import ShoeImage from "./ShoeImage";

/** Caja de color con la foto del modelo (tarjeta del catálogo y elementos de la lista). */
export default function ShoeTile({ product, ratio, width, hover = false, children }: { product: Product; ratio: string; width: string; hover?: boolean; children?: React.ReactNode }) {
  return (
    <div style={{ position: "relative", borderRadius: 8, overflow: "hidden", aspectRatio: ratio, background: tintOf(product.body), display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className={hover ? "hq-shoe" : undefined} style={{ width }}>
        {product.photo ? <ShoeImage
          photo={product.photo}
          alt={hover ? `${product.name} ${product.color}` : ""}
          rotate={0}
          shadow={hover ? "drop-shadow(0 16px 14px rgba(52,24,74,.2))" : undefined}
          sizes={hover ? "(max-width: 600px) 50vw, 340px" : "80px"}
        /> : <ShoePlaceholder color={product.body} />}
      </div>
      {children}
    </div>
  );
}

/** Marcador cuando un producto todavía no tiene foto. */
export function ShoePlaceholder({ color }: { color: string }) {
  return (
    <div aria-hidden="true" style={{ width: "100%", aspectRatio: "2 / 1", borderRadius: "58% 42% 46% 54% / 72% 64% 36% 28%", filter: "drop-shadow(0 6px 6px rgba(52,24,74,.2))", background: color }} />
  );
}
