export interface Photo {
  src: string;
  width: number;
  height: number;
  thumb?: string;
}

export interface Category {
  /** Identificador estable y enlace (`/catalogo?cat=<id>`). */
  id: string;
  name: string;
  description: string;
  palette: PaletteId;
  /** Tallas que ofrece la categoría. Vacío = la categoría no lleva tallas. */
  sizes: string[];
  photo?: Photo;
}

export interface Product {
  id: string;
  name: string;
  color: string;
  /** Color real del zapato (hex). El fondo de la foto sale de aquí. */
  body: string;
  cat: string;
  /** Texto libre, p. ej. "₡25.000". Vacío = la tienda muestra ₡XX.XXX. */
  price: string;
  /** Tallas realmente disponibles (subconjunto de las de la categoría). */
  sizes: string[];
  isNew: boolean;
  visible: boolean;
  photo?: Photo;
}

/** Lo que el administrador edita: borrador y versión publicada tienen esta forma. */
export interface Catalog {
  categories: Category[];
  products: Product[];
  /** IDs de producto de «Los modelos de hoy», en orden. */
  featured: string[];
}

export type PaletteId = "lila-superficie" | "lila-claro" | "lila-banner" | "morado" | "amarillo" | "tinta";

/** Producto tal como lo consume la tienda (ya resuelto contra su categoría). */
export interface StoreProduct extends Product {
  catName: string;
  noSize: boolean;
}

export interface StoreCatalog {
  categories: Category[];
  products: StoreProduct[];
  featured: string[];
}

export type EventType = "vista_producto" | "vistas" | "quiero" | "quitar" | "pedir" | "filtros";

export interface StatEvent {
  t: number;
  type: EventType;
  productId?: string;
  /** Atributos del producto en el momento del evento (sobreviven a ediciones y borrados). */
  attrs?: { categoria?: string; color?: string; precio?: string; talla?: string };
  /** Categoría vista o tipo de filtro usado. */
  detail?: string;
}
