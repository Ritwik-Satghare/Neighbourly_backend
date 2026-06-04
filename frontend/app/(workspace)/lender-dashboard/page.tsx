"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { OwnerListingCard } from "@/components/owner-listing-card";
import { PageHeader } from "@/components/page-header";
import { StatsCard } from "@/components/stats-card";
import { EmptyState } from "@/components/empty-state";
import { lenderActivities, lenderStats } from "@/lib/data";
import { getUserListings, deleteListing } from "@/lib/api";
import { getStoredUser, getCurrentUserId } from "@/lib/auth";
import type { UserListing } from "@/lib/data";

export default function LenderDashboardPage() {
  const [userListings, setUserListings] = useState<UserListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const currentUser = getStoredUser();

  const loadListings = async () => {
    setIsLoading(true);
    setError("");
    try {
      const currentTokenId = getCurrentUserId();
      const currentId = currentTokenId ?? currentUser?.id ?? currentUser?._id;
      
      if (!currentId) {
        throw new Error("Please log in to view your listings.");
      }

      const response = await getUserListings(currentId);
      
      const mapped = response.listings.map((item: any) => {
        const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=1200&q=80";
        const chosenField = item.image ? 'image' : item.images?.[0] ? 'images[0]' : item.imageUrl ? 'imageUrl' : item.imageURLs?.[0] ? 'imageURLs[0]' : 'fallback';
        const image = item.image ?? item.images?.[0] ?? item.imageUrl ?? item.imageURLs?.[0] ?? FALLBACK_IMAGE;
        try { console.log(`[lender listing image source] ${item.id ?? item._id ?? 'unknown'} -> ${chosenField}`); } catch (e) {}

        return {
          id: item.id ?? item._id ?? String(Math.random()),
          title: item.title ?? item.name ?? "",
          pricePerDay: Number(item.pricePerDay ?? item.price_per_day ?? 0),
          status: item.status ?? "Active",
          image: image,
          category: item.category ?? "Tools",
          summary: item.summary ?? item.description ?? "",
          requests: item.requests ?? 0,
        } as UserListing;
      });

      setUserListings(mapped);
    } catch (err: any) {
      setError(err.message ?? "Failed to fetch listings");
      setUserListings([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) {
      return;
    }
    try {
      await deleteListing(id);
      setUserListings((curr) => curr.filter((l) => l.id !== id));
    } catch (err: any) {
      alert(err.message ?? "Failed to delete listing");
    }
  };

  return (
    <div className="grid w-full gap-8">
      <PageHeader
        eyebrow="Lender"
        title="Lender dashboard"
        description="Track owner-side performance, earnings, activity, and listing health in one dedicated workspace."
        actions={<Button href="/create-listing">Manage listings</Button>}
      />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {lenderStats.map((stat) => (
          <StatsCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] bg-surface-card p-6 shadow-ambient">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline text-2xl font-bold text-ink-strong">Performance chart</h2>
              <p className="text-sm text-ink-soft">Mock monthly earnings trend for your active inventory.</p>
            </div>
            <Button href="/notifications" variant="secondary">
              View updates
            </Button>
          </div>
          <div className="mt-8 flex h-72 items-end gap-4 rounded-[1.5rem] bg-surface-low p-6">
            {[42, 58, 49, 70, 84, 76, 92].map((value, index) => (
              <div key={index} className="flex flex-1 flex-col items-center justify-end gap-3">
                <div className="w-full rounded-t-2xl bg-brand-gradient" style={{ height: `${value}%` }} />
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"][index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] bg-surface-card p-6 shadow-ambient">
          <h2 className="font-headline text-2xl font-bold text-ink-strong">Recent activity</h2>
          <div className="mt-6 grid gap-4">
            {lenderActivities.map((activity) => (
              <article key={activity.title} className="rounded-[1.5rem] bg-surface-low p-4">
                <h3 className="font-semibold text-ink-strong">{activity.title}</h3>
                <p className="mt-2 text-sm text-ink-soft">{activity.detail}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{activity.time}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] bg-surface-low p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline text-2xl font-bold text-ink-strong">Listings overview</h2>
            <p className="text-sm text-ink-soft">Owner inventory rendered with the same reusable cards as the listings page.</p>
          </div>
          <Button href="/create-listing" variant="secondary">
            Add listing
          </Button>
        </div>

        {isLoading ? (
          <div className="mt-6 flex min-h-40 items-center justify-center text-ink-soft">
            <span>Loading inventory...</span>
          </div>
        ) : error ? (
          <div className="mt-6 flex min-h-40 items-center justify-center text-tertiary">
            <span>{error}</span>
          </div>
        ) : userListings.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="No active listings"
              description="List your first item to start earning in your neighborhood."
              ctaLabel="List an Item"
              ctaHref="/create-listing"
            />
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {userListings.map((listing) => (
              <OwnerListingCard 
                key={listing.id} 
                listing={listing} 
                onDelete={() => handleDelete(listing.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
