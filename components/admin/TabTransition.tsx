"use client";

import { useLayoutEffect, useRef } from "react";

const EASING = "cubic-bezier(.22,1,.36,1)"; // amortiguación crítica: sin rebote

/**
 * Entrada suave del contenido de la pestaña (fundido + ascenso corto) mientras las pestañas se expanden y colapsan.
 * Si se cambia de pestaña a mitad de la animación, la nueva arranca desde la opacidad que se ve en pantalla.
 * Con `prefers-reduced-motion` solo hay fundido.
 */
export default function TabTransition({ routeKey, children }: { routeKey: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const previous = useRef(routeKey);
  const running = useRef<Animation | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || previous.current === routeKey) return;
    previous.current = routeKey;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let from = 0;
    if (running.current?.playState === "running") {
      from = parseFloat(getComputedStyle(el).opacity) * 0.6;
      running.current.cancel();
    }
    const animation = el.animate(
      [{ opacity: from, transform: reduce ? "none" : "translateY(8px)" }, { opacity: 1, transform: "none" }],
      { duration: reduce ? 160 : 420, easing: EASING },
    );
    running.current = animation;
    animation.onfinish = () => { if (running.current === animation) running.current = null; };
  }, [routeKey]);

  return <div ref={ref}>{children}</div>;
}
