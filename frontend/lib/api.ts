import { getValidAuthToken, getCurrentUserId } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "/api";

export function normaliseId(item: any): string | null {
  if (!item) return null;
  
  const candidates = [
    item?.id,
    item?._id,
    item?.listingId,
    item?.listingID,
    item?.data?.id,
    item?.data?._id,
    item?.listing?.id,
    item?.listing?._id
  ];

  for (const val of candidates) {
    if (!val) continue;
    
    if (typeof val === "string" && !val.includes(".")) {
      return val;
    }
    
    if (typeof val === "object" && typeof (val as any).$oid === "string") {
      return (val as any).$oid;
    }
    
    if (typeof val === "object") {
      const str = String(val);
      if (str && str !== "[object Object]" && !str.includes(".")) {
        return str;
      }
    }
  }

  console.warn("[normaliseId] failed to normalise ID for item:", item);
  return null;
}


function getUrl(path: string) {
  return `${API_BASE_URL}/${path.replace(/^\//, "")}`;
}

async function request(path: string, options: RequestInit = {}) {
  // Read the token that was saved to localStorage after login / signup.
  const token = getValidAuthToken();

  // Build headers – always add Authorization when a token exists.
  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Log in dev so we can verify the token is present.
  if (process.env.NODE_ENV !== "production") {
    console.log("[API]", path, "| token present:", Boolean(token));
  }

  const response = await fetch(getUrl(path), {
    ...options,
    headers,
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage = data.message ?? data.error ?? "API request failed";

    // Clear session only on true 401 Unauthorized – not on 400 validation errors.
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("neighbourly.authToken");
        window.localStorage.removeItem("neighbourly.user");
        window.dispatchEvent(new Event("neighbourly-auth-change"));
      }
    }

    throw new Error(errorMessage);
  }

  return data;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type CreateListingPayload = {
  title: string;
  category: string;
  summary: string;
  pricePerDay: number;
  neighborhood?: string;
  conditionNotes?: string;
  availabilitySlots?: any[];
};

export type SearchParams = {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
};

export type NearbyParams = {
  lat: number;
  lng: number;
  radius?: number;
};

export type ListingResponse = {
  id: string;
  title: string;
  category: string;
  pricePerDay: number;
  summary: string;
  image?: string;
  images?: string[];
  host?: string;
  ownerId?: string;
  ownerID?: string;
  trustScore?: number;
  distance?: string;
  rating?: number;
  _id?: string;
  price_per_day?: number;
  trust_score?: number;
  description?: string;
  name?: string;
};

// ─── Listing helpers ──────────────────────────────────────────────────────────

/**
 * Creates a new listing.
 * The auth token (stored in localStorage after login/signup) is automatically
 * attached as an Authorization header by the `request` helper above.
 */
export async function createListing(
  payload: CreateListingPayload
): Promise<{ listing: ListingResponse; id: string }> {
  // Decode the userId from the stored JWT so the backend can tie the listing
  // to the correct account – no OTP required.
  const userId = getCurrentUserId();

  // Build the payload the backend expects.
  let finalDescription = payload.summary;
  if (payload.availabilitySlots && payload.availabilitySlots.length > 0) {
    finalDescription += `\n\n[AvailabilitySlots]:${JSON.stringify(payload.availabilitySlots)}`;
  }

  const apiPayload: Record<string, unknown> = {
    name: payload.title,
    category: payload.category,
    description: finalDescription,
    pricePerDay: payload.pricePerDay,
    availability: payload.availabilitySlots || [],
    availability_slots: payload.availabilitySlots || [],
  };

  // Only include optional fields when they have a value.
  if (payload.neighborhood) apiPayload.neighborhood = payload.neighborhood;
  if (payload.conditionNotes) apiPayload.condition_notes = payload.conditionNotes;
  if (userId) apiPayload.userId = userId;

  if (process.env.NODE_ENV !== "production") {
    console.log("[createListing] payload being sent →", apiPayload);
  }

  const response = await request("/listing/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(apiPayload),
  });

  const listingData = response.listing ?? response.data ?? response;
  return {
    listing: listingData,
    id: normaliseId(listingData) ?? "",
  };
}

export async function uploadImages(listingId: string, files: File[]): Promise<any> {
  try {
    // Option A: Single request with field name 'images' (plural) and both listingID/listingId
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });
    formData.append("listingID", listingId);
    formData.append("listingId", listingId);

    return await request("/listing/upload-images", {
      method: "POST",
      body: formData,
    });
  } catch (err) {
    console.warn("Upload with field name 'images' failed, retrying with field 'image'...", err);
    
    try {
      // Option B: Single request with field name 'image' (singular) and both listingID/listingId
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("image", file);
      });
      formData.append("listingID", listingId);
      formData.append("listingId", listingId);

      return await request("/listing/upload-images", {
        method: "POST",
        body: formData,
      });
    } catch (err2) {
      console.warn("Upload with single request field 'image' failed, retrying with individual requests...", err2);
      
      // Option C: Individual requests with field name 'image' (singular)
      const uploadPromises = files.map((file) => {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("listingID", listingId);
        formData.append("listingId", listingId);

        return request("/listing/upload-images", {
          method: "POST",
          body: formData,
        });
      });
      return Promise.all(uploadPromises);
    }
  }
}

/**
 * Fetches all listings (paginated).
 */
