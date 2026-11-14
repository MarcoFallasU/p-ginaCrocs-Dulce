import type { CSSProperties, ReactNode } from "react";

export default function SectionHeading({ children, size = "clamp(34px,3.6vw,52px)", style }: { children: ReactNode; size?: string; style?: CSSProperties }) {
  return <h2 className="display" style={{ margin: 0, fontSize: size, lineHeight: 1, ...style }}>{children}</h2>;
}
