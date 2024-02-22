const Joi = require('joi');
const { objectId } = require('./custom.validation');
/**
 * @module budget
 */
/**
 * Joi schema for budget data.
 * @type {Joi.ObjectSchema}
 */
const budgetSchema = Joi.object({
  amount: Joi.number().required(),
  description: Joi.string().required(),
  taskId: Joi.string().guid().required(),
  budgetCategoryId: Joi.string().guid().required(),
  taskCategoryId: Joi.string().guid().required(),
  currencyId: Joi.string().required(),
});
/**
 * Validation schema for adding a budget.
 * @type {Object}
 * @property {Object} body - Request body object.
 * @property {number} body.amount - Amount of the budget (required).
 * @property {string} body.description - Description of the budget (required).
 * @property {string} body.taskId - ID of the task associated with the budget (required).
 * @property {string} body.budgetCategoryId - ID of the budget category associated with the budget (required).
 * @property {string} body.taskCategoryId - ID of the task category associated with the budget (required).
 * @property {string} body.groupId - ID of the group associated with the budget (required).
 * @property {string} body.currencyId - ID of the currency associated with the budget (required).
 */
const addBudget = {
  body: Joi.object().keys({
    amount: Joi.number().required(),
    description: Joi.string().required(),
    taskId: Joi.string().guid().required(),
    budgetCategoryId: Joi.string().guid().required(),
    taskCategoryId: Joi.string().guid().required(),
    groupId: Joi.string().guid().required(),
    currencyId: Joi.string().required(),
  }),
};
/**
 * Validation schema for creating a budget.
 * @type {Object}
 * @property {Object} body - Request body object.
 * @property {Date} body.from - Start date of the budget period (required).
 * @property {Date} body.to - End date of the budget period (required).
 * @property {string} body.projectId - ID of the project associated with the budget (required).
 * @property {Array} body.budgets - Array of budget objects (required).
 */
const createBudget = {
  body: Joi.object().keys({
    from: Joi.date().required(),
    to: Joi.date().required(),
    projectId: Joi.string().guid().required(),
    budgets: Joi.array().items(budgetSchema).required(),
  }),
};
/**
 * Validation schema for getting budgets.
 * @type {Object}
 * @property {Object} query - Query parameters object.
 * @property {string} [query.sortBy] - Field to sort by.
 * @property {number} [query.limit] - Maximum number of results to return.
 * @property {number} [query.page] - Page number for pagination.
 */
const getBudgets = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};
/**
 * Validation schema for filtering budgets.
 * @type {Object}
 * @property {Object} query - Query parameters object.
 * @property {Date} [query.startDate] - Start date for filtering budgets.
 * @property {Date} [query.endDate] - End date for filtering budgets.
 */
const filterBudgets = {
  query: Joi.object().keys({
    startDate: Joi.date(),
    endDate: Joi.date(),
  }),
};
/**
 * Validation schema for getting a single budget by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.budgetId - ID of the budget to retrieve.
 */
const getBudget = {
  params: Joi.object().keys({
    budgetId: Joi.string(),
  }),
};
/**
 * Validation schema for getting budgets by project.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.projectId - ID of the project to retrieve budgets for.
 */
const getBudgetByProject = {
  params: Joi.object().keys({
    projectId: Joi.string(),
  }),
};
/**
 * Validation schema for updating a budget.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.budgetId - ID of the budget to update.
 * @property {Object} body - Request body object.
 * @property {number} [body.amount] - Updated amount of the budget.
 * @property {string} [body.description] - Updated description of the budget.
 * @property {string} [body.budgetCategory] - Updated ID of the budget category associated with the budget.
 * @property {string} [body.taskCategory] - Updated ID of the task category associated with the budget.
 * @property {string} [body.currencyId] - Updated ID of the currency associated with the budget.
 */
const updateBudget = {
  params: Joi.object().keys({
    budgetId: Joi.string().guid(),
  }),
  body: Joi.object()
    .keys({
      amount: Joi.number(),
      description: Joi.string(),
      budgetCategory: Joi.string().guid(),
      taskCategory: Joi.string().guid(),
      currencyId: Joi.string().guid(),
    })
    .min(1),
};
/**
 * Validation schema for deleting a budget by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.budgetId - ID of the budget to delete.
 */
const deleteBudget = {
  params: Joi.object().keys({
    budgetId: Joi.string(),
  }),
};

module.exports = { createBudget, getBudgets, getBudget, updateBudget, getBudgetByProject, addBudget, filterBudgets,deleteBudget };
