import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth_middleware';
import * as bookingService from '../services/booking_service';
import { z } from 'zod';

// ─── Validation Schemas ──────────────────────────────────────────────────────

export const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(['confirmed', 'completed'], {
      errorMap: () => ({ message: "Status must be 'confirmed' or 'completed'" }),
    }),
  }),
});

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * GET /booking/user
 * Get all bookings for the authenticated user.
 * Query params: role (renter|owner), status (pending|confirmed|cancelled|completed)
 */
export const getUserBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userID = req.user?.id;
    if (!userID) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const bookings = await bookingService.getUserBookings(userID, req.query);

    res.status(200).json({
      success: true,
      message: 'Bookings fetched successfully',
      data: bookings,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error fetching bookings' });
  }
};

/**
 * GET /booking/:id
 * Get a single booking by ID (renter or owner only).
 */
export const getBookingById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userID = req.user?.id;
    if (!userID) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const booking = await bookingService.getBookingById(req.params.id, userID);

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error: any) {
    if (error.message.includes('Forbidden')) {
      res.status(403).json({ success: false, message: error.message });
      return;
    }
    if (error.message.includes('not found')) {
      res.status(404).json({ success: false, message: error.message });
      return;
    }
    res.status(400).json({ success: false, message: error.message || 'Error fetching booking' });
  }
};

/**
 * PATCH /booking/cancel/:id
 * Cancel a booking (renter only).
 */
export const cancelBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userID = req.user?.id;
    if (!userID) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const booking = await bookingService.cancelBooking(req.params.id, userID);

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking,
    });
  } catch (error: any) {
    if (error.message.includes('Forbidden')) {
      res.status(403).json({ success: false, message: error.message });
      return;
    }
    res.status(400).json({ success: false, message: error.message || 'Error cancelling booking' });
  }
};

/**
 * PATCH /booking/status/:id
 * Update booking status (owner only). Body: { status: 'confirmed' | 'completed' }
 */
export const updateBookingStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userID = req.user?.id;
    if (!userID) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const booking = await bookingService.updateBookingStatus(
      req.params.id,
      userID,
      req.body.status
    );

    res.status(200).json({
      success: true,
      message: `Booking status updated to '${booking.status}'`,
      data: booking,
    });
  } catch (error: any) {
    if (error.message.includes('Forbidden')) {
      res.status(403).json({ success: false, message: error.message });
      return;
    }
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating booking status',
    });
  }
};
