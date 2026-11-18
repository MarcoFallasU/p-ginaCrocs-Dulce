import Image from "next/image";

/** Logo de Dulce Crocs (public/img/logo.webp). Es decorativo cuando va dentro de un enlace que ya tiene nombre. */
export default function Logo({ size = 48, decorative = true }: { size?: number; decorative?: boolean }) {
  return (
    <Image
      src="/img/logo.webp"
      width={size}
      height={size}
      alt={decorative ? "" : "Dulce Crocs"}
      priority
      style={{ display: "block", width: size, height: size, flex: "none" }}
    />
  );
}
