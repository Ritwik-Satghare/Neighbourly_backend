import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

type InputProps = {
  label: string;
  placeholder: string;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function Input({ label, placeholder, type = "text", className, ...props }: InputProps) {
  return (
    <label className={cn("grid gap-2 text-sm font-medium text-ink-soft", className)}>
      <span>{label}</span>
      <input
        className="rounded-2xl border border-transparent bg-surface-low px-4 py-3 text-ink-strong outline-none transition focus:border-primary/40 focus:bg-surface-card"
        placeholder={placeholder}
        type={type}
        {...props}
      />
    </label>
  );
}
