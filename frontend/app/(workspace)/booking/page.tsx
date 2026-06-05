"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { getBookings } from "@/services/booking";

export default function BookingPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBookings = async () => {
      setError(null);
      setLoading(true);

      try {
        const items = await getBookings();
        setBookings(Array.isArray(items) ? items : []);
      } catch (err: unknown) {
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
        eyebrow="Bookings"
        title="Your active bookings"
        description="See all bookings created for you after offers were accepted."
      />

      {loading ? (
        <div className="rounded-[2rem] bg-surface-card p-8 shadow-ambient text-center text-ink-soft">
          Loading your bookings…
        </div>
      ) : error ? (
        <div className="rounded-[2rem] bg-rose-50 p-8 text-center text-sm text-rose-900">
          {error}
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-[2rem] bg-surface-card p-8 shadow-ambient text-center text-ink-soft">
          <p className="font-semibold">No bookings yet.</p>
          <p className="mt-2 text-sm text-ink-soft">Accept an offer to create your first booking.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div key={booking._id ?? booking.id ?? booking.bookingId ?? JSON.stringify(booking)}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-ink-soft">Booking ID</p>
                  <p className="mt-2 text-lg font-semibold text-ink-strong">{booking._id ?? booking.id ?? booking.bookingId}</p>
                  {booking.status ? <p className="mt-1 text-sm text-ink-soft">Status: {booking.status}</p> : null}
                </div>
                <Button href={`/booking/${booking._id ?? booking.id ?? booking.bookingId}`}>
                  View details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
