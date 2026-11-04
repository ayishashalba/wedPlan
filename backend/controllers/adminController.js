import User from '../models/User.js';
import VendorProfile from '../models/VendorProfile.js';
import Service from '../models/Service.js';
import Booking from '../models/Booking.js';

// @desc    Get admin dashboard aggregated statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
export const getAdminDashboardStats = async (req, res, next) => {
  try {
    const [
      totalCustomers,
      totalVendors,
      pendingVendors,
      approvedVendors,
      totalServices,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      recentBookings,
      recentVendors
    ] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      VendorProfile.countDocuments(),
      VendorProfile.countDocuments({ verificationStatus: 'pending' }),
      VendorProfile.countDocuments({ verificationStatus: 'approved' }),
      Service.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('customer', 'name email')
        .populate('vendor', 'name email'),
      VendorProfile.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name email')
    ]);

    res.status(200).json({
      success: true,
      message: 'Dashboard metrics retrieved successfully',
      data: {
        totalCustomers,
        totalVendors,
        pendingVendors,
        approvedVendors,
        totalServices,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        recentBookings,
        recentVendors
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users across all roles
// @route   GET /api/admin/users
// @access  Private (Admin only)
export const getAllUsers = async (req, res, next) => {
  try {
    const { role, search } = req.query;
    const query = {};

    if (role && role !== 'all') {
      query.role = role;
    }

    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: regex }, { email: regex }, { phone: regex }];
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      message: 'Users retrieved successfully',
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered customer accounts
// @route   GET /api/admin/customers
// @access  Private (Admin only)
export const getAllCustomers = async (req, res, next) => {
  try {
    const customers = await User.find({ role: 'customer' }).sort({ createdAt: -1 });

    // Fetch booking counts for each customer
    const customersWithStats = await Promise.all(
      customers.map(async (c) => {
        const totalBookings = await Booking.countDocuments({ customer: c._id });
        const obj = c.toJSON();
        obj.totalBookings = totalBookings;
        return obj;
      })
    );

    res.status(200).json({
      success: true,
      count: customersWithStats.length,
      message: 'Customers retrieved successfully',
      data: customersWithStats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all vendor profiles
// @route   GET /api/admin/vendors
// @access  Private (Admin only)
export const getAllVendors = async (req, res, next) => {
  try {
    const { status, category } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.verificationStatus = status;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    const vendors = await VendorProfile.find(query)
      .populate('user', 'name email phone isActive')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: vendors.length,
      message: 'Vendors retrieved successfully',
      data: vendors
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pending vendor applications awaiting verification
// @route   GET /api/admin/vendors/pending
// @access  Private (Admin only)
export const getPendingVendors = async (req, res, next) => {
  try {
    const pendingVendors = await VendorProfile.find({
      verificationStatus: 'pending'
    })
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pendingVendors.length,
      message: 'Pending vendor applications retrieved',
      data: pendingVendors
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single vendor by ID
// @route   GET /api/admin/vendors/:id
// @access  Private (Admin only)
export const getAdminVendorById = async (req, res, next) => {
  try {
    const vendor = await VendorProfile.findById(req.params.id).populate('user', 'name email phone isActive');

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found'
      });
    }

    const services = await Service.find({ vendor: vendor.user._id });
    const bookings = await Booking.find({ vendor: vendor.user._id });

    res.status(200).json({
      success: true,
      message: 'Vendor details retrieved',
      data: {
        vendor,
        services,
        bookingsCount: bookings.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve vendor application
// @route   PATCH /api/admin/vendors/:id/approve
// @access  Private (Admin only)
export const approveVendor = async (req, res, next) => {
  try {
    const vendor = await VendorProfile.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found'
      });
    }

    vendor.verificationStatus = 'approved';
    vendor.rejectionReason = '';
    vendor.approvedAt = new Date();
    await vendor.save();

    // Automatically activate vendor's services
    await Service.updateMany({ vendor: vendor.user }, { isActive: true });

    res.status(200).json({
      success: true,
      message: `Vendor '${vendor.businessName}' has been successfully approved and public listings are now live.`,
      data: vendor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject vendor application
// @route   PATCH /api/admin/vendors/:id/reject
// @access  Private (Admin only)
export const rejectVendor = async (req, res, next) => {
  try {
    const { reason, rejectionReason } = req.body;
    const vendor = await VendorProfile.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found'
      });
    }

    vendor.verificationStatus = 'rejected';
    vendor.rejectionReason = reason || rejectionReason || 'Verification requirements not fulfilled';
    await vendor.save();

    // Deactivate vendor's public services
    await Service.updateMany({ vendor: vendor.user }, { isActive: false });

    res.status(200).json({
      success: true,
      message: `Vendor '${vendor.businessName}' registration was rejected.`,
      data: vendor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all services for admin moderation
// @route   GET /api/admin/services
// @access  Private (Admin only)
export const getAllServicesAdmin = async (req, res, next) => {
  try {
    const services = await Service.find()
      .populate('vendor', 'name email')
      .populate('vendorProfile', 'businessName district verificationStatus')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      message: 'All platform services retrieved',
      data: services
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle or update service active status
// @route   PATCH /api/admin/services/:id/status
// @access  Private (Admin only)
export const updateServiceStatusAdmin = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    const { isActive, status } = req.body;
    if (isActive !== undefined) {
      service.isActive = isActive;
    } else if (status !== undefined) {
      service.isActive = status === 'active';
    } else {
      service.isActive = !service.isActive;
    }

    await service.save();

    res.status(200).json({
      success: true,
      message: `Service status updated to ${service.isActive ? 'active' : 'inactive'}`,
      data: service
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete service as admin
// @route   DELETE /api/admin/services/:id
// @access  Private (Admin only)
export const deleteServiceAdmin = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service deleted permanently by admin',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings across the platform
// @route   GET /api/admin/bookings
// @access  Private (Admin only)
export const getAllBookingsAdmin = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('customer', 'name email phone')
      .populate('vendor', 'name email phone')
      .populate('service', 'serviceName category price')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      message: 'All platform bookings retrieved',
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking by ID as admin
// @route   GET /api/admin/bookings/:id
// @access  Private (Admin only)
export const getBookingByIdAdmin = async (req, res, next) => {
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
        message: 'Booking not found'
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

// @desc    Toggle user account active/suspended status
// @route   PATCH /api/admin/users/:id/status
// @access  Private (Admin only)
export const updateUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found'
      });
    }

    const { isActive, status } = req.body;
    if (isActive !== undefined) {
      user.isActive = isActive;
    } else if (status !== undefined) {
      user.isActive = status === 'active';
    } else {
      user.isActive = !user.isActive;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: `User account is now ${user.isActive ? 'active' : 'suspended'}`,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

