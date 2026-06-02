"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, subscribeToAuthChanges } from "@/lib/auth";

export function AuthRedirect({ children }: { children: ReactNode }) {
  const router = useRouter();
  const authenticated = useSyncExternalStore(subscribeToAuthChanges, isAuthenticated, () => false);

  useEffect(() => {
    if (authenticated) {
      router.replace("/home");
    }
  }, [authenticated, router]);

  if (authenticated) {
    return (
      <div className="grid min-h-screen place-items-center px-4 text-sm font-medium text-ink-soft">
        Opening Neighbourly...
      </div>
    );
  }

  return children;
}
