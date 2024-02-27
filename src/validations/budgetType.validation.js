const Joi = require('joi');
const { objectId } = require('./custom.validation');
/**
 * @module budgetType
*/
/**
 * Validation schema for creating a budget type.
 * @type {Object}
 * @property {Object} body - Request body object.
 * @property {string} body.budgetTypeName - Name of the budget type (required).
 * @property {boolean} [body.isOffice] - Indicates if the budget type is for office purposes.
 */
const createBudgetType = {
  body: Joi.object().keys({
    budgetTypeName: Joi.string().required(),
    isOffice: Joi.boolean(),
  }),
};
/**
 * Validation schema for getting budget types.
 * @type {Object}
 * @property {Object} query - Query parameters object.
 * @property {string} [query.sortBy] - Field to sort by.
 * @property {number} [query.limit] - Maximum number of results to return.
 * @property {number} [query.page] - Page number for pagination.
 */
const getBudgetTypes = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};
/**
 * Validation schema for getting a single budget type by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.budgetTypeId - ID of the budget type to retrieve.
 */
const getBudgetType = {
  params: Joi.object().keys({
    budgetTypeId: Joi.string(),
  }),
};
/**
 * Validation schema for updating a budget type.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.budgetTypeId - ID of the budget type to update.
 * @property {Object} body - Request body object.
 * @property {string} [body.budgetTypeName] - Updated name of the budget type.
 */
const updateBudgetType = {
  params: Joi.object().keys({
    budgetTypeId: Joi.string(),
  }),
  body: Joi.object()
    .keys({
      budgetTypeName: Joi.string(),
    })
    .min(1),
};
/**
 * Validation schema for deleting a budget type by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.budgetTypeId - ID of the budget type to delete.
 */
const deleteBudgetType = {
  params: Joi.object().keys({
    budgetTypeId: Joi.string(),
  }),
};

module.exports = {
  createBudgetType,
  getBudgetTypes,
  getBudgetType,
  updateBudgetType,
  deleteBudgetType,
};
