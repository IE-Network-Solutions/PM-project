const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { permissionService } = require('../services');
const { User } = require('../models');

const seedPermissions = catchAsync(async (req, res) => {
    const data = await permissionService.seedPermission();
    res.status(httpStatus.CREATED).json(data);
});

const assignPermissionToUser = catchAsync(async (req, res) => {
    const data = await permissionService.assignPermissionToUser(req.body)
    res.status(httpStatus.CREATED).json(data);
})

module.exports = {
    seedPermissions,
    assignPermissionToUser
}