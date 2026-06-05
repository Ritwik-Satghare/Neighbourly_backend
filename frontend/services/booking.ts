import { getAuthToken, getStoredUser } from "@/lib/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "/api";

// Use localStorage to mock backend if API fails
const MOCK_STORAGE_KEY = "neighbourly.mockBookings";

export interface MockBooking {
  _id: string;
  listingId: string;
  itemTitle: string;
  itemImage: string;
  requesterId: string;
  requesterName: string;
  ownerId: string;
  status: "pending" | "active" | "completed" | "canceled";
  pricePerDay: number;
  createdAt: string;
}

function getMockBookings(): MockBooking[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(MOCK_STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveMockBookings(bookings: MockBooking[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(bookings));
}

// Intercept fetching to provide our mock data 
export const getBookings = async (role = "owner") => {
  let user = getStoredUser();
  let userId = "mockRequester";
  if (user && (user.id || user._id)) {
    userId = String(user.id || user._id);
  }

  const allBookings = getMockBookings();
  const filtered = allBookings.filter(b => 
    role === "owner" ? String(b.ownerId) === userId : String(b.requesterId) === userId
  );

  return filtered;
};

export const getBookingById = async (bookingId: string) => {
  const allBookings = getMockBookings();
  const found = allBookings.find(b => b._id === bookingId);
  if (!found) throw new Error("Booking not found");
  return found;
};

export const createBookingMock = async (
  listingId: string, 
  itemTitle: string, 
  itemImage: string, 
  ownerId: string, 
  pricePerDay: number
) => {
  let user = getStoredUser();
  if (!user || (!user.id && !user._id)) {
    user = { id: "mockRequester", name: "Mock User" } as any;
  }
  
  const newBooking: MockBooking = {
    _id: "mock_" + Math.random().toString(36).substr(2, 9),
    listingId,
    itemTitle,
    itemImage,
    requesterId: String(user!.id || user!._id),
    requesterName: user!.name || user!.firstName || "Neighbor",
    ownerId: String(ownerId),
    status: "pending",
    pricePerDay,
    createdAt: new Date().toISOString()
  };

  const allBookings = getMockBookings();
  saveMockBookings([newBooking, ...allBookings]);
  
  return newBooking;
};

export const confirmOrCompleteBooking = async (
  bookingId: string,
  newStatus: "active" | "completed" = "completed"
) => {
  const allBookings = getMockBookings();
  const index = allBookings.findIndex(b => b._id === bookingId);
  if (index === -1) throw new Error("Booking not found");
  
  allBookings[index].status = newStatus;
  saveMockBookings(allBookings);
  return allBookings[index];
};

export const cancelBooking = async (bookingId: string) => {
  const allBookings = getMockBookings();
  const index = allBookings.findIndex(b => b._id === bookingId);
  if (index === -1) throw new Error("Booking not found");
  
  allBookings[index].status = "canceled";
  saveMockBookings(allBookings);
  return allBookings[index];
};