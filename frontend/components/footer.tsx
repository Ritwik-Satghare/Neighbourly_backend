import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { footerLinks } from "@/lib/data";

export function Footer() {
  return (
    <footer className="mt-20 rounded-t-[2.5rem] bg-surface-low">
      <div className="flex w-full flex-col gap-8 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="space-y-3">
          <BrandLogo />
          <p className="max-w-sm text-sm text-ink-soft">
            Built for the Modern Common. Borrow locally, earn from what you own, and keep useful things in motion.
          </p>
        </div>
        <div className="flex flex-wrap gap-5 text-sm text-ink-soft">
          {footerLinks.map((item) => (
            <Link key={item.href} className="transition hover:text-primary" href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
