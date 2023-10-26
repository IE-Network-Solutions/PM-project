const { LessThan } = require('typeorm');
const httpStatus = require('http-status');
const { Task, TaskUser, Baseline } = require('../models');
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
const baselineRepository = dataSource.getRepository(Baseline).extend({
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

const extendTasks = async (baselineId) => {
  // const baseline = await baselineRepository.findOne({
  //   where: {
  //     id: baselineId,
  //   },
  //   relations: ['tasks.subtasks'],
  // });
  
  // if (baseline && baseline.tasks) {
  //   baseline.tasks = baseline.tasks.filter((task) => task.completion < 100);
  
  //   // Filter the subtasks with completion < 100 for each task
  //   baseline.tasks.forEach((task) => {
  //     task.subtasks = task.subtasks.filter((subtask) => subtask.completion < 100);
  //   });
  
  //   return baseline;
  // }


  const baselineData = await baselineRepository
  .createQueryBuilder('baselines')
  .leftJoinAndSelect('baselines.tasks', 'task')
  .leftJoinAndSelect('task.subtasks', 'subtask')
  .leftJoinAndSelect('task.milestone', 'milestone')
  .addSelect('baselines.*')
  .addSelect('task.*')
  .addSelect('subtask.*')
  .where('task.completion<100')
  .andWhere('baselines.id = :baselineId', { baselineId: baselineId })
  .getMany();

baselineData.forEach((base) => {
  const milestones = [];
  base.tasks.forEach((task) => {
    if (!milestones.some((m) => m.id === task.milestoneId)) {
      let taskMilestone=task.milestone
      milestones.push({...taskMilestone, "tasks":[]});
    }
    let mileInd=milestones.findIndex((m)=>m.id === task.milestoneId)
    milestones[mileInd].tasks.push(task)
  });
  delete base.tasks
  base.milestones=milestones
});

return baselineData;
};


/**
 * Get post by id
 * @param {ObjectId} id
 * @returns {Promise<Project>}
 */
const getTask = async (id) => {
  return await taskRepository.findOneBy({ id: id });
};

const getTasksByMileston = async (projectId, filter, options) => {
  const baseline = await baselineRepository.findOne({
    where: {
      projectId: projectId,
      status: true
    }
  });

  
 if(baseline){
  const { limit, page, sortBy } = options;
  return await taskRepository.find({
    where:{
      baselineId: baseline.id,
    },
    relations: ['resources'],
    sortOptions: sortBy && { option: sortBy },
    // paginationOptions: { limit: limit, page: page },
  });
 }
 else{
  return [];
 }
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

/**
 * Assign All Resoure to the task
 * @param {String} taskId
 * @param {Array} usersId
 * @returns {Promise<User>}
 */
const assignAllResource = async (resourceBody) => {
  let taskUsersData = [];
  for (const resource of resourceBody.resources) {
    const task = await getTask(resource.taskId);
    if (!task) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
    }
    const users = await services.userService.getUsersById(resource.userIds);
    if (!users) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Users not found');
    }
    let taskUsers = users.map((user) => {
      const taskUser = taskUserRepository.create({
        task: task,
        user,
      });
      return taskUser;
    });
    const data = await taskUserRepository.save(taskUsers);
    taskUsersData.push(data);
  }

  return taskUsersData;
};

/**
 * Remove Resoure from the task
 * @param {String} taskId
 * @param {Array} usersId
 * @returns {Promise<User>}
 */
const removeResource = async (taskId, userId) => {
  // Fetch the TaskResource entity representing the association
  const taskResource = await taskUserRepository.findOneBy({
    taskId: taskId,
    userId: userId,
  });

  if (!taskResource) {
    new AppError('relation not found', 404);
  }

  // Remove the TaskUser association from the database
  await taskUserRepository.remove(taskResource);

  return await getTask(taskId);
};

/**
 * Filter Tsks by planedStartDate
 * @param {String} taskId
 * @param {Array} usersId
 * @returns {Promise<User>}
 */

const filterTaskByPlanedDate = async (projectId, startDate, endDate) => {
  const tasks = await taskRepository
    .createQueryBuilder('task')
    .leftJoin('task.baseline', 'baseline')
    .leftJoin('baseline.milestone', 'milestone')
    .leftJoin('milestone.project', 'project')
    .where('project.id = :projectId', { projectId })
    .andWhere('task.plannedStart >= :startDate', {
      startDate,
    })
    .andWhere('task.plannedStart <= :endDate', {
      endDate,
    })
    .getMany();

  return tasks;
};

module.exports = {
  createTask,
  getTasks,
  extendTasks,
  getTask,
  getTasksByMileston,
  updateTask,
  deleteTask,
  assignResource,
  removeResource,
  filterTaskByPlanedDate,
  assignAllResource,
};
