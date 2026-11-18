import Image from "next/image";
import { tintOf } from "@/data/store";
import type { Photo } from "@/lib/types";
import { ShoePlaceholder } from "@/components/ShoeTile";

/** Miniatura de producto para las listas del admin (usa la foto o un marcador del color). */
export default function ProductThumb({ photo, body, width = 88, round = false, dim = false, bg }: { photo?: Photo; body: string; width?: number; round?: boolean; dim?: boolean; bg?: string }) {
  return (
    <div style={{ flex: "none", width, height: round ? width : Math.round(width * 0.75), borderRadius: round ? "50%" : 8, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: bg ?? tintOf(body), opacity: dim ? 0.45 : 1 }}>
      <div style={{ width: round ? "70%" : "64%" }}>
        {photo ? (
          <Image src={photo.thumb ?? photo.src} width={photo.width} height={photo.height} alt="" sizes={`${width}px`} style={{ display: "block", width: "100%", height: "auto", filter: "drop-shadow(0 6px 6px rgba(52,24,74,.2))" }} />
        ) : (
          <ShoePlaceholder color={body} />
        )}
      </div>
    </div>
  );
}
