export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user.role}' is not authorized to access this resource.`
      });
    }

    next();
  };
};

export const requireApprovedVendor = (req, res, next) => {
  if (req.user.role !== 'vendor') {
    return res.status(403).json({
      success: false,
      message: 'Access restricted to vendors only.'
    });
  }

  if (!req.vendorProfile || req.vendorProfile.verificationStatus !== 'approved') {
    return res.status(403).json({
      success: false,
      message: 'Your vendor account is pending approval by administrators. Public listing actions are restricted until verified.'
    });
  }

  next();
};

