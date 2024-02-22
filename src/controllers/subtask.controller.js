const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { subTaskService} = require('../services');
/**
 * @module subtask
 */
/**
 * Creates a new subtask.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the created subtask.
 */
const createSubTask = catchAsync(async (req, res) => {
const subtask = await subTaskService.createSubTask(req.body);
res.status(httpStatus.CREATED).send(subtask);
});

/**
 * Retrieves subtasks based on the provided filter and options.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the retrieved subtasks.
 */
const getSubTasks = catchAsync(async(req, res)=>{
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await subTaskService.getSubTasks(filter, options);
  res.send(result);
});
/**
 * Retrieves a subtask by its ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the retrieved subtask.
 * @throws {ApiError} If the subtask with the provided ID is not found.
 */
const getSubTask = catchAsync(async(req, res)=>{
  const subtask = await subTaskService.getSubTask(req.params.subTaskId);
  if (!subtask) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subtask not found');
  }
  res.send(subtask);
});
/**
 * Updates a subtask by its ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the updated subtask.
 */
const updateSubTask = catchAsync(async(req, res)=>{
  const subtask = await subTaskService.updateSubTask(req.params.subTaskId, req.body);
  res.send(subtask);

});
/**
 * Deletes a subtask by its ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves after deleting the subtask.
 */
const deleteSubTask = catchAsync(async(req, res)=>{
  await subTaskService.deleteSubTask(req.params.subTaskId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createSubTask,
  getSubTasks,
  getSubTask,
  updateSubTask,
  deleteSubTask,
};
