import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export const PLACEHOLDER_IMAGE = "https://placehold.co/600x400/e2e8f0/94a3b8.png?text=No+Image";

/**
 * Safely extract the first usable image URL from a backend listing object.
 * Handles `image` (string), `images` (array), `imageUrl`, and `photo` fields.
 * Returns PLACEHOLDER_IMAGE when nothing valid is found.
 */
export function getListingImage(item: any): string {
  // Prefer single `image` string
  if (typeof item?.image === "string" && item.image.trim() !== "") {
    return item.image.trim();
  }
  // Then try `images` array
  if (Array.isArray(item?.images)) {
    const first = item.images.find(
      (u: unknown) => typeof u === "string" && u.trim() !== ""
    );
    if (first) return first.trim();
  }
  // Other common field names
  if (typeof item?.imageUrl === "string" && item.imageUrl.trim() !== "") {
    return item.imageUrl.trim();
  }
  if (typeof item?.photo === "string" && item.photo.trim() !== "") {
    return item.photo.trim();
  }
  return PLACEHOLDER_IMAGE;
}
