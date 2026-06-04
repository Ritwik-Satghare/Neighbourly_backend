"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { OwnerListingCard } from "@/components/owner-listing-card";
import { PageHeader } from "@/components/page-header";
import { StatsCard } from "@/components/stats-card";
import { stats } from "@/lib/data";
import type { UserListing } from "@/lib/data";
import { EmptyState } from "@/components/empty-state";
import { getUserListings, deleteListing } from "@/lib/api";
import { getStoredUser, getCurrentUserId } from "@/lib/auth";

import { getBookings } from "@/services/booking";

export default function DashboardPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const [userListings, setUserListings] = useState<UserListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentUser = getStoredUser();

  const loadListings = async () => {
  setIsLoading(true);

  try {
    const currentTokenId = getCurrentUserId();
    const currentId = currentTokenId ?? currentUser?.id ?? currentUser?._id;

    if (!currentId) {
      throw new Error("Please log in to view your listings.");
    }

    const response = await getUserListings(currentId);

    const listingsData = response?.listings ?? [];
    const mapped = listingsData.map((item: any) => {
      const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=1200&q=80";
      const chosenField = item.image ? 'image' : item.images?.[0] ? 'images[0]' : item.imageUrl ? 'imageUrl' : item.imageURLs?.[0] ? 'imageURLs[0]' : 'fallback';
      const image = item.image ?? item.images?.[0] ?? item.imageUrl ?? item.imageURLs?.[0] ?? FALLBACK_IMAGE;
      try { console.log(`[user listing image source] ${item.id ?? item._id ?? 'unknown'} -> ${chosenField}`); } catch (e) {}

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
  } catch {
    setUserListings([]);
  } finally {
    setIsLoading(false);
  }
};

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

  useEffect(() => {
    const loadBookings = async () => {
      setBookingError(null);
      setLoading(true);

      try {
        const response = await getBookings();
        const payload = response.data;
        const items = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.bookings)
          ? payload.bookings
          : [];

        setBookings(items);
      } catch (err) {
        setBookingError((err as Error)?.message ?? "Unable to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  useEffect(() => {
  loadListings();
}, []);

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
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-headline text-2xl font-bold text-ink-strong">My bookings</h2>
            <p className="text-sm text-ink-soft">Upcoming and recent rentals rendered from your API data.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="/messages" variant="secondary">
              Open inbox
            </Button>
            <Button href="/my-reviews" variant="secondary">
              My reviews
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-dashed border-ink-soft/20 bg-white p-8 text-center text-sm text-ink-soft">
            Loading bookings…
          </div>
        ) : bookingError ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-900">
            {bookingError}
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-ink-soft/20 bg-white p-8 text-center text-sm text-ink-soft">
            No bookings yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {bookings.map((booking) => (
              <div
                key={booking._id ?? booking.id ?? booking.bookingId ?? JSON.stringify(booking)}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-ink-soft">Booking</p>
                    <p className="mt-2 text-lg font-semibold text-ink-strong">{booking._id ?? booking.id ?? "Unknown ID"}</p>
                  </div>
                  <Link href={`/booking/${booking._id ?? booking.id ?? booking.bookingId}`} className="text-sm font-semibold text-primary underline">
                    View
                  </Link>
                </div>
                {booking.status ? (
                  <p className="mt-4 text-sm text-ink-soft">Status: {booking.status}</p>
                ) : null}
                {booking.item?.title ? (
                  <p className="mt-2 text-sm text-ink-soft">Item: {booking.item.title}</p>
                ) : null}
              </div>
            ))}
          </div>
        )}
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
