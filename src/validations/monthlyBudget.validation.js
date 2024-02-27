const Joi = require('joi');
const { objectId } = require('./custom.validation');
/**
 * @module monthlyBudget
 */
/**
 * Schema for the monthly budget data.
 * @type {object}
 * @property {string} taskCategory_id - Task category ID.
 * @property {Date} taskCategory_createdAt - Date when the task category was created.
 * @property {Date} taskCategory_updatedAt - Date when the task category was last updated.
 * @property {string} [taskCategory_createdBy] - ID of the user who created the task category (nullable).
 * @property {string} [taskCategory_updatedBy] - ID of the user who last updated the task category (nullable).
 * @property {string} taskCategory_budgetTaskCategoryName - Name of the budget task category.
 * @property {string} taskCategory_accountNumber - Account number associated with the task category.
 * @property {string} taskCategory_budgetTypeId - ID of the budget type associated with the task category.
 * @property {Date} group_to - Date representing the end of the budget group.
 * @property {Date} group_from - Date representing the start of the budget group.
 * @property {string} project_id - ID of the project.
 * @property {string} project_name - Name of the project.
 * @property {string} currency_id - ID of the currency.
 * @property {string} currency_name - Name of the currency.
 * @property {number} sum - Sum of the budget.
 * @property {Date} from - Start date for the budget.
 * @property {Date} to - End date for the budget.
 */

const monthlyBudgetSchema = Joi.object({
  taskCategory_id: Joi.string().required(),
  taskCategory_createdAt: Joi.date().required(),
  taskCategory_updatedAt: Joi.date().required(),
  taskCategory_createdBy: Joi.string().allow(null),
  taskCategory_updatedBy: Joi.string().allow(null),
  taskCategory_budgetTaskCategoryName: Joi.string().required(),
  taskCategory_accountNumber: Joi.string().required(),
  taskCategory_budgetTypeId: Joi.string().required(),
  group_to: Joi.date().required(),
  group_from: Joi.date().required(),
  project_id: Joi.string().required(),
  project_name: Joi.string().required(),
  currency_id: Joi.string().required(),
  currency_name: Joi.string().required(),
  sum: Joi.number().required(),
  from: Joi.date().required(),
  to: Joi.date().required(),
});
/**
 * Schema for adding monthly budget data.
 * @type {object}
 * @property {object} body - Request body.
 * @property {array} body.budgetsData - Array of monthly budget data.
 * @property {Date} body.from - Start date for the budget.
 * @property {Date} body.to - End date for the budget.
 */
const addMonthlyBudget = {
  body: Joi.object().keys({
    budgetsData: Joi.array().items(monthlyBudgetSchema).required(),
    from: Joi.date().required(),
    to: Joi.date().required(),
  }),
};
/**
 * Schema for updating monthly budget data.
 * @type {object}
 * @property {object} params - Path parameters.
 * @property {string} params.id - ID of the monthly budget (GUID).
 * @property {object} body - Request body.
 * @property {array} body.budgetsData - Array of updated monthly budget data.
 * @property {string} body.from - Start date for the budget (as a string).
 * @property {string} body.to - End date for the budget (as a string).
 */
const updateMonthlyBudget = {
  params: Joi.object().keys({
    id: Joi.string().guid(),
  }),
  body: Joi.object()
    .keys({
      budgetsData: Joi.array().items(monthlyBudgetSchema).required(),
      from: Joi.string().required(),
      to: Joi.string().required(),
    })
    .min(1),
};
/**
 * Schema for retrieving monthly budget data.
 * @type {object}
 * @property {object} query - Query parameters.
 * @property {Date} [query.from] - Start date for filtering budget data.
 * @property {Date} [query.to] - End date for filtering budget data.
 */
const getMonthlyBudget = {
  query: Joi.object().keys({
    from: Joi.date(),
    to: Joi.date(),
  }),
};

module.exports = { updateMonthlyBudget, getMonthlyBudget, addMonthlyBudget };
