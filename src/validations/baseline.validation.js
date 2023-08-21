const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createBaseline = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    status: Joi.string(),
    milestoneId: Joi.required(),
    tasks: Joi.array(),
    subtasks: Joi.array(),
  }),
};

const getBaselines = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getBaseline = {
  params: Joi.object().keys({
    baselineId: Joi.string()
  }),
};

const updateBaseline = {
  params: Joi.object().keys({
    baselineId: Joi.string()
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
    })
    .min(1),
};

const deleteBaseline= {
    params: Joi.object().keys({
      baselineId: Joi.string(),
    }),
  };

module.exports = {
  createBaseline,
  getBaselines,
  getBaseline,
  updateBaseline,
  deleteBaseline
};
