const Joi = require('joi');
const { objectId } = require('./custom.validation');
/**
 * @module budgetCategory
 */
/**
 * Validation schema for creating a budget category.
 * @type {Object}
 * @property {Object} body - Request body object.
 * @property {string} body.budgetCategoryName - Name of the budget category (required).
 * @property {string} body.accountNumber - Account number associated with the budget category (required).
 * @property {string} body.budgetCategoryTypeId - ID of the budget category type associated with the budget category (required).
 */
const createBudgetCategory = {
  body: Joi.object().keys({
    budgetCategoryName: Joi.string().required(),
    accountNumber: Joi.string().required(),
    budgetCategoryTypeId: Joi.string().required(),
  }),
};
/**
 * Validation schema for getting budget categories.
 * @type {Object}
 * @property {Object} query - Query parameters object.
 * @property {string} [query.sortBy] - Field to sort by.
 * @property {number} [query.limit] - Maximum number of results to return.
 * @property {number} [query.page] - Page number for pagination.
 */
const getBudgetCategories = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};
/**
 * Validation schema for getting a single budget category by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.budgetCategoryId - ID of the budget category to retrieve.
 */
const getBudgetCategory = {
  params: Joi.object().keys({
    budgetCategoryId: Joi.string(),
  }),
};
/**
 * Validation schema for updating a budget category.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.budgetCategoryId - ID of the budget category to update.
 * @property {Object} body - Request body object.
 * @property {string} [body.budgetCategoryName] - Updated name of the budget category.
 * @property {string} [body.budgetCategoryTypeId] - Updated ID of the budget category type associated with the budget category.
 */
const updateBudgetCategory = {
  params: Joi.object().keys({
    budgetCategoryId: Joi.string(),
  }),
  body: Joi.object()
    .keys({
      budgetCategoryName: Joi.string(),
      budgetCategoryTypeId: Joi.string(),
    })
    .min(1),
};
/**
 * Validation schema for deleting a budget category by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.budgetCategoryId - ID of the budget category to delete.
 */
const deleteBudgetCategory = {
  params: Joi.object().keys({
    budgetCategoryId: Joi.string(),
  }),
};

module.exports = {
  createBudgetCategory,
  getBudgetCategories,
  getBudgetCategory,
  updateBudgetCategory,
  deleteBudgetCategory,
};
