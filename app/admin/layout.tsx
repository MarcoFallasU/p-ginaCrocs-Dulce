import type { Metadata } from "next";
import { AdminProvider } from "@/components/admin/AdminProvider";
import AdminShell from "@/components/admin/AdminShell";

export const metadata: Metadata = { title: "Administración · Dulce Crocs", robots: { index: false, follow: false } };

// El layout no se vuelve a montar al cambiar de pestaña: cabecera, pestañas y datos permanecen, solo cambia el contenido.
// TODO(auth): proteger /admin y /api/admin (y /api/upload) cuando se implemente la autenticación.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}
