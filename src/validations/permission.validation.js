const Joi = require('joi');
const { objectId } = require('./custom.validation');
/**
 * @module permission
 */
/**
 * Schema for assigning permissions to a user.
 * @type {object}
 * @property {object} body - Request body.
 * @property {string} body.userId - ID of the user to whom permissions will be assigned (required).
 * @property {array} body.permissions - Array of permissions to assign to the user (required).
 */
const assignPermissionToUser = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
    permissions: Joi.array().required(),
  }),
};
/**
 * Schema for assigning permissions to a role.
 * @type {object}
 * @property {object} body - Request body.
 * @property {string} body.roleId - ID of the role to which permissions will be assigned (required).
 * @property {array} body.permissions - Array of permissions to assign to the role (required).
 */
const assignPermissionToRole = {
  body: Joi.object().keys({
    roleId: Joi.string().required(),
    permissions: Joi.array().required(),
  }),
};

module.exports = {
  assignPermissionToUser,
  assignPermissionToRole,
};
