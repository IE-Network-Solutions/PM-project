const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createMilestone = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    status: Joi.boolean(),
    weight: Joi.required(),
    projectId: Joi.string(),
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
const getByProject = {
  params: Joi.object().keys({
    projectId: Joi.string(),
  }),
};

const updateMilestone = {
  params: Joi.object().keys({
    milestoneId: Joi.required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      status: Joi.boolean(),
      weight: Joi.number(),
    })
    .min(1),
};
const updateMilestoneVariance = {
  body: Joi.array().items(
    Joi.object({
      id: Joi.string().uuid().required(),
      plannedStart: Joi.date(),
      plannedFinish: Joi.date(),
      startVariance: Joi.number(),
      finishVariance: Joi.number(),
      actualStart: Joi.date(),
      actualFinish: Joi.date(),
    })
  ).min(1),
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
  getByProject,
  updateMilestone,
  deleteMilestone,
  updateMilestoneVariance
};
