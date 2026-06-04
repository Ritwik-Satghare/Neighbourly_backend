"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/listing-card";
import { PageHeader } from "@/components/page-header";
import { categories } from "@/lib/data";
import { getAllListings, searchListings, type ListingResponse } from "@/lib/api";
import type { Listing } from "@/lib/data";

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialSearch = searchParams.get("search") || "";

  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchListings() {
      setIsLoading(true);
      try {
        const response = (selectedCategory || initialSearch)
          ? await searchListings({
              category: selectedCategory || undefined,
              search: initialSearch || undefined,
            })
          : await getAllListings(1, 100);

        // Debug: raw API response and counts
        console.log("Listings API response:", response);
        const listingsArray = response.listings ?? [];
        console.log("Total listings received:", listingsArray.length);

        const mappedListings: Listing[] = listingsArray.map((item: any) => {
          const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=1200&q=80";
          const imageSrc =
            item.image ??
            item.imageUrl ??
            item.images?.find((img: any) => img?.isPrimary)?.imageUrl ??
            item.images?.[0]?.imageUrl ??
            item.imageURLs?.[0] ??
            FALLBACK_IMAGE;

          // Temporary debug logging to trace where images come from
          try {
            console.log("Listing image mapping:", {
              listingName: item.name ?? item.title,
              image: item.image,
              imageUrl: item.imageUrl,
              images: item.images,
              resolvedImage: imageSrc,
            });
          } catch (e) {}

          try { console.log("Listing:", item._id, item.name, item.ownerID); } catch (e) {}

          return {
            id: item.id ?? item._id ?? String(Math.random()),
            title: item.title ?? item.name ?? "",
            category: item.category ?? "Tools",
            distance: item.distance ?? "0.8km away",
            pricePerDay: Number(item.pricePerDay ?? item.price_per_day ?? 0),
            rating: item.rating ?? 4.9,
            trustScore: item.trustScore ?? item.trust_score ?? 98,
            image: imageSrc,
            summary: item.summary ?? item.description ?? "",
            host: item.host ?? "Neighbor",
            badge: item.badge,
          } as Listing;
        });

        setListings(mappedListings);
        console.log("Mapped listings:", mappedListings);
      } catch (err: any) {
        // If the API request fails (e.g., auth token missing or invalid), surface the error with structured details.
        console.error("Failed to fetch listings from API:", {
          error: err,
          message: err?.message,
          response: err?.response,
        });
        // Show the error to the user instead of silent fallback.
        const errMsg = err?.message ?? "Failed to load listings.";
        setError(errMsg);
        // Optionally you could still show static demo data, uncomment the lines below if desired:
        // const { listings: staticListings } = await import("@/lib/data");
        // setListings(staticListings);
        // (keep error visible)
      } finally {
        setIsLoading(false);
      }
    }

    fetchListings();
  }, [selectedCategory, initialSearch]);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory((current) => (current === categoryName ? "" : categoryName));
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10">
      <main className="w-full py-4">
        <div className="grid gap-8">
          
          {/* Header */}
          <PageHeader
            eyebrow="Browse"
            title="Neighborhood rentals"
            description="Showing curated results near Greenpoint with consistent cards, actions, and item routing."
            actions={
              listings.length > 0 ? (
                <Button href={`/item/${listings[0].id}`}>Open featured item</Button>
              ) : undefined
            }
          />

          {/* Horizontal Filters */}
          <div className="rounded-3xl bg-surface-low p-5 shadow-ambient">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              
              {/* Categories */}
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => {
                  const isSelected = selectedCategory.toLowerCase() === category.name.toLowerCase();
                  return (
                    <button
                      key={category.name}
                      onClick={() => handleCategoryClick(category.name)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition hover:scale-105 ${category.accent} ${
                        isSelected ? "ring-2 ring-primary ring-offset-2" : ""
                      }`}
                    >
                      {category.name}
                    </button>
                  );
                })}
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

          {/* Listings Grid */}
          {isLoading ? (
            <div className="flex min-h-60 items-center justify-center rounded-[2rem] bg-surface-low p-8 text-center text-ink-soft">
              <span className="font-semibold">Loading neighborhood listings...</span>
            </div>
          ) : error ? (
            <div className="flex min-h-60 items-center justify-center rounded-[2rem] bg-tertiary-fixed p-8 text-center text-tertiary">
              <span className="font-semibold">{error}</span>
            </div>
          ) : listings.length === 0 ? (
            <div className="flex min-h-60 items-center justify-center rounded-[2rem] bg-surface-low p-8 text-center text-ink-soft">
              <span className="font-semibold">No listings found in this category. Be the first to list!</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
