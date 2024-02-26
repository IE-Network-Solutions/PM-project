const httpStatus = require('http-status');
const { SummaryTask, Task } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const taskService = require('./task.service');

const summaryTaskRepository = dataSource.getRepository(SummaryTask).extend({
  findAll,
  sortBy,
});
const taskRepository = dataSource.getRepository(Task).extend({
  findAll,
  sortBy,
});
/**
 * @module summaryTask
 */
/**
 * Creates summary tasks recursively based on the provided task body, baseline ID, milestone ID, and parent ID.
 * @function
 * @param {Array<Object>} taskBody - The body of the tasks to create.
 * @param {string} baselineId - The ID of the baseline associated with the tasks.
 * @param {string} mileId - The ID of the milestone associated with the tasks.
 * @param {string|null} parentId - The ID of the parent task, or null if there is no parent.
 * @returns {Promise<Array<Object>>} A Promise that resolves with an array of created summary tasks.
 */
const createSummaryTasks = async (taskBody, baselineId, mileId, parentId) => {
  const allTasks = [];
  if (taskBody?.length !== 0) {
    await Promise.all(
      taskBody.map(async (element) => {
        console.log(element.label, "=>", "ech summarytask element")
        console.log(element.properties, "=>", "ech summarytask element")
        const task = summaryTaskRepository.create({
          name: element.label,
          baselineId: baselineId,
          milestoneId: mileId,
          parentId: parentId,
          order: element.order
        });
        const savedTask = await summaryTaskRepository.save(task);

        const nestedTasks = await createSummaryTasks(element.properties, baselineId, mileId, savedTask.id);

        allTasks.push({
          ...savedTask,
          summaryTask: nestedTasks,
        });
      })
    );
  }
  return allTasks;
};
/**
 * Updates summary tasks recursively based on the provided task body, baseline ID, milestone ID, and parent ID.
 * @function
 * @param {Object|null} taskBody - The body of the task to update, or null if no task is provided.
 * @param {string} baselineId - The ID of the baseline associated with the tasks.
 * @param {string} mileId - The ID of the milestone associated with the tasks.
 * @param {string|null} parentId - The ID of the parent task, or null if there is no parent.
 * @returns {Promise<Array<Object>>} A Promise that resolves with an array of updated summary tasks.
 */
const updateSummaryTasks = async (taskBody, baselineId, mileId, parentId) => {

  console.log(taskBody.tasks, "taskssss")
  let allTasks = [];

  if (taskBody) {
    const task = await summaryTaskRepository.update(
      { id: taskBody.id },
      {
        baselineId: baselineId,
        name: taskBody.name,
        plannedStart: taskBody.plannedFinish,
        plannedFinish: taskBody.plannedStart,
        actualStart: taskBody.actualStart,
        actualFinish: taskBody.actualFinish,
        completion: taskBody.completion,
        status: taskBody.status,
        milestoneId: taskBody.milestoneId,
        parentId: taskBody.parentId,
      }
    );
    if (taskBody?.tasks.length !== 0) {
      let newTasks = taskBody.tasks
        .filter((t) => !t.id)
        .map((e) => {
          // delete e.duration;
          //delete e.taskId;
          return { ...e, order: e.taskId, baselineId: baselineId };
        });

      if (newTasks.length > 0) {

        let createTask = taskRepository.create(newTasks);
        allTasks = [...allTasks, ...createTask];
        await taskRepository.save(createTask);
      }

      let updateTasks = taskBody.tasks
        .filter((t) => t.id)
        .map((e) => {
          // delete e.duration;
          //  delete e.taskId;
          return { ...e, baselineId: baselineId };
        });

      if (updateTasks.length > 0) {
        updateTasks.forEach((ut) => {
          let updatedTasks = taskRepository.update(
            { id: ut.id },
            {
              ...ut,
              baselineId: baselineId,
            }
          );
          allTasks.push(updatedTasks);
        });
      }
    }

    if (taskBody.summaryTask) {
      await Promise.all(
        taskBody.summaryTask.map(async (element) => {
          const nestedTasks = await updateSummaryTasks(element, baselineId, mileId, task.id);
          allTasks.push(nestedTasks);
        })
      );
    }
  }
  return allTasks;
};
/**
 * Updates a single summary task or a list of summary tasks recursively.
 * @function
 * @param {Array<Object>} taskBody - The array of task objects to update.
 * @returns {Promise<Array<Object>>} A Promise that resolves with an array of updated summary tasks.
 */

const updateSingleSummaryTask = async (taskBody) => {
  const allTasks = [];

  if (taskBody?.length !== 0) {
    await Promise.all(
      taskBody.map(async (element) => {
        const sumtask = await summaryTaskRepository.save({
          id: element.id,
          ...element,
        });

        if (element.lastChild === false && element.summaryTask) {
          const nestedTasks = await updateSingleSummaryTask(element.summaryTask);
          allTasks.push({
            ...sumtask,
            summaryTask: nestedTasks,
          });
        } else {
          allTasks.push(sumtask);
        }
      })
    );
  }

  return allTasks;
};

module.exports = {
  createSummaryTasks,
  updateSummaryTasks,
  updateSingleSummaryTask,
};
