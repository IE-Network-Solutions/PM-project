const Joi = require('joi');

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
      milestone: Joi.array().required(),
    })
  ),
};


const getPaymentTerms = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getPaymentTerm = {
  params: Joi.object().keys({
    paymentTermId: Joi.required(),
  }),
};

const getByProject = {
  params: Joi.object().keys({
    projectId: Joi.required(),
  }),
};

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
    })
    .min(1),
};

const deletePaymentTerm = {
  params: Joi.object().keys({
    paymentTermId: Joi.string(),
  }),
};

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
