import { getAuthToken } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "/api";

export type Review = {
  _id?: string;
  id?: string;
  listingID?: string;
  listingId?: string;
  userID?: string;
  userId?: string;
  rating: number;
  comment: string;
  createdAt?: string;
  created_at?: string;
  reviewerName?: string;
  reviewer?: string;
  name?: string;
  message?: string;
};

export type ReviewResponse = {
  review?: Review;
  reviews?: Review[];
  data?: Review[];
  message?: string;
};

export type CreateReviewPayload = {
  listingID: string;
  rating: number;
  comment: string;
};

async function fetchWithAuth(path: string, options: RequestInit = {}) {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Authentication token missing. Please log in again.");
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch review data");
  }

  return data as ReviewResponse;
}

export const getReviewsByListing = async (
  listingId: string
): Promise<ReviewResponse> => {
  return fetchWithAuth(`/review/list/${listingId}`, {
    method: "GET",
  });
};

export const getReviewsByUser = async (
  userId: string
): Promise<ReviewResponse> => {
  return fetchWithAuth(`/review/user/${userId}`, {
    method: "GET",
  });
};

export const createReview = async (
  listingID: string,
  rating: number,
  comment: string
): Promise<ReviewResponse> => {
  return fetchWithAuth(`/review/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      listingID,
      rating,
      comment,
    }),
  });
};