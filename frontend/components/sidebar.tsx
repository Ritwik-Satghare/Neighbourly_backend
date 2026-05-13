"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardLinks } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 self-start rounded-[2rem] bg-surface-low p-5 lg:sticky lg:top-24 lg:block">
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">Welcome back</p>
        <h2 className="font-headline text-xl font-bold text-ink-strong">Local Legend status</h2>
      </div>
      <nav className="grid gap-2">
        {dashboardLinks.map((item) => (
          <Link
            key={item.href}
            className={cn(
              "rounded-2xl px-4 py-3 text-sm font-medium text-ink-soft transition hover:bg-surface-card hover:text-primary",
              pathname === item.href && "bg-surface-card text-primary shadow-ambient",
            )}
            href={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-8 rounded-[1.5rem] bg-brand-gradient p-5 text-white">
        <h3 className="font-headline text-lg font-bold">List something useful</h3>
        <p className="mt-2 text-sm text-white/80">Turn underused gear into trusted local income.</p>
        <Link className="mt-4 inline-block rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-primary" href="/create-listing">
          Create listing
        </Link>
      </div>
    </aside>
  );
}
