import Listing from '../models/listing_model';
import ListingImage from '../models/listing_image_model';
import { deleteFromCloudinary, extractPublicId } from '../utils/cloudinary_upload';
import { calculateDistance } from '../utils/distance';
import { SearchFilters, RawListing } from '../types/listing_types';

export const createListing = async (userID: string, data: any) => {
  const listing = await Listing.create({
    ...data,
    ownerID: userID,
    latitude: data.latitude ?? data.lat,
    longitude: data.longitude ?? data.lng,
  });
  return listing;
};

export const updateListing = async (listingID: string, userID: string, data: any) => {
  const listing = await Listing.findById(listingID);
  if (!listing) throw new Error('Listing not found');
  if (listing.ownerID !== userID) throw new Error('Forbidden: You are not the owner');

  if (data.lat !== undefined && data.latitude === undefined) data.latitude = data.lat;
  if (data.lng !== undefined && data.longitude === undefined) data.longitude = data.lng;

  Object.assign(listing, data);
  await listing.save();
  return listing;
};

export const deleteListing = async (listingID: string, userID: string) => {
  const listing = await Listing.findById(listingID);
  if (!listing) throw new Error('Listing not found');
  if (listing.ownerID !== userID) throw new Error('Forbidden: You are not the owner');

  const images = await ListingImage.find({ listingID });

  // Delete images from Cloudinary
  for (const image of images) {
    const publicId = extractPublicId(image.imageUrl);
    if (publicId) {
      await deleteFromCloudinary(publicId);
    }
  }

  // Delete images from DB
  await ListingImage.deleteMany({ listingID });

  // Delete listing from DB
  await Listing.findByIdAndDelete(listingID);
  return true;
};

export const getAllListings = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;

  const listings = await Listing.find()
    .skip(skip)
    .limit(limit)
    .populate('images', 'imageUrl isPrimary') // Exclude heavy data, just necessary fields
    .lean();

  const total = await Listing.countDocuments();

  return { listings, total, page, limit };
};

export const getListingById = async (listingID: string) => {
  const listing = await Listing.findById(listingID)
    .populate('images', 'imageUrl isPrimary')
    .lean();
  if (!listing) throw new Error('Listing not found');
  return listing;
};

export const getListingsByUser = async (userID: string) => {
  const listings = await Listing.find({ ownerID: userID })
    .populate('images', 'imageUrl isPrimary')
    .lean();
  return listings;
};

export const getAllListingsRaw = async (): Promise<RawListing[]> => {
  return (await Listing.find().populate('images').lean()) as unknown as RawListing[];
};

export const getNearbyListings = async (lat: number, lng: number, radius: number) => {
  const listings = await getAllListingsRaw();
  
  return listings
    .filter(listing => {
      if (listing.latitude === undefined || listing.longitude === undefined) return false;
      const distance = calculateDistance(lat, lng, listing.latitude, listing.longitude);
      return distance <= radius;
    })
    .map(listing => {
      let thumbnail: string | null = null;
      if (listing.images && listing.images.length > 0) {
        const primary = listing.images.find(img => img.isPrimary);
        thumbnail = primary ? primary.imageUrl : listing.images[0].imageUrl;
      }
      return {
        listingID: listing._id,
        name: listing.name,
        pricePerDay: listing.pricePerDay,
        location: listing.location,
        lat: listing.latitude,
        lng: listing.longitude,
        thumbnail,
      };
    });
};

export const searchListings = async (filters: SearchFilters) => {
  let listings = await getAllListingsRaw();

  // Removed early mapping

  if (filters.category !== undefined) {
    listings = listings.filter(l => l.category === filters.category);
  }

  if (filters.minPrice !== undefined) {
    listings = listings.filter(l => l.pricePerDay !== undefined && l.pricePerDay >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    listings = listings.filter(l => l.pricePerDay !== undefined && l.pricePerDay <= filters.maxPrice!);
  }

  if (filters.rating !== undefined) {
    listings = listings.filter(l => l.rating !== undefined && l.rating >= filters.rating!);
  }

  if (filters.startDate !== undefined && filters.endDate !== undefined) {
    const searchStart = new Date(filters.startDate).getTime();
    const searchEnd = new Date(filters.endDate).getTime();

    listings = listings.filter(l => {
      if (!l.availability || l.availability.length === 0) {
        return true;
      }
      const hasOverlap = l.availability.some(slot => {
        const bookingStart = new Date(slot.startDate).getTime();
        const bookingEnd = new Date(slot.endDate).getTime();
        return !(bookingEnd < searchStart || bookingStart > searchEnd);
      });
      return !hasOverlap;
    });
  }

  if (filters.lat !== undefined && filters.lng !== undefined && filters.radius !== undefined) {
    listings = listings.filter(l => {
      if (l.latitude === undefined || l.longitude === undefined) return false;
      const distance = calculateDistance(filters.lat!, filters.lng!, l.latitude, l.longitude);
      return distance <= filters.radius!;
    });
  }

  return listings.map(listing => {
    let thumbnail: string | null = null;
    if (listing.images && listing.images.length > 0) {
      const primary = listing.images.find(img => img.isPrimary);
      thumbnail = primary ? primary.imageUrl : listing.images[0].imageUrl;
    }
    return {
      listingID: listing._id,
      name: listing.name,
      pricePerDay: listing.pricePerDay,
      location: listing.location,
      lat: listing.latitude,
      lng: listing.longitude,
      thumbnail,
    };
  });
};
