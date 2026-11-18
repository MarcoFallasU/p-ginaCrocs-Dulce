# Sistema de diseño — Dulce Crocs

Guía para agentes y personas que modifiquen la interfaz. Las reglas están deducidas del código actual (`app/globals.css`, `components/`, `data/store.ts`). Si un valor de aquí contradice el código, manda el código: corrige este archivo.

## 1. Principios

- Tienda pequeña, cálida y juguetona: morado suave, formas redondeadas, tipografía gruesa en los títulos.
- Pedido por WhatsApp, sin pagos en línea: no hay checkout. La "lista" reemplaza al carrito.
- Textos en español de Costa Rica, voseo («Armá», «Tocá», «Escribime»). Nunca tuteo ni usted.
- Móvil primero en comportamiento: cada pantalla debe funcionar a 375 px.

## 2. Tecnología y estilos

- Next.js (App Router) + TypeScript. Sin Tailwind ni librerías de UI.
- Los estilos viven en dos sitios:
  - `app/globals.css`: clases con prefijo `hq-` (animaciones, hover, estados, media queries, el cajón).
  - Estilos en línea (`style={{…}}`) en los componentes para layout, color y tipografía.
- Regla: lo que necesita `:hover`, `:active`, `@media`, `@keyframes` o `nth-of-type` va a `globals.css` con clase `hq-*`. El resto, en línea.
- Los overrides móviles de `globals.css` usan `!important` porque los estilos en línea tienen más peso. Si añades un componente con estilos en línea que deba cambiar en móvil, ponle una clase `hq-*` y agrega la regla dentro de `@media (max-width:600px)`.

## 3. Color

Paleta fija. No introduzcas colores nuevos sin necesidad; reutiliza estos valores exactos.

| Token (rol) | Valor | Uso |
|---|---|---|
| Tinta | `#34184A` | Texto principal, botones primarios, bordes de énfasis, tallas activas |
| Tinta suave | `#604872` | Texto secundario, metadatos, contadores |
| Morado acento | `#B571DC` | Detalles, subrayado dibujado, contador, anillo de foco |
| Morado enlace hover | `#8A43B5` | `a:hover`, acciones de texto («Quitar», «Quitar filtros») |
| Lila claro (botón suave) | `#EDDDF7` | Botón «Lo quiero», hover de opciones, bordes punteados |
| Lila superficie | `#F3E8F9` | Hero y cabecera del catálogo |
| Lila panel | `#F9F4FC` | Panel de filtros, botón cerrar |
| Lila pie | `#FAF5FD` | Fondo del footer |
| Borde de talla | `#E7D2F4` | Borde del botón de talla inactivo |
| Texto sobre tinta | `#D6B1EC` | Texto «Nuevo» y «En tu lista» sobre fondo tinta |
| Blanco | `#FFFFFF` | Fondo de página, tarjetas, barra superior |
| Banner plataforma | `#E3C9F2` | Fondo del banner morado (subtexto `#45275C`) |
| Banner niños | `#FDEBA0` | Fondo del banner amarillo (subtexto `#3B3A16`) |

Color de producto:
- Cada producto tiene `body` (color real del zapato, hex). El fondo de su foto se calcula con `tintOf(body)` en `data/store.ts` (mezcla 38 % del color con blanco). No pongas un fondo fijo a mano en fotos de producto.

## 4. Tipografía

- Cuerpo: **Nunito** (pesos 500–900), variable CSS `--font-nunito`.
- Títulos grandes: **Bagel Fat One**, variable `--font-bagel`, clase `.display` (peso 400, `letter-spacing:-0.01em`). Solo para `h1`, títulos de sección, títulos de banner y «Tu lista».
- Tamaños de títulos con `clamp()`: hero `clamp(48px,6.6vw,100px)`, catálogo `clamp(56px,8vw,120px)`, sección `clamp(34px,3.6vw,52px)`, «Cómo pedir» `clamp(44px,5vw,76px)`, banner `clamp(30px,3vw,42px)`.
- Etiquetas, nombres de producto, botones y navegación: MAYÚSCULAS, peso 700–900, `letter-spacing` de `.03em` a `.1em`.
- Texto corrido: 16–17 px, `line-height` 1.5–1.55, peso 500–600.
- Precios y cifras: `font-variant-numeric: tabular-nums`, peso 800.
- Los `h2/h3` que no son de tipo `.display` (p. ej. nombre de producto, pasos) usan Nunito en peso 800–900.

## 5. Espaciado, forma y elevación

