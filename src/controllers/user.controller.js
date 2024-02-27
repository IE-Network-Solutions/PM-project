const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, roleService } = require('../services');
/**
 * @module user
 */
/**
 * Retrieves users based on filter and pagination options.
 * @function
 * @param {Object} req.query - The query parameters for filtering and pagination.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the users are retrieved.
 * @throws {Error} - If there's an issue fetching the users.
 */
const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, []);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});
/**
 * Retrieves all users.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when all users are retrieved.
 * @throws {Error} - If there are no users found.
 */
const getAllUsers = catchAsync(async (req, res) => {
  const users = await userService.getUsers();
  if (!users) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No Users found');
  }
  res.send(users);
});
/**
 * Retrieves a specific user by their ID.
 * @function
 * @param {Object} req.params.userId - The ID of the user.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the user is retrieved.
 * @throws {Error} - If the user is not found.
 */
const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});
/**
 * Updates a user's role.
 * @function
 * @param {Object} req.body.userId - The ID of the user.
 * @param {Object} req.body.roleId - The ID of the new role.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the user's role is updated.
 * @throws {Error} - If there's an issue with updating the user's role.
 */
const updateRole = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.body.userId);
  const role = await roleService.getRole(req.body.roleId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
  }
  if (user.role?.id == req.body.roleId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Same Role with the previous one');
  }
  const updatedBody = {
    role: role,
  };
  const updatedUser = await userService.updateRole(user.id, updatedBody);
  res.send(updatedUser);
});

module.exports = {
  getUsers,
  getUser,
  getAllUsers,
  updateRole,
};
