const httpStatus = require('http-status');
const { Milestone, Task, Subtask } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');

const milestoneRepository = dataSource.getRepository(Milestone).extend({
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

// .extend({ sortBy });
//

/**
 * Create a user
 * @param {Object} milestoneBody
 * @returns {Promise<Project>}
 */
const createMilestone = async (milestoneBody, tasks, subTasks) => {
  const milestone = milestoneRepository.create(milestoneBody);
  //save milestone instance
  await milestoneRepository.save(milestone);

  if (tasks) {
    const taskInstances = tasks.map((eachTasks) => {
      return taskRepository.create({
        milestoneId: milestone.id,
        name: eachTasks.name,
        plannedCost: eachTasks.plannedCost,
        actualCost: eachTasks.actualCost,
        status: eachTasks.status,
        sleepingReason: eachTasks.sleepingReason,
      });
    });

    // Save the project member instances
    await taskRepository.save(taskInstances);


    if(subTasks){
      const subTaskInstance = subTasks.map((eachSubTasks) => {
        return subTaskRepository.create({
          taskId: tasks.id,
          name: eachSubTasks.name,
          plannedCost: eachSubTasks.plannedCost,
          actualCost: eachSubTasks.actualCost,
          status: eachSubTasks.status,
          sleepingReason: eachSubTasks.sleepingReason,
        });
      });

      console.log(subTaskInstance);
          // Save the subtask instances
      await subTaskRepository.save(subTaskInstance);
    }

  }
  milestone.tasks = tasks;
  return milestone;
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
  return await milestoneRepository.delete({ id: milestoneId });
};

module.exports = {
  createMilestone,
  getMilestones,
  getMilestone,
  updateMilestone,
  deleteMilestone,
};
