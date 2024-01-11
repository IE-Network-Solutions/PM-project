const httpStatus = require('http-status');
const { Role } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const services = require('./index');

const roleRepository = dataSource.getRepository(Role).extend({
  findAll,
  sortBy,
});

/**
 * Query for approval level
 * @param {Object} filter - Filter options
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

const getRoles = async () => {
  return await roleRepository.find();
};

/**
 * Get budget by id
 * @param {ObjectId} id
 * @returns {Promise<Project>}
 */
const getRole = async (id) => {
  return await roleRepository.findOneBy({ id: id });
};

module.exports = {
  getRoles,
  getRole,
};
