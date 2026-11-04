import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import Package from '../models/Package.js';
import { generateBookingId } from '../utils/generateBookingId.js';

// @desc    Create a new booking request
// @route   POST /api/bookings
// @access  Private (Customer only)
export const createBooking = async (req, res, next) => {
  try {
    const {
      serviceId,
      packageId,
      eventType,
      eventDate,
      eventTime,
      guestCount,
      location,
      eventLocation,
      requirements,
      additionalRequirements
    } = req.body;

    // 1. Validate customer role
    if (req.user.role !== 'customer' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only customer accounts can submit booking requests.'
      });
    }

    // 2. Validate event date is in the future
    if (!eventDate) {
      return res.status(400).json({
        success: false,
        message: 'Celebration event date is required.'
      });
    }

    const selectedDate = new Date(eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(selectedDate.getTime()) || selectedDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Event date must be a valid future date.'
      });
    }

    // 3. Locate Target Service or Package
    let serviceDoc = null;
    let packageDoc = null;
    let targetVendorId = null;
    let targetVendorName = '';
    let targetServiceName = '';
    let targetServiceCategory = '';
    let calculatedAmount = 0;

    const targetServiceId = serviceId || req.body.service;

    if (targetServiceId) {
      serviceDoc = await Service.findById(targetServiceId)
        .populate('vendorProfile')
        .populate('vendor', 'name email phone');

      if (!serviceDoc) {
        return res.status(404).json({
          success: false,
          message: 'The requested service listing was not found.'
        });
      }

      if (!serviceDoc.isActive) {
        return res.status(400).json({
          success: false,
          message: 'This service is currently unavailable for bookings.'
        });
      }

      targetVendorId = serviceDoc.vendor?._id || serviceDoc.vendor;
      targetVendorName = serviceDoc.vendorProfile?.businessName || serviceDoc.vendorName || serviceDoc.vendor?.name || 'Wedding Vendor';
      targetServiceName = serviceDoc.serviceName;
      targetServiceCategory = serviceDoc.category;

      // Check if service has capacity limit enabled in MongoDB
      const capacityEnabled = Boolean(
        serviceDoc.hasGuestCapacity ||
        (serviceDoc.hasGuestCapacity === undefined && (serviceDoc.maxGuestCapacity > 0 || serviceDoc.guestCapacity > 0))
      );
      const maxCapacity = capacityEnabled
        ? Number(serviceDoc.maxGuestCapacity || serviceDoc.guestCapacity || 0)
        : 0;

      let finalGuestCount = 0;

      if (capacityEnabled && maxCapacity > 0) {
        // Capacity is ENABLED: guestCount is mandatory and validated against maximum capacity
        const requestedGuests = Number(guestCount);
        if (!guestCount || isNaN(requestedGuests) || requestedGuests <= 0 || !Number.isInteger(requestedGuests)) {
          return res.status(400).json({
            success: false,
            message: 'Expected number of guests is required and must be a positive whole number.'
          });
        }

        if (requestedGuests > maxCapacity) {
          const vendorContactPhone =
            serviceDoc.vendorProfile?.phone ||
            serviceDoc.vendor?.phone ||
            '';

          return res.status(400).json({
            success: false,
            message: `Sorry! This service can accommodate a maximum of ${maxCapacity} guests. You requested ${requestedGuests} guests. Please contact the vendor for further assistance.`,
            capacityError: {
              maxCapacity,
              requestedGuests,
              vendorName: targetVendorName,
              vendorPhone: vendorContactPhone
            }
          });
        }
        finalGuestCount = requestedGuests;
      } else {
        // Capacity is DISABLED: guestCount is optional, never required, no capacity validation
        if (guestCount && !isNaN(Number(guestCount)) && Number(guestCount) > 0) {
          finalGuestCount = Number(guestCount);
        } else {
          finalGuestCount = 0;
        }
      }

      // 4. Server-Side Price Calculation (Never trust frontend price)
      if (serviceDoc.priceType === 'per-person' || serviceDoc.priceUnit === 'per person' || serviceDoc.priceUnit === 'per plate') {
        const multiplier = finalGuestCount > 0 ? finalGuestCount : 1;
        calculatedAmount = (serviceDoc.discountPrice || serviceDoc.price) * multiplier;
      } else {
        calculatedAmount = serviceDoc.discountPrice || serviceDoc.price;
      }
    } else if (packageId || req.body.package) {
      packageDoc = await Package.findById(packageId || req.body.package);
      if (!packageDoc) {
        return res.status(404).json({
          success: false,
          message: 'The requested wedding package was not found.'
        });
      }

      const requestedGuests = Number(guestCount);
      if (guestCount && (isNaN(requestedGuests) || requestedGuests <= 0 || !Number.isInteger(requestedGuests))) {
        return res.status(400).json({
          success: false,
          message: 'Guest count must be a positive integer.'
        });
      }

      targetVendorId = packageDoc.vendor;
      targetVendorName = 'WedPlan Curated Package';
      targetServiceName = packageDoc.packageName;
      targetServiceCategory = 'package';
      calculatedAmount = packageDoc.discountPrice || packageDoc.price;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide either a valid serviceId or packageId.'
      });
    }

    // 5. Check if hall already has a CONFIRMED booking on this eventDate
    if (serviceDoc && (serviceDoc.category === 'hall' || serviceDoc.category === 'wedding hall')) {
      const existingConfirmed = await Booking.findOne({
        service: serviceDoc._id,
        eventDate,
        status: 'confirmed'
      });

      if (existingConfirmed) {
        return res.status(409).json({
          success: false,
          message: `Date Unavailable: ${serviceDoc.serviceName} is already fully booked and confirmed on ${eventDate}. Please choose an alternative date.`
        });
      }
    }

    // 6. Generate unique readable booking ID
    const bookingId = generateBookingId();

    const booking = await Booking.create({
      bookingId,
      customer: req.user._id,
      vendor: targetVendorId,
      service: serviceDoc ? serviceDoc._id : packageDoc._id,
      serviceName: targetServiceName,
      serviceCategory: targetServiceCategory,
      vendorName: targetVendorName,
      customerName: req.user.name,
      customerEmail: req.user.email,
      customerPhone: req.user.phone,
      packageName: packageDoc ? packageDoc.packageName : '',
      eventType: eventType || 'Wedding Ceremony',
      eventDate,
      eventTime: eventTime || '09:30 AM (Muhurtham)',
      guestCount: Number(guestCount) || 100,
      eventLocation: eventLocation || location || serviceDoc?.location || 'Kerala, India',
      requirements: requirements || additionalRequirements || '',
      totalAmount: calculatedAmount,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Booking request placed successfully. The vendor will review and update status.',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bookings of current customer
// @route   GET /api/bookings/my-bookings
// @access  Private (Customer only)
export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id })
      .populate('service', 'serviceName category images image price location district')
      .populate('vendor', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      message: 'Customer bookings retrieved successfully',
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private (Customer, Vendor, or Admin)
export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      $or: [{ _id: req.params.id }, { bookingId: req.params.id }]
    })
      .populate('customer', 'name email phone')
      .populate('vendor', 'name email phone')
      .populate('service');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.'
      });
    }

    // Authorization check
    const customerId = booking.customer?._id || booking.customer;
    const isOwnerCustomer = customerId?.toString() === req.user._id.toString();
    const vendorId = booking.vendor?._id || booking.vendor;
    const isAssignedVendor = vendorId?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwnerCustomer && !isAssignedVendor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You do not have permission to view this booking.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking details retrieved',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel customer booking
