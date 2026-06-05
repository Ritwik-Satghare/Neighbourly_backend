import { getAuthToken, getStoredUser } from "@/lib/auth";
import { getListingImage } from "@/lib/utils";
import { getAllPublicListings } from "@/lib/api";

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
  startDate?: string;
  endDate?: string;
  // Raw backend fields for payment/split logic
  rawStatus?: "pending" | "confirmed" | "cancelled" | "completed";
  rentalState?: "scheduled" | "checked_out" | "returned" | null;
  totalPrice?: number;
  rawBookingId?: string;
}

function getMockBookings(): MockBooking[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(MOCK_STORAGE_KEY);
    if (!data || data === "[]") {
      const defaultBookings: MockBooking[] = [
        {
          _id: "mock_playstation5",
          listingId: "ooni-koda",
          itemTitle: "Ooni Koda 16 Pizza Oven",
          itemImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
          requesterId: "mockRequester",
          requesterName: "Mock User",
          ownerId: "nina-brooks",
          status: "active",
          pricePerDay: 35,
          createdAt: new Date().toISOString(),
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          rawStatus: "confirmed",
          rentalState: null, // Unpaid
          totalPrice: 105,
          rawBookingId: "mock_playstation5"
        }
      ];
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(defaultBookings));
      return defaultBookings;
    }
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveMockBookings(bookings: MockBooking[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(bookings));
}

const fetchFromBackend = async (url: string, method = "GET", body?: any) => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const options: RequestInit = {
    method,
    headers,
    cache: "no-store"
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message ?? data.error ?? "API request failed");
  }
  return data;
};

// Intercept fetching to provide real backend data
export const getBookings = async (role = "owner") => {
  const token = getAuthToken();
  if (!token) {
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
  }

  try {
    // Prefetch all public listings for resolving images and titles
    const { listings } = await getAllPublicListings().catch(() => ({ listings: [] }));
    const listingMap = new Map(listings.map(l => [String(l.id ?? l._id), l]));

    // Fetch received/sent offers
    const offerType = role === "owner" ? "received" : "sent";
    const offersRes = await fetchFromBackend(`${API_BASE_URL}/offer/list?type=${offerType}`);
    const offers = offersRes.data ?? offersRes ?? [];

    // Fetch user bookings
    const bookingsRes = await fetchFromBackend(`${API_BASE_URL}/booking/user?role=${role}`);
    const bookings = bookingsRes.data ?? bookingsRes ?? [];

    const mappedOffers: MockBooking[] = (Array.isArray(offers) ? offers : [])
      .filter((offer: any) => offer.status === "pending")
      .map((offer: any) => {
      const listingId = String(offer.listingID?._id ?? offer.listingID);
      const listing = listingMap.get(listingId);
      return {
        _id: `offer_${offer._id}`,
        listingId,
        itemTitle: listing?.name ?? listing?.title ?? offer.listingID?.name ?? "Rented Item",
        itemImage: getListingImage(listing) || getListingImage(offer.listingID) || "",
        requesterId: offer.senderID?._id ?? offer.senderID,
        requesterName: offer.senderID?.firstName ?? offer.senderID?.name ?? offer.senderID?.email ?? "Neighbor",
        ownerId: offer.listingID?.ownerID ?? offer.listingID?.ownerId ?? listing?.ownerID ?? listing?.ownerId ?? "",
        status: offer.status === "pending" ? "pending" : (offer.status === "accepted" ? "active" : "canceled"),
        pricePerDay: Number(offer.listingID?.pricePerDay ?? listing?.pricePerDay ?? offer.amount),
        createdAt: offer.createdAt || new Date().toISOString(),
        // Offers don't have booking-level payment fields
        rawStatus: undefined,
        rentalState: undefined,
        totalPrice: undefined,
        rawBookingId: undefined,
      };
    });

    const mappedBookings: MockBooking[] = (Array.isArray(bookings) ? bookings : []).map((booking: any) => {
      const listingId = String(booking.listingID?._id ?? booking.listingID);
      const listing = listingMap.get(listingId);
      return {
        _id: `booking_${booking._id}`,
        listingId,
        itemTitle: listing?.name ?? listing?.title ?? booking.listingID?.name ?? "Rented Item",
        itemImage: getListingImage(listing) || getListingImage(booking.listingID) || "",
        requesterId: booking.renterID?._id ?? booking.renterID,
        requesterName: booking.renterID?.firstName ?? booking.renterID?.name ?? booking.renterID?.email ?? "Neighbor",
        ownerId: booking.listingID?.ownerID ?? booking.listingID?.ownerId ?? listing?.ownerID ?? listing?.ownerId ?? "",
        status: booking.status === "pending" ? "pending" : (booking.status === "confirmed" ? "active" : (booking.status === "completed" ? "completed" : "canceled")),
        pricePerDay: Number(booking.listingID?.pricePerDay ?? listing?.pricePerDay ?? booking.totalPrice),
        createdAt: booking.createdAt || new Date().toISOString(),
        // Raw backend fields for payment/split logic
        rawStatus: booking.status,
        rentalState: booking.rentalState ?? null,
        totalPrice: booking.totalPrice != null ? Number(booking.totalPrice) : undefined,
        rawBookingId: String(booking._id),
        startDate: booking.startDate,
        endDate: booking.endDate,
      };
    });

    return [...mappedOffers, ...mappedBookings];
  } catch (error) {
    console.error("Failed to load backend bookings, falling back to mock:", error);
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
  }
};

