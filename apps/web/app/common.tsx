"use client";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

export function isLoggedIn(): boolean {
  if (!localStorage.getItem("token")) return false;
  // TODO: verificar se o login é inválido
  return true;
}
