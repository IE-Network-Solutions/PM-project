const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { baselineService, projectService } = require('../services');
/**
 * @module baseline
 */
/**
 * Creates a new baseline.
 * @function
 * @param {Object} req - The request object containing baseline data.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves once the baseline is created.
 */

const createBaseline = catchAsync(async (req, res) => {

  const milestones = req.body.milestones;
  // const subTasks = req.body.subTasks;
  //delete req.body.milestones;
  // delete req.body.subTasks;
  const baseline = await baselineService.createBaseline(req.body, milestones);

  res.status(httpStatus.CREATED).json(baseline);
});
/**
 * Retrieves all baselines based on the provided filter and options.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with all baselines.
 */

const getBaselines = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const baseline = await baselineService.getBaselines(filter, options);
  res.send(baseline);
});
/**
 * Retrieves a baseline by its ID.
 * @function
 * @param {Object} req - The request object containing the baseline ID.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the baseline data.
 */

const getBaseline = catchAsync(async (req, res) => {
  const baseline = await baselineService.getBaseline(req.params.baselineId);
  if (!baseline) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Baseline not found');
  }
  res.send(baseline);
});
/**
 * Retrieves baselines by milestone ID.
 * @function
 * @param {Object} req - The request object containing the milestone ID.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with baselines associated with the milestone.
 */

const getByMilestone = catchAsync(async (req, res) => {
  const milestoneBaseline = await baselineService.getByMilestone(req.params.milestoneId);
  res.send(milestoneBaseline);
});
/**
 * Updates a baseline by its ID.
 * @function
 * @param {Object} req - The request object containing the baseline ID and updated data.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the updated baseline data.
 */

const updateBaseline = catchAsync(async (req, res) => {
  const baseline = await baselineService.updateBaseline(req.params.baselineId, req.body, req.body.milestones);
  delete req.body.milestones;
  res.send(baseline);
});
/**
 * Deletes a baseline by its ID.
 * @function
 * @param {Object} req - The request object containing the baseline ID.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves once the baseline is deleted.
 */

const deleteBaseline = catchAsync(async (req, res) => {
  await baselineService.deleteBaseline(req.params.baselineId);
  res.status(httpStatus.NO_CONTENT).send();
});
/**
 * Retrieves comments associated with a baseline.
 * @function
 * @param {Object} req - The request object containing the baseline ID.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the comments associated with the baseline.
 */

const addComment = catchAsync(async (req, res) => {
  const baselineComment = await baselineService.addComment(req.body);
  res.status(httpStatus.CREATED).send(baselineComment);
});
/**
 * Retrieves comments associated with a baseline.
 * @function
 * @param {Object} req - The request object containing the baseline ID.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the comments associated with the baseline.
 */

const getComments = catchAsync(async (req, res) => {
  const baselineComment = await baselineService.getComments(req.params.baselineId);
  res.send(baselineComment);
});
/**
 * Retrieves the master schedule.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the master schedule.
 */

const masterSchedule = catchAsync(async (req, res) => {
  const masterSchedule = await baselineService.masterSchedule();
  res.send(masterSchedule);
});
/**
 * Retrieves the master schedule based on date filters.
 * @function
 * @param {Object} req - The request object containing the start and finish dates.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the master schedule filtered by date.
 */

const masterScheduleByDateFilter = catchAsync(async (req, res) => {
  const masterSchedule = await baselineService.masterScheduleByDateFilter(req.query.startDate, req.query.finsihDate);
  res.send(masterSchedule);
});
/**
 * Retrieves the project schedule.
 * @function
 * @param {Object} req - The request object containing the project ID.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the project schedule.
 */

const projectSchedule = catchAsync(async (req, res) => {
  const projectId = req.params.projectId;
  const project = await projectService.getProject(projectId)
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, ' Project doesnt exist');
  }
  const projectSchedule = await baselineService.projectSchedule(projectId);
  res.send(projectSchedule);
});
/**
 * Retrieves the active project schedule.
 * @function
 * @param {Object} req - The request object containing the project ID.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the active project schedule.
 */

const activeProjectSchedule = catchAsync(async (req, res) => {
  const projectId = req.params.projectId;
  const projectSchedule = await baselineService.activeProjectSchedule(projectId);
  res.send(projectSchedule);
});
/**
 * Retrieves the schedule dashboard for a project.
 * @function
 * @param {Object} req - The request object containing the project ID.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the schedule dashboard for the project.
 */

const scheduleDashboard = catchAsync(async (req, res) => {
  const projectId = req.params.projectId;
  const projectSchedule = await baselineService.scheduleDashboard(projectId);
  res.send(projectSchedule);
});
const uploadBaseline = catchAsync(async (req, res) => {

  const projectId = req.params.projectId;
  const projectSchedule = await baselineService.uploadBaseline(projectId, req.body);
  res.send(projectSchedule);
});

module.exports = {
  createBaseline,
  getBaselines,
  getBaseline,
  getByMilestone,
  updateBaseline,
  deleteBaseline,
  addComment,
  getComments,
  masterSchedule,
  projectSchedule,
  activeProjectSchedule,
  masterScheduleByDateFilter,
  scheduleDashboard,
  uploadBaseline

};
