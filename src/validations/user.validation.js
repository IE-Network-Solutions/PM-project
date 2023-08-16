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
    userId: Joi.string()
  }),
};


module.exports = {
    getUsers,
    getUser
};
