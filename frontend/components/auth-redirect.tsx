"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  isAuthenticated,
  subscribeToAuthChanges,
} from "@/lib/auth";

export function AuthRedirect({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const authenticated = useSyncExternalStore(
    subscribeToAuthChanges,
    isAuthenticated,
    () => false
  );

  const allowedAuthPages = [
    "/send-otp",
    "/verify-otp",
  ];

  useEffect(() => {
    if (
      authenticated &&
      !allowedAuthPages.includes(pathname)
    ) {
      router.replace("/home");
    }
  }, [authenticated, pathname, router]);

  if (
    authenticated &&
    !allowedAuthPages.includes(pathname)
  ) {
    return (
      <div className="grid min-h-screen place-items-center px-4 text-sm font-medium text-ink-soft">
        Opening Neighbourly...
      </div>
    );
  }

  return children;
}