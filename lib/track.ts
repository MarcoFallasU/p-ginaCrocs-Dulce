import type { EventType } from "./types";

/** Envía un evento anónimo para las estadísticas. Nunca falla hacia la interfaz y no cuenta dentro de /admin. */
export function track(e: { type: EventType; productId?: string; size?: string; detail?: string }) {
  try {
    if (typeof window === "undefined" || window.location.pathname.startsWith("/admin")) return;
    void fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(e),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}

/** Como `track`, pero una sola vez por sesión del navegador para la misma clave (vistas). */
export function trackOnce(key: string, e: Parameters<typeof track>[0]) {
  try {
    const k = "hq-seen:" + key;
    if (sessionStorage.getItem(k)) return;
    sessionStorage.setItem(k, "1");
  } catch {}
  track(e);
}
