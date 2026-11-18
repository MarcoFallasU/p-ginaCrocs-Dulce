/** La lista de la clienta viaja en el enlace como `p3.38,p4.37,p6` (producto.talla, sin talla si no aplica). */
export interface ShareItem {
  pid: string;
  size: string;
}

export function encodeItems(items: ShareItem[]): string {
  return items.map((i) => (i.size ? `${i.pid}.${i.size}` : i.pid)).join(",");
}

export function decodeItems(raw: string | null | undefined): ShareItem[] {
  if (!raw) return [];
  return raw
    .split(",")
    .slice(0, 30)
    .map((part) => {
      const [pid, size = ""] = part.split(".");
      return { pid: pid.slice(0, 60), size: size.slice(0, 8) };
    })
    .filter((i) => i.pid);
}

export function listUrl(origin: string, items: ShareItem[]): string {
  return `${origin}/lista?items=${encodeURIComponent(encodeItems(items))}`;
}
