const Joi = require('joi');
const { objectId } = require('./custom.validation');

const assignPermissionToUser = {
    body: Joi.object().keys({
      userId: Joi.string().required(),
      permissions: Joi.array().required()
    }),
};

module.exports = {
    assignPermissionToUser
}