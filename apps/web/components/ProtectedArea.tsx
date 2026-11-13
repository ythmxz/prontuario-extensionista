"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ProtectedArea({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
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
