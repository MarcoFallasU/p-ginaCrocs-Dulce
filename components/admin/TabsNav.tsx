"use client";

import Link from "next/link";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

export const TABS = [
  { href: "/admin", label: "Productos", match: "/admin/productos", icon: <path d="M3 12V4h8l10 10-8 8L3 12z M8 9h.01" /> },
  { href: "/admin/categorias", label: "Categorías", match: "/admin/categorias", icon: <><rect x="4" y="4" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" /></> },
  { href: "/admin/destacados", label: "Destacados", match: "/admin/destacados", icon: <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z" /> },
  { href: "/admin/estadisticas", label: "Estadísticas", match: "/admin/estadisticas", icon: <path d="M5 20V10M12 20V4M19 20v-7" /> },
];

/** Índice de la pestaña a la que pertenece la ruta (`/admin` y `/admin/productos/...` son Productos). */
export function activeTabIndex(pathname: string): number {
  const i = TABS.findIndex((t) => pathname === t.match || pathname.startsWith(t.match + "/"));
  return i === -1 ? 0 : i;
}

const TITLE_PAD = "24px clamp(20px,4vw,48px) 8px";
const TITLE_SIZE = "clamp(44px,5vw,76px)";
const COMPACT = { w: 112, h: 68 };

/**
 * Pestañas del portal. Al cambiar de ruta la pestaña pulsada se expande (de icono a título grande) mientras la que
 * estaba activa se colapsa, con transiciones de ancho, alto y radio que parten del valor actual si se interrumpen.
 * Los tamaños se miden (el título tiene ancho variable) y se animan con CSS; sin movimiento, saltan al instante.
 */
export default function TabsNav({ pathname }: { pathname: string }) {
  const active = activeTabIndex(pathname);
  const measurer = useRef<HTMLDivElement>(null);
  const [sizes, setSizes] = useState<{ w: number; h: number }[] | null>(null);
  const [ready, setReady] = useState(false);

  const measure = useCallback(() => {
    const nodes = measurer.current?.querySelectorAll<HTMLElement>("[data-measure]");
    if (!nodes?.length) return;
    setSizes([...nodes].map((n) => ({ w: Math.ceil(n.offsetWidth), h: Math.ceil(n.offsetHeight) })));
  }, []);

  useLayoutEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    void document.fonts?.ready.then(measure);
    // Las transiciones se activan después de la primera medición para que no se animen al cargar la página
    const raf = requestAnimationFrame(() => setReady(true));
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", measure); };
  }, [measure]);

  return (
    <nav aria-label="Secciones del portal" className={ready ? "hq-tabs hq-tabs-ready" : "hq-tabs"} style={{ position: "relative", display: "flex", alignItems: "flex-end", gap: 4, overflowX: "auto" }}>
      {TABS.map((t, i) => {
        const on = i === active;
        const size = sizes?.[i];
        const Title = on ? "h1" : "span";
        return (
          <Link
            key={t.href}
            href={t.href}
            className="hq-tabx"
            data-active={on}
            aria-current={on ? "page" : undefined}
            style={{ width: on ? (size?.w ?? 260) : COMPACT.w, height: on ? (size?.h ?? 120) : COMPACT.h }}
          >
            <span aria-hidden={on} className="hq-tabx-compact">
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">{t.icon}</svg>
              {t.label}
            </span>
            <Title aria-hidden={on ? undefined : true} className="display hq-tabx-title" style={{ padding: TITLE_PAD, fontSize: TITLE_SIZE }}>{t.label}</Title>
          </Link>
        );
      })}
      {/* Medidor invisible: tamaño natural de cada título para poder animar hacia él */}
      <div ref={measurer} aria-hidden="true" style={{ position: "absolute", left: 0, top: 0, visibility: "hidden", pointerEvents: "none", whiteSpace: "nowrap" }}>
        {TABS.map((t) => (
          <span key={t.href} data-measure className="display" style={{ display: "block", width: "max-content", padding: TITLE_PAD, fontSize: TITLE_SIZE, lineHeight: 1 }}>{t.label}</span>
        ))}
      </div>
    </nav>
  );
}
