const httpStatus = require('http-status');
const { Task, Subtask } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');

const subTaskRepository = dataSource.getRepository(Subtask).extend({
  findAll,
  sortBy,
});

/**
 * @module subtask
 */
/**
 * Creates a subtask asynchronously.
 * @function
 * @param {Object} subTaskBody - The subtask data to be created.
 * @returns {Promise<Object>} - A promise that resolves to the saved subtask.
 */
const createSubTask = async (subTaskBody) => {
  const subtask = subTaskRepository.create(subTaskBody);
  return await subTaskRepository.save(subtask);
};
/**
 * Retrieves subtasks asynchronously based on the provided filter and options.
 * @function
 * @param {Object} filter - The filter criteria for subtask retrieval.
 * @param {Object} options - Additional options for pagination and sorting.
 * @param {number} options.limit - The maximum number of subtasks to retrieve.
 * @param {number} options.page - The page number for pagination.
 * @param {string} options.sortBy - The field to sort subtasks by (e.g., 'createdAt', 'updatedAt').
 * @returns {Promise<Object[]>} - A promise that resolves to an array of subtasks.
 */
const getSubTasks = async (filter, options) => {
  const { limit, page, sortBy } = options;

  return await subTaskRepository.findAll({
    tableName: 'subtasks',
    sortOptions: sortBy&&{ option: sortBy },
    paginationOptions: { limit: limit, page: page },
  });
};
/**
 * Retrieves a subtask from the repository by its ID.
 * @function
 * @param {string} id - The ID of the subtask to retrieve.
 * @returns {Promise<Object|null>} A Promise that resolves with the subtask object if found, or null if not found.
 */
const getSubTask = async (id) => {
  return await subTaskRepository.findOneBy({ id: id });
};
/**
 * Updates a subtask with the specified ID using the provided update body.
 * @function
 * @param {string} subTaskId - The ID of the subtask to update.
 * @param {Object} updateBody - The data to update the subtask with.
 * @returns {Promise<Object>} A Promise that resolves with the updated subtask object.
 * @throws {ApiError} If the subtask with the specified ID is not found.
 */
const updateSubTask = async (subTaskId, updateBody) => {
  const subtask = await getSubTask(subTaskId);
  if (!subtask) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sub Task not found');
  }
  await subTaskRepository.update({ id: subTaskId }, updateBody);
  return await getSubTask(subTaskId);
};
/**
 * Deletes a subtask with the specified ID.
 * @function
 * @param {string} subTaskId - The ID of the subtask to delete.
 * @returns {Promise<void>} A Promise that resolves once the subtask is deleted.
 * @throws {ApiError} If the subtask with the specified ID is not found.
 */
const deleteSubTask = async (subTaskId) => {
  const subtask = await getSubTask(subTaskId);
  if (!subtask) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subtask not found');
  }
  return await subTaskRepository.delete({ id: subTaskId });
};

module.exports = {
  createSubTask,
  getSubTasks,
  getSubTask,
  updateSubTask,
  deleteSubTask,
};
