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
  query: Joi.object().keys({}),
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
      id: Joi.string().uuid().allow(null),
      name: Joi.string().allow(null),
      weight: Joi.number().allow(null),
      status: Joi.boolean().allow(null),
      createdBy: Joi.string().allow(null),
      updatedBy: Joi.string().allow(null),
      paymentTermId: Joi.string().uuid().allow(null),
      summaryTask: Joi.array().allow(null),
      projectId: Joi.string().uuid().allow(null),
      plannedStart: Joi.date().allow(null),
      plannedFinish: Joi.date().allow(null),
      startVariance: Joi.number().allow(null),
      finishVariance: Joi.number().allow(null),
      actualStart: Joi.date().allow(null),
      actualFinish: Joi.date().allow(null),
      createdAt: Joi.date().allow(null),
      updatedAt: Joi.date().allow(null),
      hasCheckList: Joi.boolean().allow(null),
      isEvaluted: Joi.boolean().allow(null),
      isSendToDOO: Joi.boolean().allow(null),
    })
    .min(1),
};
const updateMilestoneVariance = {
  body: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().uuid().required(),
        plannedStart: Joi.date(),
        plannedFinish: Joi.date(),
        startVariance: Joi.number(),
        finishVariance: Joi.number(),
        actualStart: Joi.date(),
        actualFinish: Joi.date(),
      })
    )
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
  getByProject,
  updateMilestone,
  deleteMilestone,
  updateMilestoneVariance,
};
