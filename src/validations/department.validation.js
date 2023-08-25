

const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getDepartments = {
    query: Joi.object().keys({
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

const getDepartment = {
    params: Joi.object().keys({
        departmentId: Joi.string().custom(objectId),
    }),
};



module.exports = {
    getDepartments,
getDepartment
};
