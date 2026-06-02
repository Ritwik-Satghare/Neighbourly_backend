"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isAuthenticated, subscribeToAuthChanges } from "@/lib/auth";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const authenticated = useSyncExternalStore(subscribeToAuthChanges, isAuthenticated, () => false);

  useEffect(() => {
    if (!authenticated) {
      const next = encodeURIComponent(pathname);
      router.replace(`/login?next=${next}`);
    }
  }, [authenticated, pathname, router]);

  if (!authenticated) {
    return (
      <div className="grid min-h-[60vh] place-items-center px-4 text-sm font-medium text-ink-soft">
        Checking your session...
      </div>
    );
  }

  return children;
}
