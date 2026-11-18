"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useList } from "@/context/ListContext";
import Logo from "./Logo";
import { BagIcon } from "./Icons";

const NAVLINK: React.CSSProperties = { color: "#34184A", minHeight: 44, display: "inline-flex", alignItems: "center" };
const CURRENT: React.CSSProperties = { ...NAVLINK, textDecoration: "underline", textUnderlineOffset: 6, textDecorationThickness: 2 };

export default function Header() {
  const pathname = usePathname();
  const inCatalog = pathname.startsWith("/catalogo");
  const { items, openDrawer, bumpKey } = useList();

  return (
    <header className="hq-bar">
      <div className="hq-head">
        <Link href="/" className="hq-logo" aria-label="Dulce Crocs, ir al inicio" style={{ display: "flex", alignItems: "center", gap: 10, minHeight: 44, textDecoration: "none", color: "#34184A" }}>
          <Logo size={48} />
        </Link>
        <nav className="hq-nav" aria-label="Principal" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0 28px", fontSize: 13, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" }}>
          {inCatalog && <Link href="/" className="hq-link" style={NAVLINK}>Inicio</Link>}
          <Link href="/catalogo" className={inCatalog ? undefined : "hq-link"} aria-current={inCatalog ? "page" : undefined} style={inCatalog ? CURRENT : NAVLINK}>Catálogo</Link>
          <Link href="/#pedir" className="hq-link" style={NAVLINK}>Cómo pedir</Link>
        </nav>
        <button type="button" onClick={openDrawer} aria-haspopup="dialog" className="hq-cart hq-press" style={{ border: 0, cursor: "pointer", background: "#34184A", color: "#FFFFFF", minHeight: 44, padding: "0 8px 0 14px", borderRadius: 6, display: "inline-flex", alignItems: "center", gap: 10, fontSize: 13, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" }}>
          <BagIcon />Mi lista{" "}
          <span key={bumpKey} className={bumpKey ? "hq-bump" : undefined} style={{ minWidth: 28, height: 28, padding: "0 8px", borderRadius: 4, background: "#B571DC", color: "#34184A", fontSize: 14, fontWeight: 800, letterSpacing: 0, fontVariantNumeric: "tabular-nums", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            {items.length}
          </span>
        </button>
      </div>
    </header>
  );
}
