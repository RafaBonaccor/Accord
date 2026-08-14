import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { isAdminAuthenticated } from "../../../../lib/admin-auth";
import { loginAction } from "./actions";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Accesso riservato all'area di amministrazione Accordi.",
  robots: {
    index: false,
    follow: false,
  },
};

type Props = {
  searchParams?: {
    error?: string;
  };
};

export default async function AdminLoginPage({ searchParams }: Props) {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  const hasError = searchParams?.error === "invalid";

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <p className="admin-login-eyebrow">Accordi Admin</p>
        <h1>Accesso riservato</h1>
        <p className="admin-login-copy">
          L&apos;area catalogo non e accessibile pubblicamente. Effettua il login con credenziali
          admin.
        </p>
        <form action={loginAction} className="admin-login-form">
          <label className="admin-login-field">
            <span>Username</span>
            <input name="username" type="text" autoComplete="username" placeholder="admin" required />
          </label>
          <label className="admin-login-field">
            <span>Password</span>
            <input name="password" type="password" autoComplete="current-password" required />
          </label>
          {hasError ? <p className="admin-login-error">Credenziali non valide.</p> : null}
          <button type="submit" className="admin-login-button">
            Entra nell&apos;admin
          </button>
        </form>
      </section>
    </main>
  );
}
