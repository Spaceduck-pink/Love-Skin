"use server";

import { redirect } from "next/navigation";
import { createAdminSession, destroyAdminSession, safeCompare } from "./admin-auth";

export interface LoginState {
  error?: string;
}

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return { error: "Admin login is not configured on the server." };
  }

  if (!password || !safeCompare(password, adminPassword)) {
    return { error: "Incorrect password." };
  }

  await createAdminSession();
  redirect("/admin");
}

export async function logout() {
  await destroyAdminSession();
  redirect("/admin/login");
}
