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


// .extend({ sortBy });
//

/**
 * Create a user
 * @param {Object} resourceBody
 * @returns {Promise<Project>}
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
 * Get resourcehistory by projectid
 * @param {ObjectId} id
 * @returns {Promise<Action>}
 */
const getResourceHistoryByProjectId = async (id) => {

    return await resourceHistoryRepository.find(
        {
            where: { projectId: id },
            relations: ['project','user','task']
        });
};


/**
 * Get resourcehistory by taskid
 * @param {ObjectId} id
 * @returns {Promise<Action>}
 */
const getResourceHistoryByTaskId = async (id) => {
    return await resourceHistoryRepository.find(
        {
            where: { taskId: id },
            relations: ['project','user','task']
        });
};
const getResourceHistoryByUserId = async (id) => {
  
  return await resourceHistoryRepository.find(
      {
          where: { userId: id },
          relations: ['project','user','task']
      });
};

/**
 * Query for resourcehistory
 * @param {Object} filter - Filter options
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
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