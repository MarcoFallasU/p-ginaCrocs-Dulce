import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "soft" | "outline";

const BASE = {
  textDecoration: "none",
  fontWeight: 800,
  textTransform: "uppercase",
  borderRadius: 6,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
} as const;

const VARIANTS: Record<Variant, React.CSSProperties & { cls: string }> = {
  primary: { cls: "hq-press", background: "#34184A", color: "#FFFFFF", border: 0, minHeight: 48, padding: "0 20px", gap: 10, fontSize: 14, letterSpacing: ".06em" },
  soft: { cls: "hq-press hq-out", background: "#EDDDF7", color: "#34184A", border: 0, minHeight: 46, padding: "0 16px", gap: 8, fontSize: 14, letterSpacing: ".04em" },
  outline: { cls: "hq-press hq-out", background: "#FFFFFF", color: "#34184A", border: "1.5px solid #34184A", minHeight: 52, padding: "0 24px", gap: 10, fontSize: 15, letterSpacing: ".06em" },
};

interface Common {
  variant?: Variant;
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
}

/** Botón de la tienda. Con `href` se pinta como enlace de Next, si no como <button>. */
export default function Button(props: Common & ({ href: string } & Omit<ComponentProps<typeof Link>, "style" | "className" | "children"> | ({ href?: undefined } & Omit<ComponentProps<"button">, "style" | "className" | "children">))) {
  const { variant = "primary", className = "", style, children, ...rest } = props;
  const { cls, ...v } = VARIANTS[variant];
  const merged = { ...BASE, ...v, ...style };
  const classes = `${cls} ${className}`.trim();
  if ("href" in rest && rest.href !== undefined) {
    return <Link {...(rest as ComponentProps<typeof Link>)} className={classes} style={merged}>{children}</Link>;
  }
  return <button type="button" {...(rest as ComponentProps<"button">)} className={classes} style={merged}>{children}</button>;
}