export const getBookingById = async (bookingId: string) => {
  const token = getAuthToken();
  if (!token) {
    const allBookings = getMockBookings();
    const found = allBookings.find(b => b._id === bookingId);
    if (!found) throw new Error("Booking not found");
    return found;
  }

  try {
    const { listings } = await getAllPublicListings().catch(() => ({ listings: [] }));
    const listingMap = new Map(listings.map(l => [String(l.id ?? l._id), l]));

    if (bookingId.startsWith("offer_")) {
      const realId = bookingId.replace("offer_", "");
      const offersRes = await fetchFromBackend(`${API_BASE_URL}/offer/list`);
      const offers = offersRes.data ?? offersRes ?? [];
      const found = offers.find((o: any) => String(o._id) === realId);
      if (!found) throw new Error("Offer not found");

      const listingId = String(found.listingID?._id ?? found.listingID);
      const listing = listingMap.get(listingId);

      return {
        _id: bookingId,
        listingId,
        itemTitle: listing?.name ?? listing?.title ?? found.listingID?.name ?? "Rented Item",
        itemImage: getListingImage(listing) || getListingImage(found.listingID) || "",
        requesterId: found.senderID?._id ?? found.senderID,
        requesterName: found.senderID?.firstName ?? found.senderID?.name ?? found.senderID?.email ?? "Neighbor",
        ownerId: found.listingID?.ownerID ?? found.listingID?.ownerId ?? listing?.ownerID ?? listing?.ownerId ?? "",
        status: found.status === "pending" ? "pending" : (found.status === "accepted" ? "active" : "canceled"),
        pricePerDay: Number(found.listingID?.pricePerDay ?? listing?.pricePerDay ?? found.amount),
        createdAt: found.createdAt || new Date().toISOString()
      };
    } else {
      const realId = bookingId.replace("booking_", "");
      const res = await fetchFromBackend(`${API_BASE_URL}/booking/${realId}`);
      const booking = res.data ?? res;

      const listingId = String(booking.listingID?._id ?? booking.listingID);
      const listing = listingMap.get(listingId);

      return {
        _id: bookingId,
        listingId,
        itemTitle: listing?.name ?? listing?.title ?? booking.listingID?.name ?? "Rented Item",
        itemImage: getListingImage(listing) || getListingImage(booking.listingID) || "",
        requesterId: booking.renterID?._id ?? booking.renterID,
        requesterName: booking.renterID?.firstName ?? booking.renterID?.name ?? booking.renterID?.email ?? "Neighbor",
        ownerId: booking.listingID?.ownerID ?? booking.listingID?.ownerId ?? listing?.ownerID ?? listing?.ownerId ?? "",
        status: booking.status === "pending" ? "pending" : (booking.status === "confirmed" ? "active" : (booking.status === "completed" ? "completed" : "canceled")),
        pricePerDay: Number(booking.listingID?.pricePerDay ?? listing?.pricePerDay ?? booking.totalPrice),
        createdAt: booking.createdAt || new Date().toISOString(),
        // Raw backend fields for payment/split logic
        rawStatus: booking.status,
        rentalState: booking.rentalState ?? null,
        totalPrice: booking.totalPrice != null ? Number(booking.totalPrice) : undefined,
        rawBookingId: String(booking._id),
        startDate: booking.startDate,
        endDate: booking.endDate,
      };
    }
  } catch (error) {
    console.error("Failed to load booking details, falling back to mock:", error);
    const allBookings = getMockBookings();
    const found = allBookings.find(b => b._id === bookingId);
    if (!found) throw new Error("Booking not found");
    return found;
  }
};

