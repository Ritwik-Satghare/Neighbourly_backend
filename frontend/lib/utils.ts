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

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";

export function normalizeImageUrl(url: string): string {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }
  // Prepend API base URL for relative paths
  return `${API_BASE_URL}/${trimmed.replace(/^\//, "")}`;
}

/**
 * Safely extract the first usable image URL from a backend listing object.
 * Handles `image` (string), `images` (array), `imageUrl`, and `photo` fields.
 * Returns PLACEHOLDER_IMAGE when nothing valid is found.
 */
export function getListingImage(item: any): string {
  if (!item) return PLACEHOLDER_IMAGE;
  // Try thumbnail first (returned by search/nearby endpoints)
  if (typeof item?.thumbnail === "string" && item.thumbnail.trim() !== "") {
    return normalizeImageUrl(item.thumbnail);
  }
  // Prefer single `image` string
  if (typeof item?.image === "string" && item.image.trim() !== "") {
    return normalizeImageUrl(item.image);
  }
  // Try `imageUrl`
  if (typeof item?.imageUrl === "string" && item.imageUrl.trim() !== "") {
    return normalizeImageUrl(item.imageUrl);
  }
  // Try `photo`
  if (typeof item?.photo === "string" && item.photo.trim() !== "") {
    return normalizeImageUrl(item.photo);
  }
  // Then try `images` array
  if (Array.isArray(item?.images)) {
    for (const u of item.images) {
      if (typeof u === "string" && u.trim() !== "") {
        return normalizeImageUrl(u);
      }
      if (u && typeof u === "object") {
        const obj = u as any;
        const url = obj.imageUrl ?? obj.url ?? obj.image ?? obj.photo;
        if (typeof url === "string" && url.trim() !== "") {
          return normalizeImageUrl(url);
        }
      }
    }
  }
  return PLACEHOLDER_IMAGE;
}
