import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminDashboard } from "../../../components/admin-dashboard";
import { isAdminAuthenticated } from "../../../lib/admin-auth";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Dashboard admin per gestione catalogo, caricamento prodotti e import JSON.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  return <AdminDashboard />;
}
