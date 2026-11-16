import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminProvider } from "@/components/admin/AdminProvider";
import AdminShell from "@/components/admin/AdminShell";

export const metadata: Metadata = { title: "Administración · Dulce Crocs", robots: { index: false, follow: false } };

// TODO(auth): proteger /admin y /api/admin (y /api/upload) cuando se implemente la autenticación.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <Suspense>
        <AdminShell>{children}</AdminShell>
      </Suspense>
    </AdminProvider>
  );
}
