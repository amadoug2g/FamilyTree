"use server";

import { redirect } from "next/navigation";
import { signIn, signOut } from "@/lib/auth";

export async function login(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const ok = await signIn(password);
  if (!ok) {
    redirect("/login?error=1");
  }
  redirect("/people");
}

export async function logout() {
  await signOut();
  redirect("/");
}
