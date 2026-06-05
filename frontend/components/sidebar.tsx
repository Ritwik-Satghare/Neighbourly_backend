"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { dashboardLinks } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { clearAuthSession } from "@/lib/auth";
import { getBookings } from "@/services/booking";

type SidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = () => {
    clearAuthSession();
    router.push("/login");
  };

  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    let active = true;
    const checkNotifications = async () => {
      try {
        const ownerBookings = await getBookings("owner");
        const renterBookings = await getBookings("renter");
        
        if (!active) return;
        
        const ownerPending = ownerBookings.filter((b: any) => b.status === "pending");
        const renterAll = renterBookings;
        const activeNotifications = [...ownerPending, ...renterAll];
        
        const readKeysRaw = localStorage.getItem("neighbourly.readNotifications");
        const readKeys = readKeysRaw ? JSON.parse(readKeysRaw) : [];
        
        const unread = activeNotifications.filter(b => !readKeys.includes(`${b._id}_${b.status}`));
        setNotificationCount(unread.length);
      } catch (err) {
        console.error("Failed to check notifications in sidebar", err);
      }
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 5000);
    
    const handleRead = () => {
      checkNotifications();
    };
    window.addEventListener("neighbourly-notifications-read", handleRead);
    
    return () => {
      active = false;
      clearInterval(interval);
      window.removeEventListener("neighbourly-notifications-read", handleRead);
    };
  }, []);


  const navContent = (
    <>
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">Welcome back</p>
        <h2 className="font-headline text-xl font-bold text-ink-strong">
          Local Legend status
        </h2>
      </div>

      <nav className="grid gap-2">
        {dashboardLinks.map((item) => {
          const isNotifications = item.href === "/notifications";
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-ink-soft transition hover:bg-surface-card hover:text-primary",
                pathname === item.href && "bg-surface-card text-primary shadow-ambient"
              )}
            >
              <span>{item.label}</span>
              {isNotifications && notificationCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white shadow-sm animate-pulse">
                  {notificationCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 rounded-[1.5rem] bg-brand-gradient p-5 text-white">
        <h3 className="font-headline text-lg font-bold">List something useful</h3>
        <p className="mt-2 text-sm text-white/80">
          Turn underused gear into trusted local income.
        </p>
        <Button onClick={handleSignOut} variant="secondary" className="mt-4 w-full">
          Sign Out
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* ── Desktop sidebar ──────────────────────────────────── */}
      <aside className="hidden w-64 shrink-0 self-start rounded-[2rem] bg-surface-low p-5 lg:sticky lg:top-24 lg:block">
        {navContent}
      </aside>

      {/* ── Mobile overlay backdrop ───────────────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile slide-in drawer ────────────────────────────── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto bg-surface-low p-6 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="mb-6 flex h-9 w-9 items-center justify-center rounded-full bg-surface-card text-ink-soft transition hover:bg-surface-low hover:text-primary"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>

        {navContent}
      </aside>
    </>
  );
}
