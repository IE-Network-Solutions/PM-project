const Joi = require('joi');
const { objectId } = require('./custom.validation');
/**
 * @module action
 */
/**
 * Validation schema for creating an action.
 * @type {Object}
 * @property {Object} body - Request body object.
 * @property {Array} body.actions - Array of action items.
 * @property {string} body.afterActionAnalysisId - ID of the after action analysis related to the action.
 */
const createAction = {
    body: Joi.object().keys({
        actions: Joi.array(),
        afterActionAnalysisId: Joi.string().custom(objectId),
    }),
};
/**
 * Validation schema for getting actions.
 * @type {Object}
 * @property {Object} query - Query parameters object.
 * @property {string} [query.sortBy] - Field to sort by.
 * @property {number} [query.limit] - Maximum number of results to return.
 * @property {number} [query.page] - Page number for pagination.
 */
const getActions = {
    query: Joi.object().keys({
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};
/**
 * Validation schema for getting a single action by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.actionId - ID of the action to retrieve.
 */
const getAction = {
    params: Joi.object().keys({
        actionId: Joi.string().custom(objectId),
    }),
};
/**
 * Validation schema for updating an action by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.actionId - ID of the action to update.
 * @property {Object} body - Request body object.
 * @property {string} body.responsiblePersonId - ID of the responsible person for the action.
 * @property {string} body.authorizedPersonId - ID of the authorized person for the action.
 * @property {string} body.action - Description of the action.
 */
const updateActionById = {
    params: Joi.object().keys({
        actionId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
        responsiblePersonId: Joi.string().required(),
        authorizedPersonId: Joi.string().required(),
        action: Joi.string().required(),
    })
        .min(1),
};
/**
 * Validation schema for deleting an action by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.actionId - ID of the action to delete.
 */
const deleteActionById = {
    params: Joi.object().keys({
        actionId: Joi.string().custom(objectId),
    }),
};

module.exports = {
    createAction,
    getActions,
    getAction,
    updateActionById,
    deleteActionById
};
