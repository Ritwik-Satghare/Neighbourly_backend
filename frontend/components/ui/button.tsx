import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

const baseStyles =
  "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5";

const variants = {
  primary: "bg-brand-gradient text-white shadow-ambient",
  secondary: "bg-surface-card text-ink-strong",
  ghost: "bg-transparent text-primary",
};

export function Button({ children, href, variant = "primary", className }: ButtonProps) {
  const styles = cn(baseStyles, variants[variant], className);

  if (href) {
    return (
      <Link className={styles} href={href}>
        {children}
      </Link>
    );
  }

  return <button className={styles}>{children}</button>;
}
