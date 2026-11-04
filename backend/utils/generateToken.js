import jwt from 'jsonwebtoken';

export const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'wedplan_kerala_jwt_secret_dev_key_2026', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

export const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = generateToken(user._id, user.role);

  // Cookie options
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax'
  };

  // Safe user representation (omit password hash)
  const userData = {
    _id: user._id,
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt
  };

  // Attach vendorProfile info if available
  if (user.vendorProfile) {
    userData.vendorProfile = user.vendorProfile;
    userData.businessName = user.vendorProfile.businessName;
    userData.status = user.vendorProfile.verificationStatus;
    userData.district = user.vendorProfile.district;
  }

  res
    .status(statusCode)
    .cookie('wedplan_token', token, cookieOptions)
    .json({
      success: true,
      message,
      data: {
        token,
        user: userData
      }
    });
};

