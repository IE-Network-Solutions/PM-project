const httpStatus = require('http-status');
const { ResourceHistory } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');

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
  const resource = resourceHistoryRepository.create(resourceBody);
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
    getAllResourceHistory
    
  };