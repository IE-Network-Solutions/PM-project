const Joi = require('joi');
const { objectId } = require('./custom.validation');
/**
 * @module user
 */
/**
 * Schema for retrieving users with pagination.
 * @type {object}
 * @property {object} query - Query parameters.
 * @property {string} query.sortBy - Sorting parameter.
 * @property {number} query.limit - Limit of users per page.
 * @property {number} query.page - Page number.
 */
const getUsers = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};
/**
 * Schema for retrieving a user by their ID.
 * @type {object}
 * @property {object} params - Path parameters.
 * @property {string} params.userId - User ID.
 */
const getUser = {
  params: Joi.object().keys({
    userId: Joi.string(),
  }),
};
/**
 * Schema for updating a user's role.
 * @type {object}
 * @property {object} body - Request body.
 * @property {string} body.userId - User ID.
 * @property {string} body.roleId - Role ID to be assigned to the user.
 */
const updateRole = {
  body: Joi.object().keys({
    userId: Joi.string(),
    roleId: Joi.string(),
  }),
};

module.exports = {
  getUsers,
  getUser,
  updateRole,
};
