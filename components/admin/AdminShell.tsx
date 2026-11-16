"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "@/components/Button";
import Dots from "@/components/Dots";
import { useAdmin } from "./AdminProvider";

const TABS = [
  { href: "/admin/productos", label: "Productos", icon: <path d="M3 12V4h8l10 10-8 8L3 12z M8 9h.01" /> },
  { href: "/admin/categorias", label: "Categorías", icon: <><rect x="4" y="4" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" /></> },
  { href: "/admin/destacados", label: "Destacados", icon: <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z" /> },
  { href: "/admin/estadisticas", label: "Estadísticas", icon: <path d="M5 20V10M12 20V4M19 20v-7" /> },
];

const TAB: React.CSSProperties = { flex: "none", width: 112, height: 68, boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, borderRadius: "16px 16px 0 0", background: "#EDDDF7", color: "#34184A", fontSize: 11, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", textDecoration: "none" };

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { changes, busy, publish, discard, error, ready } = useAdmin();
  const label = changes.count === 0 ? "Sin cambios por publicar" : changes.count === 1 ? "Borrador · 1 cambio sin publicar" : `Borrador · ${changes.count} cambios sin publicar`;

  return (
    <div style={{ minHeight: "100vh", boxSizing: "border-box", background: "#F3E8F9", color: "#34184A", fontWeight: 600, fontSize: 16, lineHeight: 1.5 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", boxSizing: "border-box", padding: "24px 24px 56px", display: "flex", flexDirection: "column" }}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", paddingBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Dots />
            <span style={{ fontSize: 13, fontWeight: 900, letterSpacing: ".1em", textTransform: "uppercase" }}>Administración</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span aria-live="polite" style={{ padding: "4px 10px", borderRadius: 4, background: changes.count ? "#FDEBA0" : "#EDDDF7", color: changes.count ? "#3B3A16" : "#604872", fontSize: 13, fontWeight: 800 }}>{label}</span>
            {changes.count > 0 && (
              <button type="button" onClick={() => { if (window.confirm("¿Descartar todos los cambios sin publicar?")) void discard(); }} disabled={busy} className="hq-text" style={{ minHeight: 44, padding: "0 4px", border: 0, background: "transparent", color: "#34184A", font: "inherit", fontSize: 15, fontWeight: 700, textDecoration: "underline", cursor: "pointer" }}>Descartar</button>
            )}
            <Button href="/admin/vista-previa" variant="outline" style={{ minHeight: 46, padding: "0 18px", fontSize: 13 }}>Vista previa</Button>
            <Button onClick={() => void publish()} disabled={busy || changes.count === 0} style={{ minHeight: 50, padding: "0 20px", fontSize: 13, opacity: changes.count === 0 ? 0.5 : 1 }}>{busy ? "Publicando…" : "Publicar"}</Button>
            {/* TODO(auth): aquí va «Cerrar sesión» cuando exista la autenticación */}
          </div>
        </header>

        <nav aria-label="Secciones del portal" style={{ display: "flex", alignItems: "flex-end", gap: 4, overflowX: "auto" }}>
          {TABS.map((t) => {
            const current = pathname.startsWith(t.href);
            return current ? (
              <Link key={t.href} href={t.href} aria-current="page" style={{ flex: "none", boxSizing: "border-box", padding: "24px clamp(20px,4vw,48px) 8px", borderRadius: "28px 28px 0 0", background: "#FFFFFF", color: "#34184A", textDecoration: "none" }}>
                <h1 className="display" style={{ margin: 0, lineHeight: 1, fontSize: "clamp(44px,5vw,76px)" }}>{t.label}</h1>
              </Link>
            ) : (
              <Link key={t.href} href={t.href} className="hq-tab" style={TAB}>
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">{t.icon}</svg>
                {t.label}
              </Link>
            );
          })}
        </nav>

        <main style={{ background: "#FFFFFF", borderRadius: "0 28px 28px 28px", boxShadow: "0 10px 30px rgba(52,24,74,.06)", padding: "8px clamp(20px,4vw,48px) clamp(20px,4vw,48px)", display: "flex", flexDirection: "column", gap: 32, minHeight: 360 }}>
          {error && <p role="alert" style={{ margin: "16px 0 0", padding: "12px 16px", borderRadius: 8, background: "#FDEBA0", color: "#3B3A16", fontWeight: 700 }}>{error}</p>}
          {ready ? children : <p style={{ margin: "24px 0", color: "#604872" }}>Cargando…</p>}
        </main>
      </div>
    </div>
  );
}
