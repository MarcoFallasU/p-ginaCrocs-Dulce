import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { CatalogProvider } from "@/context/CatalogContext";
import { ListProvider } from "@/context/ListContext";
import { getStorefrontCatalog } from "@/lib/storefront";

export default async function TiendaLayout({ children }: { children: React.ReactNode }) {
  const catalog = await getStorefrontCatalog();
  return (
    <CatalogProvider catalog={catalog}>
      <ListProvider>
        <Header />
        {children}
        <Footer />
        <CartDrawer />
      </ListProvider>
    </CatalogProvider>
  );
}
