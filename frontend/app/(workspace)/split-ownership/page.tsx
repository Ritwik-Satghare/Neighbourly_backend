"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { getUserIdFromToken, getStoredUser } from "@/lib/auth";
import { openRazorpayCheckout } from "@/lib/razorpay";
import {
  searchUsers,
  createSplits,
  getSplitsByBooking,
  getRawBooking,
  createSplitPayment,
  verifyPayment,
  type SearchedUser,
  type SplitRecord,
  type SplitSummary,
  type SplitParticipant,
} from "@/services/split";

// ─── Types ──────────────────────────────────────────────────────────────────

interface ParticipantRow {
  userId: string;
  name: string;
  email: string;
  amount: string; // kept as string for input binding
}

interface BookingInfo {
  _id: string;
  totalPrice: number;
  startDate?: string;
  endDate?: string;
  listingID?: any;
  status: string;
  rentalState: string | null;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function SplitOwnershipPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  // Booking
  const [booking, setBooking] = useState<BookingInfo | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Split creation
  const [participants, setParticipants] = useState<ParticipantRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchedUser[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [userSearchError, setUserSearchError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);

  // Split dashboard
  const [splits, setSplits] = useState<SplitRecord[]>([]);
  const [summary, setSummary] = useState<SplitSummary | null>(null);
  const [splitsExist, setSplitsExist] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  // Payment
  const [payingId, setPayingId] = useState<string | null>(null);
  const [payError, setPayError] = useState<string | null>(null);
  const [paySuccess, setPaySuccess] = useState<string | null>(null);

  const currentUserId = getUserIdFromToken();

  // ─── Load booking ───────────────────────────────────────────────────────

  const loadBooking = useCallback(async () => {
    if (!bookingId) return;
    setBookingLoading(true);
    setBookingError(null);
    try {
      const raw = await getRawBooking(bookingId);
      setBooking({
        _id: raw._id ?? bookingId,
        totalPrice: Number(raw.totalPrice ?? 0),
        startDate: raw.startDate,
        endDate: raw.endDate,
        listingID: raw.listingID,
        status: raw.status,
        rentalState: raw.rentalState ?? null,
      });
    } catch (err) {
      setBookingError(
        (err as Error)?.message ?? "Failed to load booking details."
      );
    } finally {
      setBookingLoading(false);
    }
  }, [bookingId]);

  // ─── Load splits ────────────────────────────────────────────────────────

  const loadSplits = useCallback(async () => {
    if (!bookingId) return;
    setDashboardLoading(true);
    try {
      const data = await getSplitsByBooking(bookingId);
      setSplits(data.splits ?? []);
      setSummary(data.summary ?? null);
      setSplitsExist((data.splits?.length ?? 0) > 0);
    } catch {
      // No splits yet — that's fine
      setSplitsExist(false);
    } finally {
      setDashboardLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    if (bookingId) {
      loadBooking();
      loadSplits();
    }
  }, [bookingId, loadBooking, loadSplits]);

  // Auto-add current user as first participant when booking loads
  useEffect(() => {
    if (booking && !splitsExist && participants.length === 0 && currentUserId) {
      const user = getStoredUser();
      setParticipants([
        {
          userId: currentUserId,
          name: user?.name ?? user?.firstName ?? "You",
          email: user?.email ?? "",
          amount: "",
        },
      ]);
    }
  }, [booking, splitsExist, participants.length, currentUserId]);

  // ─── User search ────────────────────────────────────────────────────────

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const results = await searchUsers(searchQuery);
        // Filter out already-added participants
        const addedIds = new Set(participants.map((p) => p.userId));
        setSearchResults(results.filter((u) => !addedIds.has(u._id)));
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery, participants]);

  // ─── Participant management ─────────────────────────────────────────────

