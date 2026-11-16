import type { Photo } from "@/lib/types";
import Button from "./Button";
import { ArrowIcon } from "./Icons";
import ShoeImage from "./ShoeImage";

interface Props {
  bg: string;
  title: string;
  sub?: string;
  subColor: string;
  cat: string;
  label: string;
  photo: Photo;
  rotate: number;
}

export default function Banner({ bg, title, sub, subColor, cat, label, photo, rotate }: Props) {
  return (
    <div className="hq-reveal hq-banner" style={{ position: "relative", overflow: "hidden", background: bg, borderRadius: 20, padding: "36px clamp(24px,3vw,40px)", minHeight: 280, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16 }}>
      <div style={{ position: "relative", zIndex: 1, flex: "1 1 200px", minWidth: 0, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 14 }}>
        <h2 className="display hq-btitle" style={{ margin: 0, fontSize: "clamp(30px,3vw,42px)", lineHeight: 1.05 }}>{title}</h2>
        {sub && <p className="hq-bsub" style={{ margin: 0, fontSize: 16, fontWeight: 600, color: subColor }}>{sub}</p>}
        <Button href={`/catalogo?cat=${cat}`} className="hq-bbtn">{label}<ArrowIcon /></Button>
      </div>
      <div aria-hidden="true" className="hq-bimg" style={{ flex: "1 1 220px", minWidth: 0, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ position: "absolute", width: "86%", aspectRatio: "1/1", borderRadius: "50%", background: "rgba(255,255,255,.55)" }} />
        <ShoeImage photo={photo} rotate={rotate} shadow="drop-shadow(0 18px 16px rgba(52,24,74,.2))" sizes="(max-width: 600px) 45vw, 400px" style={{ position: "relative" }} />
      </div>
    </div>
  );
}
