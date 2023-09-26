const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createBaseline = {
  body: Joi.object().keys({
    id: Joi.string(),
    name: Joi.string().required(),
    status: Joi.boolean(),
    projectId: Joi.required(),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    createdBy: Joi.allow(),
    updatedBy: Joi.allow(),
    milestones: Joi.array().required(),
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

const getByMilestone = {
  params: Joi.object().keys({
    milestoneId: Joi.string(),
  }),
};

const updateBaseline = {
  params: Joi.object().keys({
    baselineId: Joi.string()
  }),
  body: Joi.object()
    .keys({
      id: Joi.required(),
      name: Joi.string(),
      status: Joi.boolean(),
      milestoneId: Joi.string(),
      createdAt: Joi.date(),
      updatedAt: Joi.date(),
      createdBy: Joi.required(),
      updatedBy: Joi.required(),
      tasks: Joi.array(),
      subtasks: Joi.array(),
    })
    .min(1),
};

const deleteBaseline= {
    params: Joi.object().keys({
      baselineId: Joi.string(),
    }),
  };

  const addComment = {
    body: Joi.object().keys({
      id: Joi.string().required(),
      comment: Joi.string().required(),
      userId: Joi.string().required(),
    }),
  };

  const getComments = {
    params: Joi.object().keys({
        baselineId: Joi.string().required(),
    }),
  };

module.exports = {
  createBaseline,
  getBaselines,
  getBaseline,
  getByMilestone,
  updateBaseline,
  deleteBaseline,
  addComment,
  getComments
};
