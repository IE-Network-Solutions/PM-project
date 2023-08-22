const httpStatus = require('http-status');
const { Task, TaskUser } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const services = require('./index');

const taskRepository = dataSource.getRepository(Task).extend({
  findAll,
  sortBy,
});

const taskUserRepository = dataSource.getRepository(TaskUser).extend({
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
    sortOptions: sortBy && { option: sortBy },
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

/**
 * Assign Resoure to the task
 * @param {String} taskId
 * @param {Array} usersId
 * @returns {Promise<User>}
 */
const assignResource = async (taskId, userIds) => {
  const task = await getTask(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  console.log(userIds, 'testttttt');
  const users = await services.userService.getUsersById(userIds);
  if (!users) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Users not found');
  }

  const taskUsers = users.map((user) => {
    const taskUser = taskUserRepository.create({
      task: task,
      user,
    });
    return taskUser;
  });
  await taskUserRepository.save(taskUsers);
  return taskUsers;
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  assignResource,
};
