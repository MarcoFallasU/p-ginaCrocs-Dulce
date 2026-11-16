import Link from "next/link";
import { shownCategories } from "@/lib/catalog-utils";
import { paletteOf } from "@/lib/palettes";
import type { Category, StoreCatalog } from "@/lib/types";
import ShoeImage from "./ShoeImage";

function CategoryPicture({ cat, catalog }: { cat: Category | null; catalog: StoreCatalog }) {
  if (cat) {
    const photo = cat.photo ?? catalog.products.find((p) => p.cat === cat.id && p.photo)?.photo;
    if (!photo) return null;
    return <ShoeImage photo={photo} className="hq-shoe" sizes="80px" style={{ position: "relative", width: "78%" }} />;
  }
  // «Todos»: tres modelos apilados
  const [a, b, c] = catalog.products.filter((p) => p.photo);
  const abs = (css: React.CSSProperties): React.CSSProperties => ({ position: "absolute", ...css });
  return (
    <span className="hq-shoe" aria-hidden="true" style={{ position: "relative", display: "block", width: "100%", height: "100%" }}>
      {a?.photo && <ShoeImage photo={a.photo} rotate={-16} sizes="60px" style={abs({ left: "2%", top: "14%", width: "58%" })} />}
      {b?.photo && <ShoeImage photo={b.photo} rotate={12} sizes="60px" style={abs({ right: 0, top: "22%", width: "58%" })} />}
      {c?.photo && <ShoeImage photo={c.photo} rotate={-4} sizes="60px" style={abs({ left: "20%", bottom: "12%", width: "60%" })} />}
    </span>
  );
}

export default function CategoryNav({ catalog }: { catalog: StoreCatalog }) {
  const items: { id: string; label: string; cat: Category | null; bg: string }[] = [
    { id: "todos", label: "Todos", cat: null, bg: "#EDDDF7" },
    ...shownCategories(catalog).map((c) => ({ id: c.id, label: c.name, cat: c, bg: paletteOf(c.palette).bg })),
  ];
  return (
    <nav id="hq-catnav" aria-label="Categorías" style={{ position: "relative", margin: "-76px clamp(12px,4vw,56px) 0", background: "#FFFFFF", borderRadius: 16, boxShadow: "0 16px 44px rgba(52,24,74,.12)", padding: "16px 20px", display: "flex", flexWrap: "wrap", justifyContent: "space-around", gap: "8px 12px" }}>
      {items.map((c) => (
        <Link key={c.id} href={`/catalogo?cat=${c.id}`} className="hq-cat hq-press hq-pop" style={{ width: 104, padding: "6px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, textDecoration: "none", color: "#34184A" }}>
          <span style={{ position: "relative", width: 76, height: 76, borderRadius: "50%", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: c.bg }}>
            <CategoryPicture cat={c.cat} catalog={catalog} />
          </span>
          <span style={{ fontSize: 15, fontWeight: 600, color: "#604872" }}>{c.label}</span>
        </Link>
      ))}
    </nav>
  );
}
