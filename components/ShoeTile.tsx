import { tintOf, type Product } from "@/data/store";
import ShoeImage from "./ShoeImage";

/** Caja de color con la foto del modelo (tarjeta del catálogo y elementos de la lista). */
export default function ShoeTile({ product, ratio, width, hover = false, children }: { product: Product; ratio: string; width: string; hover?: boolean; children?: React.ReactNode }) {
  return (
    <div style={{ position: "relative", borderRadius: 8, overflow: "hidden", aspectRatio: ratio, background: tintOf(product.body), display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className={hover ? "hq-shoe" : undefined} style={{ width }}>
        <ShoeImage
          photo={product.photo}
          alt={hover ? `${product.name} ${product.color}` : ""}
          rotate={hover ? -8 : -6}
          shadow={hover ? "drop-shadow(0 16px 14px rgba(52,24,74,.2))" : undefined}
          sizes={hover ? "(max-width: 600px) 50vw, 340px" : "80px"}
        />
      </div>
      {children}
    </div>
  );
}
