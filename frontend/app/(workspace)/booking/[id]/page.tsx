"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { cancelBooking, confirmOrCompleteBooking, getBookingById } from "@/services/booking";

export default function BookingDetailsPage() {
  const params = useParams();
  const bookingId = params?.id as string | undefined;

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadBooking = useCallback(async () => {
    if (!bookingId) {
      setError("Booking ID is missing from the route.");
      setLoading(false);
      return;
    }

    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const response = await getBookingById(bookingId);
      const data = response as any;
      setBooking(data.booking ?? data);
    } catch (err) {
      setError((err as Error)?.message ?? "Unable to load booking details.");
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    loadBooking();
  }, [loadBooking]);

  const handleCancel = async () => {
    if (!bookingId) {
      setError("Booking ID is missing.");
      return;
    }

    setError(null);
    setSuccessMessage(null);
    setActionLoading(true);

    try {
      await cancelBooking(bookingId);
      setSuccessMessage("Booking canceled successfully.");
      await loadBooking();
    } catch (err) {
      setError((err as Error)?.message ?? "Failed to cancel booking.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmOrComplete = async () => {
    if (!bookingId) {
      setError("Booking ID is missing.");
      return;
    }

    setError(null);
    setSuccessMessage(null);
    setActionLoading(true);

    try {
      await confirmOrCompleteBooking(bookingId);
      setSuccessMessage("Booking confirmed / completed successfully.");
      await loadBooking();
    } catch (err) {
      setError((err as Error)?.message ?? "Failed to confirm or complete booking.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="grid w-full gap-10">
      <PageHeader
        eyebrow="Booking details"
        title={booking ? `Booking ${booking._id ?? booking.id ?? bookingId}` : "Booking details"}
        description="Review the booking, then confirm or cancel when ready."
      />

      {loading ? (
        <div className="rounded-3xl border border-dashed border-ink-soft/20 bg-white p-8 text-center text-base text-ink-soft">
          Loading booking details…
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-900">
          {error}
        </div>
      ) : (
        <div className="grid gap-6">
          {successMessage ? (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-900">
              {successMessage}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-end gap-3">
            <Button
              variant="secondary"
              onClick={handleCancel}
              disabled={actionLoading}
            >
              Cancel Booking
            </Button>
            <Button
              onClick={handleConfirmOrComplete}
              disabled={actionLoading}
            >
              Confirm / Complete Booking
            </Button>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-ink-strong">Raw booking payload</h2>
            <pre className="mt-4 overflow-x-auto rounded-3xl bg-slate-950 p-4 text-sm text-slate-100">
              {JSON.stringify(booking, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
