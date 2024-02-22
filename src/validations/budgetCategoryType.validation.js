const Joi = require('joi');
const { objectId } = require('./custom.validation');
/**
 * @module budgetCategoryType
 */
/**
 * Validation schema for creating a budget category type.
 * @type {Object}
 * @property {Object} body - Request body object.
 * @property {string} body.budgetCategoryTypeName - Name of the budget category type (required).
 * @property {string} body.accountNumber - Account number associated with the budget category type (required).
 */
const createBudgetCategoryType = {
  body: Joi.object().keys({
    budgetCategoryTypeName: Joi.string().required(),
    accountNumber: Joi.string().required(),
  }),
};
/**
 * Validation schema for getting budget category types.
 * @type {Object}
 * @property {Object} query - Query parameters object.
 * @property {string} [query.sortBy] - Field to sort by.
 * @property {number} [query.limit] - Maximum number of results to return.
 * @property {number} [query.page] - Page number for pagination.
 */
const getBudgetCategoryTypes = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};
/**
 * Validation schema for getting a single budget category type by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.budgetCategoryTypeId - ID of the budget category type to retrieve.
 */
const getBudgetCategoryType = {
  params: Joi.object().keys({
    budgetCategoryTypeId: Joi.string(),
  }),
};
/**
 * Validation schema for updating a budget category type.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.budgetCategoryTypeId - ID of the budget category type to update.
 * @property {Object} body - Request body object.
 * @property {string} [body.budgetCategoryTypeName] - Updated name of the budget category type.
 */
const updateBudgetCategoryType = {
  params: Joi.object().keys({
    budgetCategoryTypeId: Joi.string(),
  }),
  body: Joi.object()
    .keys({
      budgetCategoryTypeName: Joi.string(),
    })
    .min(1),
};
/**
 * Validation schema for deleting a budget category type by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.budgetCategoryTypeId - ID of the budget category type to delete.
 */
const deleteBudgetCategoryType = {
  params: Joi.object().keys({
    budgetCategoryTypeId: Joi.string(),
  }),
};

module.exports = {
    createBudgetCategoryType,
    getBudgetCategoryTypes,
  getBudgetCategoryType,
  updateBudgetCategoryType,
  deleteBudgetCategoryType,
};
