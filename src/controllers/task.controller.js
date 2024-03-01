const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { taskService, userService, projectService } = require('../services');
/**
 * @module task
 */
/**
 * Creates a new task.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the created task.
 */
const createTask = catchAsync(async (req, res) => {
  const task = await taskService.createTask(req.body);
  res.status(httpStatus.CREATED).send(task);
});
/**
 * Retrieves tasks based on the provided filter and options.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the retrieved tasks.
 */
const getTasks = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await taskService.getTasks(filter, options);
  res.send(result);
});
/**
 * Extends tasks based on the provided baseline ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the extended tasks.
 */
const extendTasks = catchAsync(async (req, res) => {
  console.log(req.params.baselineId, 'baseline id');
  const extendTasks = await taskService.extendTasks(req.params.baselineId);
  res.send(extendTasks);
});


/**
 * Retrieves tasks by milestone ID, filtered by the provided options.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the retrieved tasks.
 */
const getTasksByMileston = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const task = await taskService.getTasksByMileston(req.params.projectId, filter, options);
  res.send(task);
});

/**
 * Retrieves a task by its ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the retrieved task.
 * @throws {ApiError} If the task with the provided ID is not found.
 */

const getTask = catchAsync(async (req, res) => {
  const task = await taskService.getTask(req.params.taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  res.send(task);
});
/**
 * Updates a task by its ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the updated task.
 */

const updateTask = catchAsync(async (req, res) => {
  const task = await taskService.updateTask(req.params.taskId, req.body);
  res.send(task);
});
/**
 * Deletes a task by its ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves after deleting the task.
 */

const deleteTask = catchAsync(async (req, res) => {
  await taskService.deleteTask(req.params.taskId);
  res.status(httpStatus.NO_CONTENT).send();
});
/**
 * Assigns resource(s) to a task.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the assigned user(s).
 */
const assignResource = catchAsync(async (req, res) => {
  const taskId = req.body.taskId;
  const userIds = req.body.userIds;
  const assinedUsers = await taskService.assignResource(taskId, userIds);
  res.send(assinedUsers);
});

/**
 * Assigns all resources to a task.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the assigned user(s).
 */
const assignAllResource = catchAsync(async (req, res) => {
  console.log(req.body);
  const assinedUsers = await taskService.assignAllResource(req.body);
  res.send(assinedUsers);
});
/**
 * Removes a resource from a task by user ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves after removing the user from the task.
 */
const removeResource = catchAsync(async (req, res) => {
  const taskId = req.params.id;
  const userId = req.body.userId;
  const task = await taskService.getTask(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  const user = await userService.getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const removeUser = await taskService.removeResource(taskId, userId);
  res.send(removeUser);
});
/**
 * Retrieves tasks by project ID and planned start date within the specified range.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the retrieved tasks.
 */
const getTasksByPlandStartDate = catchAsync(async (req, res) => {
  const projectId = req.params.projectId;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  const project = await projectService.getProject(req.body.projectId);
  if (!project) {
    throw ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  const tasks = await taskService.filterTaskByPlanedDate(projectId, startDate, endDate);
  res.send(tasks);
});




const getActiveBaselineTasks = catchAsync(async (req, res) => {
  const projectId = req.params.projectId
  const tasks = await taskService.activeBaselineTasks(projectId)
  res.send(tasks);
});
module.exports = {
  createTask,
  getTasks,
  extendTasks,
  getTask,
  updateTask,
  deleteTask,
  getTasksByMileston,
  assignResource,
  removeResource,
  getTasksByPlandStartDate,
  assignAllResource,
  getActiveBaselineTasks
};
