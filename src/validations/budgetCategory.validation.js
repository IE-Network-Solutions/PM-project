const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createBudgetCategory = {
  body: Joi.object().keys({
    budgetCategoryName: Joi.string().required(),
    accountNumber: Joi.string().required(),
  }),
};

const getBudgetCategories = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getBudgetCategory = {
  params: Joi.object().keys({
    budgetCategoryId: Joi.string(),
  }),
};

const updateBudgetCategory = {
  params: Joi.object().keys({
    budgetCategoryId: Joi.string(),
  }),
  body: Joi.object()
    .keys({
      budgetCategoryName: Joi.string(),
    })
    .min(1),
};

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
