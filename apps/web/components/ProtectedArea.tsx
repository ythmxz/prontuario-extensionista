"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { isLoggedIn } from "@/app/common";

export default function ProtectedArea({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function doIt() {
      const logged = await isLoggedIn();
      if (!logged) {
        const currentRoute = `${pathname}${
          searchParams.size ? `?${searchParams.toString()}` : ""
        }`;
        router.replace(`/login?returnTo=${encodeURIComponent(currentRoute)}`);
        return;
      }
      setChecking(false);
    }
    doIt();
  }, [pathname, router, searchParams]);

  if (checking) return null;

  return children;
}
