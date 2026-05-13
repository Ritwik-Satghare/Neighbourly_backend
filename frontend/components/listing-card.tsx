import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import type { Listing } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      className="group w-full h-full rounded-xl bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1"
      href={`/item/${listing.id}`}
    >
      <div className="flex h-full flex-col">
        <div className="relative h-48 w-full overflow-hidden rounded-lg">
          <Image
            alt={listing.title}
            className="object-cover transition duration-500 group-hover:scale-105"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            src={listing.image}
          />
          {listing.badge ? (
            <span className="absolute right-3 top-3 rounded-full bg-surface/90 px-3 py-1 text-xs font-semibold text-primary">
              {listing.badge}
            </span>
          ) : null}
        </div>
        <div className="mt-3 flex flex-grow flex-col">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="font-headline text-lg font-bold text-ink-strong">{listing.title}</h3>
              <p className="mt-1 text-sm text-ink-soft">{listing.summary}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1 text-sm font-semibold text-ink-strong">
              <Star className="h-4 w-4 fill-primary text-primary" />
              {listing.rating}
            </div>
          </div>
          <div className="mt-auto flex items-center justify-between border-t border-outline/20 pt-4">
            <div className="min-w-0 text-sm text-ink-soft">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate">{listing.distance}</span>
              </div>
              <div className="mt-1 truncate">{listing.category}</div>
            </div>
            <div className="shrink-0 text-right">
              <div className="font-headline text-xl font-bold text-primary">{formatCurrency(listing.pricePerDay)}</div>
              <div className="text-xs text-ink-soft">{listing.trustScore}% trust</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
