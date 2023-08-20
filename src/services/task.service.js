const httpStatus = require('http-status');
const { Task } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');

const taskRepository = dataSource.getRepository(Task).extend({
  findAll,
  sortBy,
});

// .extend({ sortBy });
//

/**
 * Create a user
 * @param {Object} taskBody
 * @returns {Promise<Project>}
 */
const createTask = async (taskBody) => {
  console.log(taskBody);
  const task = taskRepository.create(taskBody);
  return await taskRepository.save(task);
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

const getTasks = async (filter, options) => {
  const { limit, page, sortBy } = options;

  return await taskRepository.findAll({
    tableName: 'tasks',
    sortOptions: sortBy&&{ option: sortBy },
    paginationOptions: { limit: limit, page: page },
  });
};

/**
 * Get post by id
 * @param {ObjectId} id
 * @returns {Promise<Project>}
 */
const getTask = async (id) => {
  return await taskRepository.findOneBy({ id: id });
};

/**
 * Update user by id
 * @param {ObjectId} taskId
 * @param {Object} updateBody
 * @returns {Promise<Project>}
 */
const updateTask = async (taskId, updateBody) => {
  const task = await getTask(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  await taskRepository.update({ id: taskId }, updateBody);
  return await getTask(taskId);
};

/**
 * Delete user by id
 * @param {ObjectId} taskId
 * @returns {Promise<User>}
 */
const deleteTask = async (taskId) => {
  const task = await getTask(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  return await taskRepository.delete({ id: taskId });
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
};
