import Banner from "@/components/Banner";
import Button from "@/components/Button";
import CategoryNav from "@/components/CategoryNav";
import { ArrowIcon } from "@/components/Icons";
import ProductGrid from "@/components/ProductGrid";
import SectionHeading from "@/components/SectionHeading";
import ShoeImage from "@/components/ShoeImage";
import StepCard from "@/components/StepCard";
import { BANNERS, HERO_PHOTO } from "@/data/store";
import { sizesLabel } from "@/lib/catalog-utils";
import type { StoreCatalog } from "@/lib/types";

const SECTION: React.CSSProperties = { maxWidth: 1280, margin: "0 auto" };

/** Inicio de la tienda. Recibe el catálogo (publicado o borrador) para poder reutilizarse en la vista previa. */
export default function HomeView({ catalog }: { catalog: StoreCatalog }) {
  const byId = new Map(catalog.products.map((p) => [p.id, p]));
  const featured = catalog.featured.map((id) => byId.get(id)!).filter(Boolean);
  const banners = BANNERS.flatMap((b) => {
    const inCat = catalog.products.filter((p) => p.cat === b.cat && p.photo);
    const pick = inCat.find((p) => p.isNew) ?? inCat[0];
    return pick?.photo ? [{ ...b, photo: pick.photo, sub: sizesLabel(catalog, b.cat) }] : [];
  });

  return (
    <main>
      <section id="inicio" style={{ padding: "8px 16px 0" }}>
        <div style={{ ...SECTION, position: "relative" }}>
          <div style={{ position: "relative", overflow: "hidden", background: "#F3E8F9", borderRadius: 28, padding: "56px clamp(24px,5vw,72px) 120px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "24px 40px" }}>
            <div style={{ flex: "1 1 440px", minWidth: 0 }}>
              <h1 className="display hq-rise" style={{ margin: 0, maxWidth: "10ch", fontSize: "clamp(48px,6.6vw,100px)", lineHeight: 1 }}>
                <span style={{ position: "relative", display: "inline-block" }}>
                  Crocs
                </span>{" "}
                para grandes y{" "}
                <span className="hq-wiggle" style={{ display: "inline-block", color: "#B571DC", transform: "rotate(-3deg)" }}>chiquitos</span>
              </h1>
            </div>
            <div aria-hidden="true" style={{ flex: "1 1 380px", minWidth: 0, position: "relative", minHeight: 340, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="hq-bloom" style={{ position: "absolute", width: "min(400px,92%)", aspectRatio: "1/1", borderRadius: "50%", background: "rgba(255,255,255,.72)" }} />
              <ShoeImage photo={HERO_PHOTO} rotate={0} priority sizes="(max-width: 700px) 100vw, 600px" shadow="drop-shadow(0 30px 24px rgba(52,24,74,.24))" className="hq-hero-shoe" style={{ position: "relative", width: "108%", maxWidth: 600 }} />
            </div>
          </div>
          <CategoryNav catalog={catalog} />
        </div>
      </section>

      <section id="modelos" className="hq-sec" style={{ ...SECTION, padding: "96px 24px", display: "flex", flexDirection: "column", gap: 40, scrollMarginTop: 88 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, textAlign: "center" }}>
          <SectionHeading>Los modelos de hoy</SectionHeading>
        </div>
        <ProductGrid products={featured} minCard={340} gap={24} animation="reveal" />
        <Button href="/catalogo" variant="outline" style={{ alignSelf: "center" }}>Ver todo el catálogo<ArrowIcon /></Button>
      </section>

      {banners.length > 0 && (
        <section aria-label="Destacados" className="hq-banners" style={{ ...SECTION, padding: "0 24px 96px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(460px,100%),1fr))", gap: 24 }}>
          {banners.map((b) => (
            <Banner key={b.cat} bg={b.bg} title={b.title} sub={b.sub} subColor={b.subColor} cat={b.cat} label={b.label} photo={b.photo} rotate={b.rotate} />
          ))}
        </section>
      )}

      <section id="pedir" style={{ ...SECTION, padding: "0 24px 96px", display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: "32px 64px", scrollMarginTop: 88 }}>
        <SectionHeading size="clamp(44px,5vw,76px)" style={{ flex: "1 1 260px" }}>Cómo pedir</SectionHeading>
        <div style={{ flex: "2 1 520px", minWidth: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(260px,100%),1fr))", gap: "36px 48px" }}>
          <StepCard title="Armá tu lista">Elegí modelo y talla, tocá «Lo quiero» y mandame la lista por WhatsApp. Los pares de esta página los tengo para entregar.</StepCard>
          <StepCard title="Yo te contesto">Te confirmo la talla y te paso el total con envío. Pagás por SINPE Móvil y quedamos en el día y el lugar de entrega.</StepCard>
        </div>
      </section>
    </main>
  );
}
