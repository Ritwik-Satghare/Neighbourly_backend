import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categories, listings } from "@/lib/data";
import { ListingCard } from "@/components/listing-card";

export default function HomePage() {
  return (
    <main className="w-full">
      <section className="grid gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-8">
          <span className="inline-flex rounded-full bg-primary-fixed px-4 py-2 text-sm font-semibold text-primary">
            The Modern Common for local rentals
          </span>
          <div className="space-y-5">
            <h1 className="max-w-3xl font-headline text-5xl font-extrabold leading-tight tracking-tight text-ink-strong md:text-6xl">
              Rent what you need from neighbors you can actually trust.
            </h1>
            <p className="max-w-2xl text-lg text-ink-soft">
              Browse high-quality tools, tech, outdoor gear, and hosting essentials without buying more stuff.
            </p>
          </div>
          <div className="flex max-w-2xl flex-col gap-3 rounded-[1.75rem] bg-surface-card p-3 shadow-ambient md:flex-row">
            <div className="flex flex-1 items-center gap-3 rounded-2xl bg-surface-low px-4 py-4">
              <Search className="h-5 w-5 text-primary" />
              <span className="text-sm text-ink-soft">Search for cameras, drills, coolers, and more</span>
            </div>
            <Button href="/browse">Search Local</Button>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-ink-soft">
            <span className="rounded-full bg-surface-low px-4 py-2">1,200+ active neighbors</span>
            <span className="rounded-full bg-surface-low px-4 py-2">Protection-backed rentals</span>
            <span className="rounded-full bg-surface-low px-4 py-2">Condition-first verification</span>
          </div>
        </div>
        <div className="rounded-[2rem] bg-brand-gradient p-8 text-white shadow-ambient">
          <div className="grid gap-8">
            <div className="rounded-[1.75rem] bg-white/10 p-6 backdrop-blur-sm">
              <p className="text-sm uppercase tracking-[0.18em] text-white/70">Rentability Score</p>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="font-headline text-6xl font-extrabold">92%</p>
                  <p className="text-sm text-white/75">Top 5% in your area</p>
                </div>
                <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">Excellent</span>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {categories.map((category) => (
                <div key={category.name} className="rounded-[1.5rem] bg-white/10 p-5 backdrop-blur-sm">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${category.accent}`}>
                    {category.name}
                  </span>
                  <p className="mt-4 text-sm text-white/80">{category.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-headline text-4xl font-extrabold text-ink-strong">Explore the neighborhood shelf</h2>
            <p className="mt-3 max-w-xl text-ink-soft">
              Shared components now power the browse experience, cards, filters, and item pages.
            </p>
          </div>
          <Button href="/browse" variant="ghost">
            Browse all listings
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {listings.slice(0, 3).map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      <section className="rounded-[2.5rem] bg-surface-low px-6 py-12 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {[
            ["Browse", "Search by category, trust score, and distance to find exactly what you need nearby."],
            ["Book", "Move from listing to messaging and verification without losing context."],
            ["Borrow locally", "Pick up from a verified neighbor and keep useful things circulating in your community."],
          ].map(([title, copy], index) => (
            <div key={title} className="rounded-[1.75rem] bg-surface-card p-8 shadow-ambient">
              <p className="font-headline text-5xl font-extrabold text-primary/20">0{index + 1}</p>
              <h3 className="mt-6 font-headline text-2xl font-bold text-ink-strong">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-ink-soft">{copy}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
