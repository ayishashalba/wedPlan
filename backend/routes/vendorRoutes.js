import express from 'express';
import {
  registerVendorProfile,
  getVendorProfile,
  updateVendorProfile,
  getVendorStatus,
  getVendorServices,
  createVendorService,
  updateVendorService,
  deleteVendorService,
  getVendorBookings,
  acceptBooking,
  rejectBooking,
  completeBooking,
  getVendorById
} from '../controllers/vendorController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Public / Authenticated Vendor Registration
router.post('/register', protect, registerVendorProfile);

// Specific vendor profile & status (Vendor only)
router.get('/profile', protect, authorize('vendor'), getVendorProfile);
router.put('/profile', protect, authorize('vendor'), updateVendorProfile);
router.get('/status', protect, authorize('vendor'), getVendorStatus);

// Vendor Services Management (Vendor only)
router.get('/services', protect, authorize('vendor'), getVendorServices);
router.post('/services', protect, authorize('vendor'), createVendorService);
router.put('/services/:id', protect, authorize('vendor'), updateVendorService);
router.delete('/services/:id', protect, authorize('vendor'), deleteVendorService);

// Vendor Bookings Management (Vendor only)
router.get('/bookings', protect, authorize('vendor'), getVendorBookings);
router.patch('/bookings/:id/accept', protect, authorize('vendor'), acceptBooking);
router.patch('/bookings/:id/reject', protect, authorize('vendor'), rejectBooking);
router.patch('/bookings/:id/complete', protect, authorize('vendor'), completeBooking);

// Public vendor profile details by ID
router.get('/:id', getVendorById);

export default router;

