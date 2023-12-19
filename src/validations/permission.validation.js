const Joi = require('joi');
const { objectId } = require('./custom.validation');

const assignPermissionToUser = {
    body: Joi.object().keys({
      userId: Joi.string().required(),
      permissions: Joi.array().required()
    }),
};

const assignPermissionToRole = {
    body: Joi.object().keys({
      roleId: Joi.string().required(),
      permissions: Joi.array().required()
    }),
};

module.exports = {
  assignPermissionToUser,
  assignPermissionToRole
}