

const Joi = require('joi');
const { objectId } = require('./custom.validation');
/**
 * @module department
 */
/**
 * Validation schema for getting departments.
 * @type {Object}
 * @property {Object} query - Query parameters object.
 * @property {string} [query.sortBy] - Field to sort by.
 * @property {number} [query.limit] - Maximum number of results to return.
 * @property {number} [query.page] - Page number for pagination.
 */
const getDepartments = {
    query: Joi.object().keys({
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};
/**
 * Validation schema for getting a single department by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.departmentId - ID of the department to retrieve.
 */
const getDepartment = {
    params: Joi.object().keys({
        departmentId: Joi.string().custom(objectId),
    }),
};



module.exports = {
    getDepartments,
getDepartment
};
