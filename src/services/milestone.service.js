const httpStatus = require('http-status');
const { Milestone, Task, Subtask, Baseline } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');

const milestoneRepository = dataSource.getRepository(Milestone).extend({
  findAll,
  sortBy,
});
const baselineRepository = dataSource.getRepository(Baseline).extend({
  findAll,
  sortBy,
});
const taskRepository = dataSource.getRepository(Task).extend({
  findAll,
  sortBy,
});
const subTaskRepository = dataSource.getRepository(Subtask).extend({
  findAll,
  sortBy,
});

/**
 * Create a user
 * @param {Object} milestoneBody
 * @returns {Promise<Project>}
 */
const createMilestone = async (milestoneBody) => {
  const milestone = milestoneRepository.create(milestoneBody);
 return await milestoneRepository.save(milestone);
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

const getMilestones = async (filter, options) => {
  const { limit, page, sortBy } = options;
  return await milestoneRepository.findAll({
    tableName: 'milestones',
    sortOptions: sortBy&&{ option: sortBy },
    paginationOptions: { limit: limit, page: page },
  });
};

/**
 * Get post by id
 * @param {ObjectId} id
 * @returns {Promise<Milestone>}
 */
const getMilestone = async (milestoenId) => {
  return await milestoneRepository.findOneBy({ id: milestoenId });
};

const getByProject = async (projectId) => {
  return await milestoneRepository.findBy({ projectId: projectId,});
};

/**
 * Update user by id
 * @param {ObjectId} milestoneId
 * @param {Object} updateBody
 * @returns {Promise<Project>}
 */
const updateMilestone = async (milestoneId, updateBody) => {
  const milestone = await getMilestone(milestoneId);
  if (!milestone) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Milestone not found');
  }
  await milestoneRepository.update({ id: milestoneId }, updateBody);
  return await getMilestone(milestoneId);
};

/**
 * Delete user by id
 * @param {ObjectId} milestoenId
 * @returns {Promise<User>}
 */

const deleteMilestone = async (milestoneId) => {
  const milestone = await getMilestone(milestoneId);
  if (!milestone) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Milestone not found');
  }

  return await milestoneRepository.delete({ id: milestoneId});
  //The following code is to cascade deleting baselines, 
  //tasks and subtasks when we delete milestone
    // const baselinesToDelete = await baselineRepository.find({ milestoneId: milestoneId });
    // for (const baseline of baselinesToDelete) {
    //       const tasksToDelete = await taskRepository.find({ baselineId: baseline.id });
    //       for (const task of tasksToDelete) {
    //       const subTasksToDelet = await subTaskRepository.find({ taskId: task.id });
    //       for (const subtask of subTasksToDelet) {
    //         await subTaskRepository.delete({ id: subtask.id });
    //       }
    //         await taskRepository.delete({ id: task.id });
    //       }
    //   await baselineRepository.delete({ id: baseline.id });
  // }

};

module.exports = {
  createMilestone,
  getMilestones,
  getMilestone,
  getByProject,
  updateMilestone,
  deleteMilestone,
};
