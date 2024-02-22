const Joi = require('joi');
const { objectId } = require('./custom.validation');
/**
 * @module accountability
 */
/**
 * Validation schema for creating accountability.
 * @type {Object}
 * @property {Object} body - Request body object.
 * @property {Array} body.accountablities - Array of accountability items.
 * @property {string} body.afterActionAnalysisId - ID of the after action analysis related to the accountability.
 */
const createAccountablity = {
    body: Joi.object().keys({
        accountablities: Joi.array(),
        afterActionAnalysisId: Joi.string().custom(objectId),
    }),
};
/**
 * Validation schema for getting accountabilities.
 * @type {Object}
 * @property {Object} query - Query parameters object.
 * @property {string} [query.sortBy] - Field to sort by.
 * @property {number} [query.limit] - Maximum number of results to return.
 * @property {number} [query.page] - Page number for pagination.
 */
const getAccountablityies = {
    query: Joi.object().keys({
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};
/**
 * Validation schema for getting a single accountability by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.accId - ID of the accountability to retrieve.
 */
const getAccountablity = {
    params: Joi.object().keys({
        accId: Joi.string().custom(objectId),
    }),
};
/**
 * Validation schema for updating an accountability by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.accIdId - ID of the accountability to update.
 * @property {Object} body - Request body object.
 * @property {string} body.responsiblePersonId - ID of the responsible person for the accountability.
 * @property {string} body.accountablityies - Accountability items.
 */
const updateAccountablityById = {
    params: Joi.object().keys({
        accIdId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
        responsiblePersonId: Joi.string().required(),

        accountablityies: Joi.string().required(),
    })
        .min(1),
};
/**
 * Validation schema for deleting an accountability by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.accId - ID of the accountability to delete.
 */
const deleteAccountablityById = {
    params: Joi.object().keys({
        accId: Joi.string().custom(objectId),
    }),
};

module.exports = {
    createAccountablity,
    getAccountablityies,
    getAccountablity,
    updateAccountablityById,
    deleteAccountablityById
};
