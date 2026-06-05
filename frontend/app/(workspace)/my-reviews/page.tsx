"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { getReviewsByUser, type Review } from "@/services/review";
import { getCurrentUserId } from "@/lib/auth";

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const renderStars = (value: number) => {
    const filled = Math.max(0, Math.min(5, Math.round(value)));
    return Array.from({ length: 5 }, (_, index) => (index < filled ? "★" : "☆")).join("");
  };

  const getReviewDate = (review: Review) => {
    const raw = review.createdAt ?? review.created_at;
    if (!raw) return null;
    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) return raw;
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    const loadUserReviews = async () => {
      setLoading(true);
      setError(null);

      const currentUserId = getCurrentUserId();
      if (!currentUserId) {
        setError("Please sign in to view your reviews.");
        setLoading(false);
        return;
      }

      try {
        const response = await getReviewsByUser(currentUserId);
        const payload = response.reviews ?? response.data ?? response;
        setReviews(Array.isArray(payload) ? payload : []);
      } catch (err: unknown) {
        setError((err as Error)?.message ?? "Failed to load your reviews.");
      } finally {
        setLoading(false);
      }
    };

    loadUserReviews();
  }, []);

  return (
    <div className="grid w-full gap-10">
      <PageHeader
        eyebrow="My reviews"
        title="Reviews you have written"
        description="See all the feedback you submitted for your rentals."
      />

      {loading ? (
        <div className="rounded-[2rem] bg-surface-card p-8 shadow-ambient text-center text-ink-soft">
          Loading your reviews…
        </div>
      ) : error ? (
        <div className="rounded-[2rem] bg-rose-50 p-8 text-center text-sm text-rose-900">
          <p>{error}</p>
          {error.includes("sign in") ? (
            <div className="mt-4 flex justify-center">
              <Button href="/login">Sign in</Button>
            </div>
          ) : null}
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-[2rem] bg-surface-card p-8 shadow-ambient text-center text-ink-soft">
          <p className="font-semibold">No reviews yet.</p>
          <p className="mt-2 text-sm text-ink-soft">Write your first review after a booking to see it here.</p>
          <div className="mt-4 flex justify-center">
            <Button href="/browse" variant="secondary">
              Browse items
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {reviews.map((review) => (
            <div key={review._id ?? review.id ?? `${review.listingID ?? review.listingId}-${review.rating}-${review.comment}`}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <p className="text-xl font-semibold text-ink-strong">{renderStars(review.rating)}</p>
                  <p className="text-sm text-ink-soft">{review.comment}</p>
                </div>
                <div className="text-right text-sm text-ink-soft">
                  {getReviewDate(review) ? <p>{getReviewDate(review)}</p> : null}
                  {review.listingID || review.listingId ? (
                    <Link href={`/item/${review.listingID ?? review.listingId}`} className="font-semibold text-primary underline">
                      View listing
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
