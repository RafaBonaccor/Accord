import type { Metadata } from "next";

import { AdminDashboard } from "../../../components/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Dashboard admin per gestione catalogo, caricamento prodotti e import JSON.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
