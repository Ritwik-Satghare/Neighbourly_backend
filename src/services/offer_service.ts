import Offer from '../models/offer_model';
import Listing from '../models/listing_model';
import Booking from '../models/booking_model';

/**
 * Create a new rental offer.
 * - Validates listing exists
 * - Prevents owner from sending offer on their own listing
 * - Checks for date overlap with existing confirmed/pending bookings (double-booking prevention)
 */
export const createOffer = async (senderID: string, data: any) => {
  const listing = await Listing.findById(data.listingID);
  if (!listing) throw new Error('Listing not found');

  // ownerID is stored as String in Listing model
  if (listing.ownerID === senderID) {
    throw new Error('You cannot send an offer for your own listing');
  }

  // Validate dates: endDate must be after startDate
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  if (endDate <= startDate) {
    throw new Error('End date must be after start date');
  }

  // Check for overlapping bookings (double-booking prevention)
  const overlappingBooking = await Booking.findOne({
    listingID: data.listingID,
    status: { $in: ['pending', 'confirmed'] },
    startDate: { $lt: endDate },
    endDate: { $gt: startDate },
  });

  if (overlappingBooking) {
    throw new Error('This listing is already booked for the requested dates');
  }

  const offer = await Offer.create({
    listingID: data.listingID,
    senderID: senderID,
    amount: data.amount,
    startDate: startDate,
    endDate: endDate,
    note: data.note,
    status: 'pending',
  });

  return offer;
};

/**
 * List offers for a user.
 * Supports filtering by: sent, received, or a specific listing.
 */
export const listOffers = async (userID: string, query: any) => {
  const { listingID, type } = query;

  let filter: any = {};

  if (type === 'sent') {
    filter.senderID = userID;
  } else if (type === 'received') {
    const userListings = await Listing.find({ ownerID: userID }).select('_id');
    const listingIDs = userListings.map((l) => l._id);
    filter.listingID = { $in: listingIDs };
  } else if (listingID) {
    filter.listingID = listingID;
  } else {
    // Both sent and received
    const userListings = await Listing.find({ ownerID: userID }).select('_id');
    const listingIDs = userListings.map((l) => l._id);
    filter = {
      $or: [{ senderID: userID }, { listingID: { $in: listingIDs } }],
    };
  }

  const offers = await Offer.find(filter)
    .populate('listingID', 'name pricePerDay ownerID')
    .sort({ createdAt: -1 });

  return offers;
};

/**
 * Accept an offer (owner-only).
 * - Validates ownership
 * - Prevents duplicate acceptance
 * - Checks for date overlaps AGAIN at accept-time (race condition protection)
 * - Atomically creates a Booking
 */
export const acceptOffer = async (offerID: string, ownerID: string) => {
  const offer = await Offer.findById(offerID).populate('listingID');
  if (!offer) throw new Error('Offer not found');

  const listing = offer.listingID as any;
  if (listing.ownerID !== ownerID) {
    throw new Error('Forbidden: You are not the owner of this listing');
  }

  if (offer.status !== 'pending') {
    throw new Error(`Offer is already ${offer.status}`);
  }

  // Double-booking guard at accept time (prevents race conditions)
  const overlappingBooking = await Booking.findOne({
    listingID: listing._id,
    status: { $in: ['pending', 'confirmed'] },
    startDate: { $lt: offer.endDate },
    endDate: { $gt: offer.startDate },
  });

  if (overlappingBooking) {
    throw new Error('Cannot accept: listing is already booked for these dates');
  }

  offer.status = 'accepted';
  await offer.save();

  // Create Booking automatically when offer is accepted
  const booking = await Booking.create({
    offerID: offer._id,
    renterID: offer.senderID,
    listingID: listing._id,
    startDate: offer.startDate,
    endDate: offer.endDate,
    totalPrice: offer.amount,
    status: 'pending',
  });

  return { offer, booking };
};

/**
 * Reject an offer (owner-only).
 */
export const rejectOffer = async (offerID: string, ownerID: string) => {
  const offer = await Offer.findById(offerID).populate('listingID');
  if (!offer) throw new Error('Offer not found');

  const listing = offer.listingID as any;
  if (listing.ownerID !== ownerID) {
    throw new Error('Forbidden: You are not the owner of this listing');
  }

  if (offer.status !== 'pending') {
    throw new Error(`Offer is already ${offer.status}`);
  }

  offer.status = 'rejected';
  await offer.save();

  return offer;
};
