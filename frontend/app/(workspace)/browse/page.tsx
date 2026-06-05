"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ListingCard } from "@/components/listing-card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/page-header";
import { categories } from "@/lib/data";
import { getAllPublicListings, searchListings } from "@/lib/api";
import type { Listing } from "@/lib/data";
import { getListingImage } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialSearch = searchParams.get("search") || "";

  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);
  const [maxDistance, setMaxDistance] = useState<number | undefined>(undefined);
  const [locality, setLocality] = useState<string>("");
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Compute displayed listings based on current filters
  const displayedListings = listings.filter((listing) => {
    const matchesCategory = selectedCategory
      ? listing.category?.toLowerCase() === selectedCategory.toLowerCase()
      : true;
    const matchesSearch = searchTerm
      ? listing.title?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    // New distance filter – parse 'Xkm away' string
    const distanceKm = listing.distance ? Number(listing.distance.replace(/[^0-9.]/g, "")) : Infinity;
    const matchesDistance = maxDistance ? distanceKm <= maxDistance : true;
    // New locality filter – use host field as a simple locality indicator
    const matchesLocality = locality ? (listing.host?.toLowerCase().includes(locality.toLowerCase())) : true;
    return matchesCategory && matchesSearch && matchesDistance && matchesLocality;
  });

  useEffect(() => {
    async function fetchListings() {
      setIsLoading(true);
      setError("");
      try {
        const response =
          selectedCategory || searchTerm
            ? await searchListings({
                category: selectedCategory || undefined,
                search: searchTerm || undefined,
              })
            : await getAllPublicListings(1, 1000);

        const listingsArray = response.listings ?? [];
        const mappedListings: Listing[] = listingsArray.map((item: any) => {
          // Normalise ID or fallback if the backend forgot to send it.
          const rawId =
            item.id ??
            item._id?.$oid ??
            (typeof item._id === "string" ? item._id : null) ??
            (item._id ? String(item._id) : null) ??
            Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

          return {
            id: rawId,
            title: item.title ?? item.name ?? "",
            category: item.category ?? "Tools",
            distance: item.distance ?? "",
            pricePerDay: Number(item.pricePerDay ?? item.price_per_day ?? 0),
            rating: item.rating ?? 4.9,
            trustScore: item.trustScore ?? item.trust_score ?? null,
            image: getListingImage(item),
            summary: item.summary ?? item.description ?? "",
            host: item.host ?? "Neighbor",
            badge: item.badge,
            ownerId: item.userId ?? item.ownerId ?? item.owner ?? null,
          };
        });

        setListings(mappedListings);
      } catch (err: any) {
        console.error("Failed to fetch listings:", err);
        setError(err?.message ?? "Failed to load listings.");
        // Clear listings on error to avoid stale data
        setListings([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchListings();
  }, [selectedCategory, searchTerm]);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory((current) =>
      current === categoryName ? "" : categoryName
    );
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10">
      <main className="w-full py-4">
        <div className="grid gap-8">
          {/* Header */}
          <PageHeader
            eyebrow="Browse"
            title="Neighborhood rentals"
            description="Click any item to view its full details and request to rent."
          />

          {/* Search */}
          <div className="mb-4">
            <Input
              label="Search listings"
              placeholder="Search listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md"
            />
          </div>

          {/* Category filters */}
          <div className="rounded-3xl bg-surface-low p-5 shadow-ambient">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
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
              <div className="flex items-center gap-4">
                {/* Max distance filter */}
                <input
                  type="number"
                  min="0"
                  placeholder="Max km"
                  value={maxDistance ?? ""}
                  onChange={(e) => setMaxDistance(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-24 rounded border p-1 text-sm"
                />
                {/* Locality filter */}
                <input
                  type="text"
                  placeholder="Locality"
                  value={locality ?? ""}
                  onChange={(e) => setLocality(e.target.value)}
                  className="rounded border p-1 text-sm"
                />
                <div className="rounded-2xl bg-primary-fixed px-5 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Trust Score
                  </p>
                  <p className="text-lg font-bold text-primary">90%+</p>
                </div>
              </div>
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="flex min-h-60 items-center justify-center rounded-[2rem] bg-surface-low p-8 text-center text-ink-soft">
              <span className="font-semibold">Loading neighborhood listings...</span>
            </div>
          ) : error ? (
            <div className="flex min-h-60 items-center justify-center rounded-[2rem] bg-tertiary-fixed p-8 text-center text-tertiary">
              <span className="font-semibold">{error}</span>
            </div>
          ) : displayedListings.length === 0 ? (
            <div className="flex min-h-60 items-center justify-center rounded-[2rem] bg-surface-low p-8 text-center text-ink-soft">
              <span className="font-semibold">
                No listings found. Be the first to list!
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayedListings.map((listing) => (
                <ListingCard 
                  key={listing.id} 
                  listing={listing} 
                  onClick={() => router.push(`/item/${listing.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}