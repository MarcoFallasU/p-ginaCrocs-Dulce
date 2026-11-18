import Image from "next/image";
import type { Photo } from "@/lib/types";

interface Props {
  photo: Photo;
  alt?: string;
  rotate?: number;
  shadow?: string;
  sizes?: string;
  priority?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

/** Foto de un modelo con la rotación y sombra de la tienda. */
export default function ShoeImage({ photo, alt = "", rotate = 0, shadow, sizes = "(max-width: 600px) 50vw, 400px", priority, style, className }: Props) {
  return (
    <Image
      src={photo.src}
      width={photo.width}
      height={photo.height}
      alt={alt}
      sizes={sizes}
      priority={priority}
      className={className}
      style={{ display: "block", width: "100%", height: "auto", transform: `rotate(${rotate}deg)`, filter: shadow, ...style }}
    />
  );
}
