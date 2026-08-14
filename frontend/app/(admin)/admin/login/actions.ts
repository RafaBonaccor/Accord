"use server";

import { redirect } from "next/navigation";

import { setAdminSession, validateAdminCredentials } from "../../../../lib/admin-auth";

export async function loginAction(formData: FormData): Promise<void> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!validateAdminCredentials(username, password)) {
    redirect("/admin/login?error=invalid");
  }

  await setAdminSession();
  redirect("/admin");
}
