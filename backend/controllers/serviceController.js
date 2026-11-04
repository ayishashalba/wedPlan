import Service from '../models/Service.js';
import VendorProfile from '../models/VendorProfile.js';
import Package from '../models/Package.js';
import { normalizeDistrict } from '../utils/districts.js';

// @desc    Get all active public services with search, filtering, sorting and pagination
// @route   GET /api/services
// @access  Public
export const getServices = async (req, res, next) => {
  try {
    const {
      search,
      q,
      category,
      district,
      city,
      minPrice,
      maxPrice,
      capacity,
      minCapacity,
      guestCapacity,
      sort,
      page = 1,
      limit = 20
    } = req.query;

    // 1. Base filter: only active services
    const query = { isActive: true };

    // 2. Only show services of approved vendors
    const approvedVendorProfiles = await VendorProfile.find({
      verificationStatus: 'approved'
    }).select('user');
    const approvedVendorUserIds = approvedVendorProfiles.map((p) => p.user).filter(Boolean);
    query.vendor = { $in: approvedVendorUserIds };

    // 3. Category filter
    if (category && category !== 'all') {
      query.category = category.toLowerCase();
    }

    // 4. District filter
    if (district && district !== 'all') {
      const normalized = normalizeDistrict(district);
      query.district = new RegExp(normalized, 'i');
    }

    // 5. City filter
    if (city && city !== 'all') {
      query.city = new RegExp(city, 'i');
    }

    // 6. Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice && maxPrice !== 'Infinity') query.price.$lte = Number(maxPrice);
    }

    // 7. Guest capacity filter
    const reqCapacity = guestCapacity || capacity || minCapacity;
    if (reqCapacity && Number(reqCapacity) > 0) {
      query.guestCapacity = { $gte: Number(reqCapacity) };
    }

    // 8. Search query (search name, location, address, description)
    const searchQuery = search || q;
    if (searchQuery && searchQuery.trim()) {
      const regex = new RegExp(searchQuery.trim(), 'i');
      query.$or = [
        { serviceName: regex },
        { description: regex },
        { location: regex },
        { city: regex },
        { address: regex }
      ];
    }

    // 9. Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc' || sort === 'price-low' || sort === 'price') {
      sortOption = { price: 1 };
    } else if (sort === 'price_desc' || sort === 'price-high' || sort === '-price') {
      sortOption = { price: -1 };
    } else if (sort === 'rating') {
      sortOption = { rating: -1 };
    }

    // 10. Pagination
    const isAll = limit === 'all' || limit === '0' || Number(limit) === 0 || req.query.all === 'true';
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = isAll ? 0 : (parseInt(limit, 10) || 20);
    const skip = (pageNum - 1) * limitNum;

    const total = await Service.countDocuments(query);
    let serviceQuery = Service.find(query)
      .populate('vendor', 'name email phone')
      .populate('vendorProfile', 'businessName logo rating district city phone email')
      .sort(sortOption);

    if (!isAll && limitNum > 0) {
      serviceQuery = serviceQuery.skip(skip).limit(limitNum);
    }

    const services = await serviceQuery;

    res.status(200).json({
      success: true,
      count: services.length,
      total,
      page: pageNum,
      pages: isAll ? 1 : Math.ceil(total / limitNum),
      message: 'Services retrieved successfully',
      data: services
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single service by ID
// @route   GET /api/services/:id
// @access  Public
export const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('vendor', 'name email phone')
      .populate('vendorProfile', 'businessName logo rating district city experience address phone email')
      .populate('packages');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service listing not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service details retrieved',
      data: service
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get services by category
// @route   GET /api/services/category/:category
// @access  Public
export const getServicesByCategory = async (req, res, next) => {
  try {
    const categoryParam = req.params.category.toLowerCase();

    // Only approved vendors
    const approvedVendorProfiles = await VendorProfile.find({
      verificationStatus: 'approved'
    }).select('user');
    const approvedVendorUserIds = approvedVendorProfiles.map((p) => p.user).filter(Boolean);

    const services = await Service.find({
      category: categoryParam,
      isActive: true,
      vendor: { $in: approvedVendorUserIds }
    })
      .populate('vendorProfile', 'businessName logo rating district')
      .sort({ rating: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      message: `Services in category '${categoryParam}' retrieved successfully`,
      data: services
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured services for homepage
// @route   GET /api/services/featured
// @access  Public
export const getFeaturedServices = async (req, res, next) => {
  try {
    const approvedVendorProfiles = await VendorProfile.find({
      verificationStatus: 'approved'
    }).select('user');
    const approvedVendorUserIds = approvedVendorProfiles.map((p) => p.user).filter(Boolean);

    const featured = await Service.find({
      isActive: true,
      vendor: { $in: approvedVendorUserIds },
      featured: true
    })
      .populate('vendorProfile', 'businessName logo rating district')
      .limit(6);

    res.status(200).json({
      success: true,
      count: featured.length,
      message: 'Featured services retrieved successfully',
      data: featured
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all active wedding packages
// @route   GET /api/services/packages/all
// @access  Public
export const getPackages = async (req, res, next) => {
  try {
    const packages = await Package.find({ isActive: true })
      .populate('vendor', 'name email phone')
      .sort({ featured: -1, rating: -1 });

    res.status(200).json({
      success: true,
      count: packages.length,
      message: 'Packages retrieved successfully',
      data: packages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single package by ID
// @route   GET /api/services/packages/:id
// @access  Public
export const getPackageById = async (req, res, next) => {
  try {
    const pkg = await Package.findById(req.params.id).populate('vendor', 'name email phone');

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: 'Wedding package not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Package retrieved successfully',
      data: pkg
    });
  } catch (error) {
    next(error);
  }
};

