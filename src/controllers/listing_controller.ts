import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth_middleware';
import * as listingService from '../services/listing_service';
import { z } from 'zod';

export const createListingSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    category: z.string().min(1, "Category is required"),
    description: z.string().optional(),
    pricePerDay: z.number().positive("Price must be positive"),
    location: z.string().optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    lat: z.number().min(-90).max(90).optional(),
    lng: z.number().min(-180).max(180).optional(),
  }),
});

export const updateListingSchema = z.object({
  body: z.object({
    name: z.string().min(3).optional(),
    category: z.string().optional(),
    description: z.string().optional(),
    pricePerDay: z.number().positive().optional(),
    location: z.string().optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    lat: z.number().min(-90).max(90).optional(),
    lng: z.number().min(-180).max(180).optional(),
  }),
});

export const createListing = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userID = req.user?.id;
    if (!userID) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const listing = await listingService.createListing(userID, req.body);
    
    res.status(201).json({
      success: true,
      message: 'Listing created successfully',
      data: listing
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error creating listing' });
  }
};

export const updateListing = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userID = req.user?.id;
    const { id } = req.params;

    if (!userID) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const listing = await listingService.updateListing(id, userID, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Listing updated successfully',
      data: listing
    });
  } catch (error: any) {
    if (error.message.includes('Forbidden') || error.message.includes('owner')) {
         res.status(403).json({ success: false, message: error.message });
         return;
    }
    res.status(400).json({ success: false, message: error.message || 'Error updating listing' });
  }
};

export const deleteListing = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userID = req.user?.id;
    const { id } = req.params;

    if (!userID) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    await listingService.deleteListing(id, userID);
    
    res.status(200).json({
      success: true,
      message: 'Listing deleted successfully',
      data: {}
    });
  } catch (error: any) {
    if (error.message.includes('Forbidden') || error.message.includes('owner')) {
         res.status(403).json({ success: false, message: error.message });
         return;
    }
    res.status(400).json({ success: false, message: error.message || 'Error deleting listing' });
  }
};

export const getAllListings = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    let limit = parseInt(req.query.limit as string) || 10;
    
    if (limit > 50) limit = 50; // Max limit = 50

    const result = await listingService.getAllListings(page, limit);
    
    res.status(200).json({
      success: true,
      message: 'Listings fetched successfully',
      data: result
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error fetching listings' });
  }
};

export const getListingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const listing = await listingService.getListingById(id);
    
    res.status(200).json({
      success: true,
      message: 'Listing fetched successfully',
      data: listing
    });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message || 'Listing not found' });
  }
};

export const getListingsByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userID } = req.params;
    const listings = await listingService.getListingsByUser(userID);
    
    res.status(200).json({
      success: true,
      message: 'User listings fetched successfully',
      data: listings
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error fetching user listings' });
  }
};

export const getNearbyListings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lat, lng, radius } = req.query;

    if (lat === undefined || lng === undefined || radius === undefined) {
      res.status(400).json({ success: false, message: 'Missing lat, lng, or radius' });
      return;
    }

    const numLat = Number(lat);
    const numLng = Number(lng);
    const numRadius = Number(radius);

    if (isNaN(numLat) || isNaN(numLng) || isNaN(numRadius)) {
      res.status(400).json({ success: false, message: 'lat, lng, and radius must be valid numbers' });
      return;
    }

    const listings = await listingService.getNearbyListings(numLat, numLng, numRadius);
    res.status(200).json({ success: true, data: listings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};

export const searchListings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, minPrice, maxPrice, lat, lng, radius, rating, startDate, endDate } = req.query;
    const filters: Parameters<typeof listingService.searchListings>[0] = {};

    if (category !== undefined) filters.category = String(category);
    
    if (minPrice !== undefined) {
      const parsed = Number(minPrice);
      if (isNaN(parsed)) {
        res.status(400).json({ success: false, message: 'minPrice must be a valid number' });
        return;
      }
      filters.minPrice = parsed;
    }

    if (maxPrice !== undefined) {
      const parsed = Number(maxPrice);
      if (isNaN(parsed)) {
        res.status(400).json({ success: false, message: 'maxPrice must be a valid number' });
        return;
      }
      filters.maxPrice = parsed;
    }

    if (rating !== undefined) {
      const parsed = Number(rating);
      if (isNaN(parsed)) {
        res.status(400).json({ success: false, message: 'rating must be a valid number' });
        return;
      }
      filters.rating = parsed;
    }

    if (lat !== undefined || lng !== undefined || radius !== undefined) {
      const numLat = Number(lat);
      const numLng = Number(lng);
      const numRadius = Number(radius);
      if (isNaN(numLat) || isNaN(numLng) || isNaN(numRadius)) {
        res.status(400).json({ success: false, message: 'lat, lng, and radius must be valid numbers' });
        return;
      }
      filters.lat = numLat;
      filters.lng = numLng;
      filters.radius = numRadius;
    }

    if (startDate !== undefined || endDate !== undefined) {
      const start = new Date(String(startDate));
      const end = new Date(String(endDate));
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        res.status(400).json({ success: false, message: 'startDate and endDate must be valid ISO dates' });
        return;
      }
      
      filters.startDate = start.toISOString();
      filters.endDate = end.toISOString();
    }

    const listings = await listingService.searchListings(filters);
    res.status(200).json({ success: true, data: listings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};
