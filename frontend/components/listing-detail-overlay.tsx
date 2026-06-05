"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { getStoredUser } from "@/lib/auth";
import { listings as mockListings } from "@/lib/data";
import type { Listing } from "@/lib/data";
import { createBookingMock } from "@/services/booking";

interface ListingDetailOverlayProps {
  item: Listing;
  onClose: () => void;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";

export default function ListingDetailOverlay({ item, onClose }: ListingDetailOverlayProps) {
  const router = useRouter();
  const [bookingStatus, setBookingStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [bookingMessage, setBookingMessage] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    // Check ownership
    const user = getStoredUser();
    const currentUserId = user ? (user.id || user._id) : null;
    const ownerId = (item as any).ownerId ?? (item as any).userId ?? (item as any).owner ?? null;
    if (currentUserId && ownerId) {
      setIsOwner(String(currentUserId) === String(ownerId));
    }

    // Prevent body scroll when open
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = original;
      document.removeEventListener("keydown", handleKey);
    };
  }, [item, onClose]);

  async function handleRequestToRent() {
    let user = getStoredUser();
    if (!user) {
      // Fallback for mock flow if auth state is missing
      user = { id: "mockRequester", name: "Mock User", email: "mock@example.com" } as any;
    }

    setBookingStatus("loading");
    setBookingMessage("");

    try {
      const ownerId = (item as any).ownerId ?? (item as any).userId ?? (item as any).owner ?? "mockOwner";
      await createBookingMock(item.id, item.title, item.image, ownerId, item.pricePerDay);

      setBookingStatus("success");
      setBookingMessage("Booking request sent! The owner will review it shortly.");
    } catch (err: any) {
      setBookingStatus("error");
      setBookingMessage(err.message ?? "Something went wrong. Please try again.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-8 overflow-y-auto" onClick={onClose}>
      <div 
        className="relative w-full max-w-6xl bg-surface rounded-[2rem] shadow-2xl p-6 md:p-10 my-auto animate-in fade-in zoom-in-95 duration-200" 
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-surface-low text-ink-soft hover:bg-surface-card hover:text-ink-strong transition-colors"
          onClick={onClose}
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left: Images + Details */}
          <section className="grid gap-8">
            <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
              <div className="relative min-h-[420px] overflow-hidden rounded-[2rem]">
                <Image
                  alt={item.title}
                  className="object-cover"
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  src={item.image}
                />
              </div>
              <div className="grid gap-4">
                {mockListings.slice(1, 3).map((listing) => (
                  <div
                    key={listing.id}
                    className="relative min-h-[200px] overflow-hidden rounded-[1.5rem]"
                  >
                    <Image
                      alt={listing.title}
                      className="object-cover"
                      fill
                      sizes="(max-width: 1024px) 100vw, 25vw"
                      src={listing.image}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] bg-surface-card p-8 shadow-ambient">
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                    {item.category}
                  </p>
                  <h1 className="mt-3 font-headline text-4xl font-extrabold text-ink-strong">
                    {item.title}
                  </h1>
                  <p className="mt-3 max-w-2xl text-base text-ink-soft">
                    {item.summary}
                  </p>
                </div>
                <div className="rounded-[1.5rem] bg-secondary-container px-5 py-4 text-secondary">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em]">
                    Trust score
                  </p>
                  <p className="font-headline text-4xl font-extrabold">
                    {item.trustScore}%
                  </p>
                </div>
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {[
                  ["Host", item.host],
                  ["Distance", item.distance],
                  ["Category", item.category],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[1.5rem] bg-surface-low p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
                      {label}
                    </p>
                    <p className="mt-2 font-semibold text-ink-strong">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Right: Booking sidebar */}
          <aside className="h-fit rounded-[2rem] bg-surface-card p-8 shadow-ambient lg:sticky lg:top-28">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm text-ink-soft">Starting at</p>
                <p className="font-headline text-4xl font-extrabold text-primary">
                  {formatCurrency(item.pricePerDay)}
                </p>
              </div>
              <div className="rounded-full bg-primary-fixed px-4 py-2 text-sm font-semibold text-primary">
                Excellent
              </div>
            </div>

            <div className="mt-8 grid gap-4">
              <div className="rounded-[1.5rem] bg-surface-low p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
                  Pick up
                </p>
                <p className="mt-2 font-semibold text-ink-strong">Saturday, 10:00 AM</p>
              </div>
              <div className="rounded-[1.5rem] bg-surface-low p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
                  Return
                </p>
                <p className="mt-2 font-semibold text-ink-strong">Monday, 6:00 PM</p>
              </div>

              {/* Booking feedback */}
              {bookingStatus === "success" && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800">
                  {bookingMessage}
                </div>
              )}
              {bookingStatus === "error" && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800">
                  {bookingMessage}
                </div>
              )}

              {isOwner ? (
                <div className="rounded-xl bg-surface-low p-4 text-center text-sm text-ink-soft">
                  You listed this item — you cannot request to rent it.
                </div>
              ) : (
                <Button
                  className="w-full justify-center"
                  onClick={handleRequestToRent}
                  disabled={bookingStatus === "loading" || bookingStatus === "success"}
                >
                  {bookingStatus === "loading"
                    ? "Sending request..."
                    : bookingStatus === "success"
                    ? "Request sent ✓"
                    : "Request to Rent"}
                </Button>
              )}

              {bookingStatus === "success" && (
                <Button
                  className="w-full justify-center"
                  onClick={() => {
                    const ownerId = (item as any).ownerId ?? (item as any).userId ?? (item as any).owner ?? "";
                    onClose();
                    router.push(`/messages?userId=${ownerId}`);
                  }}
                >
                  💬 Message Owner
                </Button>
              )}

              <Button
                className="w-full justify-center"
                href="/verify"
                variant="secondary"
              >
                Verify condition first
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
