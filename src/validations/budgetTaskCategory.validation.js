const Joi = require('joi');
const { objectId } = require('./custom.validation');
/**
 * @module budgetTaskCategory
 */
/**
 * Validation schema for creating a budget task category.
 * @type {Object}
 * @property {Object} body - Request body object.
 * @property {string} body.budgetTaskCategoryName - Name of the budget task category (required).
 * @property {string} body.accountNumber - Account number associated with the budget task category (required).
 * @property {string} body.budgetTypeId - ID of the budget type associated with the budget task category (required).
 */
const createBudgetTaskCategory = {
  body: Joi.object().keys({
    budgetTaskCategoryName: Joi.string().required(),
    accountNumber: Joi.string().required(),
    budgetTypeId: Joi.string().required(),
  }),
};
/**
 * Validation schema for getting budget task categories.
 * @type {Object}
 * @property {Object} query - Query parameters object.
 * @property {string} [query.sortBy] - Field to sort by.
 * @property {number} [query.limit] - Maximum number of results to return.
 * @property {number} [query.page] - Page number for pagination.
 */
const getBudgetTaskCategories = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};
/**
 * Validation schema for getting a single budget task category by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.budgetTaskCategoryId - ID of the budget task category to retrieve.
 */
const getBudgetTaskCategory = {
  params: Joi.object().keys({
    budgetTaskCategoryId: Joi.string(),
  }),
};
/**
 * Validation schema for updating a budget task category.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.budgetTaskCategoryId - ID of the budget task category to update.
 * @property {Object} body - Request body object.
 * @property {string} [body.budgetTaskCategoryName] - Updated name of the budget task category.
 * @property {string} [body.budgetTypeId] - Updated ID of the budget type associated with the budget task category.
 */
const updateBudgetTaskCategory = {
  params: Joi.object().keys({
    budgetTaskCategoryId: Joi.string(),
  }),
  body: Joi.object()
    .keys({
      budgetTaskCategoryName: Joi.string(),
      budgetTypeId: Joi.string(),
    })
    .min(1),
};
/**
 * Validation schema for deleting a budget task category by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.budgetTaskCategoryId - ID of the budget task category to delete.
 */
const deleteBudgetTaskCategory = {
  params: Joi.object().keys({
    budgetTaskCategoryId: Joi.string(),
  }),
};

module.exports = {
  createBudgetTaskCategory,
  getBudgetTaskCategories,
  getBudgetTaskCategory,
  updateBudgetTaskCategory,
  deleteBudgetTaskCategory,
};
