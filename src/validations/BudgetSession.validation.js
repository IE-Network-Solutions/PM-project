const Joi = require('joi');
const { objectId } = require('./custom.validation');
/**
 * @module budgetSession
 */
/**
 * Validation schema for adding a budget session.
 * @type {Object}
 * @property {Object} body - Request body object.
 * @property {Date} body.startDate - Start date of the budget session (required).
 * @property {Date} body.endDate - End date of the budget session (required).
 */
const addBudgetSession = {
  body: Joi.object().keys({
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
  }),
};
/**
 * Validation schema for getting a budget session by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.id - ID of the budget session to retrieve.
 */
const getBudgetSession = {
  params: Joi.object().keys({
    id: Joi.string(),
  }),
};
/**
 * Validation schema for updating a budget.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.id - ID of the budget to update.
 * @property {Object} body - Request body object.
 * @property {Date} [body.from] - Updated start date of the budget.
 * @property {Date} [body.to] - Updated end date of the budget.
 */
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
