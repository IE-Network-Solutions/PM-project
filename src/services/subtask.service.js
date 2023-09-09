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

// .extend({ sortBy });
//

/**
 * Create a user
 * @param {Object} subTaskBody
 * @returns {Promise<Project>}
 */
const createSubTask = async (subTaskBody) => {
  const subtask = subTaskRepository.create(subTaskBody);
  return await subTaskRepository.save(subtask);
};


/**
 * Query for users
 * @param {Object} filter - Filter options
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
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
 * Get post by id
 * @param {ObjectId} id
 * @returns {Promise<Project>}
 */
const getSubTask = async (id) => {
  return await subTaskRepository.findOneBy({ id: id });
};

/**
 * Update user by id
 * @param {ObjectId} subTaskId
 * @param {Object} updateBody
 * @returns {Promise<Project>}
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
 * Delete user by id
 * @param {ObjectId} taskId
 * @returns {Promise<User>}
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
