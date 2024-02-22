const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { milestoneService, projectService } = require('../services');
/**
 * @module milestone
 */
/**
 * Creates a milestone.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the created milestone.
 */
const createMilestone = catchAsync(async (req, res) => {
  // const Tasks = req.body.tasks;
  // const subTasks = req.body.subTasks;
  // delete req.body.Tasks;
  // delete req.body.subTasks;
  const milestone = await milestoneService.createMilestone(req.body);
  res.status(httpStatus.CREATED).json(milestone);
});
/**
 * Retrieves milestones based on the provided filter and options.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the retrieved milestones.
 */
const getMilestones = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const milestone = await milestoneService.getMilestones(filter, options)
  res.send(milestone);
});
/**
 * Retrieves a milestone by its ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the milestone corresponding to the provided ID.
 * @throws {ApiError} If the milestone with the provided ID is not found.
 */
const getMilestone = catchAsync(async (req, res) => {
  const milestone = await milestoneService.getMilestone(req.params.milestoneId);
  if (!milestone) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Milestone not found');
  }
  res.send(milestone);
});
/**
 * Retrieves milestones by project ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the milestones associated with the provided project ID.
 */
const getByProject = catchAsync(async (req, res) => {
  const projectMilestone = await milestoneService.getByProject(req.params.projectId);
  res.send(projectMilestone);
});


/**
 * Updates a milestone by its ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the updated milestone.
 */
const updateMilestone = catchAsync(async (req, res) => {
  const milestone = await milestoneService.updateMilestone(req.params.milestoneId, req.body);
  res.send(milestone);
});
/**
 * Updates multiple milestones' variance by their IDs and data provided.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the updated milestones' variance.
 */
const updateMilestoneVariance = catchAsync(async (req, res) => {
  const milestones = await Promise.all(req.body.map(async (element) => {
    const milestone = milestoneService.updateMilestone(element.id, element);
    return milestone;


  }));

  res.send(milestones);
});
/**
 * Deletes a milestone by its ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves after deleting the milestone.
 */
const deleteMilestone = catchAsync(async (req, res) => {
  await milestoneService.deleteMilestone(req.params.milestoneId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createMilestone,
  getMilestones,
  getByProject,
  getMilestone,
  updateMilestone,
  deleteMilestone,
  updateMilestoneVariance
};
