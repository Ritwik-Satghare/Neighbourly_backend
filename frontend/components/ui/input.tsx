import { cn } from "@/lib/utils";

type InputProps = {
  label: string;
  placeholder: string;
  type?: string;
  className?: string;
};

export function Input({ label, placeholder, type = "text", className }: InputProps) {
  return (
    <label className={cn("grid gap-2 text-sm font-medium text-ink-soft", className)}>
      <span>{label}</span>
      <input
        className="rounded-2xl border border-transparent bg-surface-low px-4 py-3 text-ink-strong outline-none transition focus:border-primary/40 focus:bg-surface-card"
        placeholder={placeholder}
        type={type}
      />
    </label>
  );
}
