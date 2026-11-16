import Link from "next/link";
import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { CheckIcon } from "@/components/Icons";

export const LABEL: CSSProperties = { fontSize: 13, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase" };
export const HELP: CSSProperties = { fontSize: 14, color: "#604872" };
const INPUT: CSSProperties = { height: 52, boxSizing: "border-box", padding: "0 14px", border: "2px solid #E7D2F4", borderRadius: 6, background: "#F9F4FC", font: "inherit", fontWeight: 700, color: "#34184A" };

/** Campo con etiqueta arriba y ayuda opcional abajo. */
export function Field({ label, htmlFor, help, children, grow = true }: { label: ReactNode; htmlFor?: string; help?: ReactNode; children: ReactNode; grow?: boolean }) {
  return (
    <div style={{ flex: grow ? "1 1 220px" : undefined, display: "flex", flexDirection: "column", gap: 8 }}>
      <label htmlFor={htmlFor} style={LABEL}>{label}</label>
      {children}
      {help && <span style={HELP}>{help}</span>}
    </div>
  );
}

export function TextInput(props: ComponentProps<"input">) {
  return <input {...props} className="hq-field" style={{ ...INPUT, minWidth: 0, ...props.style }} />;
}

export function SelectInput(props: ComponentProps<"select">) {
  return <select {...props} className="hq-field" style={{ ...INPUT, padding: "0 12px", ...props.style }} />;
}

/** Casilla accesible con el estilo de la tienda (role="checkbox"). */
export function CheckRow({ checked, onChange, children, controls }: { checked: boolean; onChange: () => void; children: ReactNode; controls?: string }) {
  return (
    <button type="button" role="checkbox" aria-checked={checked} aria-controls={controls} onClick={onChange} style={{ alignSelf: "flex-start", minHeight: 48, padding: 0, display: "flex", alignItems: "center", gap: 12, border: 0, background: "transparent", color: "#34184A", font: "inherit", fontWeight: 700, cursor: "pointer" }}>
      <span aria-hidden="true" style={{ flex: "none", width: 28, height: 28, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #34184A", borderRadius: 6, background: checked ? "#34184A" : "#FFFFFF", color: "#D6B1EC" }}>
        {checked && <CheckIcon />}
      </span>
      {children}
    </button>
  );
}

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="hq-text" style={{ alignSelf: "flex-start", minHeight: 44, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 15, fontWeight: 700, color: "#34184A" }}>
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
      {children}
    </Link>
  );
}

export const FORM_TITLE: CSSProperties = { margin: 0, fontSize: 28, fontWeight: 900, letterSpacing: ".03em", textTransform: "uppercase", lineHeight: 1.2 };