export async function getAllPublicListings(
  page = 1,
  limit = 1000
): Promise<{ listings: ListingResponse[] }> {
  // Direct fetch without Authorization header to retrieve all listings publicly.
  const response = await fetch(`${API_BASE_URL}/listing/all?page=${page}&limit=${limit}`, {
    method: "GET",
    cache: "no-store",
  });
  const data = await response.json();
  if (!response.ok) {
    const errorMessage = data.message ?? data.error ?? "API request failed";
    throw new Error(errorMessage);
  }
  const rawListings =
    data.listings ?? data.data?.listings ?? (Array.isArray(data) ? data : []);
  return { listings: rawListings };
}

/**
 * Fetches a single listing by ID.
 */
export async function getListingById(id: string): Promise<ListingResponse> {
  const response = await request(`/listing/${id}`, { method: "GET" });
  return response.listing ?? response.data ?? response;
}

/**
 * Fetches all listings for a specific user.
 */
export async function getUserListings(userId: string): Promise<{ listings: ListingResponse[] }> {
  const response = await request(`/listing/user/${userId}`, { method: "GET" });
  const rawListings = response.data ?? response.listings ?? (Array.isArray(response) ? response : []);
  return { listings: rawListings };
}

/**
 * Searches and filters listings.
 */
export async function searchListings(
  params: SearchParams
): Promise<{ listings: ListingResponse[] }> {
  const query = new URLSearchParams();
  if (params.category) query.append("category", params.category);
  if (params.minPrice !== undefined) query.append("minPrice", String(params.minPrice));
  if (params.maxPrice !== undefined) query.append("maxPrice", String(params.maxPrice));
  if (params.search) query.append("search", params.search);
  if (params.page) query.append("page", String(params.page));
  if (params.limit) query.append("limit", String(params.limit));

  const response = await request(`/listing/search?${query.toString()}`, { method: "GET" });
  const rawListings =
    response.listings ?? response.data?.listings ?? (Array.isArray(response.data) ? response.data : []) ?? (Array.isArray(response) ? response : []);
  return { listings: rawListings };
}

/**
 * Fetches listings near specified coordinates.
 */
export async function getNearbyListings(
  params: NearbyParams
): Promise<{ listings: ListingResponse[] }> {
  const radius = params.radius ?? 15;
  const response = await request(
    `/listing/nearby?lat=${params.lat}&lng=${params.lng}&radius=${radius}`,
    { method: "GET" }
  );
  const rawListings =
    response.listings ?? response.data?.listings ?? (Array.isArray(response.data) ? response.data : []) ?? (Array.isArray(response) ? response : []);
  return { listings: rawListings };
}

/**
 * Updates an existing listing.
 */
export async function updateListing(
  id: string,
  payload: Partial<CreateListingPayload>
): Promise<any> {
  const apiPayload: Record<string, unknown> = { ...payload };
  if (payload.title !== undefined) apiPayload.name = payload.title;
  if (payload.summary !== undefined) apiPayload.description = payload.summary;
  if (payload.pricePerDay !== undefined) apiPayload.pricePerDay = payload.pricePerDay;
  if (payload.conditionNotes) apiPayload.condition_notes = payload.conditionNotes;

  return request(`/listing/update/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(apiPayload),
  });
}

/**
 * Deletes a listing.
 */
export async function deleteListing(id: string): Promise<any> {
  return request(`/listing/delete/${id}`, { method: "DELETE" });
}

// ─── Offer helpers ────────────────────────────────────────────────────────────

export type CreateOfferPayload = {
  title: string;
  category: string;
  summary: string;
  pricePerDay: number;
  neighborhood?: string;
  conditionNotes?: string;
};

export type OfferResponse = ListingResponse;

/** Create a new offer */
export async function createOffer(
  payload: CreateOfferPayload
): Promise<{ offer: OfferResponse; id: string }> {
  const userId = getCurrentUserId();
  const apiPayload: Record<string, unknown> = {
    name: payload.title,
    category: payload.category,
    description: payload.summary,
    pricePerDay: payload.pricePerDay,
  };
  if (payload.neighborhood) apiPayload.neighborhood = payload.neighborhood;
  if (payload.conditionNotes) apiPayload.condition_notes = payload.conditionNotes;
  if (userId) apiPayload.userId = userId;

  const response = await request("/offer/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(apiPayload),
  });

  return {
    offer: response.offer ?? response.data ?? response,
    id: response.offer?.id ?? response.id ?? response.data?.id,
  };
}

/** Upload images for an offer */
export async function uploadOfferImages(offerId: string, files: File[]): Promise<any> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("images", file);
  });
  formData.append("offerID", offerId);
  formData.append("offerId", offerId);
  return request("/offer/upload-images", { method: "POST", body: formData });
}

/** Get offers list */
export async function getOffers(
  type = "received",
  page = 1,
  limit = 10
): Promise<{ offers: OfferResponse[] }> {
  const response = await request(
    `/offer/list?type=${encodeURIComponent(type)}&page=${page}&limit=${limit}`,
    { method: "GET" }
  );
  const raw = response.offers ?? response.listings ?? response.data ?? [];
  return { offers: raw };
}

/** Accept an offer */
export async function acceptOffer(offerId: string): Promise<any> {
  return request(`/offer/accept/${offerId}`, { method: "PATCH" });
}

/** Reject an offer */
export async function rejectOffer(offerId: string): Promise<any> {
  return request(`/offer/reject/${offerId}`, { method: "PATCH" });
}
