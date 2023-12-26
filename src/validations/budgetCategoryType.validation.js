const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createBudgetCategoryType = {
  body: Joi.object().keys({
    budgetCategoryTypeName: Joi.string().required(),
    accountNumber: Joi.string().required(),
  }),
};

const getBudgetCategoryTypes = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getBudgetCategoryType = {
  params: Joi.object().keys({
    budgetCategoryTypeId: Joi.string(),
  }),
};

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
