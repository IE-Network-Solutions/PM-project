const Joi = require('joi');
const { objectId } = require('./custom.validation');
/**
 * @module task
 */
/**
 * Schema for creating a task.
 * @type {object}
 * @property {object} body - Request body.
 * @property {string} [body.name] - Name of the task.
 * @property {Date} [body.plannedStart] - Planned start date of the task.
 * @property {Date} [body.plannedFinish] - Planned finish date of the task.
 * @property {Date} [body.actualStart] - Actual start date of the task.
 * @property {Date} [body.actualFinish] - Actual finish date of the task.
 * @property {number} [body.plannedCost] - Planned cost of the task.
 * @property {number} [body.actualCost] - Actual cost of the task.
 * @property {boolean} [body.status] - Status of the task.
 * @property {string} [body.sleepingReason] - Reason for the task being in a sleeping state.
 * @property {string} body.milestoneId - ID of the milestone associated with the task (required).
 * @property {number} [body.completion] - Completion percentage of the task.
 * @property {array} [body.tasks] - Array of sub-tasks associated with the task.
 */
const createTask = {
  body: Joi.object().keys({
    name: Joi.string(),
    plannedStart: Joi.date(),
    plannedFinish: Joi.date(),
    actualStart: Joi.date(),
    actualFinish: Joi.date(),
    plannedCost: Joi.number(),
    actualCost: Joi.number(),
    status: Joi.boolean(),
    sleepingReason: Joi.string(),
    milestoneId: Joi.required(),
    completion: Joi.number(),
    tasks: Joi.array()
  }),
};
/**
 * Schema for querying tasks.
 * @type {object}
 * @property {object} query - Query parameters.
 * @property {string} query.sortBy - Field to sort by.
 * @property {number} query.limit - Maximum number of results to return per page (integer).
 * @property {number} query.page - Page number (integer).
 */
const getTasks = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

/**
 * Schema for querying tasks by milestone.
 * @type {object}
 * @property {object} query - Query parameters.
 * @property {string} query.sortBy - Field to sort by.
 * @property {number} query.limit - Maximum number of results to return per page (integer).
 * @property {number} query.page - Page number (integer).
 * @property {object} params - Path parameters.
 * @property {string} params.projectId - ID of the project to filter tasks by (required).
 */

const getTasksByMileston = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
  params: Joi.object().keys({
    projectId: Joi.string().required(),
  })
};

/**
 * Schema for getting a single task by ID.
 * @type {object}
 * @property {object} params - Path parameters.
 * @property {string} params.taskId - ID of the task.
 */
const getTask = {
  params: Joi.object().keys({
    taskId: Joi.string(),
  }),
};
/**
 * Schema for extending tasks.
 * @type {object}
 * @property {string} [baselineId] - ID of the baseline (optional).
 */
const extendTasks = {
  params: Joi.object().keys({
    baselineId: Joi.string(),
  }),
};
/**
 * Schema for updating a task.
 * @type {object}
 * @property {object} params - Path parameters.
 * @property {string} params.taskId - ID of the task.
 * @property {object} body - Request body.
 * @property {string} [body.name] - Name of the task.
 */
const updateTask = {
  params: Joi.object().keys({
    taskId: Joi.string(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
    })
    .min(1),
};
/**
 * Schema for deleting a task.
 * @type {object}
 * @property {object} params - Path parameters.
 * @property {string} params.taskId - ID of the task.
 */
const deleteTask = {
  params: Joi.object().keys({
    taskId: Joi.string(),
  }),
};
/**
 * Schema for assigning resources to a task.
 * @type {object}
 * @property {object} body - Request body.
 * @property {string} body.taskId - ID of the task to assign resources to (required).
 * @property {string[]} body.userIds - Array of user IDs to assign to the task (required).
 */
const assignResource = {
  body: Joi.object()
    .keys({
      taskId: Joi.string().guid().required(),
      userIds: Joi.array().items(Joi.string().guid()).required(),
    })
    .min(1),
};
/**
 * Schema for assigning resources to a task.
 * @type {object}
 * @property {string} taskId - ID of the task to which resources are being assigned (required, must be a GUID).
 * @property {string[]} userIds - Array of user IDs being assigned to the task (required).
 */
const assignResourceSchema = Joi.object({
  taskId: Joi.string().guid().required(),
  userIds: Joi.array().items(Joi.string()).required(),
});
/**
 * Schema for assigning resources to multiple tasks.
 * @type {object}
 * @property {object} body - Request body.
 * @property {object[]} body.resources - Array of objects containing taskId and userIds.
 * @property {string} body.resources[].taskId - ID of the task to assign resources to.
 * @property {string[]} body.resources[].userIds - Array of user IDs to assign to the task.
 */
const assignAllResource = {
  body: Joi.object().keys({
    resources: Joi.array().items(assignResourceSchema).required(),
  }),
};
/**
 * Schema for removing a resource from a task.
 * @type {object}
 * @property {object} params - Path parameters.
 * @property {string} params.taskId - ID of the task.
 * @property {object} body - Request body.
 * @property {string} body.userId - ID of the user to remove from the task (required).
 */
const removeResource = {
  params: Joi.object().keys({
    taskId: Joi.string(),
  }),
  body: Joi.object().keys({
    userId: Joi.string().guid().required(),
  }),
};

/**
 * Schema for getting tasks by planned date range.
 * @type {object}
 * @property {object} params - Path parameters.
 * @property {string} params.projectId - ID of the project to filter tasks by.
 * @property {object} query - Query parameters.
 * @property {Date} query.startDate - Start date of the planned date range (required).
 * @property {Date} query.endDate - End date of the planned date range (required).
 */
const getByPlnedDate = {
  params: Joi.object().keys({
    projectId: Joi.string(),
  }),
  query: Joi.object().keys({
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
  }),
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  getTasksByMileston,
  assignResource,
  removeResource,
  getByPlnedDate,
  assignAllResource,
  extendTasks
};
