const httpStatus = require('http-status');
const { User } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');

const userRepository = dataSource.getRepository(User).extend({ findAll, sortBy });

/**
 * Query for users
 * @param {Object} filter - Filter options
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

const queryUsers = async (filter, options) => {
  const { limit, page, sortBy } = options;

  return await userRepository.findAll({
    tableName: 'user',
    sortOptions: sortBy && { option: sortBy },
    paginationOptions: { limit: limit, page: page },
  });
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<Risk>}
 */
const getUserById = async (id) => {
  return await userRepository.findOneBy({ id: id });
};

const createUser = async (userBody) => {
  userBody.createdAt = userBody.created_at;
  userBody.updatedAt = userBody.updated_at;
  userBody.roleId = userBody.role_id;

  delete userBody.created_at;
  delete userBody.updated_at;
  delete userBody.role_id;

  const user = userRepository.create(userBody);
  return await userRepository.save(user);
};

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
 * Get multiple users by array of ids
 * @param {Array} userIds
 * @returns {Promise<User>}
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
};
