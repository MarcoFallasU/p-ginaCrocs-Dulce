"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { byId, type Product } from "@/data/store";

const KEY = "huequitos-lista";

interface ListEntry {
  pid: string;
  size: string;
}

interface ListContextValue {
  items: ListEntry[];
  drawerOpen: boolean;
  bumpKey: number;
  justAdded: string | null;
  inList: (id: string) => boolean;
  chosenSize: (p: Product, fallback?: string) => string;
  selectSize: (id: string, size: string) => void;
  add: (p: Product, fallback?: string) => void;
  remove: (id: string) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const ListContext = createContext<ListContextValue | null>(null);

export function ListProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ListEntry[]>([]);
  const [sel, setSel] = useState<Record<string, string>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [bumpKey, setBumpKey] = useState(0);
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(() => {
    try {
      const d = JSON.parse(localStorage.getItem(KEY) || "null");
      if (d) {
        setItems(Array.isArray(d.list) ? d.list.filter((l: ListEntry) => byId[l.pid]) : []);
        setSel(d.sel && typeof d.sel === "object" ? d.sel : {});
      }
    } catch {}
  }, []);

  useEffect(() => {
    // Hidratar desde localStorage solo es posible en el cliente, después del primer render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    setLoaded(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) load();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [load]);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ list: items, sel }));
    } catch {}
  }, [items, sel, loaded]);

  const value = useMemo<ListContextValue>(
    () => ({
      items,
      drawerOpen,
      bumpKey,
      justAdded,
      inList: (id) => items.some((l) => l.pid === id),
      chosenSize: (p, fallback = "") => sel[p.id] || (fallback && p.sizes.includes(fallback) ? fallback : ""),
      selectSize: (id, size) => {
        setSel((s) => ({ ...s, [id]: size }));
        setItems((l) => l.map((e) => (e.pid === id ? { pid: id, size } : e)));
      },
      add: (p, fallback = "") => {
        const size = sel[p.id] || (fallback && p.sizes.includes(fallback) ? fallback : "");
        setItems((l) => l.filter((e) => e.pid !== p.id).concat([{ pid: p.id, size }]));
        setJustAdded(p.id);
        setBumpKey((k) => k + 1);
      },
      remove: (id) => {
        setItems((l) => l.filter((e) => e.pid !== id));
        setJustAdded(null);
      },
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
    }),
    [items, sel, drawerOpen, bumpKey, justAdded],
  );

  return <ListContext.Provider value={value}>{children}</ListContext.Provider>;
}

export function useList() {
  const ctx = useContext(ListContext);
  if (!ctx) throw new Error("useList debe usarse dentro de ListProvider");
  return ctx;
}
