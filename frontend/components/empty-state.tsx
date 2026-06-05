import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
};

export function EmptyState({ title, description, ctaLabel, ctaHref }: EmptyStateProps) {
  return (
    <div className="rounded-[2rem] bg-surface-card p-8 text-center shadow-ambient">
      <h3 className="font-headline text-2xl font-bold text-ink-strong">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-sm text-ink-soft">{description}</p>
      <Button className="mt-6" href={ctaHref}>
        {ctaLabel}
      </Button>
    </div>
  );
}
