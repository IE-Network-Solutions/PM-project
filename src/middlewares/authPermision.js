const httpStatus = require('http-status');
const userModel = require('../models/user.model');
const { userService } = require('../services');
const ApiError = require('../utils/ApiError');
const { json } = require('express');

const authPermissions = (prmissions) => {
  return async (req, res, next) => {
    const userData = await JSON.parse(req.headers.user);
    const user = await userService.getUserById(userData.id);
    if (!user) {
      return next(new ApiError(httpStatus.NOT_FOUND, 'User Does not Exist'));
    }
    const userPermissions = await user.permissions?.map((permission) => permission.slug);
    if (user?.role?.roleName === 'supperadmin') {
      next();
    } else if(userPermissions?.includes('all')) {
      next();
    }
      else {
      const hasRequiredRights = await prmissions.every((requiredRight) => userPermissions?.includes(requiredRight));
      if (!hasRequiredRights) {
        return next(new ApiError(httpStatus.FORBIDDEN, 'Access Denied'));
      }
      next();
    }
  };
};

// Export
module.exports = authPermissions;
