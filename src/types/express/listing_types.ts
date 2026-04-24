// types/listing_types.ts
export interface Listing {
    listingID: string;
    name: string;
    pricePerDay: number;
    location: string;
    lat: number;
    lng: number;
    thumbnail: string;
    rating?: number;
    category?: string;
    availability?: {
        startDate: Date;
        endDate: Date;
    }[];
}

export interface SearchFilters {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    lat?: number;
    lng?: number;
    radius?: number;
    rating?: number;
    startDate?: string;
    endDate?: string;
}
