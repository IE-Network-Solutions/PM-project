const httpStatus = require('http-status');
const { Baseline, Task, Subtask, Milestone, baselineComment, User } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const { all } = require('../routes/v1');

const baselineRepository = dataSource.getRepository(Baseline).extend({
  findAll,
  sortBy,
});
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
const baselineCommentRepository = dataSource.getRepository(baselineComment).extend({
  findAll,
  sortBy,
});
const userRepository = dataSource.getRepository(User).extend({
  findAll,
  sortBy,
});


/**
 * Create a user
 * @param {Object} BaselineBody
 * @returns {Promise<Project>}
 */
const createBaseline = async (baselineBody, tasks) => {

  if (baselineBody) {
    const lastActiveBaseline = await baselineRepository.findOne({
      where: {
        milestoneId: baselineBody.milestoneId,
        status: true
      }
    });
  
    if (lastActiveBaseline) {
      await baselineRepository.update(lastActiveBaseline.id, { status: false });
    }
  }

  const baseline = baselineRepository.create(baselineBody);
  const savedBaseline = await baselineRepository.save(baseline);
  
  

  if (tasks) {
    const taskInstances = tasks.map(async (eachTask) => {
      const subTasks = eachTask.subtasks || [];
      const taskInstance = taskRepository.create({
        baselineId: baseline.id,
        name: eachTask.name,
        plannedStart: eachTask.plannedStart,
        plannedFinish: eachTask.plannedFinish,
        actualStart: eachTask.actualStart,
        actualFinish: eachTask.actualFinish,
        completion: eachTask.completion,
        status: eachTask.status,
        sleepingReason: eachTask.sleepingReason,
        subTasks: subTasks,
      });

      const savedTaskInstance = await taskRepository.save(taskInstance);

      // Create and save subtasks
      if (subTasks.length > 0) {
        const subTaskInstances = subTasks.map((eachSubTask) => {
          return subTaskRepository.create({
            taskId: savedTaskInstance.id,
            name: eachSubTask.name,
            plannedStart: eachSubTask.plannedStart,
            plannedFinish: eachSubTask.plannedFinish,
            actualStart: eachTask.actualStart,
            actualFinish: eachTask.actualFinish,
            completion: eachTask.completion,
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
  }
  return baseline;
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
    sortOptions: sortBy && { option: sortBy },
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
    where: { id: milestoneId },
    relations: ['tasks.subtasks',]
  });
};

const getByMilestone = async (milestoneId) => {
  return await baselineRepository.findBy({
    milestoneId: milestoneId,
  });
};

/**
 * Update user by id
 * @param {ObjectId} baselineId
 * @param {Object} updateBody
 * @returns {Promise<Project>}
 */
const updateBaseline = async (baselineId, baselineBody, tasksBody) => {

  if (baselineBody) {
  await baselineRepository.update({ id: baselineId }, {name: baselineBody.name});
  }


  if (tasksBody) {
    for (const taskBody of tasksBody) {
      const requestedTask = taskBody;
  
      if (requestedTask.id) {
        const subTasks = taskBody.subtasks || [];
  
        // Update the main task
        await taskRepository.update({ id: requestedTask.id }, {
          name: requestedTask.name,
          status: requestedTask.status,
          sleepingReason: requestedTask.sleepingReason,
          plannedStart: requestedTask.plannedStart,
          plannedFinish: requestedTask.plannedFinish,
          actualStart: requestedTask.actualStart,
          actualFinish: requestedTask.actualFinish,
          completion: requestedTask.completion,
          subTasks: requestedTask.subTasks,
        });
  
        // Create and save subtasks
        if (subTasks.length > 0) {
          const subTaskInstances = subTasks.map((eachSubTask) => ({
            taskId: requestedTask.id, // Use the taskId of the main task
            name: eachSubTask.name,
            plannedStart: eachSubTask.plannedStart,
            plannedFinish: eachSubTask.plannedFinish,
            actualStart: eachSubTask.actualStart,
            actualFinish: eachSubTask.actualFinish,
            completion: eachSubTask.completion,
            status: eachSubTask.status,
            sleepingReason: eachSubTask.sleepingReason,
          }));
          await subTaskRepository.save(subTaskInstances);
        }
      } else {
        const subTasks = taskBody.subtasks || [];
        const createTask = taskRepository.create({
          baselineId: baselineId,
          name: requestedTask.name,
          status: requestedTask.status,
          sleepingReason: requestedTask.sleepingReason,
          plannedStart: requestedTask.plannedStart,
          plannedFinish: requestedTask.plannedFinish,
          actualStart: requestedTask.actualStart,
          actualFinish: requestedTask.actualFinish,
          completion: requestedTask.completion,
          subTasks: requestedTask.subTasks,
        });
        const savedTask = await taskRepository.save(createTask);
  
        // Create and save subtasks
        if (subTasks.length > 0) {
          const subTaskInstances = subTasks.map((eachSubTask) => ({
            taskId: savedTask.id, // Use the taskId of the newly created task
            name: eachSubTask.name,
            plannedStart: eachSubTask.plannedStart,
            plannedFinish: eachSubTask.plannedFinish,
            actualStart: eachSubTask.actualStart,
            actualFinish: eachSubTask.actualFinish,
            completion: eachSubTask.completion,
            status: eachSubTask.status,
            sleepingReason: eachSubTask.sleepingReason,
          }));
          await subTaskRepository.save(subTaskInstances);
        }
      }
    }
  }
  
return baselineBody;
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

const addComment = async (baselineBody) => {
  const baselineComment = baselineCommentRepository.create({
    baselineId: baselineBody.id,
    userId: baselineBody.userId,
    comment: baselineBody.comment,
  });

  const savedComment = await baselineCommentRepository.save(baselineComment);
  const sender = await userRepository.findOne({
    where : {
      id: savedComment.userId
    }
  }
  );

  savedComment.user = sender;
  return savedComment;
}

const getComments = async(baselineId) =>{

  return await baselineCommentRepository.find(
    {
      where:{baselineId: baselineId, },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    }
  );
}

module.exports = {
  createBaseline,
  getBaselines,
  getBaseline,
  getByMilestone,
  updateBaseline,
  deleteBaseline,
  addComment,
  getComments
};
