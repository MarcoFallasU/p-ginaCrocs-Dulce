import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  async redirects() {
    // La lista de productos es la página principal del admin
    return [{ source: "/admin/productos", destination: "/admin", permanent: false }];
  },
  images: { remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }] },
  partialPrefetching: true,
};

export default nextConfig;
