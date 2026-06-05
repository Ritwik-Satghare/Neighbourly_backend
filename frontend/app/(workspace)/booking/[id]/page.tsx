"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import {
  cancelBooking,
  confirmOrCompleteBooking,
  getBookingById,
  startRental,
  returnRental,
} from "@/services/booking";
import {
  createBookingPayment,
  verifyPayment,
  getSplitsByBooking,
} from "@/services/split";
import { openRazorpayCheckout } from "@/lib/razorpay";
import { getStoredUser, getUserIdFromToken } from "@/lib/auth";

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params?.id as string | undefined;

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Simulated role for developer mock testing
  const [simulatedRole, setSimulatedRole] = useState<"renter" | "owner">("renter");

  // Payment state
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [hasSplits, setHasSplits] = useState(false);

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
      const b = data.booking ?? data;
      setBooking(b);

      // Check if splits exist for this booking
      if (b.rawBookingId) {
        try {
          const splitData = await getSplitsByBooking(b.rawBookingId);
          setHasSplits(
            splitData.splits != null && splitData.splits.length > 0
          );
        } catch {
          setHasSplits(false);
        }
      }
    } catch (err) {
      setError((err as Error)?.message ?? "Unable to load booking details.");
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    loadBooking();
  }, [loadBooking]);

  // ─── Role detection ─────────────────────────────────────────────────────

  const tokenUserId = getUserIdFromToken();
  
  // User Requested: Force Renter view so payment page always opens directly
  const isOwner = false;
  const isRenter = true;

  // ─── Booking state helpers ──────────────────────────────────────────────

  const isOffer = bookingId?.startsWith("offer_");
  const rawStatus = booking?.rawStatus;
  const rentalState = booking?.rentalState;

  // User Requested: Force the booking state to always be Confirmed + Unpaid 
  // so the Pay Full and Split with Friends buttons always show up no matter what.
  const isPendingOffer = false;
  const isPending = false;
  
  const isConfirmedUnpaid = true;
  const isScheduled = false;
  const isCheckedOut = false;
  const isReturned = false;
  const isCompleted = false;
  const isCanceled = false;

  // Can cancel: pending, or confirmed+unpaid (no active rental)
  const canCancel =
    isOwner && (isPending || isConfirmedUnpaid);

  // ─── Owner Actions ──────────────────────────────────────────────────────

  const doAction = async (
    label: string,
    action: () => Promise<any>
  ) => {
    setError(null);
    setSuccessMessage(null);
    setActionLoading(true);
    try {
      await action();
      setSuccessMessage(`${label} — success.`);
      await loadBooking();
    } catch (err) {
      setError((err as Error)?.message ?? `${label} failed.`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirm = () =>
    doAction("Booking confirmed", () =>
      confirmOrCompleteBooking(bookingId!, "active")
    );

  const handleCancel = () =>
    doAction("Booking canceled", () => cancelBooking(bookingId!));

  const handleStartRental = () =>
    doAction("Item handed over", () => startRental(bookingId!));

  const handleReturnRental = () =>
    doAction("Item returned", () => returnRental(bookingId!));

  const handleComplete = () =>
    doAction("Booking completed", () =>
      confirmOrCompleteBooking(bookingId!, "completed")
    );

  // ─── Renter: Pay Full Amount ────────────────────────────────────────────

  const handlePayFull = async () => {
    if (!booking?.rawBookingId) {
      setPaymentError("Cannot determine booking ID for payment.");
      return;
    }

    setPaymentError(null);
    setPaymentLoading(true);

    try {
      const orderData = await createBookingPayment(booking.rawBookingId);
      const { razorpayOrder } = orderData;
      const user = getStoredUser();

      await openRazorpayCheckout({
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        userName: user?.name ?? user?.firstName ?? undefined,
        userEmail: user?.email ?? undefined,
        onSuccess: async (response) => {
          try {
            await verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature,
              booking.rawBookingId // Pass ID for mock updates
            );
            setSuccessMessage(
              "Payment completed successfully! Your rental is now scheduled."
            );
            await loadBooking();
          } catch (err) {
            setPaymentError(
              (err as Error)?.message ?? "Payment verification failed."
            );
          } finally {
            setPaymentLoading(false);
          }
        },
        onDismiss: () => {
          setPaymentLoading(false);
        },
      });
    } catch (err) {
      setPaymentError(
        (err as Error)?.message ?? "Failed to initiate payment."
      );
      setPaymentLoading(false);
    }
  };

  // ─── Renter: Split With Friends ─────────────────────────────────────────

  const handleSplitWithFriends = () => {
    if (booking?.rawBookingId) {
      router.push(`/split-ownership?bookingId=${booking.rawBookingId}`);
    }
  };

  // ─── Status label for display ───────────────────────────────────────────

  const getStatusDisplay = () => {
    if (isCanceled) return { label: "Canceled", color: "bg-rose-100 text-rose-700" };
    if (isCompleted) return { label: "Completed", color: "bg-slate-100 text-slate-700" };
    if (isReturned) return { label: "Returned", color: "bg-blue-100 text-blue-700" };
    if (isCheckedOut) return { label: "Rental Active", color: "bg-emerald-100 text-emerald-700" };
    if (isScheduled) return { label: "Paid — Ready for Handoff", color: "bg-emerald-100 text-emerald-700" };
    if (isConfirmedUnpaid) return { label: "Payment Required", color: "bg-primary-fixed text-primary" };
    if (isPending) return { label: "Pending Confirmation", color: "bg-amber-100 text-amber-700" };
    return { label: booking?.status ?? "Unknown", color: "bg-slate-100 text-slate-700" };
  };

  const statusDisplay = booking ? getStatusDisplay() : null;

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="grid w-full gap-8">
      <PageHeader
        eyebrow="Booking details"
        title={booking?.itemTitle ?? "Booking details"}
        description={
          isOwner
            ? "Manage this booking as the listing owner."
            : "Track your rental booking."
        }
      />

      {/* Developer Mock Sandbox Selector */}
      {!tokenUserId && (
        <div className="rounded-3xl border border-dashed border-primary/30 bg-primary-fixed/5 p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-primary">🔧 Developer Mock Sandbox</span>
            <span className="text-xs text-ink-soft">Simulate local states without backend integration</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSimulatedRole("renter")}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                simulatedRole === "renter"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white border border-slate-200 text-ink-soft hover:bg-slate-50"
              }`}
            >
              Renter View (Pay / Split)
            </button>
            <button
              onClick={() => setSimulatedRole("owner")}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                simulatedRole === "owner"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white border border-slate-200 text-ink-soft hover:bg-slate-50"
              }`}
            >
              Owner View (Confirm)
            </button>
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  localStorage.removeItem("neighbourly.mockBookings");
                  router.push("/booking/mock_playstation5");
                  if (window.location.pathname === "/booking/mock_playstation5") {
                    window.location.reload();
                  }
                }
              }}
              className="rounded-full px-4 py-1.5 text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 transition-all shadow-sm"
            >
              Reset to Unpaid Confirmed Booking
            </button>
          </div>
        </div>
      )}

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
          {/* Success banner */}
          {successMessage && (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-900">
              {successMessage}
            </div>
          )}

          {/* ─── Status + Booking Info Card ───────────────────────────── */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-ink-strong">
                  {booking.itemTitle}
                </h2>
                <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink-soft">
                  {booking.totalPrice != null && (
                    <span>
                      Total:{" "}
                      <span className="font-semibold text-ink-strong">
                        ₹{booking.totalPrice}
                      </span>
                    </span>
                  )}
                  {booking.pricePerDay != null && (
                    <span>₹{booking.pricePerDay} / day</span>
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
              </div>
              {statusDisplay && (
                <span
                  className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold ${statusDisplay.color}`}
                >
                  {statusDisplay.label}
                </span>
              )}
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════ */}
          {/* RENTER VIEW                                                 */}
          {/* ════════════════════════════════════════════════════════════ */}
          {isRenter && (
            <>
              {/* Pending — Waiting for owner */}
              {isPending && (
                <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-center">
                  <p className="text-lg font-semibold text-amber-800">
                    ⏳ Waiting for Owner Confirmation
                  </p>
                  <p className="mt-2 text-sm text-amber-700">
                    The listing owner needs to review and confirm this
                    booking before you can proceed with payment.
                  </p>
                </div>
              )}

              {/* Confirmed + Unpaid — Payment options */}
              {isConfirmedUnpaid && (
                <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary-fixed/10 to-secondary-container/10 p-8">
                  <div className="flex flex-col gap-1 mb-6">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                      Payment Required
                    </span>
                    <h3 className="text-2xl font-bold text-ink-strong">
                      Complete Your Booking
                    </h3>
                    <p className="text-sm text-ink-soft">
                      The owner has confirmed this booking. Pay now to
                      schedule your rental.
                    </p>
                  </div>

                  {paymentError && (
                    <div className="mb-4 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800">
                      {paymentError}
                    </div>
                  )}

                  {hasSplits ? (
                    <div className="flex flex-col gap-3">
                      <div className="rounded-2xl bg-white/80 border border-primary/10 p-4 text-sm text-ink-soft text-center">
                        This booking has active splits. View the split
                        dashboard to pay your share.
                      </div>
                      <Button
                        className="w-full justify-center"
                        onClick={handleSplitWithFriends}
                      >
                        View Split Dashboard
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button
                        className="flex-1 justify-center"
                        onClick={handlePayFull}
                        disabled={paymentLoading}
                      >
                        {paymentLoading
                          ? "Processing..."
                          : `Pay Full Amount — ₹${booking.totalPrice ?? booking.pricePerDay ?? 0}`}
                      </Button>
                      <Button
                        className="flex-1 justify-center"
                        variant="secondary"
                        onClick={handleSplitWithFriends}
                        disabled={paymentLoading}
                      >
                        Split With Friends
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Scheduled — Waiting for handoff */}
              {isScheduled && (
                <div className="rounded-3xl border border-emerald-300 bg-gradient-to-r from-emerald-50 to-teal-50 p-8 text-center">
                  <div className="text-3xl mb-2">✅</div>
                  <h3 className="text-xl font-bold text-emerald-800">
                    Payment Complete
                  </h3>
                  <p className="mt-2 text-sm text-emerald-700">
                    Your rental is scheduled. The owner will arrange the item
                    handoff.
                  </p>
                </div>
              )}

              {/* Checked Out — Rental active */}
              {isCheckedOut && (
                <div className="rounded-3xl border border-emerald-300 bg-emerald-50 p-6 text-center">
                  <div className="text-3xl mb-2">📦</div>
                  <h3 className="text-xl font-bold text-emerald-800">
                    Rental Active
                  </h3>
                  <p className="mt-2 text-sm text-emerald-700">
                    The item is with you. Return it by the end date.
                  </p>
                </div>
              )}

              {/* Returned — Waiting for owner verification */}
              {isReturned && (
                <div className="rounded-3xl border border-blue-200 bg-blue-50 p-6 text-center">
                  <div className="text-3xl mb-2">🔍</div>
                  <h3 className="text-xl font-bold text-blue-800">
                    Item Returned
                  </h3>
                  <p className="mt-2 text-sm text-blue-700">
                    Waiting for the owner to verify the return and complete
                    the rental.
                  </p>
                </div>
              )}

              {/* Completed */}
              {isCompleted && (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center">
                  <div className="text-3xl mb-2">🎉</div>
                  <h3 className="text-xl font-bold text-slate-700">
                    Rental Completed
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    This rental has been completed. No further actions
                    available.
                  </p>
                </div>
              )}

              {/* Canceled */}
              {isCanceled && (
                <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-center">
                  <h3 className="text-xl font-bold text-rose-700">
                    Booking Canceled
                  </h3>
                  <p className="mt-2 text-sm text-rose-600">
                    This booking was canceled.
                  </p>
                </div>
              )}
            </>
          )}

          {/* ════════════════════════════════════════════════════════════ */}
          {/* OWNER VIEW                                                  */}
          {/* ════════════════════════════════════════════════════════════ */}
          {isOwner && (
            <>
              {/* Owner action cards based on state */}
              {isPending && (
                <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
                  <h3 className="text-lg font-bold text-amber-800 mb-2">
                    Awaiting Your Confirmation
                  </h3>
                  <p className="text-sm text-amber-700 mb-4">
                    Review the rental request. Confirm to allow payment, or
                    cancel to decline.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleConfirm}
                      disabled={actionLoading}
                    >
                      {actionLoading ? "Processing…" : "Confirm Booking"}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleCancel}
                      disabled={actionLoading}
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              )}

              {isConfirmedUnpaid && (
                <div className="rounded-3xl border border-primary/20 bg-primary-fixed/10 p-6">
                  <h3 className="text-lg font-bold text-ink-strong mb-2">
                    Waiting for Payment
                  </h3>
                  <p className="text-sm text-ink-soft mb-4">
                    You've confirmed this booking. The renter needs to
                    complete payment before the rental can start.
                  </p>
                  <Button
                    variant="secondary"
                    onClick={handleCancel}
                    disabled={actionLoading}
                  >
                    Cancel Booking
                  </Button>
                </div>
              )}

              {isScheduled && (
                <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
                  <h3 className="text-lg font-bold text-emerald-800 mb-2">
                    Ready for Handoff
                  </h3>
                  <p className="text-sm text-emerald-700 mb-4">
                    Payment is complete. Hand the item to the renter to start
                    the rental.
                  </p>
                  <Button
                    onClick={handleStartRental}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Processing…" : "Mark as Handed Over"}
                  </Button>
                </div>
              )}

              {isCheckedOut && (
                <div className="rounded-3xl border border-blue-200 bg-blue-50 p-6">
                  <h3 className="text-lg font-bold text-blue-800 mb-2">
                    Rental Active
                  </h3>
                  <p className="text-sm text-blue-700 mb-4">
                    The item is with the renter. When they return it, mark it
                    as received.
                  </p>
                  <Button
                    onClick={handleReturnRental}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Processing…" : "Mark as Returned"}
                  </Button>
                </div>
              )}

              {isReturned && (
                <div className="rounded-3xl border border-blue-200 bg-blue-50 p-6">
                  <h3 className="text-lg font-bold text-blue-800 mb-2">
                    Verify Return
                  </h3>
                  <p className="text-sm text-blue-700 mb-4">
                    The item has been returned. Review the condition and
                    complete the rental.
                  </p>
                  <Button
                    onClick={handleComplete}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Processing…" : "Complete Rental"}
                  </Button>
                </div>
              )}

              {isCompleted && (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center">
                  <div className="text-3xl mb-2">🎉</div>
                  <h3 className="text-xl font-bold text-slate-700">
                    Rental Completed
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    This rental is complete. No further actions available.
                  </p>
                </div>
              )}

              {isCanceled && (
                <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-center">
                  <h3 className="text-xl font-bold text-rose-700">
                    Booking Canceled
                  </h3>
                </div>
              )}
            </>
          )}

          {/* ─── Fallback: if role can't be determined ───────────────── */}
          {!isOwner && !isRenter && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-ink-strong">
                Booking Information
              </h2>
              <pre className="mt-4 overflow-x-auto rounded-3xl bg-slate-950 p-4 text-sm text-slate-100">
                {JSON.stringify(booking, null, 2)}
              </pre>
            </div>
          )}

          {/* ─── Raw payload (debug) ─────────────────────────────────── */}
          <details className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <summary className="cursor-pointer p-6 text-sm font-semibold text-ink-soft hover:text-ink-strong">
              View raw booking data
            </summary>
            <pre className="overflow-x-auto border-t border-slate-100 p-6 text-xs text-slate-600">
              {JSON.stringify(booking, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
