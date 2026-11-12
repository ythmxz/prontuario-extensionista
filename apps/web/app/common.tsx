"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

export function isLoggedIn(): boolean {
  if (!localStorage.getItem("token")) return false;
  // TODO: verificar se o login é inválido
  return true;
}

/**
 * Elemento que protege uma área que precisa de login.
 */
export function ProtectedArea({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) {
      const currentRoute = `${pathname}${
        searchParams.size ? `?${searchParams.toString()}` : ""
      }`;

      router.replace(`/login?returnTo=${encodeURIComponent(currentRoute)}`);
      return;
    }

    setChecking(false);
  }, [pathname, router, searchParams]);

  if (checking) return null;

  return children;
}
