const httpStatus = require('http-status');
const { User } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const ApiError = require('../utils/ApiError');

const userRepository = dataSource.getRepository(User).extend({ findAll, sortBy });
/**
 * @module user
 */
/**
 * Queries users based on the provided filter and options, filtering tasks for each user where completion is less than 100%.
 * @function
 * @param {Object} filter - The filter criteria to apply while querying users.
 * @param {Object} options - The options to configure the query, including limit, page, and sortBy.
 * @param {number} [options.limit] - The maximum number of users to retrieve per page.
 * @param {number} [options.page] - The page number of users to retrieve.
 * @param {string} [options.sortBy] - The field to sort the users by.
 * @returns {Promise<Array<Object>>} A Promise that resolves with an array of queried users with filtered tasks.
 */

const queryUsers = async (filter, options) => {
  const { limit, page, sortBy } = options;

  const users = await userRepository.find({ relations: ['resourceOn'] });
  // Filter tasks for each user
  users.forEach((user) => {
    user.resourceOn = user.resourceOn.filter((task) => task.completion < 100);
  });

  return users;
};
/**
 * Retrieves all users along with their permissions and roles.
 * @function
 * @param {string} id - The ID of the user to retrieve.
 * @returns {Promise<Array<Object>>} A Promise that resolves with an array of retrieved users with their permissions and roles.
 */

const getUsers = async (id) => {
  return await userRepository.find({ relations: ['permissions', 'role'] });
};
/**
 * Retrieves a user by their ID along with their permissions and role.
 * @function
 * @param {string} id - The ID of the user to retrieve.
 * @returns {Promise<Object|null>} A Promise that resolves with the retrieved user if found, or null if not found.
 */

const getUserById = async (id) => {
  console.log(id, "test id");
  return await userRepository.findOne({ where: { id: id }, relations: ['permissions', 'role'] });
};
/**
 * Creates a new user with the provided data.
 * @function
 * @param {Object} userBody - The data for the user to create.
 * @returns {Promise<Object>} A Promise that resolves with the created user.
 */

const createUser = async (userBody) => {
  userBody.createdAt = userBody.created_at;
  userBody.updatedAt = userBody.updated_at;
  userBody.roleId = userBody.role_id;

  delete userBody.created_at;
  delete userBody.updated_at;
  delete userBody.role_id;

  console.log(userBody);

  const user = userRepository.create(userBody);
  return await userRepository.save(user);
};
/**
 * Updates a user with the provided data.
 * @function
 * @param {Object} updateBody - The data to update the user with.
 * @returns {Promise<void>} A Promise that resolves once the user is updated.
 */

const updateUser = async (updateBody) => {
  let userId = updateBody.id;
  delete updateBody.id;

  updateBody.createdAt = updateBody.created_at;
  updateBody.updatedAt = updateBody.updated_at;
  updateBody.roleId = updateBody.role_id;
  updateBody.emailVerifiedAt = updateBody.email_verified_at;

  delete updateBody.created_at;
  delete updateBody.updated_at;
  delete updateBody.role_id;
  delete updateBody.email_verified_at;

  await userRepository.update({ id: userId }, updateBody);
};
/**
 * Updates the role of a user specified by their ID with the provided data.
 * @function
 * @param {string} userId - The ID of the user whose role is to be updated.
 * @param {Object} updateBody - The data to update the user's role with.
 * @returns {Promise<Object>} A Promise that resolves with the updated user.
 * @throws {ApiError} If the user specified by the ID does not exist.
 */

const updateRole = async (userId, updateBody) => {
  console.log(updateBody, 'aaaaaaaaaaaaaaaaaaaaa');
  const user = await getUserById(userId);
  console.log(user, 'bbbbbbbbbbbbbbbb');
  if (!user) {
    throw ApiError(404, 'user does not exist');
  }
  // if (user.permissions != null) {
  //   user.permissions = [];
  //   await user.save();
  // }

  await userRepository.update({ id: userId }, updateBody);

  return await getUserById(userId);
};
/**
 * Retrieves users by their IDs.
 * @function
 * @param {Array<string>} userIds - An array of user IDs to retrieve.
 * @returns {Promise<Array<Object>>} A Promise that resolves with an array of retrieved users.
 */

const getUsersById = async (userIds) => {
  console.log(userIds);
  return await userRepository.findByIds(userIds);
};

module.exports = {
  queryUsers,
  getUserById,
  getUsersById,
  createUser,
  updateUser,
  getUsers,
  updateRole,
};
