"use client";

import { useSearchParams } from "next/navigation";
import { CATS, type CategoryId } from "@/data/store";
import CatalogView from "./CatalogView";

/** Lee ?cat= de la URL y reinicia el catálogo cuando cambia (enlaces de categorías y banners). */
export default function CatalogFilters() {
  const cat = useSearchParams().get("cat");
  const initial = (CATS.some((c) => c.id === cat) ? cat : "todos") as CategoryId | "todos";
  return <CatalogView key={initial} initialCat={initial} />;
}
