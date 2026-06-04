"use client";

import { FormEvent, use, useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getListingById as apiGetListingById } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { listings as mockListings } from "@/lib/data";
import type { Listing } from "@/lib/data";
import { createReview, getReviewsByListing, type Review } from "@/services/review";

type ItemPageProps = {
  params: Promise<{ id: string }>;
};

export default function ItemPage({ params }: ItemPageProps) {
  const { id } = use(params);
  const [item, setItem] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

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

  const loadReviews = async (listingId: string) => {
    setReviewsError("");
    setReviewsLoading(true);

    try {
      const response = await getReviewsByListing(listingId);
      const payload = response.reviews ?? response.data ?? response;
      setReviews(Array.isArray(payload) ? payload : []);
    } catch (err: unknown) {
      setReviewsError((err as Error)?.message ?? "Unable to load reviews.");
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleSubmitReview = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    if (rating <= 0) {
      setSubmitError("Please select a rating.");
      return;
    }

    if (!comment.trim()) {
      setSubmitError("Please enter a comment.");
      return;
    }

    if (!item?.id) {
      setSubmitError("Unable to submit review without a valid listing.");
      return;
    }

    setSubmitLoading(true);

    try {
      await createReview(item.id, rating, comment.trim());
      setSubmitSuccess("Review submitted successfully.");
      setRating(0);
      setComment("");
      await loadReviews(item.id);
    } catch (err: unknown) {
      setSubmitError((err as Error)?.message ?? "Failed to submit review.");
    } finally {
      setSubmitLoading(false);
    }
  };

  useEffect(() => {
    async function loadItem() {
      setIsLoading(true);
      setError("");
      try {
        const data = await apiGetListingById(id);
        const listingId = data.id ?? data._id ?? id;
        setItem({
          id: listingId,
          title: data.title ?? "",
          category: data.category ?? "Tools",
          distance: data.distance ?? "0.8km away",
          pricePerDay: Number(data.pricePerDay ?? data.price_per_day ?? 0),
          rating: data.rating ?? 4.9,
          trustScore: data.trustScore ?? data.trust_score ?? 98,
          image: data.image ?? data.images?.[0] ?? "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=1200&q=80",
          summary: data.summary ?? data.description ?? "",
          host: data.host ?? "Neighbor",
        });

        await loadReviews(listingId);
      } catch (err: any) {
        setError(err.message ?? "Failed to load item details.");
      } finally {
        setIsLoading(false);
      }
    }
    loadItem();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-[2rem] bg-surface-card p-8 shadow-ambient text-center text-ink-soft">
        <span className="font-semibold">Loading item details...</span>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-[2rem] bg-surface-card p-8 shadow-ambient text-center">
        <p className="font-semibold text-tertiary">{error || "Item not found"}</p>
        <Button href="/browse" variant="secondary">
          Back to Browse
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <section className="grid gap-8">
        <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
          <div className="relative min-h-[420px] overflow-hidden rounded-[2rem]">
            <Image alt={item.title} className="object-cover" fill sizes="(max-width: 1024px) 100vw, 60vw" src={item.image} />
          </div>
          <div className="grid gap-4">
            {mockListings.slice(1, 3).map((listing) => (
              <div key={listing.id} className="relative min-h-[200px] overflow-hidden rounded-[1.5rem]">
                <Image alt={listing.title} className="object-cover" fill sizes="(max-width: 1024px) 100vw, 25vw" src={listing.image} />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[2rem] bg-surface-card p-8 shadow-ambient">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{item.category}</p>
              <h1 className="mt-3 font-headline text-4xl font-extrabold text-ink-strong">{item.title}</h1>
              <p className="mt-3 max-w-2xl text-base text-ink-soft">{item.summary}</p>
            </div>
            <div className="rounded-[1.5rem] bg-secondary-container px-5 py-4 text-secondary">
              <p className="text-xs font-semibold uppercase tracking-[0.18em]">Trust score</p>
              <p className="font-headline text-4xl font-extrabold">{item.trustScore}%</p>
            </div>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["Host", item.host],
              ["Distance", item.distance],
              ["Category", item.category],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.5rem] bg-surface-low p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">{label}</p>
                <p className="mt-2 font-semibold text-ink-strong">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          <div className="rounded-[2rem] bg-surface-card p-8 shadow-ambient">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-ink-strong">Reviews</h2>
                <p className="text-sm text-ink-soft">Feedback from people who rented this item.</p>
              </div>
            </div>

            {reviewsLoading ? (
              <div className="mt-6 rounded-[1.5rem] bg-surface-low p-6 text-sm text-ink-soft">
                Loading reviews…
              </div>
            ) : reviewsError ? (
              <div className="mt-6 rounded-[1.5rem] bg-rose-50 p-6 text-sm text-rose-900">
                {reviewsError}
              </div>
            ) : reviews.length === 0 ? (
              <div className="mt-6 rounded-[1.5rem] bg-surface-low p-6 text-sm text-ink-soft">
                No reviews yet.
              </div>
            ) : (
              <div className="mt-6 grid gap-4">
                {reviews.map((review) => (
                  <div key={review._id ?? review.id ?? `${review.listingID ?? review.listingId}-${review.userID ?? review.userId}-${review.comment}`}
                    className="rounded-[1.5rem] border border-slate-200 bg-white p-6">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-base font-semibold text-ink-strong">{renderStars(review.rating)}</p>
                      {getReviewDate(review) ? (
                        <p className="text-sm text-ink-soft">{getReviewDate(review)}</p>
                      ) : null}
                    </div>
                    {review.reviewerName || review.name ? (
                      <p className="mt-3 font-semibold text-ink-strong">{review.reviewerName ?? review.name}</p>
                    ) : null}
                    <p className="mt-2 text-sm leading-6 text-ink-soft">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmitReview} className="rounded-[2rem] bg-surface-card p-8 shadow-ambient">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-ink-strong">Leave a review</h2>
              <p className="mt-2 text-sm text-ink-soft">Share your experience with this listing.</p>
            </div>

            {submitError ? (
              <div className="mb-4 rounded-[1.5rem] bg-rose-50 p-4 text-sm text-rose-900">{submitError}</div>
            ) : null}
            {submitSuccess ? (
              <div className="mb-4 rounded-[1.5rem] bg-emerald-50 p-4 text-sm text-emerald-900">{submitSuccess}</div>
            ) : null}

            <div className="grid gap-4">
              <label className="grid gap-2 text-sm font-semibold text-ink-strong">
                Rating
                <select
                  className="rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 text-sm text-ink-strong outline-none focus:border-primary"
                  value={rating}
                  onChange={(event) => setRating(Number(event.target.value))}
                >
                  <option value={0}>Select rating</option>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <option key={value} value={value}>{value} star{value > 1 ? "s" : ""}</option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm font-semibold text-ink-strong">
                Comment
                <textarea
                  className="min-h-[120px] rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 text-sm text-ink-strong outline-none focus:border-primary"
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder="Tell others what you enjoyed about the item"
                />
              </label>

              <Button type="submit" className="w-full justify-center" disabled={submitLoading}>
                {submitLoading ? "Submitting review…" : "Submit review"}
              </Button>
            </div>
          </form>
        </div>
      </section>

      <aside className="h-fit rounded-[2rem] bg-surface-card p-8 shadow-ambient lg:sticky lg:top-28">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-ink-soft">Starting at</p>
            <p className="font-headline text-4xl font-extrabold text-primary">{formatCurrency(item.pricePerDay)}</p>
          </div>
          <div className="rounded-full bg-primary-fixed px-4 py-2 text-sm font-semibold text-primary">Excellent</div>
        </div>
        <div className="mt-8 grid gap-4">
          <div className="rounded-[1.5rem] bg-surface-low p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">Pick up</p>
            <p className="mt-2 font-semibold text-ink-strong">Saturday, 10:00 AM</p>
          </div>
          <div className="rounded-[1.5rem] bg-surface-low p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">Return</p>
            <p className="mt-2 font-semibold text-ink-strong">Monday, 6:00 PM</p>
          </div>
          <Button className="w-full justify-center" href="/messages">
            Request to Rent
          </Button>
          <Button className="w-full justify-center" href="/verify" variant="secondary">
            Verify condition first
          </Button>
        </div>
      </aside>
    </div>
  );
}
