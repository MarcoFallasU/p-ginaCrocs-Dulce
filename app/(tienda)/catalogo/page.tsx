import type { Metadata } from "next";
import { Suspense } from "react";
import CatalogFilters from "@/components/CatalogFilters";

export const metadata: Metadata = { title: "Catálogo · Dulce Crocs" };

export default function CatalogoPage() {
  return (
    <main>
      <Suspense>
        <CatalogFilters />
      </Suspense>
    </main>
  );
}
