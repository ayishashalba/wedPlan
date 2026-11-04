import express from 'express';
import {
  getServices,
  getServiceById,
  getServicesByCategory,
  getFeaturedServices,
  getPackages,
  getPackageById
} from '../controllers/serviceController.js';
import {
  createVendorService,
  updateVendorService,
  deleteVendorService
} from '../controllers/vendorController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Public Routes
router.get('/', getServices);
router.get('/featured', getFeaturedServices);
router.get('/category/:category', getServicesByCategory);
router.get('/packages/all', getPackages);
router.get('/packages/:id', getPackageById);
router.get('/:id', getServiceById);

// Direct service creation/modification (Vendor only)
router.post('/', protect, authorize('vendor'), createVendorService);
router.put('/:id', protect, authorize('vendor'), updateVendorService);
router.delete('/:id', protect, authorize('vendor'), deleteVendorService);

export default router;

