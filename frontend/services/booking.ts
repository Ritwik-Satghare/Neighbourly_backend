import { getAuthToken } from "@/lib/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "/api";

async function fetchWithAuth(path: string, options: RequestInit = {}) {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Authentication token missing. Please login again.");
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
    throw new Error(data.message || "Failed to fetch booking data");
  }

  return data;
}

export const getBookings = async (role = "owner") => {
  return fetchWithAuth(`/booking/user?role=${role}`, {
    method: "GET",
  });
};

export const getBookingById = async (bookingId: string) => {
  return fetchWithAuth(`/booking/${bookingId}`, {
    method: "GET",
  });
};

export const confirmOrCompleteBooking = async (
  bookingId: string,
  payload?: Record<string, unknown>
) => {
  return fetchWithAuth(`/booking/status/${bookingId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: payload ? JSON.stringify(payload) : undefined,
  });
};

export const cancelBooking = async (bookingId: string) => {
  return fetchWithAuth(`/booking/cancel/${bookingId}`, {
    method: "PATCH",
  });
};