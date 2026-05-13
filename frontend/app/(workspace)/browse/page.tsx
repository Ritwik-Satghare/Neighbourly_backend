import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/listing-card";
import { PageHeader } from "@/components/page-header";
import { categories, listings } from "@/lib/data";

export default function BrowsePage() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-10">
      <main className="w-full py-4">
        <div className="grid gap-8">
          
          {/* Header */}
          <PageHeader
            eyebrow="Browse"
            title="Neighborhood rentals"
            description="Showing curated results near Greenpoint with consistent cards, actions, and item routing."
            actions={<Button href="/item/stumpjumper-evo">Open featured item</Button>}
          />

          {/* Horizontal Filters */}
          <div className="rounded-3xl bg-surface-low p-5 shadow-ambient">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              
              {/* Categories */}
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition hover:scale-105 ${category.accent}`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Trust Score */}
              <div className="rounded-2xl bg-primary-fixed px-5 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Trust Score
                </p>
                <p className="text-lg font-bold text-primary">90%+</p>
              </div>
            </div>
          </div>

          {/* Listings */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
