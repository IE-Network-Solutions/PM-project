const Joi = require('joi');
const { objectId } = require('./custom.validation');

const addBudgetSession = {
  body: Joi.object().keys({
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
  }),
};

const getBudgetSession = {
  params: Joi.object().keys({
    id: Joi.string(),
  }),
};

const updateBudget = {
  params: Joi.object().keys({
    id: Joi.string().guid(),
  }),
  body: Joi.object()
    .keys({
      from: Joi.date(),
      to: Joi.date(),
    })
    .min(1),
};

module.exports = { addBudgetSession,getBudgetSession,updateBudget };
