import HomeView from "@/components/HomeView";
import { getStorefrontCatalog } from "@/lib/storefront";

export default async function Home() {
  return <HomeView catalog={await getStorefrontCatalog()} />;
}
