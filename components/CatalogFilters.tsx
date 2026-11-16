"use client";

import { useSearchParams } from "next/navigation";
import CatalogView from "./CatalogView";

/** Lee ?cat= de la URL y reinicia el catálogo cuando cambia (enlaces de categorías y banners). */
export default function CatalogFilters() {
  const cat = useSearchParams().get("cat") ?? "todos";
  return <CatalogView key={cat} initialCat={cat} />;
}
