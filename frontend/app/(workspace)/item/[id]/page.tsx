"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getListingById as apiGetListingById } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { listings as mockListings } from "@/lib/data";
import type { Listing } from "@/lib/data";

type ItemPageProps = {
  params: Promise<{ id: string }>;
};

export default function ItemPage({ params }: ItemPageProps) {
  const { id } = use(params);
  const [item, setItem] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadItem() {
      setIsLoading(true);
      setError("");
      try {
        const data = await apiGetListingById(id);
        setItem({
          id: data.id ?? data._id ?? id,
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
