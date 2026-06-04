import { getAuthToken } from "@/lib/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

export const getBookings = async (role = "owner") => {
  const token = getAuthToken();

  const response = await fetch(
    `${API_BASE_URL}/booking/user?role=${role}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch bookings");
  }

  return data;
};