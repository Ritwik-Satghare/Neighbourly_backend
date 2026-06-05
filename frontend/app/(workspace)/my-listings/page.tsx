"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { OwnerListingCard } from "@/components/owner-listing-card";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { getUserListings } from "@/lib/api";
import { getCurrentUserId, getStoredUser } from "@/lib/auth";
import type { UserListing } from "@/lib/data";
import { getListingImage } from "@/lib/utils";

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
          return {
            id: item.id ?? item._id ?? String(Math.random()),
            title: item.title ?? item.name ?? "",
            pricePerDay: Number(item.pricePerDay ?? item.price_per_day ?? 0),
            status: item.status ?? "Active",
            image: getListingImage(item),
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