// @route   PATCH /api/bookings/:id/cancel
// @access  Private (Customer only)
export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      $or: [{ _id: req.params.id }, { bookingId: req.params.id }]
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Ensure customer owns the booking
    if (booking.customer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only cancel your own bookings.'
      });
    }

    // Check cancellation eligibility
    if (!['pending', 'confirmed'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel booking with current status '${booking.status}'.`
      });
    }

    booking.status = 'cancelled';
    booking.vendorResponse = req.body.reason || 'Cancelled by customer';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (vendor/admin compatibility)
// @route   PATCH /api/bookings/:id/status
// @access  Private (Vendor or Admin)
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, reason } = req.body;
    const booking = await Booking.findOne({
      $or: [{ _id: req.params.id }, { bookingId: req.params.id }]
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const isAssignedVendor = booking.vendor.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAssignedVendor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You cannot update status of this booking.'
      });
    }

    // If confirming, check for conflicts on the same date
    if (status === 'confirmed' && booking.status !== 'confirmed') {
      const conflict = await Booking.findOne({
        _id: { $ne: booking._id },
        service: booking.service,
        eventDate: booking.eventDate,
        status: 'confirmed'
      });

      if (conflict) {
        return res.status(409).json({
          success: false,
          message: `Conflict Detected: A confirmed booking already exists for this venue on ${booking.eventDate}.`
        });
      }
    }

    booking.status = status;
    if (reason) booking.vendorResponse = reason;
    await booking.save();

    res.status(200).json({
      success: true,
      message: `Booking status updated to '${status}' successfully`,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

