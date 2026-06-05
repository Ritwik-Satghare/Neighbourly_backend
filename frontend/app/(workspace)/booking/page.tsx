"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { getBookings, type MockBooking } from "@/services/booking";

export default function BookingPage() {
  const [bookings, setBookings] = useState<MockBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"renter" | "owner">("renter");

  useEffect(() => {
    const loadBookings = async () => {
      setError(null);
      setLoading(true);

      try {
        // Fetch both roles and combine, deduplicating by _id
        const [renterItems, ownerItems] = await Promise.all([
          getBookings("renter").catch(() => []),
          getBookings("owner").catch(() => []),
        ]);

        const renterArr = Array.isArray(renterItems) ? renterItems : [];
        const ownerArr = Array.isArray(ownerItems) ? ownerItems : [];

        // Tag each booking with its role for display
        const renterTagged = renterArr.map((b: any) => ({ ...b, _role: "renter" as const }));
        const ownerTagged = ownerArr.map((b: any) => ({ ...b, _role: "owner" as const }));

        // Deduplicate: if same _id appears in both, keep the renter version
        const seen = new Set<string>();
        const combined: any[] = [];
        for (const b of [...renterTagged, ...ownerTagged]) {
          const key = b._id ?? b.id;
          if (!seen.has(key)) {
            seen.add(key);
            combined.push(b);
          }
        }

        setBookings(combined);
      } catch (err: unknown) {
        setError((err as Error)?.message ?? "Unable to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  // Filter by tab
  const filteredBookings = bookings.filter((b: any) => b._role === activeTab);

  // Helper: get status display info
  const getStatusBadge = (booking: MockBooking) => {
    // Check if payment is required (confirmed but not paid)
    if (booking.rawStatus === "confirmed" && booking.rentalState == null) {
      return { label: "Payment Required", color: "bg-primary-fixed text-primary" };
    }
    if (booking.rawStatus === "confirmed" && booking.rentalState === "scheduled") {
      return { label: "Scheduled", color: "bg-emerald-100 text-emerald-700" };
    }
    if (booking.rawStatus === "confirmed" && booking.rentalState === "checked_out") {
      return { label: "Checked Out", color: "bg-blue-100 text-blue-700" };
    }
    if (booking.rawStatus === "confirmed" && booking.rentalState === "returned") {
      return { label: "Returned", color: "bg-slate-100 text-slate-700" };
    }
    if (booking.status === "active") {
      return { label: "Confirmed", color: "bg-emerald-100 text-emerald-700" };
    }
    if (booking.status === "pending") {
      return { label: "Pending", color: "bg-amber-100 text-amber-700" };
    }
    if (booking.status === "completed") {
      return { label: "Completed", color: "bg-slate-100 text-slate-700" };
    }
    if (booking.status === "canceled") {
      return { label: "Canceled", color: "bg-rose-100 text-rose-700" };
    }
    return { label: booking.status, color: "bg-slate-100 text-slate-700" };
  };

  return (
    <div className="grid w-full gap-10">
      <PageHeader
        eyebrow="Bookings"
        title="Your Bookings"
        description="Manage bookings as a renter or as a listing owner."
      />

      {/* Tab switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("renter")}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
            activeTab === "renter"
              ? "bg-primary text-on-primary"
              : "bg-surface-low text-ink-soft hover:bg-surface-high"
          }`}
        >
          My Rentals
        </button>
        <button
          onClick={() => setActiveTab("owner")}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
            activeTab === "owner"
              ? "bg-primary text-on-primary"
              : "bg-surface-low text-ink-soft hover:bg-surface-high"
          }`}
        >
          As Owner
        </button>
      </div>

      {loading ? (
        <div className="rounded-[2rem] bg-surface-card p-8 shadow-ambient text-center text-ink-soft">
          Loading your bookings…
        </div>
      ) : error ? (
        <div className="rounded-[2rem] bg-rose-50 p-8 text-center text-sm text-rose-900">
          {error}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="rounded-[2rem] bg-surface-card p-8 shadow-ambient text-center text-ink-soft">
          <p className="font-semibold">
            {activeTab === "renter"
              ? "No rental bookings yet."
              : "No bookings received yet."}
          </p>
          <p className="mt-2 text-sm text-ink-soft">
            {activeTab === "renter"
              ? "Browse items and send an offer to create your first rental."
              : "When renters book your listings, they'll appear here."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredBookings.map((booking) => {
            const badge = getStatusBadge(booking);
            const isPaymentRequired =
              booking.rawStatus === "confirmed" && booking.rentalState == null;

            return (
              <div
                key={booking._id ?? booking.listingId}
                className={`rounded-[2rem] border bg-white p-6 shadow-sm transition-shadow hover:shadow-md ${
                  isPaymentRequired
                    ? "border-primary/30 ring-1 ring-primary/10"
                    : "border-slate-200"
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-ink-strong truncate">
                        {booking.itemTitle}
                      </h3>
                      <span
                        className={`shrink-0 rounded-full px-3 py-0.5 text-xs font-semibold ${badge.color}`}
                      >
                        {badge.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink-soft">
                      {booking.totalPrice != null && (
                        <span>
                          Total:{" "}
                          <span className="font-semibold text-ink-strong">
                            ₹{booking.totalPrice}
                          </span>
                        </span>
                      )}
                      {booking.pricePerDay != null && (
                        <span>
                          ₹{booking.pricePerDay} / day
                        </span>
                      )}
                      {booking.startDate && (
                        <span>
                          {new Date(booking.startDate).toLocaleDateString()} —{" "}
                          {booking.endDate
                            ? new Date(booking.endDate).toLocaleDateString()
                            : "Open"}
                        </span>
                      )}
                    </div>

                    {isPaymentRequired && activeTab === "renter" && (
                      <p className="mt-2 text-xs font-medium text-primary">
                        Owner has confirmed — complete payment to schedule your
                        rental.
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <Button
                      variant="secondary"
                      href={`/booking/${booking._id}`}
                    >
                      View Details
                    </Button>
                    {isPaymentRequired && activeTab === "renter" && (
                      <Button
                        href={`/booking/${booking._id}`}
                      >
                        Pay Now
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