export const createBookingMock = async (
  listingId: string, 
  itemTitle: string, 
  itemImage: string, 
  ownerId: string, 
  pricePerDay: number,
  startDate?: string,
  endDate?: string
) => {
  const token = getAuthToken();
  if (token) {
    const response = await fetch(`${API_BASE_URL}/offer/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        listingID: listingId,
        amount: pricePerDay,
        startDate: startDate || new Date().toISOString(),
        endDate: endDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        note: "Request to rent"
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message ?? data.error ?? "Failed to create booking request.");
    }
    return data;
  }

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
    createdAt: new Date().toISOString(),
    startDate: startDate || new Date().toISOString(),
    endDate: endDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  };

  const allBookings = getMockBookings();
  saveMockBookings([newBooking, ...allBookings]);
  
  return newBooking;
};

export const confirmOrCompleteBooking = async (
  bookingId: string,
  newStatus: "active" | "completed" = "completed"
) => {
  const token = getAuthToken();
  if (!token) {
    const allBookings = getMockBookings();
    const index = allBookings.findIndex(b => b._id === bookingId);
    if (index === -1) throw new Error("Booking not found");
    
    allBookings[index].status = newStatus;
    if (newStatus === "active") {
      allBookings[index].rawStatus = "confirmed";
      allBookings[index].rentalState = null;
    } else if (newStatus === "completed") {
      allBookings[index].rawStatus = "completed";
      allBookings[index].rentalState = "returned";
    }

    saveMockBookings(allBookings);
    return allBookings[index];
  }

  try {
    if (bookingId.startsWith("offer_")) {
      const realId = bookingId.replace("offer_", "");
      const res = await fetchFromBackend(`${API_BASE_URL}/offer/accept/${realId}`, "PATCH");
      return res.data ?? res;
    } else {
      const realId = bookingId.replace("booking_", "");
      const statusMap: Record<string, string> = {
        "active": "confirmed",
        "completed": "completed"
      };
      const statusToSend = statusMap[newStatus] || "confirmed";
      const res = await fetchFromBackend(`${API_BASE_URL}/booking/status/${realId}`, "PATCH", {
        status: statusToSend
      });
      return res.data ?? res;
    }
  } catch (error) {
    console.error("Failed to update status, falling back to mock:", error);
    const allBookings = getMockBookings();
    const index = allBookings.findIndex(b => b._id === bookingId);
    if (index === -1) throw new Error("Booking not found");
    
    allBookings[index].status = newStatus;
    saveMockBookings(allBookings);
    return allBookings[index];
  }
};

export const cancelBooking = async (bookingId: string) => {
  const token = getAuthToken();
  if (!token) {
    const allBookings = getMockBookings();
    const index = allBookings.findIndex(b => b._id === bookingId);
    if (index === -1) throw new Error("Booking not found");
    
    allBookings[index].status = "canceled";
    saveMockBookings(allBookings);
    return allBookings[index];
  }

  try {
    if (bookingId.startsWith("offer_")) {
      const realId = bookingId.replace("offer_", "");
      const res = await fetchFromBackend(`${API_BASE_URL}/offer/reject/${realId}`, "PATCH");
      return res.data ?? res;
    } else {
      const realId = bookingId.replace("booking_", "");
      const res = await fetchFromBackend(`${API_BASE_URL}/booking/cancel/${realId}`, "PATCH");
      return res.data ?? res;
    }
  } catch (error) {
    console.error("Failed to cancel, falling back to mock:", error);
    const allBookings = getMockBookings();
    const index = allBookings.findIndex(b => b._id === bookingId);
    if (index === -1) throw new Error("Booking not found");
    
    allBookings[index].status = "canceled";
    saveMockBookings(allBookings);
    return allBookings[index];
  }
};

/**
 * Mark item as handed over to renter (owner only).
 * PATCH /booking/start/:id → rentalState = checked_out
 */
export const startRental = async (bookingId: string) => {
  const realId = bookingId.replace("booking_", "").replace("offer_", "");
  const res = await fetchFromBackend(`${API_BASE_URL}/booking/start/${realId}`, "PATCH");
  return res.data ?? res;
};

/**
 * Mark item as returned by renter (owner only).
 * PATCH /booking/return/:id → rentalState = returned
 */
export const returnRental = async (bookingId: string) => {
  const realId = bookingId.replace("booking_", "").replace("offer_", "");
  const res = await fetchFromBackend(`${API_BASE_URL}/booking/return/${realId}`, "PATCH");
  return res.data ?? res;
};