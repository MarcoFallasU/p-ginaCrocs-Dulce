"use client";

import { useEffect, useRef } from "react";
import { PRICE_PLACEHOLDER, byId, whatsappDigits } from "@/data/store";
import { useList } from "@/context/ListContext";
import Button from "./Button";
import { CloseIcon, PlaneIcon } from "./Icons";
import ShoeTile from "./ShoeTile";

export default function CartDrawer() {
  const { items, drawerOpen, closeDrawer, remove } = useList();
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const entries = items.filter((l) => byId[l.pid]);

  // Bloqueo de scroll, foco inicial y devolución del foco
  useEffect(() => {
    if (!drawerOpen) return;
    lastFocus.current = document.activeElement as HTMLElement | null;
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => panelRef.current?.querySelector<HTMLElement>(".hq-close")?.focus(), 60);
    return () => {
      clearTimeout(t);
      document.documentElement.style.overflow = "";
      if (lastFocus.current && document.contains(lastFocus.current)) lastFocus.current.focus();
    };
  }, [drawerOpen]);

  // Escape y trampa de foco con Tab
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return closeDrawer();
      if (e.key !== "Tab" || !panelRef.current) return;
      const f = [...panelRef.current.querySelectorAll<HTMLElement>("a[href], button")];
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawerOpen, closeDrawer]);

  const waHref =
    `https://wa.me/${whatsappDigits()}?text=` +
    encodeURIComponent(
      "¡Hola! Quiero pedir:\n" +
        entries
          .map((l) => {
            const p = byId[l.pid];
            return `- ${p.name} ${p.color}` + (p.noSize ? "" : ", " + (l.size ? `talla ${l.size}` : "talla por confirmar"));
          })
          .join("\n"),
    );

  return (
    <div id="hq-drawer" className={drawerOpen ? "open" : undefined}>
      <div className="hq-scrim" onClick={closeDrawer} />
      <div ref={panelRef} className="hq-panel" role="dialog" aria-modal="true" aria-labelledby="hq-drawer-title">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, padding: "22px 16px 14px 24px", borderBottom: "1px solid #F3E8F9" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <h2 id="hq-drawer-title" className="display" style={{ margin: 0, fontSize: 36, lineHeight: 1 }}>Tu lista</h2>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#604872" }}>
              {entries.length ? `${entries.length} ${entries.length === 1 ? "producto" : "productos"}` : ""}
            </span>
          </div>
          <button type="button" className="hq-close hq-press hq-opt" onClick={closeDrawer} aria-label="Cerrar tu lista" style={{ flex: "none", width: 44, height: 44, borderRadius: "50%", border: 0, background: "#F9F4FC", color: "#34184A", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CloseIcon />
          </button>
        </div>

        <div style={{ flex: "1 1 auto", overflowY: "auto", overscrollBehavior: "contain", padding: "0 24px" }}>
          {entries.length === 0 ? (
            <div style={{ padding: "48px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Tu lista está vacía</p>
              <p style={{ margin: 0, fontSize: 16, lineHeight: 1.5, color: "#604872" }}>Tocá «Lo quiero» en los modelos que te gusten.</p>
            </div>
          ) : (
            entries.map((l) => {
              const p = byId[l.pid];
              const sizeLabel = p.noSize ? "Sin talla" : l.size ? `Talla ${l.size}` : "Talla por confirmar";
              return (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: "1px solid #F3E8F9" }}>
                  <div style={{ width: 80, flex: "none" }}>
                    <ShoeTile product={p} ratio="100/80" width="84%" />
                  </div>
                  <div style={{ flex: "1 1 auto", minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                    <strong style={{ fontSize: 15, fontWeight: 800, letterSpacing: ".03em", textTransform: "uppercase" }}>{p.name}</strong>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#604872" }}>{p.color} · {sizeLabel}</span>
                    <span style={{ fontSize: 15, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{p.price || PRICE_PLACEHOLDER}</span>
                  </div>
                  <button type="button" onClick={() => remove(p.id)} aria-label={`Quitar ${p.name} ${p.color}`} style={{ flex: "none", background: "transparent", border: 0, minHeight: 44, padding: "0 4px", fontSize: 14, fontWeight: 700, color: "#8A43B5", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 4 }}>
                    Quitar
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div style={{ flex: "none", padding: "16px 20px calc(16px + env(safe-area-inset-bottom))", borderTop: "1px solid #F3E8F9", display: "flex", flexDirection: "column", gap: 10, background: "#FFFFFF" }}>
          {entries.length > 0 && (
            <Button href={waHref} target="_blank" rel="noopener" style={{ minHeight: 56 }}>
              <PlaneIcon />Pedir por WhatsApp
            </Button>
          )}
          <Button variant="outline" onClick={closeDrawer} style={{ width: "100%", minHeight: 52, fontSize: 14 }}>Seguir comprando</Button>
        </div>
      </div>
    </div>
  );
}
