const Joi = require('joi');
/**
 * @module paymentTerm
 */

/**
 * Schema for creating a payment term.
 * @type {object}
 * @property {array} body - Array containing payment term objects.
 * @property {object} body[] - Payment term object.
 * @property {string} body[].name - Name of the payment term (required).
 * @property {number} body[].amount - Amount of the payment term (required).
 * @property {boolean} [body[].percentage] - Indicates if the amount is a percentage.
 * @property {Date} [body[].plannedCollectionDate] - Planned collection date.
 * @property {Date} [body[].actualCollectionDate] - Actual collection date.
 * @property {boolean} [body[].status] - Status of the payment term.
 * @property {string} body[].projectId - ID of the project associated with the payment term (required).
 * @property {string} body[].currencyId - ID of the currency for the payment term (required).
 * @property {string} body[].budgetTypeId - ID of the budget type for the payment term (required).
 * @property {array} body[].milestone - Array of milestones associated with the payment term (required).
 */
const createPaymentTerm = {
  body: Joi.array().items(
    Joi.object().keys({
      name: Joi.string().required(),
      amount: Joi.number().required(),
      percentage: Joi.boolean(),
      plannedCollectionDate: Joi.date(),
      actualCollectionDate: Joi.date(),
      status: Joi.boolean(),
      projectId: Joi.string().required(),
      currencyId: Joi.string().required(),
      budgetTypeId: Joi.string().required(),
      milestone: Joi.array(),
      isAdvance: Joi.boolean()
    })
  ),
};

/**
 * Schema for retrieving payment terms.
 * @type {object}
 * @property {object} query - Query parameters.
 * @property {string} [query.sortBy] - Field to sort by.
 * @property {number} [query.limit] - Maximum number of results to return.
 * @property {number} [query.page] - Page number.
 */
const getPaymentTerms = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};
/**
 * Schema for retrieving a single payment term.
 * @type {object}
 * @property {object} params - Path parameters.
 * @property {string} params.paymentTermId - ID of the payment term to retrieve (required).
 */
const getPaymentTerm = {
  params: Joi.object().keys({
    paymentTermId: Joi.required(),
  }),
};
/**
 * Schema for retrieving payment terms by project ID.
 * @type {object}
 * @property {object} params - Path parameters.
 * @property {string} params.projectId - ID of the project to retrieve payment terms for (required).
 */
const getByProject = {
  params: Joi.object().keys({
    projectId: Joi.required(),
  }),
};
/**
 * Schema for updating a payment term.
 * @type {object}
 * @property {object} params - Path parameters.
 * @property {string} params.paymentTermId - ID of the payment term to update (required).
 * @property {object} body - Request body.
 * @property {string} [body.name] - Updated name of the payment term.
 * @property {number} [body.amount] - Updated amount of the payment term.
 * @property {Date} [body.plannedCollectionDate] - Updated planned collection date.
 * @property {Date} [body.actualCollectionDate] - Updated actual collection date.
 * @property {boolean} [body.status] - Updated status of the payment term.
 * @property {array} [body.milestone] - Updated array of milestones associated with the payment term.
 * @property {string} [body.projectId] - Updated ID of the project associated with the payment term.
 * @property {string} [body.budgetTypeId] - Updated ID of the budget type for the payment term.
 * @property {string} [body.currencyId] - Updated ID of the currency for the payment term.
 * @property {boolean} [body.percentage] - Updated indicator if the amount is a percentage.
 */
const updatePaymentTerm = {
  params: Joi.object().keys({
    paymentTermId: Joi.required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      amount: Joi.number(),
      plannedCollectionDate: Joi.date(),
      actualCollectionDate: Joi.date(),
      status: Joi.boolean(),
      milestone: Joi.array(),
      projectId: Joi.string(),
      budgetTypeId: Joi.string(),
      currencyId: Joi.string(),
      percentage: Joi.boolean(),
      milestone: Joi.array(),
      isAdvance: Joi.boolean(),
      atpDocument: Joi.string(),
      isAmountPercent: Joi.boolean(),
      isOffshore: Joi.boolean(),
    })
    .min(1),
};
/**
 * Schema for deleting a payment term.
 * @type {object}
 * @property {object} params - Path parameters.
 * @property {string} params.paymentTermId - ID of the payment term to delete.
 */
const deletePaymentTerm = {
  params: Joi.object().keys({
    paymentTermId: Joi.string(),
  }),
};
/**
 * Schema for validating variance data.
 * @type {object}
 * @property {object} body - Request body.
 * @property {array} body.varianceData - Array of variance data.
 * @property {number} body.varianceData[].amount - Amount of the variance data (required).
 * @property {string} body.varianceData[].currencyId - ID of the currency for the variance data (required).
 * @property {Date} [body.varianceData[].contractSignDate] - Contract sign date for the variance data.
 * @property {boolean} body.varianceData[].isVariance - Indicator if the data is a variance (required).
 * @property {string} body.varianceData[].projectId - ID of the project for the variance data (required).
 */
const validateVariance = {
  body: Joi.object().keys({
    varianceData: Joi.array().items(
    Joi.object({
    amount: Joi.number().required(),
    currencyId: Joi.string().required(),
    contractSignDate: Joi.date(),
    isVariance: Joi.boolean().required(),
    projectId: Joi.string().required()
  })
  ).required().unique((a, b) => a.currencyId === b.currencyId),
  })

}
module.exports = {
  createPaymentTerm,
  getPaymentTerms,
  getPaymentTerm,
  getByProject,
  updatePaymentTerm,
  deletePaymentTerm,
  validateVariance
};
