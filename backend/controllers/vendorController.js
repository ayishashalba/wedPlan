import VendorProfile from '../models/VendorProfile.js';
import User from '../models/User.js';
import Service from '../models/Service.js';
import Booking from '../models/Booking.js';
import { normalizeDistrict } from '../utils/districts.js';

// @desc    Submit / register vendor business details
// @route   POST /api/vendors/register
// @access  Private / Public
export const registerVendorProfile = async (req, res, next) => {
  try {
    const {
      businessName,
      ownerName,
      email,
      phone,
      category,
      description,
      district,
      city,
      address,
      yearsExperience,
      experience,
      logo,
      portfolioImages,
      userId
    } = req.body;

    // Use logged in user ID or provided userId
    const targetUserId = req.user ? req.user._id : userId;

    if (!targetUserId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required to submit vendor registration.'
      });
    }

    // Check if user exists
    const user = await User.findById(targetUserId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Associated user account not found.'
      });
    }

    // Update user role to vendor
    if (user.role !== 'vendor') {
      user.role = 'vendor';
      await user.save();
    }

    // Check if vendor profile already exists for this user
    let profile = await VendorProfile.findOne({ user: targetUserId });

    const normalizedDist = normalizeDistrict(district);

    if (profile) {
      profile.businessName = businessName || profile.businessName;
      profile.ownerName = ownerName || profile.ownerName;
      profile.email = (email || profile.email).toLowerCase();
      profile.phone = phone || profile.phone;
      profile.category = category || profile.category;
      profile.description = description || profile.description;
      profile.district = normalizedDist || profile.district;
      profile.city = city || profile.city;
      profile.address = address || profile.address;
      profile.experience = yearsExperience || experience || profile.experience;
      if (logo) profile.logo = logo;
      if (portfolioImages) profile.portfolioImages = portfolioImages;
      profile.verificationStatus = 'pending'; // Re-submit for review
      await profile.save();
    } else {
      profile = await VendorProfile.create({
        user: targetUserId,
        businessName,
        ownerName: ownerName || user.name,
        email: (email || user.email).toLowerCase(),
        phone: phone || user.phone,
        category: category || 'Wedding Hall',
        description,
        district: normalizedDist,
        city: city || 'Kochi',
        address,
        experience: yearsExperience || experience || 1,
        logo: logo || undefined,
        portfolioImages: portfolioImages || [],
        verificationStatus: 'pending'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Vendor profile registration submitted successfully. Awaiting admin approval.',
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current vendor profile
// @route   GET /api/vendors/profile
// @access  Private (Vendor only)
export const getVendorProfile = async (req, res, next) => {
  try {
    const profile = await VendorProfile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'No vendor profile found for this account.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vendor profile retrieved successfully',
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current vendor profile
// @route   PUT /api/vendors/profile
// @access  Private (Vendor only)
export const updateVendorProfile = async (req, res, next) => {
  try {
    let profile = await VendorProfile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found.'
      });
    }

    const {
      businessName,
      ownerName,
      phone,
      email,
      description,
      district,
      city,
      address,
      experience,
      yearsExperience,
      logo,
      portfolioImages
    } = req.body;

    if (businessName) profile.businessName = businessName;
    if (ownerName) profile.ownerName = ownerName;
    if (phone) profile.phone = phone;
    if (email) profile.email = email.toLowerCase();
    if (description) profile.description = description;
    if (district) profile.district = normalizeDistrict(district);
    if (city) profile.city = city;
    if (address) profile.address = address;
    if (experience !== undefined || yearsExperience !== undefined) {
      profile.experience = experience !== undefined ? experience : yearsExperience;
    }
    if (logo) profile.logo = logo;
    if (portfolioImages) profile.portfolioImages = portfolioImages;

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Vendor profile updated successfully',
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get vendor verification status
// @route   GET /api/vendors/status
// @access  Private (Vendor only)
export const getVendorStatus = async (req, res, next) => {
  try {
    const profile = await VendorProfile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Verification status retrieved',
      data: {
        status: profile.verificationStatus,
        verificationStatus: profile.verificationStatus,
        rejectionReason: profile.rejectionReason,
        approvedAt: profile.approvedAt,
        businessName: profile.businessName
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all services belonging to current vendor
// @route   GET /api/vendors/services
// @access  Private (Vendor only)
export const getVendorServices = async (req, res, next) => {
  try {
    const services = await Service.find({ vendor: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      message: 'Vendor services retrieved successfully',
      data: services
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new service for current vendor
// @route   POST /api/vendors/services
// @access  Private (Vendor only)
export const createVendorService = async (req, res, next) => {
  try {
    const profile = await VendorProfile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(400).json({
        success: false,
        message: 'Vendor profile required before listing services.'
      });
    }

    // Business Rule: Check if vendor is approved
    const isApproved = profile.verificationStatus === 'approved';

    const {
      name,
      serviceName,
      category,
      categoryLabel,
      description,
      district,
      city,
      location,
      address,
      price,
      discountPrice,
      priceType,
      priceUnit,
      hasGuestCapacity,
      maxGuestCapacity,
      capacity,
      guestCapacity,
      facilities,
      features,
      facilitiesText,
      images,
      image
    } = req.body;

    // Process facilities array
    let processedFeatures = features || facilities || [];
    if (facilitiesText && typeof facilitiesText === 'string') {
      processedFeatures = facilitiesText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    // Process capacity settings (vendor controlled, completely optional for any category)
    const capacityEnabled = Boolean(hasGuestCapacity);
    const capacityValue = capacityEnabled
      ? Math.max(1, parseInt(maxGuestCapacity || guestCapacity || capacity || 0, 10))
      : 0;

    // Process structured images array: [{ url, publicId, isPrimary }]
    let processedImages = [];
    let primaryImageUrl = '';

    if (Array.isArray(images) && images.length > 0) {
      processedImages = images.map((img, idx) => {
        if (typeof img === 'string') {
          return {
            url: img,
            publicId: `img_${Date.now()}_${idx}`,
            isPrimary: idx === 0
          };
        }
        return {
          url: img.url || img.secure_url || '',
          publicId: img.publicId || img.public_id || `img_${Date.now()}_${idx}`,
          isPrimary: img.isPrimary !== undefined ? Boolean(img.isPrimary) : idx === 0
        };
      });

      const primaryObj = processedImages.find((img) => img.isPrimary) || processedImages[0];
      primaryImageUrl = primaryObj?.url || '';
    } else if (image) {
      primaryImageUrl = typeof image === 'string' ? image : image.url || '';
      processedImages = [{ url: primaryImageUrl, publicId: `img_${Date.now()}_0`, isPrimary: true }];
    } else if (profile.logo) {
      primaryImageUrl = profile.logo;
      processedImages = [{ url: profile.logo, publicId: `img_${Date.now()}_0`, isPrimary: true }];
    }

    const newService = await Service.create({
      vendor: req.user._id,
      vendorProfile: profile._id,
      vendorName: profile.businessName || req.user.name,
      serviceName: serviceName || name,
      category: (category || 'hall').toLowerCase(),
      categoryLabel: categoryLabel || category || 'Wedding Hall',
      description,
      district: normalizeDistrict(district || profile.district),
      city: city || profile.city,
      location: location || `${city || profile.city}, ${district || profile.district}`,
      address: address || profile.address,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      priceType: priceType || 'per-event',
      priceUnit: priceUnit || 'per day',
      hasGuestCapacity: capacityEnabled,
      maxGuestCapacity: capacityValue,
      guestCapacity: capacityValue,
      features: processedFeatures,
      images: processedImages,
      image: primaryImageUrl,
      isActive: isApproved // Service becomes active only if vendor is approved
    });

    res.status(201).json({
      success: true,
      message: isApproved
        ? 'Service listing published successfully'
        : 'Service saved! It will become publicly visible once your vendor application is approved.',
      data: newService
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update vendor's existing service
// @route   PUT /api/vendors/services/:id
// @access  Private (Vendor only)
export const updateVendorService = async (req, res, next) => {
  try {
    let service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service listing not found'
      });
    }

    // Ensure service belongs to this vendor
    if (service.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only edit services belonging to your vendor account.'
      });
    }

    const {
      name,
      serviceName,
      category,
      categoryLabel,
      description,
      district,
      city,
      location,
      address,
      price,
      discountPrice,
      priceType,
      priceUnit,
      hasGuestCapacity,
      maxGuestCapacity,
      capacity,
      guestCapacity,
      facilities,
      features,
      facilitiesText,
      images,
      image,
      isActive
    } = req.body;

    if (serviceName || name) service.serviceName = serviceName || name;
    if (category) service.category = category.toLowerCase();
    if (categoryLabel) service.categoryLabel = categoryLabel;
    if (description) service.description = description;
    if (district) service.district = normalizeDistrict(district);
    if (city) service.city = city;
    if (location) service.location = location;
    if (address) service.address = address;
    if (price !== undefined) service.price = Number(price);
    if (discountPrice !== undefined) service.discountPrice = Number(discountPrice);
    if (priceType) service.priceType = priceType;
    if (priceUnit) service.priceUnit = priceUnit;

    // Process capacity update (optional, vendor-controlled)
    if (hasGuestCapacity !== undefined) {
      service.hasGuestCapacity = Boolean(hasGuestCapacity);
      if (service.hasGuestCapacity) {
        const capVal = Math.max(1, parseInt(maxGuestCapacity || guestCapacity || capacity || 0, 10));
        service.maxGuestCapacity = capVal;
        service.guestCapacity = capVal;
      } else {
        service.maxGuestCapacity = 0;
        service.guestCapacity = 0;
      }
    } else if (guestCapacity !== undefined || capacity !== undefined) {
      const capVal = Number(guestCapacity !== undefined ? guestCapacity : capacity);
      service.hasGuestCapacity = capVal > 0;
      service.maxGuestCapacity = capVal;
      service.guestCapacity = capVal;
    }

    if (features || facilities) {
      service.features = features || facilities;
    } else if (facilitiesText && typeof facilitiesText === 'string') {
      service.features = facilitiesText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    if (images && Array.isArray(images)) {
      const processedImages = images.map((img, idx) => {
        if (typeof img === 'string') {
          return {
            url: img,
            publicId: `img_${Date.now()}_${idx}`,
            isPrimary: idx === 0
          };
        }
        return {
          url: img.url || img.secure_url || '',
          publicId: img.publicId || img.public_id || `img_${Date.now()}_${idx}`,
          isPrimary: img.isPrimary !== undefined ? Boolean(img.isPrimary) : idx === 0
        };
      });

      service.images = processedImages;
      const primaryObj = processedImages.find((img) => img.isPrimary) || processedImages[0];
      service.image = primaryObj?.url || service.image;
    } else if (image) {
      service.image = image;
    }

    if (isActive !== undefined) service.isActive = isActive;

    await service.save();

    res.status(200).json({
      success: true,
      message: 'Service listing updated successfully',
      data: service
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete vendor's service
// @route   DELETE /api/vendors/services/:id
// @access  Private (Vendor only)
export const deleteVendorService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service listing not found'
      });
    }

    // Ensure service belongs to this vendor
    if (service.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only delete services belonging to your vendor account.'
      });
    }

    await Service.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Service listing deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings for current vendor
// @route   GET /api/vendors/bookings
// @access  Private (Vendor only)
export const getVendorBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ vendor: req.user._id })
      .populate('customer', 'name email phone')
      .populate('service', 'serviceName category price location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      message: 'Vendor bookings retrieved successfully',
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept customer booking request (with Hall Date Conflict prevention)
// @route   PATCH /api/vendors/bookings/:id/accept
// @access  Private (Vendor only)
export const acceptBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking request not found'
      });
    }

    // Verify vendor ownership
    if (booking.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only manage bookings sent to your vendor account.'
      });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot accept booking. Current status is already '${booking.status}'.`
      });
    }

    // CRITICAL BUSINESS RULE: Prevent conflicting confirmed bookings for the same hall/service on the same date!
    const conflict = await Booking.findOne({
      _id: { $ne: booking._id },
      service: booking.service,
      eventDate: booking.eventDate,
      status: 'confirmed'
    });

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: `Conflict Detected: This venue already has a confirmed event reservation on ${booking.eventDate}. Cannot confirm another booking for the same date.`
      });
    }

    booking.status = 'confirmed';
    booking.vendorResponse = req.body.vendorResponse || req.body.reason || 'Booking accepted by vendor';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking request confirmed successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject customer booking request
// @route   PATCH /api/vendors/bookings/:id/reject
// @access  Private (Vendor only)
export const rejectBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking request not found'
      });
    }

    // Verify vendor ownership
    if (booking.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only manage bookings sent to your vendor account.'
      });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot decline booking. Current status is '${booking.status}'. Only pending requests can be rejected.`
      });
    }

    booking.status = 'rejected';
    booking.vendorResponse = req.body.vendorResponse || req.body.reason || 'Declined due to date unavailability or scheduling conflict';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking request declined',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark confirmed booking as completed
// @route   PATCH /api/vendors/bookings/:id/complete
// @access  Private (Vendor only)
export const completeBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking request not found'
      });
    }

    if (booking.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only manage bookings sent to your vendor account.'
      });
    }

    if (booking.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: `Only confirmed bookings can be marked as completed. Current status: '${booking.status}'.`
      });
    }

    booking.status = 'completed';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking marked as completed successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Public: Get single vendor profile by ID
// @route   GET /api/vendors/:id
// @access  Public
export const getVendorById = async (req, res, next) => {
  try {
    const profile = await VendorProfile.findById(req.params.id)
      .populate('user', 'name email phone');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vendor details retrieved',
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

