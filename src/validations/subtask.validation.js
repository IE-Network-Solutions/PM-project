const Joi = require('joi');
const { objectId } = require('./custom.validation');
/**
 * @module subtask
 */
/**
 * Schema for creating a subtask.
 * @type {object}
 * @property {object} body - Request body.
 * @property {string} [body.name] - Name of the subtask.
 * @property {Date} [body.plannedStart] - Planned start date of the subtask.
 * @property {Date} [body.plannedFinish] - Planned finish date of the subtask.
 * @property {Date} [body.actualStart] - Actual start date of the subtask.
 * @property {number} [body.actualFinish] - Actual finish date of the subtask.
 * @property {number} [body.plannedCost] - Planned cost of the subtask.
 * @property {number} [body.actualCost] - Actual cost of the subtask.
 * @property {string} [body.status] - Status of the subtask.
 * @property {string} [body.sleepingReason] - Reason for the subtask being in a sleeping state.
 */
const createSubTask = {
  body: Joi.object().keys({
    name: Joi.string(),
    plannedStart: Joi.date(),
    plannedFinish: Joi.date(),
    actualStart: Joi.date(),
    actualFinish: Joi.number(),
    plannedCost: Joi.number(),
    actualCost: Joi.number(),
    status: Joi.string(),
    sleepingReason: Joi.string(),
  }),
};
/**
 * Schema for querying subtasks.
 * @type {object}
 * @property {object} query - Query parameters.
 * @property {string} query.sortBy - Field to sort by.
 * @property {number} query.limit - Maximum number of results to return per page (integer).
 * @property {number} query.page - Page number (integer).
 */
const getSubTasks = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

/**
 * Schema for getting a single subtask by ID.
 * @type {object}
 * @property {object} params - Path parameters.
 * @property {string} params.subTaskId - ID of the subtask.
 */
const getSubTask = {
  params: Joi.object().keys({
    subTaskId: Joi.string()
  }),
};
/**
 * Schema for updating a subtask.
 * @type {object}
 * @property {object} params - Path parameters.
 * @property {string} params.subTaskId - ID of the subtask.
 * @property {object} body - Request body.
 * @property {string} [body.name] - Name of the subtask.
 */
const updateSubTask = {
  params: Joi.object().keys({
    subTaskId: Joi.string()
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
    })
    .min(1),
};

/**
 * Schema for deleting a subtask.
 * @type {object}
 * @property {object} params - Path parameters.
 * @property {string} params.subTaskId - ID of the subtask.
 */
const deleteSubTask= {
    params: Joi.object().keys({
      subTaskId: Joi.string(),
    }),
  };

module.exports = {
  createSubTask,
  getSubTasks,
  getSubTask,
  updateSubTask,
  deleteSubTask
};
