import { ArrowRight, BadgeCheck, Handshake, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified local trust",
    copy: "Build confidence with identity-aware profiles, trust scores, and transparent rental history.",
  },
  {
    icon: Handshake,
    title: "Simple neighborhood bookings",
    copy: "Move from discovery to pickup with clear availability, messaging, and handoff context.",
  },
  {
    icon: BadgeCheck,
    title: "Condition-first rentals",
    copy: "Support safer sharing with listing details, verification steps, and return-ready workflows.",
  },
];

export default function LandingPage() {
  return (
    <main className="w-full">
      <section className="px-4 pb-12 pt-10 sm:px-6 lg:px-8">
        <div className="grid min-h-[calc(100vh-9rem)] gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div className="max-w-3xl space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-fixed px-4 py-2 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              Local marketplace for useful things
            </span>
            <div className="space-y-5">
              <h1 className="font-headline text-5xl font-extrabold leading-tight tracking-tight text-ink-strong md:text-7xl">
                Neighbourly turns nearby stuff into shared value.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-ink-soft">
                Borrow trusted tools, cameras, outdoor gear, and hosting essentials from real neighbors, or earn from the items you already own.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/signup" className="justify-center">
                Start sharing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button href="/login" variant="secondary" className="justify-center">
                Login
              </Button>
            </div>
            <div className="grid max-w-2xl gap-3 text-sm text-ink-soft sm:grid-cols-3">
              <span className="rounded-2xl bg-surface-low px-4 py-3">Verified neighbors</span>
              <span className="rounded-2xl bg-surface-low px-4 py-3">Protected rentals</span>
              <span className="rounded-2xl bg-surface-low px-4 py-3">Fast local pickup</span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] bg-brand-gradient p-6 text-white shadow-ambient">
            <div className="absolute inset-0 bg-page-glow opacity-60" />
            <div className="relative grid gap-5">
              <div className="rounded-[1.5rem] bg-white/12 p-5 backdrop-blur">
                <p className="text-sm uppercase tracking-[0.18em] text-white/70">Featured nearby</p>
                <h2 className="mt-4 font-headline text-3xl font-extrabold">Sony Alpha creator kit</h2>
                <p className="mt-2 text-sm text-white/75">2.1 km away · $85/day · 96 trust score</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] bg-white/12 p-5 backdrop-blur">
                  <p className="font-headline text-4xl font-extrabold">1.2k+</p>
                  <p className="mt-2 text-sm text-white/75">active neighbors</p>
                </div>
                <div className="rounded-[1.5rem] bg-white/12 p-5 backdrop-blur">
                  <p className="font-headline text-4xl font-extrabold">98%</p>
                  <p className="mt-2 text-sm text-white/75">average handoff rating</p>
                </div>
              </div>
              <div className="rounded-[1.5rem] bg-white p-5 text-ink-strong">
                <p className="text-sm font-semibold text-primary">Next booking</p>
                <p className="mt-2 font-headline text-2xl font-bold">Weekend projector pickup</p>
                <p className="mt-2 text-sm text-ink-soft">Messaging, verification, and return notes stay in one flow.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <h2 className="font-headline text-4xl font-extrabold text-ink-strong">Built for high-trust local rentals</h2>
          <p className="mt-3 text-ink-soft">
            Neighbourly gives borrowers and lenders a calmer way to discover, book, and manage shared items.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="rounded-[1.75rem] bg-surface-card p-7 shadow-ambient">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-fixed text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-6 font-headline text-2xl font-bold text-ink-strong">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-ink-soft">{feature.copy}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="how-it-works" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-surface-low px-6 py-10 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <h2 className="font-headline text-4xl font-extrabold text-ink-strong">From signup to handoff in minutes</h2>
              <p className="mt-3 text-ink-soft">
                Public visitors can learn the marketplace, create an account, and land directly in the authenticated app.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {["Create a profile", "Find or list an item", "Coordinate pickup"].map((step, index) => (
                <div key={step} className="rounded-[1.5rem] bg-surface-card p-5">
                  <p className="font-headline text-4xl font-extrabold text-primary/25">0{index + 1}</p>
                  <p className="mt-5 text-sm font-bold text-ink-strong">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="trust" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-ink-strong px-6 py-10 text-white md:flex-row md:items-center lg:px-10">
          <div>
            <h2 className="font-headline text-4xl font-extrabold">Ready to borrow smarter?</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">
              Join the marketplace, then head to your workspace home to browse listings, manage dashboards, message neighbors, and verify rentals.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button href="/signup" className="justify-center bg-white text-primary">
              Sign Up
            </Button>
            <Button href="/login" variant="ghost" className="justify-center text-white">
              Login
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
