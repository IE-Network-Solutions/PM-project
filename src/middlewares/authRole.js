const ApiError = require('../utils/ApiError');

const authRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError("Access Denied", 403));
    }
    next();
  };
};

// Export
module.exports = authRoles;
