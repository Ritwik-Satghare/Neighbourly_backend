"use client";
import React, { useEffect } from "react";
import type { Listing } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

interface ListingPanelProps {
  listing: Listing;
  onClose: () => void;
}

export default function ListingPanel({ listing, onClose }: ListingPanelProps) {
  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Prevent body scroll when panel is open
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm" onClick={onClose}>
      {/* Click on container stops propagation */}
      <div className="relative w-full max-w-md h-full bg-white p-6 overflow-y-auto" onClick={e => e.stopPropagation()}>
        <button
          className="absolute right-3 top-3 text-ink-muted hover:text-ink-strong"
          onClick={onClose}
          aria-label="Close panel"
        >
          &times;
        </button>
        <h2 className="mb-4 text-xl font-semibold">{listing.title}</h2>
        <img src={listing.image} alt={listing.title} className="mb-4 w-full rounded-lg" />
        <p className="mb-2"><strong>Category:</strong> {listing.category}</p>
        <p className="mb-2"><strong>Price per day:</strong> ${listing.pricePerDay}</p>
        <p className="mb-2"><strong>Rating:</strong> {listing.rating} ★</p>
        <p className="mb-2"><strong>Trust Score:</strong> {listing.trustScore}%</p>
        <p className="mb-4"><strong>Summary:</strong> {listing.summary}</p>
        {listing.host && (
          <p className="text-sm text-ink-soft">Hosted by {listing.host}</p>
        )}
      </div>
    </div>
  );
}
