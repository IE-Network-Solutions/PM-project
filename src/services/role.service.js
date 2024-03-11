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
 * @module role
 */
/**
 * Retrieves roles along with their associated role permissions.
 *
 * @function
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of role objects.
 */
const getRoles = async () => {
  return await roleRepository.find({ relations: ['rolePermission'] });
};
/**
 * Retrieves a role by its unique identifier.
 *
 * @function
 * @param {number} id - The ID of the role to retrieve.
 * @returns {Promise<Object|null>} - A promise that resolves to the role object or null if not found.
 */
const getRole = async (id) => {
  return await roleRepository.findOneBy({ id: id });
};

module.exports = {
  getRoles,
  getRole,
};
