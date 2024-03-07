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
/**
 * @module task
 */
/**
 * Creates a new task using the provided task body.
 * @function
 * @param {Object} taskBody - The body of the task to create.
 * @returns {Promise<void>} A Promise that resolves once the task is created and saved.
 */

const createTask = async (taskBody) => {
  const task = taskRepository.create(taskBody)
  return await taskRepository.save(task);


};
/**
 * Retrieves tasks based on the provided filter and options.
 * @function
 * @param {Object} filter - The filter criteria to apply while retrieving tasks.
 * @param {Object} options - The options to configure the retrieval, including limit, page, and sortBy.
 * @param {number} [options.limit] - The maximum number of tasks to retrieve per page.
 * @param {number} [options.page] - The page number of tasks to retrieve.
 * @param {string} [options.sortBy] - The field to sort the tasks by.
 * @returns {Promise<Array<Object>>} A Promise that resolves with an array of retrieved tasks.
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
 * Extends tasks related to the specified baseline by retrieving additional data including subtasks and milestones.
 * @function
 * @param {string} baselineId - The ID of the baseline to extend tasks for.
 * @returns {Promise<Array<Object>>} A Promise that resolves with an array of extended baseline data including tasks, subtasks, and milestones.
 */

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
        let taskMilestone = task.milestone
        milestones.push({ ...taskMilestone, "tasks": [] });
      }
      let mileInd = milestones.findIndex((m) => m.id === task.milestoneId)
      milestones[mileInd].tasks.push(task)
    });
    delete base.tasks
    base.milestones = milestones
  });

  return baselineData;
};
/**
 * Retrieves a task by its ID.
 * @function
 * @param {string} id - The ID of the task to retrieve.
 * @returns {Promise<Object|null>} A Promise that resolves with the task object if found, or null if not found.
 */

const getTask = async (id) => {
  return await taskRepository.findOneBy({ id: id });
};
/**
 * Retrieves tasks associated with the specified project and baseline, filtered by the provided criteria.
 * @function
 * @param {string} projectId - The ID of the project to retrieve tasks for.
 * @param {Object} filter - The filter criteria to apply while retrieving tasks.
 * @param {Object} options - The options to configure the retrieval, including limit, page, and sortBy.
 * @param {number} [options.limit] - The maximum number of tasks to retrieve per page.
 * @param {number} [options.page] - The page number of tasks to retrieve.
 * @param {string} [options.sortBy] - The field to sort the tasks by.
 * @returns {Promise<Array<Object>>} A Promise that resolves with an array of retrieved tasks.
 */

const getTasksByMileston = async (projectId, filter, options) => {
  const baseline = await baselineRepository.findOne({
    where: {
      projectId: projectId,
      status: true
    }
  });


  if (baseline) {
    const { limit, page, sortBy } = options;
    return await taskRepository.find({
      where: {
        baselineId: baseline.id,
      },
      relations: ['resources'],
      sortOptions: sortBy && { option: sortBy },
      // paginationOptions: { limit: limit, page: page },
    });
  }
  else {
    return [];
  }
};
/**
 * Updates a task with the specified ID using the provided update body.
 * @function
 * @param {string} taskId - The ID of the task to update.
 * @param {Object} updateBody - The data to update the task with.
 * @returns {Promise<Object>} A Promise that resolves with the updated task object.
 * @throws {ApiError} If the task with the specified ID is not found.
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
 * Deletes a task with the specified ID.
 * @function
 * @param {string} taskId - The ID of the task to delete.
 * @returns {Promise<void>} A Promise that resolves once the task is deleted.
 * @throws {ApiError} If the task with the specified ID is not found.
 */

const deleteTask = async (taskId) => {
  const task = await getTask(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  return await taskRepository.delete({ id: taskId });
};
/**
 * Assigns users to a task identified by its ID.
 * @function
 * @param {string} taskId - The ID of the task to assign users to.
 * @param {Array<string>} userIds - An array of user IDs to assign to the task.
 * @returns {Promise<Array<Object>>} A Promise that resolves with an array of task-user associations created.
 * @throws {ApiError} If the task with the specified ID or the users with the given IDs are not found.
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
 * Assigns multiple users to multiple tasks according to the provided resource body.
 * @function
 * @param {Object} resourceBody - The resource body containing task IDs and corresponding user IDs.
 * @param {Array<Object>} resourceBody.resources - An array of objects containing task IDs and corresponding user IDs.
 * @param {string} resourceBody.resources[].taskId - The ID of the task to assign users to.
 * @param {Array<string>} resourceBody.resources[].userIds - An array of user IDs to assign to the task.
 * @returns {Promise<Array<Object>>} A Promise that resolves with an array of task-user associations created.
 * @throws {ApiError} If any task or user specified in the resource body is not found.
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
 * Removes a user from a task by their ID.
 * @function
 * @param {string} taskId - The ID of the task from which to remove the user.
 * @param {string} userId - The ID of the user to be removed from the task.
 * @returns {Promise<Object>} A Promise that resolves with the updated task object from which the user was removed.
 * @throws {AppError} If the association between the task and user is not found.
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
 * Filters tasks associated with a project within a specified planned date range.
 * @function
 * @param {string} projectId - The ID of the project to filter tasks for.
 * @param {Date} startDate - The start date of the planned date range.
 * @param {Date} endDate - The end date of the planned date range.
 * @returns {Promise<Array<Object>>} A Promise that resolves with an array of tasks filtered by the planned date range.
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



const activeBaselineTasks = async (projectId) => {


  const activeBaseline = await baselineRepository.findOne({ where: { projectId: projectId, status: true } })
  const tasks = await taskRepository.find({ where: { baselineId: activeBaseline.id } })

  if (!tasks) {
    new AppError('relation not found', 404);
  }

  // Remove the TaskUser association from the database
  return tasks
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
  activeBaselineTasks,
};
