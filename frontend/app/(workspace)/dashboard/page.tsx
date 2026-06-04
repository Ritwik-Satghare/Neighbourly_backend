"use client";

import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/listing-card";
import { OwnerListingCard } from "@/components/owner-listing-card";
import { PageHeader } from "@/components/page-header";
import { StatsCard } from "@/components/stats-card";
import { listings, stats, userListings } from "@/lib/data";

import { getBookings } from "@/services/booking";

export default function DashboardPage() {
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
          <Button
  onClick={async () => {
    try {
      const data = await getBookings();
      console.log("BOOKINGS ARRAY:", data.data);
    } catch (err) {
      console.error(err);
    }
  }}
>
  Test Booking API
</Button>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {listings.slice(0, 3).map((listing) => (
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {userListings.slice(0, 3).map((listing) => (
            <OwnerListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>
    </div>
  );
}
