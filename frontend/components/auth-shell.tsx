import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthShell({ title, description, children }: AuthShellProps) {
  return (
    <div className="grid min-h-[calc(100vh-8rem)] items-center px-5 py-10 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[2rem] bg-surface-low shadow-ambient lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden min-h-[640px] overflow-hidden bg-brand-gradient p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-page-glow opacity-70" />
          <div className="relative z-10">
            <p className="font-headline text-3xl font-extrabold">Neighbourly</p>
          </div>
          <div className="relative z-10 max-w-md space-y-6">
            <h2 className="font-headline text-5xl font-extrabold leading-tight">
              Trust starts with the people already around you.
            </h2>
            <p className="text-base text-white/80">
              Verified neighbors, editorial-quality listings, and a rental flow that feels warm instead of transactional.
            </p>
            <div className="grid gap-3 text-sm text-white/85">
              <p>Verified local identity</p>
              <p>Protection-backed bookings</p>
              <p>Condition-first handoffs</p>
            </div>
          </div>
          <p className="relative z-10 text-sm text-white/70">Trusted by 1,200+ active neighbors this week.</p>
        </section>
        <section className="bg-surface-card p-8 md:p-12">
          <div className="mx-auto max-w-md">
            <div className="mb-8">
              <h1 className="font-headline text-3xl font-extrabold text-ink-strong">{title}</h1>
              <p className="mt-2 text-sm text-ink-soft">{description}</p>
            </div>
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}
