const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getUsers = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string(),
  }),
};
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
