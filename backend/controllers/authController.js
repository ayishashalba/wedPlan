import User from '../models/User.js';
import VendorProfile from '../models/VendorProfile.js';
import { sendTokenResponse } from '../utils/generateToken.js';
import { validationResult } from 'express-validator';

// @desc    Register a new customer or vendor user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array()
      });
    }

    const { name, email, phone, password, role, district } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists.'
      });
    }

    // Determine role (default to customer; admin cannot be registered publicly)
    const assignedRole = role === 'vendor' ? 'vendor' : 'customer';

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role: assignedRole,
      isActive: true
    });

    // If registered as vendor, initialize a pending VendorProfile
    if (assignedRole === 'vendor') {
      const defaultDistrict = district || 'Ernakulam';
      const vendorProfile = await VendorProfile.create({
        user: user._id,
        businessName: req.body.businessName || `${name}'s Services`,
        ownerName: name,
        category: req.body.category || 'Wedding Hall',
        description: req.body.description || 'Kerala wedding & event service provider',
        phone,
        email: email.toLowerCase(),
        district: defaultDistrict,
        city: req.body.city || 'Kochi',
        address: req.body.address || defaultDistrict,
        experience: req.body.experience || req.body.yearsExperience || 1,
        verificationStatus: 'pending'
      });
      user.vendorProfile = vendorProfile;
    }

    sendTokenResponse(user, 201, res, 'Registration successful');
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    // Check for user and include password hash
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Check password match
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact administrator.'
      });
    }

    // Attach vendorProfile if user is vendor
    if (user.role === 'vendor') {
      const vendorProfile = await VendorProfile.findOne({ user: user._id });
      user.vendorProfile = vendorProfile;
    }

    sendTokenResponse(user, 200, res, 'Signed in successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently logged in user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    let profile = null;
    if (user.role === 'vendor') {
      profile = await VendorProfile.findOne({ user: user._id });
    }

    const userData = {
      _id: user._id,
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      vendorProfile: profile,
      businessName: profile?.businessName,
      status: profile?.verificationStatus || (user.isActive ? 'active' : 'inactive'),
      district: profile?.district
    };

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: userData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log user out & clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logout = async (req, res) => {
  res.cookie('wedplan_token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'User logged out successfully',
    data: {}
  });
};

