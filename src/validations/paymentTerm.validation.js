const Joi = require('joi');

const createPaymentTerm = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    amount: Joi.number().required(),
    plannedCollectionDate: Joi.date().required(),
    actualCollectionDate: Joi.date(),
    status: Joi.boolean(),
    milestone: Joi.array().required(),
  }),
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

const updatePaymentTerm = {
  params: Joi.object().keys({
    paymentTermId: Joi.required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
    })
    .min(1),
};

const deletePaymentTerm = {
    params: Joi.object().keys({
      paymentTermId: Joi.string(),
    }),
  };

module.exports = {
  createPaymentTerm,
  getPaymentTerms,
  getPaymentTerm,
  updatePaymentTerm,
  deletePaymentTerm
};
