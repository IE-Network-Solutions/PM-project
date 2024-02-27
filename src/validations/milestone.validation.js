const Joi = require('joi');
const { objectId } = require('./custom.validation');
/**
 * @module milestone
 */
/**
 * Schema for creating a milestone.
 * @type {object}
 * @property {object} body - The request body.
 * @property {string} body.name - The name of the milestone.
 * @property {boolean} [body.status] - The status of the milestone.
 * @property {number} body.weight - The weight of the milestone.
 * @property {string} [body.projectId] - The ID of the project associated with the milestone.
 */
const createMilestone = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    status: Joi.boolean(),
    weight: Joi.required(),
    projectId: Joi.string(),
  }),
};

/**
 * Schema for getting milestones.
 * @type {object}
 * @property {object} query - The query parameters.
 */
const getMilestones = {
  query: Joi.object().keys({}),
};

/**
 * Schema for getting a milestone.
 * @type {object}
 * @property {object} params - The URL parameters.
 * @property {string} params.milestoneId - The ID of the milestone.
 */
const getMilestone = {
  params: Joi.object().keys({
    milestoneId: Joi.string(),
  }),
};
/**
 * Schema for getting milestones by project.
 * @type {object}
 * @property {object} params - The URL parameters.
 * @property {string} params.projectId - The ID of the project.
 */
const getByProject = {
  params: Joi.object().keys({
    projectId: Joi.string(),
  }),
};
/**
 * Schema for updating a milestone.
 * @type {object}
 * @property {object} params - The URL parameters.
 * @property {string} params.milestoneId - The ID of the milestone.
 * @property {object} body - The request body.
 * @property {string} [body.id] - The ID of the milestone.
 * @property {string} [body.name] - The name of the milestone.
 * @property {number} [body.weight] - The weight of the milestone.
 * @property {boolean} [body.status] - The status of the milestone.
 * @property {string} [body.createdBy] - The creator of the milestone.
 * @property {string} [body.updatedBy] - The updater of the milestone.
 * @property {string} [body.paymentTermId] - The ID of the payment term associated with the milestone.
 * @property {Array} [body.summaryTask] - Summary tasks associated with the milestone.
 * @property {string} [body.projectId] - The ID of the project associated with the milestone.
 * @property {Date} [body.plannedStart] - The planned start date of the milestone.
 * @property {Date} [body.plannedFinish] - The planned finish date of the milestone.
 * @property {number} [body.startVariance] - The variance in the start date of the milestone.
 * @property {number} [body.finishVariance] - The variance in the finish date of the milestone.
 * @property {Date} [body.actualStart] - The actual start date of the milestone.
 * @property {Date} [body.actualFinish] - The actual finish date of the milestone.
 * @property {Date} [body.createdAt] - The creation date of the milestone.
 * @property {Date} [body.updatedAt] - The update date of the milestone.
 * @property {boolean} [body.hasCheckList] - Indicates whether the milestone has a checklist.
 * @property {boolean} [body.isEvaluted] - Indicates whether the milestone is evaluated.
 * @property {boolean} [body.isSendToDOO] - Indicates whether the milestone is sent to DOO.
 */
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
      start: Joi.date().allow(null),
      finish: Joi.date().allow(null),
      order: Joi.date().allow(null),
      actualDuration: Joi.date().allow(null),
      duration: Joi.date().allow(null),
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
/**
 * Schema for updating milestone variance.
 * @type {object}
 * @property {object} body - The request body.
 * @property {Array} body - An array of milestone variance objects.
 */
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
/**
 * Schema for deleting a milestone.
 * @type {object}
 * @property {object} params - The URL parameters.
 * @property {string} params.milestoneId - The ID of the milestone to be deleted.
 */
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
