"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { OwnerListingCard } from "@/components/owner-listing-card";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { getUserListings } from "@/lib/api";
import { getCurrentUserId, getStoredUser } from "@/lib/auth";
import type { UserListing } from "@/lib/data";

export default function MyListingsPage() {
  const [userListings, setUserListings] = useState<UserListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadListings = async () => {
      setIsLoading(true);
      setError("");

      const currentUser = getStoredUser();
      const currentTokenId = getCurrentUserId();
      const currentId = currentTokenId ?? currentUser?.id ?? currentUser?._id;

      if (!currentId) {
        setError("Please log in to view your listings.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await getUserListings(currentId);
        const listingsData = response.listings ?? [];
        console.log("My listings response count:", listingsData.length);
        const mapped = listingsData.map((item: any) => {
          const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=1200&q=80";
          const imageSrc =
            item.image ??
            item.imageUrl ??
            item.images?.find((img: any) => img?.isPrimary)?.imageUrl ??
            item.images?.[0]?.imageUrl ??
            item.imageURLs?.[0] ??
            FALLBACK_IMAGE;
          try { console.log("My listings image mapping:", { id: item._id ?? item.id, name: item.name ?? item.title, resolved: imageSrc }); } catch (e) {}

          return {
            id: item.id ?? item._id ?? String(Math.random()),
            title: item.title ?? item.name ?? "",
            pricePerDay: Number(item.pricePerDay ?? item.price_per_day ?? 0),
            status: item.status ?? "Active",
            image: imageSrc,
            category: item.category ?? "Tools",
            summary: item.summary ?? item.description ?? "",
            requests: item.requests ?? 0,
          } as UserListing;
        });
        setUserListings(mapped);
      } catch (err: any) {
        setError(err.message ?? "Failed to load my listings.");
      } finally {
        setIsLoading(false);
      }
    };

    loadListings();
  }, []);

  return (
    <div className="grid w-full gap-10">
      <PageHeader
        eyebrow="My listings"
        title="Your current inventory"
        description="Manage the rentals you have listed in the neighborhood marketplace."
      />

      {isLoading ? (
        <div className="rounded-[2rem] bg-surface-card p-8 shadow-ambient text-center text-ink-soft">
          Loading your listings…
        </div>
      ) : error ? (
        <div className="rounded-[2rem] bg-rose-50 p-8 text-center text-sm text-rose-900">
          {error}
        </div>
      ) : userListings.length === 0 ? (
        <div className="rounded-[2rem] bg-surface-card p-8 shadow-ambient text-center text-ink-soft">
          <EmptyState
            title="No listings yet"
            description="List your first item to start earning in your neighborhood."
            ctaLabel="List an Item"
            ctaHref="/create-listing"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {userListings.map((listing) => (
            <OwnerListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
