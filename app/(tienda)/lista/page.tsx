import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import Button from "@/components/Button";
import ListSummary from "@/components/ListSummary";
import { repo } from "@/lib/db";
import { decodeItems, encodeItems } from "@/lib/share";

type Props = { searchParams: Promise<{ items?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const items = decodeItems((await searchParams).items);
  const catalog = await repo.getPublished();
  const names = items.flatMap((i) => catalog.products.filter((p) => p.id === i.pid).map((p) => `${p.name} ${p.color}${i.size ? ` (talla ${i.size})` : ""}`));
  const description = names.length ? names.join(", ") : "Crocs para grandes y chiquitos en Costa Rica.";
  const image = `/lista/imagen?items=${encodeURIComponent(encodeItems(items))}`;
  return {
    title: "Mi lista · Dulce Crocs",
    description,
    robots: { index: false },
    openGraph: { title: "Mi lista de Crocs", description, images: [{ url: image, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", images: [image] },
  };
}

// Los metadatos dependen de la URL (la lista viaja en ella), así que la página declara que es dinámica a propósito
async function Connection() {
  await connection();
  return null;
}

async function ListContent({ searchParams }: Props) {
  const items = decodeItems((await searchParams).items);
  const catalog = await repo.getPublished();
  const rows = items.flatMap((i) => {
    const p = catalog.products.find((x) => x.id === i.pid);
    return p ? [{ product: p, size: i.size }] : [];
  });
  return <ListSummary rows={rows} />;
}

export default function ListaPage({ searchParams }: Props) {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 96px", display: "flex", flexDirection: "column", gap: 32 }}>
      <h1 className="display" style={{ margin: 0, fontSize: "clamp(44px,6vw,72px)", lineHeight: 1 }}>Lista de Crocs</h1>
      <Suspense>
        <ListContent searchParams={searchParams} />
      </Suspense>
      <Button href="/catalogo" variant="outline" style={{ alignSelf: "flex-start" }}>Ver el catálogo</Button>
      <Suspense>
        <Connection />
      </Suspense>
    </main>
  );
}
