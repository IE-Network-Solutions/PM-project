const Joi = require('joi');
const { objectId } = require('./custom.validation');

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

const addMonthlyBudget = {
  body: Joi.object().keys({
    budgetsData: Joi.array().items(monthlyBudgetSchema).required(),
    from: Joi.date().required(),
    to: Joi.date().required(),
  }),
};
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

const getMonthlyBudget = {
  query: Joi.object().keys({
    from: Joi.date(),
    to: Joi.date(),
  }),
};

module.exports = { updateMonthlyBudget, getMonthlyBudget, addMonthlyBudget };
