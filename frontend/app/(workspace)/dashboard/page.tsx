"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/listing-card";
import { OwnerListingCard } from "@/components/owner-listing-card";
import { PageHeader } from "@/components/page-header";
import { StatsCard } from "@/components/stats-card";
import { EmptyState } from "@/components/empty-state";
import { listings as mockBookings, stats } from "@/lib/data";
import { getUserListings, deleteListing } from "@/lib/api";
import { getStoredUser, getCurrentUserId } from "@/lib/auth";
import type { UserListing } from "@/lib/data";

export default function DashboardPage() {
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
      
      const mapped = response.listings.map((item: any) => ({
        id: item.id ?? item._id ?? String(Math.random()),
        title: item.title ?? item.name ?? "",
        pricePerDay: Number(item.pricePerDay ?? item.price_per_day ?? 0),
        status: item.status ?? "Active",
        image: item.image ?? item.images?.[0] ?? "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=1200&q=80",
        category: item.category ?? "Tools",
        summary: item.summary ?? item.description ?? "",
        requests: item.requests ?? 0,
      }));

      setUserListings(mapped);
    } catch (err: any) {
      const msg = err.message ?? "Failed to fetch listings";
      if (msg.toLowerCase().includes("token")) {
        // Silent ignore token issues; UI will show empty state
        setError("");
      } else {
        setError(msg);
      }
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
    <div className="grid w-full gap-10">
      <PageHeader
        eyebrow="Dashboard"
        title="Manage your local impact"
        description="Track performance, active rentals, and your best-performing listings from one shared app shell."
        actions={<Button href="/create-listing">List new item</Button>}
      />

      <section className="grid w-full gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="grid w-full gap-6 rounded-[2rem] bg-surface-low p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline text-2xl font-bold text-ink-strong">My bookings</h2>
            <p className="text-sm text-ink-soft">Upcoming and recent rentals rendered from shared listing data.</p>
          </div>
          <Button href="/messages" variant="secondary">
            Open inbox
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {mockBookings.slice(0, 3).map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      <section className="grid w-full gap-6 rounded-[2rem] bg-surface-low p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline text-2xl font-bold text-ink-strong">My listings</h2>
            <p className="text-sm text-ink-soft">Monitor listed items, status, and quick actions from the same dashboard.</p>
          </div>
          <Button href="/lender-dashboard" variant="secondary">
            Open lender dashboard
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex min-h-40 items-center justify-center text-ink-soft">
            <span>Loading listings...</span>
          </div>
        ) : error ? (
          <div className="flex min-h-40 items-center justify-center text-tertiary">
            <span>{error}</span>
          </div>
        ) : userListings.length === 0 ? (
          <EmptyState
            title="No listings yet"
            description="List your first item to start earning in your neighborhood."
            ctaLabel="List an Item"
            ctaHref="/create-listing"
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {userListings.slice(0, 3).map((listing) => (
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
