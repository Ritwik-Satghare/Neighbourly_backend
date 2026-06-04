"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { OwnerListingCard } from "@/components/owner-listing-card";
import { PageHeader } from "@/components/page-header";
import { StatsCard } from "@/components/stats-card";
import { listings, stats, userListings } from "@/lib/data";

import { getBookings } from "@/services/booking";

export default function DashboardPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBookings = async () => {
      setError(null);
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
        setError((err as Error)?.message ?? "Unable to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
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
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-dashed border-ink-soft/20 bg-white p-8 text-center text-sm text-ink-soft">
            Loading bookings…
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-900">
            {error}
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
