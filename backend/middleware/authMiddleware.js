import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import VendorProfile from '../models/VendorProfile.js';

export const protect = async (req, res, next) => {
  let token;

  // 1. Check Bearer token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // 2. Check Cookie
  else if (req.cookies && req.cookies.wedplan_token) {
    token = req.cookies.wedplan_token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'wedplan_kerala_jwt_secret_dev_key_2026'
    );

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // If user is a vendor, optionally attach vendorProfile
    if (user.role === 'vendor') {
      const vendorProfile = await VendorProfile.findOne({ user: user._id });
      req.vendorProfile = vendorProfile;
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token is invalid or expired. Please sign in again.'
    });
  }
};

