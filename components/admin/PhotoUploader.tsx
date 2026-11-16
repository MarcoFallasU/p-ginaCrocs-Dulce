"use client";

import { useRef, useState } from "react";
import Button from "@/components/Button";
import type { Photo } from "@/lib/types";

/** Sube una foto a /api/upload (WebP 1920 px + miniatura) y avisa con los datos para guardar en el producto. */
export default function PhotoUploader({ label, onUploaded }: { label: string; onUploaded: (p: Photo) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<{ busy: boolean; error: string }>({ busy: false, error: "" });

  async function pick(file: File | undefined) {
    if (!file) return;
    setState({ busy: true, error: "" });
    try {
      const body = new FormData();
      body.set("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo subir la foto");
      onUploaded({ src: data.url, thumb: data.thumb, width: data.width, height: data.height });
      setState({ busy: false, error: "" });
    } catch (e) {
      setState({ busy: false, error: e instanceof Error ? e.message : "No se pudo subir la foto" });
    } finally {
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => void pick(e.target.files?.[0])} />
      <Button variant="soft" onClick={() => input.current?.click()} disabled={state.busy} style={{ minHeight: 50, fontSize: 13, letterSpacing: ".06em" }}>
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V5M7 10l5-5 5 5M5 19h14" /></svg>
        {state.busy ? "Subiendo…" : label}
      </Button>
      {state.error && <span role="alert" style={{ fontSize: 14, fontWeight: 700, color: "#8A43B5" }}>{state.error}</span>}
    </div>
  );
}
