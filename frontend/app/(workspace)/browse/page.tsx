import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/listing-card";
import { PageHeader } from "@/components/page-header";
import { categories, listings } from "@/lib/data";

export default function BrowsePage() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-10">
      <div className="flex w-full flex-col gap-6 lg:flex-row">
        <aside className="h-fit w-full rounded-[2rem] bg-surface-low p-6 lg:sticky lg:top-24 lg:w-64 lg:shrink-0">
        <h2 className="font-headline text-2xl font-bold text-ink-strong">Filters</h2>
        <div className="mt-6 grid gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">Categories</p>
            <div className="mt-3 grid gap-3">
              {categories.map((category) => (
                <div key={category.name} className="rounded-2xl bg-surface-card p-4 text-sm shadow-ambient">
                  <div className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${category.accent}`}>
                    {category.name}
                  </div>
                  <p className="mt-3 text-ink-soft">{category.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-primary-fixed p-4">
            <p className="text-sm font-semibold text-primary">Minimum trust score</p>
            <p className="mt-2 font-headline text-3xl font-extrabold text-primary">90%+</p>
            <p className="mt-1 text-sm text-primary/80">Only show highly rated neighbors.</p>
          </div>
        </div>
        </aside>

        <main className="flex-1 px-0 py-0 lg:px-6 lg:py-4">
          <div className="grid gap-8">
            <PageHeader
              eyebrow="Browse"
              title="Neighborhood rentals"
              description="Showing curated results near Greenpoint with consistent cards, actions, and item routing."
              actions={<Button href="/item/stumpjumper-evo">Open featured item</Button>}
            />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
