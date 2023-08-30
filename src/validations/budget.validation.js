const Joi = require('joi');
const { objectId } = require('./custom.validation');

const budgetSchema = Joi.object({
  amount: Joi.number().required(),
  description: Joi.string().required(),
  taskId: Joi.string().guid().required(),
  budgetCategoryId: Joi.string().guid().required(),
  taskCategoryId: Joi.string().guid().required(),
});
const addBudget = {
  body: Joi.object().keys({
    amount: Joi.number().required(),
    description: Joi.string().required(),
    taskId: Joi.string().guid().required(),
    budgetCategoryId: Joi.string().guid().required(),
    taskCategoryId: Joi.string().guid().required(),
    groupId: Joi.string().guid().required(),
  }),
};

const createBudget = {
  body: Joi.object().keys({
    from: Joi.date().required(),
    to: Joi.date().required(),
    projectId: Joi.string().guid().required(),
    budgets: Joi.array().items(budgetSchema).required(),
  }),
};

const getBudgets = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getBudget = {
  params: Joi.object().keys({
    budgetId: Joi.string(),
  }),
};
const getBudgetByProject = {
  params: Joi.object().keys({
    projectId: Joi.string(),
  }),
};

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
    })
    .min(1),
};

const deleteBudget = {
  params: Joi.object().keys({
    budgetId: Joi.string(),
  }),
};

module.exports = { createBudget, getBudgets, getBudget, updateBudget, getBudgetByProject, addBudget };
