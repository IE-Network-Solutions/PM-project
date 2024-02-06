const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, roleService } = require('../services');

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, []);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getAllUsers = catchAsync(async (req, res) => {
  const users = await userService.getUsers();
  if (!users) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No Users found');
  }
  res.send(users);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

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
