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

const createSummaryTasks = async (taskBody, baselineId, mileId, parentId) => {
  console.log(taskBody, "whyy idont")
  const allTasks = [];
  if (taskBody?.length !== 0) {
    await Promise.all(
      taskBody.map(async (element) => {
        const task = summaryTaskRepository.create({
          name: element.label,
          baselineId: baselineId,
          milestoneId: mileId,
          parentId: parentId,
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

const updateSummaryTasks = async (taskBody, baselineId, mileId, parentId) => {
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
          delete e.duration;
          delete e.taskId;
          return { ...e, baselineId: baselineId };
        });

      if (newTasks.length > 0) {
        let createTask = taskRepository.create(newTasks);
        allTasks = [...allTasks, ...createTask];
        await taskRepository.save(createTask);
      }

      let updateTasks = taskBody.tasks
        .filter((t) => t.id)
        .map((e) => {
          delete e.duration;
          delete e.taskId;
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

  console.log(allTasks, 'taskbodies');
  return allTasks;
};

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
