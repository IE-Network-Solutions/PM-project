const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createBudgetTaskCategory = {
  body: Joi.object().keys({
    budgetTaskCategoryName: Joi.string().required(),
    accountNumber: Joi.string().required(),
    budgetTypeId: Joi.string().required(),
  }),
};

const getBudgetTaskCategories = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getBudgetTaskCategory = {
  params: Joi.object().keys({
    budgetTaskCategoryId: Joi.string(),
  }),
};

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