  const addParticipant = (user: SearchedUser) => {
    setParticipants((prev) => {
      if (prev.some((p) => p.userId === user._id)) return prev;
      return [
        ...prev,
        {
          userId: user._id,
          name: user.fullName,
          email: user.email,
          amount: "",
        },
      ];
    });
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleManualAdd = async () => {
    setUserSearchError(null);
    if (!searchQuery.trim()) {
      setSearchLoading(true);
      try {
        const results = await searchUsers("");
        const addedIds = new Set(participants.map((p) => p.userId));
        setSearchResults(results.filter((u) => !addedIds.has(u._id)));
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
      return;
    }
    
    // Non-empty query: search the backend for real users
    setSearchLoading(true);
    try {
      const results = await searchUsers(searchQuery);
      const queryLower = searchQuery.trim().toLowerCase();
      // Find exact match by email or name
      const exactMatch = results.find(
        (u) => u.email.toLowerCase() === queryLower || u.fullName.toLowerCase() === queryLower
      );
      
      if (exactMatch) {
        addParticipant(exactMatch);
      } else if (results.length > 0) {
        // If no exact match but there are results, pick the first one
        addParticipant(results[0]);
      } else {
        // User not found in MongoDB
        setUserSearchError("User not found in database.");
      }
    } catch {
      setUserSearchError("Failed to search for user.");
    } finally {
      setSearchLoading(false);
    }
  };

  const removeParticipant = (userId: string) => {
    // Don't allow removing yourself
    if (userId === currentUserId) return;
    setParticipants((prev) => prev.filter((p) => p.userId !== userId));
  };

  const updateAmount = (userId: string, value: string) => {
    setParticipants((prev) =>
      prev.map((p) => (p.userId === userId ? { ...p, amount: value } : p))
    );
  };

  // Split evenly helper
  const splitEvenly = () => {
    if (!booking || participants.length === 0) return;
    const each = Math.floor(booking.totalPrice / participants.length);
    const remainder = booking.totalPrice - each * participants.length;
    setParticipants((prev) =>
      prev.map((p, i) => ({
        ...p,
        amount: String(i === 0 ? each + remainder : each),
      }))
    );
  };

  // ─── Create splits ─────────────────────────────────────────────────────

  const totalAssigned = participants.reduce(
    (sum, p) => sum + (Number(p.amount) || 0),
    0
  );

  const handleCreateSplits = async () => {
    if (!bookingId || !booking) return;

    // Validation
    if (participants.length < 2) {
      setCreateError("At least 2 participants are required for a split.");
      return;
    }

    for (const p of participants) {
      if (!p.amount || Number(p.amount) <= 0) {
        setCreateError(`Please enter a valid amount for ${p.name}.`);
        return;
      }
    }

    if (Math.abs(totalAssigned - booking.totalPrice) > 0.01) {
      setCreateError(
        `Total (₹${totalAssigned}) must equal booking amount (₹${booking.totalPrice}).`
      );
      return;
    }

    setCreateError(null);
    setCreateLoading(true);

    try {
      const splitPayload: SplitParticipant[] = participants.map((p) => ({
        userID: p.userId,
        amount: Number(p.amount),
      }));
      
      console.log("SENDING SPLIT PAYLOAD TO BACKEND (End-to-End Test):", JSON.stringify(splitPayload, null, 2));
      
      await createSplits(bookingId, splitPayload);
      setCreateSuccess("🎉 Split ownership successfully created!");
      // Reload splits to switch to dashboard view
      await loadSplits();
    } catch (err) {
      setCreateError(
        (err as Error)?.message ?? "Failed to create split payments."
      );
    } finally {
      setCreateLoading(false);
    }
  };

  // ─── Pay split share ────────────────────────────────────────────────────

  const handlePaySplit = async (splitRecord: SplitRecord) => {
    if (!bookingId) return;

    setPayError(null);
    setPaySuccess(null);
    setPayingId(splitRecord._id);

    try {
      const orderData = await createSplitPayment(bookingId, splitRecord._id);
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
              response.razorpay_signature
            );
            setPaySuccess("Payment successful!");
            await loadSplits();
            await loadBooking();
          } catch (err) {
            setPayError(
              (err as Error)?.message ?? "Payment verification failed."
            );
          } finally {
            setPayingId(null);
          }
        },
        onDismiss: () => {
          setPayingId(null);
        },
      });
    } catch (err) {
      setPayError(
        (err as Error)?.message ?? "Failed to initiate split payment."
      );
      setPayingId(null);
    }
  };

  // ─── Helper: get user ID from a split record ───────────────────────────

  const getSplitUserId = (split: SplitRecord): string => {
    if (typeof split.userID === "object" && split.userID?._id) {
      return split.userID._id;
    }
    return String(split.userID);
  };

  const getSplitUserName = (split: SplitRecord): string => {
    if (typeof split.userID === "object" && split.userID?.fullName) {
      return split.userID.fullName;
    }
    return "User";
  };

  const getSplitUserEmail = (split: SplitRecord): string => {
    if (typeof split.userID === "object" && split.userID?.email) {
      return split.userID.email;
    }
    return "";
  };

  // ─── No booking ID ─────────────────────────────────────────────────────

  if (!bookingId) {
    return (
      <div className="grid w-full gap-10">
        <PageHeader
          eyebrow="Ownership"
          title="Split Ownership"
          description="Share the cost of a booking with friends."
        />
        <div className="rounded-[2rem] bg-surface-card p-8 shadow-ambient text-center">
          <p className="text-lg font-semibold text-ink-strong mb-2">
            No booking selected
          </p>
          <p className="text-sm text-ink-soft mb-6">
            To split a booking, go to your bookings and click "Split With
            Friends" on a confirmed booking.
          </p>
          <Button href="/booking">View My Bookings</Button>
        </div>
      </div>
    );
  }

  // ─── Loading state ──────────────────────────────────────────────────────

  if (bookingLoading || dashboardLoading) {
    return (
      <div className="grid w-full gap-10">
        <PageHeader
          eyebrow="Ownership"
          title="Split Ownership"
          description="Share the cost of a booking with friends."
        />
        <div className="rounded-[2rem] bg-surface-card p-8 shadow-ambient text-center text-ink-soft">
          Loading booking details…
        </div>
      </div>
    );
  }

  // ─── Error state ────────────────────────────────────────────────────────

  if (bookingError) {
    return (
      <div className="grid w-full gap-10">
        <PageHeader
          eyebrow="Ownership"
          title="Split Ownership"
          description="Share the cost of a booking with friends."
        />
        <div className="rounded-[2rem] bg-rose-50 border border-rose-200 p-8 text-center text-sm text-rose-800">
          {bookingError}
        </div>
      </div>
    );
  }

  // ─── Render ─────────────────────────────────────────────────────────────

  const paidCount = splits.filter((s) => s.status === "paid").length;
  const totalCount = splits.length;
  const progressPercent =
    totalCount > 0 ? Math.round((paidCount / totalCount) * 100) : 0;

  return (
    <div className="grid w-full gap-10">
      <PageHeader
        eyebrow="Ownership"
        title="Split Ownership"
        description={
          splitsExist
            ? "Track payment progress for this booking."
            : "Share the cost of this booking with friends."
        }
      />

      {/* ─── Booking Summary ─────────────────────────────────────────── */}
      {booking && (
        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[2rem] bg-surface-card p-6 shadow-ambient">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
              Booking Amount
            </p>
            <p className="mt-2 text-3xl font-bold text-primary">
              ₹{booking.totalPrice}
            </p>
          </div>
          {booking.startDate && (
            <div className="rounded-[2rem] bg-surface-card p-6 shadow-ambient">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
                Start Date
              </p>
              <p className="mt-2 text-xl font-bold text-ink-strong">
                {new Date(booking.startDate).toLocaleDateString()}
              </p>
            </div>
          )}
          {booking.endDate && (
            <div className="rounded-[2rem] bg-surface-card p-6 shadow-ambient">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
                End Date
              </p>
              <p className="mt-2 text-xl font-bold text-ink-strong">
                {new Date(booking.endDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </section>
      )}

      {/* ─── All Paid Banner ─────────────────────────────────────────── */}
      {summary?.allPaid && (
        <div className="rounded-[2rem] border border-emerald-300 bg-gradient-to-r from-emerald-50 to-teal-50 p-8 text-center">
          <div className="text-4xl mb-3">🎉</div>
          <h3 className="text-2xl font-bold text-emerald-800">
            All Payments Complete!
          </h3>
          <p className="mt-2 text-sm text-emerald-700">
            Everyone has paid their share. The rental is now active.
          </p>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* STATE 2: Split Dashboard (splits already exist)                */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {splitsExist && (
        <>
          {/* Progress bar */}
          <section className="rounded-[2rem] bg-surface-card p-6 shadow-ambient">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-ink-strong">
                Payment Progress
              </h3>
              <span className="text-sm font-semibold text-primary">
                {paidCount} / {totalCount} Paid
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-surface-low overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary-container transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {summary && (
              <div className="mt-4 flex gap-6 text-sm">
                <span className="text-ink-soft">
                  Paid:{" "}
                  <span className="font-semibold text-emerald-600">
                    ₹{summary.totalPaid}
                  </span>
                </span>
                <span className="text-ink-soft">
                  Pending:{" "}
                  <span className="font-semibold text-amber-600">
                    ₹{summary.totalPending}
                  </span>
                </span>
              </div>
            )}
          </section>

          {/* Payment feedback */}
          {createSuccess && (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800 mb-6">
              {createSuccess}
            </div>
          )}
          {paySuccess && (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800">
              {paySuccess}
            </div>
          )}
          {payError && (
            <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800">
              {payError}
            </div>
          )}

          {/* Participants list */}
          <section className="rounded-[2rem] bg-surface-card p-6 shadow-ambient">
            <h3 className="text-lg font-bold text-ink-strong mb-4">
              Participants
            </h3>
            <div className="grid gap-3">
              {splits.map((split) => {
                const isCurrentUser =
                  getSplitUserId(split) === currentUserId;
                const isPaid = split.status === "paid";

                return (
                  <div
                    key={split._id}
                    className={`flex items-center justify-between rounded-2xl border p-5 transition-colors ${
                      isPaid
                        ? "border-emerald-200 bg-emerald-50/50"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div>
                      <h4 className="font-semibold text-ink-strong">
                        {getSplitUserName(split)}
                        {isCurrentUser && (
                          <span className="ml-2 text-xs font-medium text-primary">
                            (You)
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-ink-soft">
                        {getSplitUserEmail(split)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">
                          ₹{split.amount}
                        </p>
                        <span
                          className={`inline-block mt-1 rounded-full px-3 py-0.5 text-xs font-semibold ${
                            isPaid
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {isPaid ? "Paid ✓" : "Pending"}
                        </span>
                      </div>
                      {isCurrentUser && !isPaid && !summary?.allPaid && (
                        <Button
                          onClick={() => handlePaySplit(split)}
                          disabled={payingId != null}
                          className="whitespace-nowrap"
                        >
                          {payingId === split._id
                            ? "Processing..."
                            : `Pay ₹${split.amount}`}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* STATE 1: Create Split Form (no splits yet)                    */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {!splitsExist && booking && (
        <>
          {/* Search and add participants */}
          <section className="rounded-[2rem] bg-surface-card p-6 shadow-ambient">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-ink-strong">
                  Add Participants
                </h3>
                <p className="text-sm text-ink-soft">
                  Search for registered users to split this booking with.
                </p>
              </div>
              <Button variant="ghost" onClick={splitEvenly}>
                Split Evenly
              </Button>
            </div>

            {/* Search input */}
            <div className="relative mb-4 flex gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search by name or email…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleManualAdd();
                    }
                  }}
                  className="w-full rounded-2xl border border-outline/40 bg-surface-low px-4 py-3 text-sm text-ink-strong outline-none focus:border-primary/40 placeholder:text-ink-soft/60"
                />
                {searchLoading && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-ink-soft">
                    Searching…
                  </span>
                )}

                {/* Search dropdown */}
                {searchResults.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full rounded-2xl border border-outline/20 bg-white shadow-lg max-h-48 overflow-y-auto">
                    {searchResults.map((user) => (
                      <button
                        key={user._id}
                        onClick={() => addParticipant(user)}
                        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-surface-low transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                      >
                        <div>
                          <p className="text-sm font-semibold text-ink-strong">
                            {user.fullName}
                          </p>
                          <p className="text-xs text-ink-soft">{user.email}</p>
                        </div>
                        <span className="text-xs font-semibold text-primary">
                          + Add
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Button 
                onClick={handleManualAdd}
                className="shrink-0 rounded-2xl px-6"
              >
                Add
              </Button>
            </div>
            
            {userSearchError && (
              <div className="mb-4 text-sm font-medium text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">
                {userSearchError}
              </div>
            )}

            {/* Participant rows */}
            <div className="grid gap-3">
              {participants.map((p) => (
                <div
                  key={p.userId}
                  className="flex items-center gap-4 rounded-2xl border border-outline/20 bg-surface-low p-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink-strong truncate">
                      {p.name}
                      {p.userId === currentUserId && (
                        <span className="ml-2 text-xs text-primary">
                          (You)
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-ink-soft truncate">{p.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-ink-soft">₹</span>
                    <input
                      type="number"
                      min="1"
                      placeholder="0"
                      value={p.amount}
                      onChange={(e) => updateAmount(p.userId, e.target.value)}
                      className="w-28 rounded-xl border border-outline/30 bg-white px-3 py-2 text-sm text-right font-semibold text-ink-strong outline-none focus:border-primary/40"
                    />
                  </div>
                  {p.userId !== currentUserId && (
                    <button
                      onClick={() => removeParticipant(p.userId)}
                      className="shrink-0 text-sm text-rose-500 hover:text-rose-700 font-semibold"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Total validation */}
            {booking && (
              <div className="mt-4 flex items-center justify-between border-t border-outline/20 pt-4">
                <div className="text-sm">
                  <span className="text-ink-soft">Total assigned: </span>
                  <span
                    className={`font-bold ${
                      Math.abs(totalAssigned - booking.totalPrice) < 0.01
                        ? "text-emerald-600"
                        : totalAssigned > booking.totalPrice
                          ? "text-rose-600"
                          : "text-amber-600"
                    }`}
                  >
                    ₹{totalAssigned}
                  </span>
                  <span className="text-ink-soft">
                    {" "}
                    / ₹{booking.totalPrice}
                  </span>
                </div>
                {Math.abs(totalAssigned - booking.totalPrice) < 0.01 && (
                  <span className="text-xs font-semibold text-emerald-600">
                    ✓ Amounts match
                  </span>
                )}
              </div>
            )}
          </section>

          {/* Create split button */}
          {createError && (
            <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800">
              {createError}
            </div>
          )}

          <Button
            className="w-full justify-center"
            onClick={handleCreateSplits}
            disabled={
              createLoading ||
              participants.length < 2 ||
              Math.abs(totalAssigned - (booking?.totalPrice ?? 0)) > 0.01
            }
          >
            {createLoading
              ? "Creating split…"
              : `Create Split for ₹${booking?.totalPrice ?? 0}`}
          </Button>
        </>
      )}
    </div>
  );
}