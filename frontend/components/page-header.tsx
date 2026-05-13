import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        {eyebrow ? <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p> : null}
        <h1 className="font-headline text-4xl font-extrabold tracking-tight text-ink-strong">{title}</h1>
        <p className="max-w-2xl text-base text-ink-soft">{description}</p>
      </div>
      {actions}
    </div>
  );
}
