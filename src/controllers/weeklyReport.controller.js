const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { weeklyReportService } = require('../services');
/**
 * @module weeklyReport
*/
/**
 * Retrieves all active baseline tasks for a project.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the retrieved tasks.
 */
const allTasks = catchAsync(async (req, res) => {
  const project = await weeklyReportService.allActiveBaselineTasks(req.params.projectId);
  res.send(project);
});
/**
 * Retrieves the weekly report for a project.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the retrieved weekly report.
 */
const weeklyReport = catchAsync(async (req, res) => {
  const project = await weeklyReportService.getWeeklyReport(req.params.projectId);
  res.send(project);
});
/**
 * Adds a sleeping reason to tasks in the weekly report.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the updated tasks.
 */
const addSleepingReason = catchAsync(async (req, res) => {
  const updatedTasks = await weeklyReportService.addSleepingReason(req.body);
  res.send(updatedTasks);
});
/**
 * Adds a weekly report for a project.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the added weekly report.
 */
const addWeeklyReport = catchAsync(async (req, res) => {
  const weeklyReport = await weeklyReportService.addWeeklyReport(req.params.projectId, req.body);
  res.status(httpStatus.CREATED).send(weeklyReport);
});

/**
 * Retrieves the added weekly report for a project.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the retrieved weekly report.
 */
const getAddedWeeklyReport = catchAsync(async (req, res) => {
  const savedWeeklyReport = await weeklyReportService.getAddedWeeklyReport(req.params.projectId);
  res.send(savedWeeklyReport);
});
/**
 * Retrieves the weekly report for a project by week number.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the retrieved weekly report.
 */
const getReportByWeek = catchAsync(async (req, res) => {
  const reportByWeek = await weeklyReportService.getReportByWeek(req.params.projectId, req.params.week);
  res.send(reportByWeek);
});
/**
 * Adds a comment to a weekly report.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the added comment.
 */
const addComment = catchAsync(async (req, res) => {
  const weeklyReportComment = await weeklyReportService.addComment(req.body);
  res.status(httpStatus.CREATED).send(weeklyReportComment);
});
/**
 * Retrieves comments for a weekly report by its ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the retrieved comments.
 */
const getComments = catchAsync(async (req, res) => {
  const weeklyReportComment = await weeklyReportService.getComments(req.params.weeklyReportId);
  res.send(weeklyReportComment);
});

const deleteWeeklyReport = catchAsync(async (req, res) => {
  const weeklyReportComment = await weeklyReportService.deleteWeeklyReport(req.params.weeklyReportId);
  res.send(weeklyReportComment);
});


module.exports = {
  weeklyReport,
  addSleepingReason,
  allTasks,
  addWeeklyReport,
  getAddedWeeklyReport,
  getReportByWeek,
  addComment,
  getComments,
  deleteWeeklyReport
};
