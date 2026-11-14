"use client";

import Link from "next/link";
import { INSTAGRAM, whatsappDigits } from "@/data/store";
import { useList } from "@/context/ListContext";
import Dots from "./Dots";

const LINK: React.CSSProperties = { color: "#34184A", fontSize: 16, fontWeight: 600, minHeight: 40, display: "inline-flex", alignItems: "center" };

function Column({ title, label, children }: { title: string; label: string; children: React.ReactNode }) {
  return (
    <nav aria-label={label} style={{ display: "flex", flexDirection: "column" }}>
      <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 }}>{title}</span>
      {children}
    </nav>
  );
}

export default function Footer() {
  const { openDrawer } = useList();
  const num = whatsappDigits();
  const pretty = num.length === 11 && num.startsWith("506") ? `+506 ${num.slice(3, 7)} ${num.slice(7)}` : num ? "+" + num : "[número]";

  return (
    <footer style={{ background: "#FAF5FD" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 24px 28px", display: "flex", flexDirection: "column", gap: 36 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(200px,100%),1fr))", gap: "32px 40px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Dots />
            <span style={{ fontSize: 15, lineHeight: 1.5, fontWeight: 600, color: "#604872" }}>Pedís por WhatsApp y pagás por SINPE Móvil.</span>
          </div>
          <Column title="La tienda" label="La tienda">
            <Link href="/catalogo" className="hq-link" style={LINK}>Catálogo</Link>
            <Link href="/catalogo?cat=plataforma" className="hq-link" style={LINK}>Plataforma</Link>
            <Link href="/catalogo?cat=ninos" className="hq-link" style={LINK}>Niños</Link>
          </Column>
          <Column title="Ayuda" label="Ayuda">
            <Link href="/#pedir" className="hq-link" style={LINK}>Cómo pedir</Link>
            <button type="button" onClick={openDrawer} className="hq-link" style={{ ...LINK, background: "none", border: 0, padding: 0, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>Tu lista</button>
          </Column>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 }}>Escribime</span>
            {num ? (
              <a href={`https://wa.me/${num}`} target="_blank" rel="noopener" className="hq-link" style={LINK}>WhatsApp {pretty}</a>
            ) : (
              <Link href="/#pedir" className="hq-link" style={LINK}>WhatsApp {pretty}</Link>
            )}
            <span style={{ fontSize: 16, fontWeight: 600, minHeight: 40, display: "inline-flex", alignItems: "center" }}>Instagram {INSTAGRAM}</span>
          </div>
        </div>
        <p style={{ margin: 0, paddingTop: 20, borderTop: "1px solid #EDDDF7", fontSize: 13, lineHeight: 1.6, fontWeight: 600, color: "#604872" }}>
          Huequitos es una tienda independiente en Costa Rica, sin relación con Crocs, Inc. ni con sus distribuidores oficiales. Crocs es una marca registrada de Crocs, Inc.
        </p>
      </div>
    </footer>
  );
}
