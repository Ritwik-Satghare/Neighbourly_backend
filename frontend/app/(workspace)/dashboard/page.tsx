"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { StatsCard } from "@/components/stats-card";
import { OwnerListingCard } from "@/components/owner-listing-card";
import { EmptyState } from "@/components/empty-state";

import { getUserListings, deleteListing, normaliseId } from "@/lib/api";
import { getBookings } from "@/services/booking";
import { clearAuthSession, getStoredUser, getCurrentUserId } from "@/lib/auth";
import { getListingImage } from "@/lib/utils";
import type { UserListing } from "@/lib/data";

export default function DashboardPage() {
  const router = useRouter();

  const handleSignOut = () => {
    clearAuthSession();
    router.push("/login");
  };

  // Listings state
  const [userListings, setUserListings] = useState<UserListing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [listingsError, setListingsError] = useState<string>("");

  // Bookings state
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState<string | null>(null);

  // Fetch user listings on mount
  useEffect(() => {
    const loadListings = async () => {
      setListingsLoading(true);
      setListingsError("");
      try {
        const currentUser = getStoredUser();
        const currentTokenId = getCurrentUserId();
        const currentId = currentTokenId ?? currentUser?.id ?? currentUser?._id;

        if (!currentId) {
          throw new Error("Please log in to view your listings.");
        }

        const response = await getUserListings(currentId);
        const mapped = (response.listings ?? []).map((item: any) => ({
          id: normaliseId(item) ?? String(Math.random()),
          title: item.title ?? item.name ?? "",
          pricePerDay: Number(item.pricePerDay ?? item.price_per_day ?? 0),
          status: item.status ?? "Active",
          image: getListingImage(item),
          category: item.category ?? "Tools",
          summary: item.summary ?? item.description ?? "",
          requests: item.requests ?? 0,
        }));
        setUserListings(mapped);
      } catch (err: any) {
        setListingsError(err.message ?? "Failed to load listings.");
      } finally {
        setListingsLoading(false);
      }
    };

    loadListings();
  }, []);

  // Fetch bookings on mount
  useEffect(() => {
    const loadBookings = async () => {
      setBookingsError(null);
      setBookingsLoading(true);

      try {
        const data = await getBookings();
        // getBookings returns MockBooking[] directly
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        setBookingsError((err as Error)?.message ?? "Unable to load bookings.");
      } finally {
        setBookingsLoading(false);
      }
    };

    loadBookings();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    try {
      await deleteListing(id);
      setUserListings((curr) => curr.filter((l) => l.id !== id));
    } catch (err: any) {
      alert(err.message ?? "Failed to delete listing");
    }
  };

  // Compute stats from real data
  const stats = [
    { label: "Total Listings", value: String(userListings.length), note: "Items you've listed" },
    { label: "Active Bookings", value: String(bookings.filter((b) => b.status === "active").length), note: "Currently rented" },
    { label: "Pending Requests", value: String(bookings.filter((b) => b.status === "pending").length), note: "Awaiting approval" },
    { label: "Completed", value: String(bookings.filter((b) => b.status === "completed").length), note: "All time" },
  ];

  return (
    <div className="flex flex-col gap-8 p-6">
      <PageHeader
        title="Manage your local impact"
        description="Track performance, active rentals, and your best‑performing listings from one shared app shell."
        actions={<></>}
      />

      {/* Stats */}
      <section className="grid w-full gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard key={stat.label} {...stat} />
        ))}
      </section>

      {/* Bookings */}
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

        {bookingsLoading ? (
          <div className="rounded-3xl border border-dashed border-ink-soft/20 bg-white p-8 text-center text-sm text-ink-soft">
            Loading bookings…
          </div>
        ) : bookingsError ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-900">
            {bookingsError}
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-ink-soft/20 bg-white p-8 text-center text-sm text-ink-soft">No bookings yet.</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-ink-soft">Booking ID</p>
                      <p className="mt-2 text-sm font-semibold text-ink-strong">{booking._id}</p>
                    </div>
                    {booking.status === "active" && (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                        Accepted
                      </span>
                    )}
                    {booking.status === "pending" && (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                        Pending
                      </span>
                    )}
                  </div>
                  <p className="mt-4 font-headline text-lg font-bold text-ink-strong">{booking.itemTitle}</p>
                </div>
                <div className="mt-6 flex justify-between items-center border-t border-slate-100 pt-4">
                  <p className="text-sm font-semibold text-primary">${booking.pricePerDay} / day</p>
                  <Button variant="secondary" size="sm">Details</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Listings */}
      <section className="grid w-full gap-6 rounded-[2rem] bg-surface-low p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline text-2xl font-bold text-ink-strong">My listings</h2>
            <p className="text-sm text-ink-soft">Monitor listed items, status, and quick actions from the same dashboard.</p>
          </div>
          <Button href="/lender-dashboard" variant="secondary">Open lender dashboard</Button>
        </div>
        
        {listingsLoading ? (
          <div className="flex min-h-40 items-center justify-center text-ink-soft">
            <span>Loading listings...</span>
          </div>
        ) : listingsError ? (
          <div className="flex min-h-40 items-center justify-center text-tertiary">
            <span>{listingsError}</span>
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
              <OwnerListingCard key={listing.id} listing={listing} onDelete={() => handleDelete(listing.id)} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
