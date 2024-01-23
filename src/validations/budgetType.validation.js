const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createBudgetType = {
  body: Joi.object().keys({
    budgetTypeName: Joi.string().required(),
    isOffice: Joi.boolean(),
  }),
};

const getBudgetTypes = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getBudgetType = {
  params: Joi.object().keys({
    budgetTypeId: Joi.string(),
  }),
};

const updateBudgetType = {
  params: Joi.object().keys({
    budgetTypeId: Joi.string(),
  }),
  body: Joi.object()
    .keys({
      budgetTypeName: Joi.string(),
    })
    .min(1),
};

const deleteBudgetType = {
  params: Joi.object().keys({
    budgetTypeId: Joi.string(),
  }),
};

module.exports = {
  createBudgetType,
  getBudgetTypes,
  getBudgetType,
  updateBudgetType,
  deleteBudgetType,
};