- Ancho máximo de contenido: **1280 px**, centrado, con `padding` lateral de 24 px (12 px en móvil, clase `hq-sec`).
- Secciones: separación vertical de 96 px (72/64 px en móvil), `scroll-margin-top: 88px` para anclas por la barra fija.
- Radios: hero y cabecera de catálogo 28; banners 20; paneles y categorías 16; tarjetas 12; fotos y opciones 8; **botones 6**; etiquetas 4; botones de talla y cierre, círculo.
- Los botones rectangulares tienen esquinas poco redondeadas (6 px) a propósito; las tallas son círculos. No mezclar.
- Sombras suaves tintadas de morado: tarjeta `0 10px 30px rgba(52,24,74,.06)`, categorías `0 16px 44px rgba(52,24,74,.12)`, cajón `-20px 0 60px rgba(52,24,74,.22)`. Fotos de producto usan `drop-shadow` con `rgba(52,24,74,.2)`.
- Zonas táctiles mínimas de **44 px** (botones 46–56 px). No reducir.

## 6. Imágenes de producto

- Fotos en WebP con fondo transparente, en `public/img/`, declaradas en `IMG` de `data/store.ts` con ancho y alto reales.
- Se muestran derechas (sin rotación) con `drop-shadow`, dentro de una caja con el tinte del producto. Usar `ShoeImage` y `ShoeTile`, no `<Image>` suelto.
- Usar `next/image` (vía `ShoeImage`) con `sizes` realista. Solo la imagen del hero lleva `priority`.
- Imágenes decorativas: `alt=""`. Imagen de producto en tarjeta: `alt="<nombre> <color>"`.
- Subidas nuevas: endpoint `app/api/upload` (WebP, 1920 px máx. + miniatura de 400 px).

## 7. Componentes

Reutiliza antes de crear. Todos en `components/` (sin subcarpetas por ahora).

| Componente | Función |
|---|---|
| `Button` | Botón o enlace. Variantes `primary` (tinta), `soft` (lila, acción «Lo quiero»), `outline` (borde tinta). Con `href` renderiza `Link`. |
| `SizeButton` | Botón circular de talla; activo = fondo tinta y texto blanco. Usado en tarjetas y filtros. |
| `ProductCard` / `ProductGrid` | Tarjeta de modelo y su cuadrícula (`auto-fill`, mínimo 280–340 px). |
| `ShoeImage` / `ShoeTile` | Foto derecha con sombra / caja con tinte del producto. |
| `Banner` | Bloque destacado con título, subtexto, botón y foto. |
| `CategoryNav` | Barra flotante de categorías con miniaturas circulares sobre el hero. |
| `SectionHeading`, `StepCard` | Título de sección `.display` y paso numerado con borde superior tinta. |
| `Header`, `Footer`, `CartDrawer` | Estructura global (en `app/layout.tsx`). |
| `CatalogView` | Filtros + resultados del catálogo. |
| `Icons`, `Dots` | Iconos SVG de trazo (`currentColor`, 18–20 px, trazo 2.2–2.6) y el logo de tres puntos. |

Reglas:
- Un botón nuevo se construye con `Button`, no con estilos copiados.
- Iconos: SVG en línea con `stroke="currentColor"`, `aria-hidden`, esquinas redondeadas; añadir a `Icons.tsx`.
- Logo: tres círculos `#B571DC` con borde tinta de 2 px (`Dots`). No hay texto de logo.
- Estados de botón: `hq-press` (escala .96 al presionar); `hq-out` (invierte a tinta al hover) en botones suaves y de contorno.
- Estado «en la lista»: botón tinta con texto `#D6B1EC` y check.

## 8. Movimiento

- Curvas: entrada `cubic-bezier(.22,1,.36,1)`; rebote `cubic-bezier(.34,1.56,.64,1)`; presionar 120 ms.
- Animaciones existentes (`hq-rise`, `hq-pop`, `hq-pop-card`, `hq-reveal` por scroll, `hq-hero-shoe`, `hq-draw`, `hq-wiggle`, `hq-bloom`, `hq-bump`, `hq-added`): reutilizarlas antes de crear otras.
- Hover de producto: el zapato sube y rota (`hq-shoe`).
- Todo movimiento debe quedar desactivado bajo `prefers-reduced-motion: reduce` (añadir la clase nueva a ese bloque de `globals.css`). Con `prefers-reduced-transparency` la barra superior es blanca sólida.

## 9. Layout y responsive

- Un solo punto de corte móvil: **600 px** (cabecera con navegación en segunda fila a ≤ 760 px).
- Móvil: cuadrículas de producto y banners a 2 columnas, tarjetas más compactas, filtros en filas con scroll horizontal, categorías en una sola fila deslizable.
- Barra superior: `sticky`, blanco 80 % con `backdrop-filter`, `z-index:20`. Cajón de lista: `z-index:70`, ancho `min(440px,90vw)`, entra desde la derecha.
- Cuadrículas con `repeat(auto-fill,minmax(min(Npx,100%),1fr))` para no desbordar.

