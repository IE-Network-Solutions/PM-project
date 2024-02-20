const httpStatus = require('http-status');
const { ResourceHistory } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const { taskService, baselineService, milestoneService } = require('.');

const resourceHistoryRepository = dataSource.getRepository(ResourceHistory).extend({
  findAll,
  sortBy,
});
/**
 * @module resourcehistory
 */
/**
 * Creates a resource history entry by saving the given data.
 *
 * @function
 * @param {Object} resourceBody - Data representing the resource history.
 *   - {number} taskId - The ID of the task associated with this resource history.
 *   - {number} baselineId - The ID of the baseline associated with this resource history.
 *   - {number} milestoneId - The ID of the milestone associated with this resource history.
 *   - {number} projectId - The ID of the project associated with this resource history.
 *   - ... // Specify other properties and their descriptions
 * @returns {Promise<Object>} - A promise that resolves to the saved resource history entry.
 */
const createResourceHistory = async (resourceBody) => {
  const task = await taskService.getTask(resourceBody.taskId);
  const baseline = await baselineService.getBaseline(task.baselineId)
  const milestone = await milestoneService.getMilestone(baseline.milestoneId)
  resourceBody.projectId = milestone.projectId
  const resource = resourceHistoryRepository.create(resourceBody)
  return await resourceHistoryRepository.save(resource);
};
/**
 * Retrieves resource history entries associated with a specific project.
 *
 * @function
 * @param {number} id - The unique identifier of the project to retrieve resource history for.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of resource history entries.
 */
const getResourceHistoryByProjectId = async (id) => {

    return await resourceHistoryRepository.find(
        {
            where: { projectId: id },
            relations: ['project','user','task']
        });
};
/**
 * Retrieves resource history entries associated with a specific task.
 *
 * @function
 * @param {number} id - The unique identifier of the task to retrieve resource history for.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of resource history entries.
 *   Each entry represents a historical record of resource usage or changes related to the task.
 */
const getResourceHistoryByTaskId = async (id) => {
    return await resourceHistoryRepository.find(
        {
            where: { taskId: id },
            relations: ['project','user','task']
        });
};
/**
 * Retrieves resource history entries associated with a specific user.
 *
 * @function
 * @param {number} id - The unique identifier of the user to retrieve resource history for.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of resource history entries.
 *   Each entry represents a historical record related to the user's resource usage or changes.
 */
const getResourceHistoryByUserId = async (id) => {

  return await resourceHistoryRepository.find(
      {
          where: { userId: id },
          relations: ['project','user','task']
      });
};
/**
 * Retrieves resource history entries based on the provided filter and options.
 *
 * @function
 * @param {Object} filter - An object containing filter criteria for resource history retrieval.
 * @param {Object} options - Additional options for querying resource history.
 *   - {number} limit - Maximum number of results to retrieve.
 *   - {number} page - Page number for pagination.
 *   - {string} sortBy - Field to sort the results by (e.g., 'createdAt', 'updatedAt').
 * @returns {Promise<Object[]>} - A promise that resolves to an array of resource history entries.
 *   Each entry represents a historical record related to resource usage or changes.
 */
const getAllResourceHistory = async (filter, options) => {
  const { limit, page, sortBy } = options;

  return await resourceHistoryRepository.find({
    tableName: 'resourcehistories',
    sortOptions: sortBy && { option: sortBy },
    paginationOptions: { limit: limit, page: page },
    relations: ['project','user','task']
  });
};
module.exports = {
    createResourceHistory,
    getResourceHistoryByProjectId,
    getResourceHistoryByTaskId,
    getAllResourceHistory,
    getResourceHistoryByUserId

  };
