"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { diffCatalogs, type Changes } from "@/lib/diff";
import type { Catalog } from "@/lib/types";

interface AdminContextValue {
  ready: boolean;
  /** Mensaje del último error de red o validación (se limpia al siguiente cambio). */
  error: string;
  draft: Catalog;
  published: Catalog;
  changes: Changes;
  busy: boolean;
  /** Aplica un cambio al borrador y lo guarda. Devuelve `false` si el servidor lo rechazó. */
  update: (fn: (c: Catalog) => Catalog) => Promise<boolean>;
  publish: () => Promise<boolean>;
  discard: () => Promise<void>;
}

const EMPTY: Catalog = { categories: [], products: [], featured: [] };
const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [published, setPublished] = useState<Catalog>(EMPTY);
  const [draft, setDraft] = useState<Catalog>(EMPTY);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const latest = useRef<Catalog>(EMPTY);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/draft", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { published: Catalog; draft: Catalog };
      latest.current = data.draft;
      setPublished(data.published);
      setDraft(data.draft);
      setError("");
    } catch {
      setError("No se pudo cargar el catálogo.");
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    // Carga inicial desde el servidor
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const update = useCallback(async (fn: (c: Catalog) => Catalog) => {
    const previous = latest.current;
    const next = fn(previous);
    latest.current = next;
    setDraft(next);
    setError("");
    try {
      const res = await fetch("/api/admin/draft", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo guardar");
      latest.current = data.draft;
      setDraft(data.draft);
      return true;
    } catch (e) {
      latest.current = previous;
      setDraft(previous);
      setError(e instanceof Error ? e.message : "No se pudo guardar");
      return false;
    }
  }, []);

  const publish = useCallback(async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/publish", { method: "POST" });
      if (!res.ok) throw new Error();
      await load();
      return true;
    } catch {
      setError("No se pudo publicar.");
      return false;
    } finally {
      setBusy(false);
    }
  }, [load]);

  const discard = useCallback(async () => {
    setBusy(true);
    try {
      await fetch("/api/admin/discard", { method: "POST" });
      await load();
    } finally {
      setBusy(false);
    }
  }, [load]);

  const changes = useMemo(() => diffCatalogs(draft, published), [draft, published]);
  const value = useMemo(() => ({ ready, error, draft, published, changes, busy, update, publish, discard }), [ready, error, draft, published, changes, busy, update, publish, discard]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin debe usarse dentro de AdminProvider");
  return ctx;
}
