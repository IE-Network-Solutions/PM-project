const httpStatus = require('http-status');
const { Baseline, Task, Subtask } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');

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
 * @param {Object} BaselineBody
 * @returns {Promise<Project>}
 */
const createBaseline = async (baselineBody, tasks) => {
  const baseline = baselineRepository.create(baselineBody);
  await baselineRepository.save(baseline);

  console.log(tasks);

  if (tasks) {
    const taskInstances = tasks.map(async (eachTask) => {
      const subTasks = eachTask.subtasks || [];
      const taskInstance = taskRepository.create({
        baselineId: baseline.id,
        name: eachTask.name,
        plannedStart: eachTask.plannedStart,
        plannedFinish: eachTask.plannedFinish,
        // plannedCost: eachTask.plannedCost,
        // actualCost: eachTask.actualCost,
        status: eachTask.status,
        sleepingReason: eachTask.sleepingReason,
        subTasks: subTasks, // Store subtasks in the task instance
      });

      const savedTaskInstance = await taskRepository.save(taskInstance);

      // Create and save subtasks
      if (subTasks.length > 0) {
        const subTaskInstances = subTasks.map((eachSubTask) => {
          return subTaskRepository.create({
            taskId: savedTaskInstance.id, // Use the saved task's ID
            name: eachSubTask.name,
            plannedStart: eachSubTask.plannedStart,
            plannedFinish: eachSubTask.plannedFinish,
            // plannedCost: eachSubTask.plannedCost,
            // actualCost: eachSubTask.actualCost,
            status: eachSubTask.status,
            sleepingReason: eachSubTask.sleepingReason,
          });
        });

         await subTaskRepository.save(subTaskInstances);
      }

      return savedTaskInstance;
    });

    // Save the task instances
    const savedTaskInstances = await Promise.all(taskInstances);
    
     baseline.tasks = savedTaskInstances;
    return baseline;
  }
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

const getBaselines = async (filter, options) => {
  const { limit, page, sortBy } = options;
  return await baselineRepository.findAll({
    tableName: 'baselines',
    sortOptions: sortBy&&{ option: sortBy },
    paginationOptions: { limit: limit, page: page },
  });
};

/**
 * Get post by id
 * @param {ObjectId} id
 * @returns {Promise<Baseline>}
 */
const getBaseline = async (milestoneId) => {
  return await baselineRepository.findOne({ 
    where: {id: milestoneId},
    relations: ['task.subtasks',]
  });
};

const getByMilestone = async (milestoneId) => {
  return await baselineRepository.findBy({ milestoneId: milestoneId,
  });
};

/**
 * Update user by id
 * @param {ObjectId} baselineId
 * @param {Object} updateBody
 * @returns {Promise<Project>}
 */
const updateBaseline = async (baselineId, updateBody) => {
  const baseline = await getBaseline(baselineId);
  if (!baseline) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Baseline not found');
  }
  await baselineRepository.update({ id: baselineId }, updateBody);
  return await getBaseline(baselineId);
};

/**
 * Delete user by id
 * @param {ObjectId} milestoneId
 * @returns {Promise<User>}
 */
const deleteBaseline = async (baselineId) => {
  const baseline = await getBaseline(baselineId);
  if (!baseline) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Baseline not found');
  }
  return await baselineRepository.delete({ id: baselineId });
};

module.exports = {
  createBaseline,
  getBaselines,
  getBaseline,
  getByMilestone,
  updateBaseline,
  deleteBaseline,
};
