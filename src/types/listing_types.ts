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

export interface PopulatedImage {
  imageUrl: string;
  isPrimary?: boolean;
}

export interface RawListing {
  _id: unknown;
  name?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  pricePerDay?: number;
  category?: string;
  rating?: number;
  availability?: {
    startDate: Date;
    endDate: Date;
  }[];
  images?: PopulatedImage[];
  thumbnail?: string | null;
}
