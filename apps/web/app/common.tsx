"use client";

import { useRouter } from "next/navigation";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

export async function isLoggedIn(): Promise<boolean> {
  if (!localStorage.getItem("token")) return false;

  const resp = await getWithAuth(`${API_URL}/auth/info`);
  if (!resp.ok) return false;

  return true;
}

export function logOut(): void {
  localStorage.setItem("token", "");
  const router = useRouter();
  router.replace(`/login`);
  // TODO: por que que não tá funcionando?
}

export function getWithAuth(url: string): Promise<Response> {
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
  // TODO: verificar se o token é realmente válido ou deu 401; nesse último caso, acho que lançar um erro especial ou algo assim.
  return fetch(url, { headers });
}
