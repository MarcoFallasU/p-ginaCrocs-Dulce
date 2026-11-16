"use client";

import { useEffect, useRef } from "react";
import { PRICE_PLACEHOLDER } from "@/data/store";
import { trackOnce } from "@/lib/track";
import type { StoreProduct } from "@/lib/types";
import { useList } from "@/context/ListContext";
import Button from "./Button";
import { CheckIcon, PlusIcon } from "./Icons";
import ShoeTile from "./ShoeTile";
import SizeButton from "./SizeButton";

interface Props {
  product: StoreProduct;
  /** Talla filtrada en el catálogo: se usa como talla por defecto si el modelo la tiene. */
  filterSize?: string;
  animation?: "reveal" | "pop";
}

export default function ProductCard({ product: p, filterSize = "", animation }: Props) {
  const { inList, chosenSize, selectSize, add, remove, justAdded } = useList();
  const chosen = chosenSize(p, filterSize);
  const listed = inList(p.id);
  const ref = useRef<HTMLElement>(null);
  const cls = "hq-tile hq-card" + (animation === "reveal" ? " hq-reveal" : animation === "pop" ? " hq-pop-card" : "");

  // Cuenta una vista de producto la primera vez que la tarjeta entra en pantalla (una por sesión)
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        trackOnce("p:" + p.id, { type: "vista_producto", productId: p.id });
        io.disconnect();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [p.id]);

  return (
    <article ref={ref} className={cls} style={{ background: "#FFFFFF", border: "1px solid #F5EBFA", borderRadius: 12, padding: 12, display: "flex", flexDirection: "column", gap: 16, boxShadow: "0 10px 30px rgba(52,24,74,.06)" }}>
      <ShoeTile product={p} ratio="100/72" width="76%" hover>
        {p.isNew && (
          <span className="hq-badge" style={{ position: "absolute", left: 12, top: 12, background: "#34184A", color: "#D6B1EC", fontSize: 12, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase", padding: "7px 12px", borderRadius: 4 }}>
            Nuevo
          </span>
        )}
      </ShoeTile>

      <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "0 4px" }}>
        <h3 className="hq-cname" style={{ margin: 0, fontSize: 16, fontWeight: 800, letterSpacing: ".03em", textTransform: "uppercase", lineHeight: 1.25 }}>{p.name}</h3>
        <div className="hq-cmeta" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, color: "#604872" }}>
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" style={{ flex: "none" }}>
            <circle cx="7" cy="7" r="6" fill={p.body} stroke="#34184A" strokeOpacity=".4" strokeWidth="1.5" />
          </svg>
          <span>{p.color} · {p.catName}</span>
        </div>
      </div>

      {p.sizes.length > 0 && (
        <div role="group" className="hq-sizes" aria-label={`Tallas de ${p.name} ${p.color}`} style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "0 4px" }}>
          {p.sizes.map((z) => (
            <SizeButton key={z} size={z} className="hq-size" active={z === chosen} onClick={() => selectSize(p.id, z)} />
          ))}
        </div>
      )}

      <div className="hq-cfoot" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: "auto", padding: 4 }}>
        <span className="hq-price" style={{ fontSize: 20, fontWeight: 800, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{p.price || PRICE_PLACEHOLDER}</span>
        {listed ? (
          <Button variant="primary" className={`hq-cbtn${justAdded === p.id ? " hq-added" : ""}`} style={{ color: "#D6B1EC", minHeight: 46, padding: "0 16px", gap: 8, fontSize: 14, letterSpacing: ".04em" }} onClick={() => remove(p.id)} aria-label={`En tu lista. Tocá para quitar ${p.name} ${p.color}`}>
            <CheckIcon />En tu lista
          </Button>
        ) : (
          <Button variant="soft" className="hq-cbtn" onClick={() => add(p, filterSize)}>
            <PlusIcon />Lo quiero
          </Button>
        )}
      </div>
    </article>
  );
}
