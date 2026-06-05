import { getAuthToken } from "@/lib/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "/api";

// ─── Helpers ────────────────────────────────────────────────────────────────

const fetchWithAuth = async (url: string, method = "GET", body?: unknown) => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const options: RequestInit = { method, headers, cache: "no-store" };
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

// ─── User Search ────────────────────────────────────────────────────────────

export interface SearchedUser {
  _id: string;
  fullName: string;
  email: string;
}

/**
 * Search registered users by name or email (min 2 characters).
 */
export const searchUsers = async (query: string): Promise<SearchedUser[]> => {
  const q = encodeURIComponent(query.trim());
  const res = await fetchWithAuth(`${API_BASE_URL}/user/search?q=${q}`);
  return res.data ?? [];
};

// ─── Split CRUD ─────────────────────────────────────────────────────────────

export interface SplitParticipant {
  userID: string;
  amount: number;
}

export interface SplitRecord {
  _id: string;
  bookingID: string;
  userID: { _id: string; fullName: string; email: string } | string;
  amount: number;
  status: "pending" | "paid" | "failed";
  paidAt?: string;
  createdAt: string;
}

export interface SplitSummary {
  totalPrice: number;
  totalPaid: number;
  totalPending: number;
  allPaid: boolean;
  bookingStatus: string;
  rentalState: string | null;
}

export interface SplitsByBookingResponse {
  splits: SplitRecord[];
  summary: SplitSummary;
}

/**
 * Create split payment records for a booking.
 * Body: { bookingID, splits: [{ userID, amount }] }
 */
export const createSplits = async (
  bookingID: string,
  splits: SplitParticipant[]
): Promise<SplitRecord[]> => {
  if (bookingID.startsWith("mock_")) {
    const mockUsers = [
      { _id: "user_alice", fullName: "Alice Smith", email: "alice@example.com" },
      { _id: "user_bob", fullName: "Bob Jones", email: "bob@example.com" }
    ];
    
    const records = splits.map(s => ({
      _id: "split_" + Math.random().toString(36).substr(2, 9),
      bookingID,
      userID: s.userID,
      amount: s.amount,
      status: "pending",
      createdAt: new Date().toISOString()
    })) as SplitRecord[];
    
    if (typeof window !== "undefined") {
      const existing = JSON.parse(localStorage.getItem("neighbourly.mockSplits") || "[]");
      localStorage.setItem("neighbourly.mockSplits", JSON.stringify([...existing, ...records]));
    }
    return records;
  }

  const res = await fetchWithAuth(`${API_BASE_URL}/split/create`, "POST", {
    bookingID,
    splits,
  });
  return res.data ?? [];
};

/**
 * Fetch all split records and summary for a booking.
 */
export const getSplitsByBooking = async (
  bookingID: string
): Promise<SplitsByBookingResponse> => {
  if (bookingID.startsWith("mock_")) {
    let splits: SplitRecord[] = [];
    if (typeof window !== "undefined") {
      const existing = JSON.parse(localStorage.getItem("neighbourly.mockSplits") || "[]") as SplitRecord[];
      splits = existing.filter(s => s.bookingID === bookingID);
    }
    
    const totalPrice = 2500;
    const totalPaid = splits.filter(s => s.status === "paid").reduce((sum, s) => sum + s.amount, 0);
    const totalPending = splits.filter(s => s.status === "pending").reduce((sum, s) => sum + s.amount, 0);
    const allPaid = splits.length > 0 && totalPending === 0;

    return {
      splits,
      summary: {
        totalPrice,
        totalPaid,
        totalPending,
        allPaid,
        bookingStatus: "confirmed",
        rentalState: null
      }
    };
  }

  const res = await fetchWithAuth(`${API_BASE_URL}/split/${bookingID}`);
  return res.data ?? { splits: [], summary: {} };
};

// ─── Payment ────────────────────────────────────────────────────────────────

export interface RazorpayOrderResponse {
  transaction: { _id: string; amount: number; status: string };
  razorpayOrder: { id: string; amount: number; currency: string };
}

/**
 * Create a Razorpay order for full booking payment.
 */
export const createBookingPayment = async (
  bookingID: string
): Promise<RazorpayOrderResponse> => {
  const token = getAuthToken();
  if (!token || bookingID.startsWith("mock_")) {
    return {
      transaction: { _id: "mock_txn", amount: 1000, status: "pending" },
      razorpayOrder: { id: "order_mock", amount: 1000, currency: "INR" }
    } as any;
  }
  const res = await fetchWithAuth(`${API_BASE_URL}/payment/booking`, "POST", {
    bookingID,
  });
  return res.data;
};

/**
 * Create a Razorpay order for a split participant's share.
 */
export const createSplitPayment = async (
  bookingID: string,
  splitID: string
): Promise<RazorpayOrderResponse> => {
  const token = getAuthToken();
  if (!token || bookingID.startsWith("mock_")) {
    return {
      transaction: { _id: "mock_txn_split", amount: 1000, status: "pending" },
      razorpayOrder: { id: "order_mock_split", amount: 1000, currency: "INR" }
    } as any;
  }
  const res = await fetchWithAuth(`${API_BASE_URL}/payment/split`, "POST", {
    bookingID,
    splitID,
  });
  return res.data;
};

/**
 * Verify a Razorpay payment after checkout completes.
 */
export const verifyPayment = async (
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string,
  mockBookingId?: string
) => {
  const token = getAuthToken();
  if (!token || (mockBookingId && mockBookingId.startsWith("mock_"))) {
    if (mockBookingId && typeof window !== "undefined") {
      try {
        const bookings = JSON.parse(localStorage.getItem("neighbourly.mockBookings") || "[]");
        const idx = bookings.findIndex((b: any) => b._id === mockBookingId || b._id === `booking_${mockBookingId}`);
        if (idx !== -1) {
          bookings[idx].rentalState = "scheduled";
          localStorage.setItem("neighbourly.mockBookings", JSON.stringify(bookings));
        }
      } catch (e) {
        console.error(e);
      }
    }
    return { success: true };
  }
  const res = await fetchWithAuth(`${API_BASE_URL}/payment/verify`, "POST", {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });
  return res.data;
};

// ─── Raw Booking Fetch ──────────────────────────────────────────────────────

/**
 * Fetch raw backend booking by ID (for split-ownership page where
 * we need totalPrice, dates, listing info without MockBooking mapping).
 */
export const getRawBooking = async (bookingID: string) => {
  if (bookingID.startsWith("mock_")) {
    if (typeof window !== "undefined") {
      const mockBookings = JSON.parse(localStorage.getItem("neighbourly.mockBookings") || "[]");
      const booking = mockBookings.find((b: any) => b._id === bookingID || b._id === `booking_${bookingID}`);
      if (booking) return booking;
    }
    return {
      _id: bookingID,
      totalPrice: 2500,
      status: "confirmed",
      rentalState: null,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000).toISOString()
    };
  }

  const res = await fetchWithAuth(`${API_BASE_URL}/booking/${bookingID}`);
  return res.data ?? res;
};

