const Joi = require('joi');

const budgetSchema = Joi.object({
  amount: Joi.number().required(),
  description: Joi.string().required(),
  taskId: Joi.string().guid().required(),
  budgetCategoryId: Joi.string().guid().required(),
  taskCategoryId: Joi.string().guid().required(),
  currencyId: Joi.string().required(),
});

module.exports = { createBudget, getBudgets, getBudget, updateBudget, getBudgetByProject, addBudget, filterBudgets };
