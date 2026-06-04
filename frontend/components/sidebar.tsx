"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { dashboardLinks } from "@/lib/data";
import { cn } from "@/lib/utils";

type SidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  const navContent = (
    <>
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">Welcome back</p>
        <h2 className="font-headline text-xl font-bold text-ink-strong">
          Local Legend status
        </h2>
      </div>

      <nav className="grid gap-2">
        {dashboardLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={cn(
              "rounded-2xl px-4 py-3 text-sm font-medium text-ink-soft transition hover:bg-surface-card hover:text-primary",
              pathname === item.href && "bg-surface-card text-primary shadow-ambient"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-8 rounded-[1.5rem] bg-brand-gradient p-5 text-white">
        <h3 className="font-headline text-lg font-bold">List something useful</h3>
        <p className="mt-2 text-sm text-white/80">
          Turn underused gear into trusted local income.
        </p>
        <Link
          href="/create-listing"
          onClick={onClose}
          className="mt-4 inline-block rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-primary"
        >
          Create listing
        </Link>
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
