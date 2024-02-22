const Joi = require('joi');
const { objectId } = require('./custom.validation');
/**
 * @module baseline
 */

/**
 * Validation schema for creating a baseline.
 * @type {Object}
 * @property {Object} body - Request body object.
 * @property {string} [body.id] - ID of the baseline.
 * @property {string} body.name - Name of the baseline.
 * @property {boolean} [body.status] - Status of the baseline.
 * @property {string} body.projectId - ID of the project associated with the baseline.
 * @property {Date} [body.createdAt] - Date of creation of the baseline.
 * @property {Date} [body.updatedAt] - Date of last update of the baseline.
 * @property {string} [body.createdBy] - ID of the user who created the baseline.
 * @property {string} [body.updatedBy] - ID of the user who last updated the baseline.
 * @property {Array} body.milestones - Array of milestone objects associated with the baseline (required).
 * @property {Array} [body.subtasks] - Array of subtask objects associated with the baseline.
 */
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
/**
 * Validation schema for getting baselines.
 * @type {Object}
 * @property {Object} query - Query parameters object.
 * @property {string} [query.sortBy] - Field to sort by.
 * @property {number} [query.limit] - Maximum number of results to return.
 * @property {number} [query.page] - Page number for pagination.
 */
const getBaselines = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};
/**
 * Validation schema for getting a single baseline by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.baselineId - ID of the baseline to retrieve.
 */
const getBaseline = {
  params: Joi.object().keys({
    baselineId: Joi.string(),
  }),
};
/**
 * Validation schema for getting baselines by milestone ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.milestoneId - ID of the milestone to retrieve baselines for.
 */
const getByMilestone = {
  params: Joi.object().keys({
    milestoneId: Joi.string(),
  }),
};
/**
 * Validation schema for getting project schedule.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.projectId - ID of the project to retrieve the schedule for.
 */
const projectSchedule = {
  params: Joi.object().keys({
    projectId: Joi.string(),
  }),
};
/**
 * Validation schema for updating a baseline.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.baselineId - ID of the baseline to update.
 * @property {Object} body - Request body object.
 * @property {string} body.id - ID of the baseline (required).
 * @property {string} [body.name] - Name of the baseline.
 * @property {boolean} [body.status] - Status of the baseline.
 * @property {string} [body.milestoneId] - ID of the milestone associated with the baseline.
 * @property {Date} [body.createdAt] - Date of creation of the baseline.
 * @property {Date} [body.updatedAt] - Date of last update of the baseline.
 * @property {string} body.createdBy - ID of the user who created the baseline (required).
 * @property {string} body.updatedBy - ID of the user who last updated the baseline (required).
 * @property {Array} [body.tasks] - Array of task objects associated with the baseline.
 * @property {Array} [body.subtasks] - Array of subtask objects associated with the baseline.
 */
const updateBaseline = {
  params: Joi.object().keys({
    baselineId: Joi.string(),
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
/**
 * Validation schema for deleting a baseline by ID.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.baselineId - ID of the baseline to delete.
 */
const deleteBaseline = {
  params: Joi.object().keys({
    baselineId: Joi.string(),
  }),
};
/**
 * Validation schema for adding a comment.
 * @type {Object}
 * @property {Object} body - Request body object.
 * @property {string} body.id - ID of the item to which the comment is being added (required).
 * @property {string} body.comment - The comment content (required).
 * @property {string} body.userId - ID of the user adding the comment (required).
 */
const addComment = {
  body: Joi.object().keys({
    id: Joi.string().required(),
    comment: Joi.string().required(),
    userId: Joi.string().required(),
  }),
};
/**
 * Validation schema for getting comments.
 * @type {Object}
 * @property {Object} params - URL parameters object.
 * @property {string} params.baselineId - ID of the item for which comments are being retrieved (required).
 */
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
  getComments,
  projectSchedule,
};