## 10. Accesibilidad (obligatorio)

- Foco visible: `:focus-visible` con contorno `#B571DC` de 3 px. No quitarlo.
- Botones de talla: `aria-pressed` y `aria-label="Talla N"`. Filtros activos: `aria-pressed`. Enlace actual: `aria-current="page"`.
- Cajón: `role="dialog"`, `aria-modal`, `aria-labelledby`, foco inicial en cerrar, trampa de foco, `Escape` cierra, bloquea scroll y devuelve el foco.
- Regiones con `aria-label` (`nav`, `section`, `aside`); contador de resultados con `aria-live="polite"`.
- Contraste: texto tinta sobre blanco o lilas. No usar `#B571DC` como color de texto pequeño sobre blanco.

## 11. Contenido y datos

- Catálogo, categorías, WhatsApp e Instagram se editan en `data/store.ts`; la UI no debe tener productos escritos a mano.
- Precio vacío muestra `₡XX.XXX`; formato `₡25.000` (punto de miles).
- Etiquetas de botones: verbos cortos en imperativo voseado («Lo quiero», «Quitar», «Seguir comprando», «Pedir por WhatsApp»).
- Aviso legal del footer (sin relación con Crocs, Inc.) debe mantenerse.
- La lista se guarda en `localStorage` (clave `huequitos-lista`) y se gestiona solo con `ListContext`.

## 12. Cosas por definir

- Tokens de color como variables CSS (hoy son hex repetidos).
- Estilo del portal de administración (no existe aún).
- Modo oscuro: no soportado.

## 13. Portal de administración (`/admin`)

- Mismas reglas de color, tipografía y componentes que la tienda. Lo propio del admin vive en `components/admin/` y su CSS en la sección «Administración» de `app/globals.css` (clases `hq-tab`, `hq-acc`, `hq-row`, `hq-stat`, `hq-menu`, `hq-open`).
- Estructura: cabecera (estado del borrador, Descartar, Vista previa, Publicar) + pestañas. La pestaña activa es el título grande en Bagel Fat One sobre fondo blanco; las inactivas son pestañas lilas de 112×68 con icono y texto en mayúsculas. El contenido va en una tarjeta blanca con esquina superior izquierda recta (`0 28px 28px 28px`).
- Formularios: etiqueta en mayúsculas 13 px, campos de 52 px con borde `#E7D2F4` y fondo `#F9F4FC`, casillas con `role="checkbox"`, tallas con `SizeButton`. Usar `Field`, `TextInput`, `SelectInput` y `CheckRow` de `components/admin/fields.tsx`.
- Borrador y publicación: todo cambio se guarda como borrador; la tienda solo cambia al pulsar «Publicar». Ocultar un producto en lugar de borrarlo.
- Datos: toda lectura y escritura pasa por `lib/db` (interfaz `Repository`). Con la variable `DATABASE_URL` se usa Neon Postgres (`neonRepository.ts`: tabla `catalogs` con el catálogo en JSONB y tabla `events`; las tablas se crean solas). Sin ella se usan los archivos JSON de `data/db/`, solo para desarrollo.
- Pendiente: autenticación. Todo bajo `/admin`, `/api/admin` y `/api/upload` debe protegerse (hay `TODO(auth)` en el código).
- Color de categoría: se elige con un selector de color libre (más el código hex y atajos con los colores del sistema), campo `color` de la categoría. El texto sobre ese fondo (`ink` y `sub`) lo calcula `colorsOf()` en `lib/palettes.ts` según el contraste; no lo fijes a mano.
- Navegación del admin: `/admin` es la página principal (pestaña Productos) y `app/admin/layout.tsx` monta una sola vez cabecera, pestañas y datos; al cambiar de pestaña solo cambia el contenido de la tarjeta blanca (con `AdminSkeleton` mientras carga). No envolver el shell en `Suspense` ni mover cabecera o pestañas a cada página.
- Animación de pestañas: la pestaña pulsada se expande (de icono a título grande) y la anterior se colapsa (`TabsNav`: ancho, alto y radio con `cubic-bezier(.22,1,.36,1)`, 520 ms, sin rebote). Los tamaños se miden y las transiciones son CSS, así que un clic a mitad de camino reencauza desde el valor actual. El contenido solo hace fundido + ascenso de 8 px (`TabTransition`). Con `prefers-reduced-motion` no hay transiciones de tamaño.
