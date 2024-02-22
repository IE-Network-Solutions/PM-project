const Joi = require('joi');
const { objectId } = require('./custom.validation');
/**
 * @module weeklyReport
 */
/**
 * Schema for retrieving weekly report data.
 * @type {object}
 * @property {object} params - Path parameters.
 * @property {string} params.projectId - Project ID.
 */
const weeklyReport = {
  params: Joi.object().keys({
    projectId: Joi.string().required(),
  }),
};
/**
 * Schema for adding sleeping reasons to tasks.
 * @type {object}
 * @property {array} addSleepingReason - Array of sleeping reasons to be added.
 * @property {string} addSleepingReason[].id - ID of the task.
 * @property {string} addSleepingReason[].sleepingReason - Reason for sleeping.
 */
const sleepingTasks = Joi.object({
  addSleepingReason: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),

      sleepingReason: Joi.string().required(),
    })
  ),
});
/**
 * Schema for adding a weekly report.
 * @type {object}
 * @property {object} params - Path parameters.
 * @property {string} params.projectId - Project ID.
 */
const addWeeklyReport ={
  params: Joi.object().keys({
    projectId: Joi.string().required(),
  }),
}

/**
 * Schema for retrieving a saved weekly report.
 * @type {object}
 * @property {object} params - Path parameters.
 * @property {string} params.projectId - Project ID.
 */
const savedWeeklyReport ={
  params: Joi.object().keys({
    projectId: Joi.string().required(),
  }),
}
/**
 * Schema for retrieving a report by week.
 * @type {object}
 * @property {object} params - Path parameters.
 * @property {string} params.projectId - Project ID.
 * @property {string} params.week - Week number.
 */
const getReportByWeek ={
  params: Joi.object().keys({
    projectId: Joi.string().required(),
    week: Joi.string().required(),
  }),
}
/**
 * Schema for adding a comment.
 * @type {object}
 * @property {object} body - Request body.
 * @property {string} body.id - ID of the item.
 * @property {string} body.comment - Comment text.
 * @property {string} body.userId - ID of the user adding the comment.
 */
const addComment = {
  body: Joi.object().keys({
    id: Joi.string().required(),
    comment: Joi.string().required(),
    userId: Joi.string().required(),
  }),
};

module.exports = {
  weeklyReport,
  sleepingTasks,
  addWeeklyReport,
  savedWeeklyReport,
  getReportByWeek,
  addComment
};
