import express from 'express';
import {
  getAdminDashboardStats,
  getAllUsers,
  getAllCustomers,
  getAllVendors,
  getPendingVendors,
  getAdminVendorById,
  approveVendor,
  rejectVendor,
  getAllServicesAdmin,
  updateServiceStatusAdmin,
  deleteServiceAdmin,
  getAllBookingsAdmin,
  getBookingByIdAdmin,
  updateUserStatus
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Apply protect and admin authorization to ALL admin routes
router.use(protect, authorize('admin'));

// Admin Dashboard aggregated metrics
router.get('/dashboard', getAdminDashboardStats);

// Users management
router.get('/users', getAllUsers);
router.get('/customers', getAllCustomers);
router.patch('/users/:id/status', updateUserStatus);

// Vendor applications and moderation
router.get('/vendors/pending', getPendingVendors);
router.get('/vendors', getAllVendors);
router.get('/vendors/:id', getAdminVendorById);
router.patch('/vendors/:id/approve', approveVendor);
router.patch('/vendors/:id/reject', rejectVendor);

// Services moderation
router.get('/services', getAllServicesAdmin);
router.patch('/services/:id/status', updateServiceStatusAdmin);
router.delete('/services/:id', deleteServiceAdmin);

// Bookings monitoring
router.get('/bookings', getAllBookingsAdmin);
router.get('/bookings/:id', getBookingByIdAdmin);

export default router;

