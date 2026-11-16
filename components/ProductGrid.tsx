import type { StoreProduct } from "@/lib/types";
import ProductCard from "./ProductCard";

interface Props {
  products: StoreProduct[];
  minCard?: number;
  gap?: number;
  filterSize?: string;
  animation?: "reveal" | "pop";
}

export default function ProductGrid({ products, minCard = 280, gap = 20, filterSize, animation }: Props) {
  return (
    <div className="hq-grid" style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill,minmax(min(${minCard}px,100%),1fr))`, gap }}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} filterSize={filterSize} animation={animation} />
      ))}
    </div>
  );
}
