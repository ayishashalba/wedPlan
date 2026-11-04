import express from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  updateBookingStatus
} from '../controllers/bookingController.js';
import { getVendorBookings } from '../controllers/vendorController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Customer Bookings
router.post('/', protect, authorize('customer', 'admin'), createBooking);
router.get('/my-bookings', protect, authorize('customer', 'admin'), getMyBookings);

// Vendor Bookings shortcut route (supports frontend bookingService.getVendorBookings)
router.get('/vendor-bookings', protect, authorize('vendor'), getVendorBookings);

// Specific Booking details and cancellation
router.get('/:id', protect, getBookingById);
router.patch('/:id/cancel', protect, cancelBooking);
router.patch('/:id/status', protect, authorize('vendor', 'admin'), updateBookingStatus);

export default router;

