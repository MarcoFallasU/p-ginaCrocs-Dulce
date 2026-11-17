import type { Metadata } from "next";
import { AdminProvider } from "@/components/admin/AdminProvider";
import { Suspense } from "react";
import AdminShell, { AdminShellFallback } from "@/components/admin/AdminShell";

export const metadata: Metadata = { title: "Administración · Dulce Crocs", robots: { index: false, follow: false } };

// El layout no se vuelve a montar al cambiar de pestaña: cabecera, pestañas y datos permanecen, solo cambia el contenido.
// TODO(auth): proteger /admin y /api/admin (y /api/upload) cuando se implemente la autenticación.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      {/* El fallback es el mismo shell: aunque se muestre, cabecera y pestañas no desaparecen */}
      <Suspense fallback={<AdminShellFallback />}>
        <AdminShell>{children}</AdminShell>
      </Suspense>
    </AdminProvider>
  );
}
