const httpStatus = require('http-status');
const userModel = require('../models/user.model');
const { userService } = require('../services');
const ApiError = require('../utils/ApiError');

const authRoles = (prmissions) => {
    return async (req, res, next) => {
        const user = await userService.getUserById(req.body.user.id);
        const userPermissions = await user.permissions?.map(permission => permission.slug);
        
        if (user?.role?.roleName === "supperadmin") {
            next();
        } else {
            const hasRequiredRights = await prmissions.every((requiredRight) => userPermissions?.includes(requiredRight));
            if (!hasRequiredRights) {
                return next(new ApiError(httpStatus.BAD_REQUEST, "Access Denied"));
            }
            next();
        } 
  };
};

// Export
module.exports = authRoles;
