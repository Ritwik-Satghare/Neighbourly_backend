import Image from "next/image";
import { Eye, Pencil } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import type { UserListing } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export function OwnerListingCard({ listing }: { listing: UserListing }) {
  return (
    <div className="flex h-full w-full flex-col rounded-[1.5rem] bg-surface-card p-4 shadow-ambient">
      <div className="relative h-48 w-full overflow-hidden rounded-xl">
        <Image alt={listing.title} className="object-cover" fill sizes="(max-width: 768px) 100vw, 33vw" src={listing.image} />
      </div>
      <div className="mt-4 flex flex-grow flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-headline text-lg font-bold text-ink-strong">{listing.title}</h3>
            <p className="mt-1 text-sm text-ink-soft">{listing.summary}</p>
          </div>
          <StatusBadge status={listing.status} />
        </div>
        <div className="mt-4 grid gap-1 text-sm text-ink-soft">
          <p>{listing.category}</p>
          <p>{listing.requests} active requests</p>
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-outline/20 pt-4">
          <div>
            <p className="font-headline text-xl font-bold text-primary">{formatCurrency(listing.pricePerDay)}</p>
            <p className="text-xs text-ink-soft">per day</p>
          </div>
          <div className="flex gap-2">
            <Button className="px-3 py-2" href={`/item/${listing.id}`} variant="secondary">
              <Eye className="mr-1 h-4 w-4" />
              View
            </Button>
            <Button className="px-3 py-2" href="/create-listing" variant="ghost">
              <Pencil className="mr-1 h-4 w-4" />
              Edit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
