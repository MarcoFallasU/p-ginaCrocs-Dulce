"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import Button from "@/components/Button";
import Dots from "@/components/Dots";
import { useAdmin } from "./AdminProvider";
import AdminSkeleton from "./AdminSkeleton";
import TabsNav, { activeTabIndex } from "./TabsNav";
import TabTransition from "./TabTransition";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const active = activeTabIndex(pathname);
  const { changes, busy, publish, discard, error, ready } = useAdmin();

  return (
    <div style={{ minHeight: "100vh", boxSizing: "border-box", background: "#F3E8F9", color: "#34184A", fontWeight: 600, fontSize: 16, lineHeight: 1.5 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", boxSizing: "border-box", padding: "24px 24px 56px", display: "flex", flexDirection: "column" }}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", paddingBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Dots />
            <span style={{ fontSize: 13, fontWeight: 900, letterSpacing: ".1em", textTransform: "uppercase" }}>Administración</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            {changes.count > 0 && (
              <button type="button" onClick={() => { if (window.confirm("¿Descartar todos los cambios sin publicar?")) void discard(); }} disabled={busy} className="hq-text" style={{ minHeight: 44, padding: "0 4px", border: 0, background: "transparent", color: "#34184A", font: "inherit", fontSize: 15, fontWeight: 700, textDecoration: "underline", cursor: "pointer" }}>Descartar</button>
            )}
            <Button href="/admin/vista-previa" variant="outline" style={{ minHeight: 46, padding: "0 18px", fontSize: 13 }}>Vista previa</Button>
            <Button onClick={() => void publish()} disabled={busy || changes.count === 0} style={{ minHeight: 50, padding: "0 20px", fontSize: 13, opacity: changes.count === 0 ? 0.5 : 1 }}>{busy ? "Publicando…" : "Publicar"}</Button>
            {/* TODO(auth): aquí va «Cerrar sesión» cuando exista la autenticación */}
          </div>
        </header>

        <TabsNav pathname={pathname} />

        <main className="hq-tabs-card" style={{ background: "#FFFFFF", borderRadius: `${active === 0 ? 0 : 28}px 28px 28px 28px`, boxShadow: "0 10px 30px rgba(52,24,74,.06)", padding: "8px clamp(20px,4vw,48px) clamp(20px,4vw,48px)", display: "flex", flexDirection: "column", gap: 32, minHeight: 360 }}>
          {error && <p role="alert" style={{ margin: "16px 0 0", padding: "12px 16px", borderRadius: 8, background: "#FDEBA0", color: "#3B3A16", fontWeight: 700 }}>{error}</p>}
          <TabTransition routeKey={active * 10 + (pathname.split("/").length > (active === 0 ? 2 : 3) ? 1 : 0)}>
            {ready ? <Suspense fallback={<AdminSkeleton />}>{children}</Suspense> : <AdminSkeleton />}
          </TabTransition>
        </main>
      </div>
    </div>
  );
}
