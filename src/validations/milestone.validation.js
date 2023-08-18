const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createMilestone = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    status: Joi.string().required(),
    weight: Joi.required(),
    projectId: Joi.string(),
    tasks: Joi.array(),
    subtasks: Joi.array(),
  }),
};

const getMilestones = {
  query: Joi.object().keys({
  }),
};

const getMilestone = {
  params: Joi.object().keys({
    milestoneId: Joi.string(),
  }),
};

const updateMilestone = {
  params: Joi.object().keys({
    milestoneId: Joi.required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
    })
    .min(1),
};

const deleteMilestone = {
    params: Joi.object().keys({
        milestoneId: Joi.string(),
    }),
  };

module.exports = {
  createMilestone,
  getMilestones,
  getMilestone,
  updateMilestone,
  deleteMilestone
};
