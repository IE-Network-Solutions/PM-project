const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { permissionService } = require('../services');
const { User } = require('../models');
/**
 * @module permission
 */

/**
 * Seeds permissions data.
 * @function
 * @returns {Promise<Object>} - A promise that resolves to the seeded permission data.
 * @throws {Error} - If there's an issue with seeding permissions.
 */
const seedPermissions = catchAsync(async (req, res) => {
  const data = await permissionService.seedPermission();
  res.status(httpStatus.CREATED).json(data);
});

/**
 * Assigns permissions to a user.
 * @function
 * @param {Object} req.body - The request body containing user and permission data.
 * @returns {Promise<Object>} - A promise that resolves to the updated user data.
 * @throws {Error} - If there's an issue with assigning permissions.
 */
const assignPermissionToUser = catchAsync(async (req, res) => {
  const data = await permissionService.assignPermissionToUser(req.body);
  res.status(httpStatus.CREATED).json(data);
});

/**
 * Assigns permissions to a role.
 * @function
 * @param {Object} req.body - The request body containing role and permission data.
 * @returns {Promise<Object>} - A promise that resolves to the updated role data.
 * @throws {Error} - If there's an issue with assigning permissions.
 */
const assignPermissionToRole = catchAsync(async (req, res) => {
  const data = await permissionService.assignPermissionToRole(req.body);
  res.status(httpStatus.CREATED).json(data);
});

/**
 * Seeds permission resources.
 * @function
 * @returns {Promise<Object>} - A promise that resolves to the seeded resource data.
 * @throws {Error} - If there's an issue with seeding resources.
 */
const seedPermissionResource = catchAsync(async (req, res) => {
  const data = await permissionService.seedPermissionResource();
  res.status(httpStatus.CREATED).json(data);
});

/**
 * Retrieves resources with associated permissions.
 * @function
 * @returns {Promise<Object[]>} - A promise that resolves to an array of resource data.
 * @throws {Error} - If there's an issue fetching resources.
 */
const getResourcesWithPermission = catchAsync(async (req, res) => {
  const data = await permissionService.getResourcesWithPermission();
  res.status(200).json(data);
});

module.exports = {
  seedPermissions,
  assignPermissionToUser,
  assignPermissionToRole,
  seedPermissionResource,
  getResourcesWithPermission,
};
