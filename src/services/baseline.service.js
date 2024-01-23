const httpStatus = require('http-status');
const { Baseline, Task, Subtask, Milestone, baselineComment, User, TaskUser } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const { all } = require('../routes/v1');
const { milestoneService } = require('.');

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
const taskUserRepository = dataSource.getRepository(TaskUser).extend({
  findAll,
  sortBy,
});

/**
 * Create a user
 * @param {Object} BaselineBody
 * @returns {Promise<Project>}
 */
const createBaseline = async (baselineBody, milestones) => {

  if (baselineBody) {
    const lastActiveBaseline = await baselineRepository.findOne({
      where: {
        projectId: baselineBody.projectId,
        status: true,
      },
    });

    if (lastActiveBaseline) {
      await baselineRepository.update(lastActiveBaseline.id, { status: false });
    }
  }

  const baseline = baselineRepository.create({
    name: baselineBody.name,
    status: true,
    projectId: baselineBody.projectId,
    createdBy: baselineBody.createdBy,
    updatedBy: baselineBody.updatedBy,
  });
  const savedBaseline = await baselineRepository.save(baseline);

  if (milestones) {
    milestones?.forEach((milestone) => {
      const taskInstances = milestone?.tasks?.map(async (eachTask) => {
        const subTasks = eachTask?.subtasks || [];
        const taskInstance = taskRepository.create({
          baselineId: baseline?.id,
          milestoneId: milestone?.id,
          name: eachTask?.name,
          plannedStart: eachTask?.plannedStart,
          plannedFinish: eachTask?.plannedFinish,
          actualStart: eachTask?.actualStart,
          actualFinish: eachTask?.actualFinish,
          completion: eachTask?.completion,
          status: eachTask?.status,
          sleepingReason: eachTask?.sleepingReason,
          subTasks: subTasks,
          predecessor: eachTask?.predecessor,
          predecessorType: eachTask?.predecessorType
        });

        const savedTaskInstance = await taskRepository.save(taskInstance);


        // Create and save subtasks
        if (subTasks.length > 0) {
          const subTaskInstances = subTasks?.map((eachSubTask) => {
            return subTaskRepository.create({
              taskId: savedTaskInstance?.id,
              name: eachSubTask?.name,
              plannedStart: eachSubTask?.plannedStart,
              plannedFinish: eachSubTask?.plannedFinish,
              actualStart: eachTask?.actualStart,
              actualFinish: eachTask?.actualFinish,
              completion: eachTask?.completion,
              status: eachSubTask?.status,
              sleepingReason: eachSubTask?.sleepingReason,
              predecessor: eachSubTask?.predecessor,
              predecessorType: eachSubTask?.predecessorType
            });
          });

          await subTaskRepository.save(subTaskInstances);
        }

        return savedTaskInstance;
      });

      // Save the task instances
      const savedTaskInstances = Promise.all(taskInstances).then((data) => {
        console.log("data", data)
        baseline.tasks = savedTaskInstances;
      }).catch((error) => {
        console.log("Error:", error)
      });
    });
  }
  const baselineDate = await baselineRepository
    .createQueryBuilder('baselines')
    .leftJoinAndSelect('baselines.tasks', 'task')
    .leftJoinAndSelect('task.subtasks', 'subtask')
    .leftJoinAndSelect('task.milestone', 'milestone')
    .addSelect('baselines.*')
    .addSelect('task.*')
    .addSelect('subtask.*')
    .addSelect('milestone.*')
    .getOne();

  console.log(baselineDate, "baselineDate")

  return baselineDate;
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


const scheduleDashboard = async (projectId) => {
  let taskResourceName = ""
  const baseline = baselineRepository.findBy({
    projectId: projectId,
  });

  const tasks = await taskRepository.findBy({
    baselineId: "cb475adf-9dcc-4bd0-adad-93ddf7db5f13",
  });

  // Use Promise.all to await multiple asynchronous operations concurrently
  const taskArray = await Promise.all(tasks.map(async (task) => {
    const resource = await taskUserRepository.findBy({
      taskId: task.id,
    });
    const formatDate = (date) => {
      return `new Date(${date.getFullYear()}, ${date.getMonth()}, ${date.getDate()})`;
    };

    // Use Promise.all for the inner map to await all user fetching operations
    const eachResource = await Promise.all(resource.map(async (r) => {
      const resourceName = await userRepository.findBy({ id: r.userId });
      return resourceName
    }));
    eachResource?.map(r => r?.map(re => taskResourceName = taskResourceName + re.name + ","



    )

    )
    // console.log(eachResource[0]?.map(p => p.name), "ooo");

    const plannedStartDate = new Date(task.plannedStart);
    const plannedEndDate = new Date(task.plannedFinish);

    const formattedStartDate = formatDate(plannedStartDate);
    const formattedEndDate = formatDate(plannedEndDate);
    return {
      id: task.id,
      name: task.name,
      resource: taskResourceName,
      startDate: null,
      endDate: null,
      duration: 10 * 10 * 10 * 10 * 60 * 1000,
      completion: task.completion,
      predecessor: null,
    };
  }));

  const taskArrays = taskArray.map((task) => Object.values(task));

  return taskArrays;

};


/**
 * Master Schedule
 */
const masterSchedule = async () => {
  const status = true;
  const baselineData = await baselineRepository
    .createQueryBuilder('baselines')
    .leftJoinAndSelect('baselines.tasks', 'task')
    .leftJoinAndSelect('baselines.project', 'project')
    .leftJoinAndSelect('task.subtasks', 'subtask')
    .leftJoinAndSelect('task.resources', 'resource')
    .leftJoinAndSelect('task.milestone', 'milestone')
    .orderBy('baselines.createdAt', 'DESC')
    // .where('baselines.status = true',)
    .getMany();
  // return baselineData;
  const projectBaseline = [];

  baselineData.forEach((base) => {
    if (!projectBaseline.some((p) => p.id === base.projectId)) {
      let baselineProj = base.project
      projectBaseline.push({ ...baselineProj, "baselines": [] });
    }
    let projIndx = projectBaseline.findIndex((bp) => bp.id === base.projectId)
    projectBaseline[projIndx].baselines.push(base)

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

  return projectBaseline;
};

const masterScheduleByDateFilter = async (startDate, endDate) => {
  const status = true;
  const baselineData = await baselineRepository
    .createQueryBuilder('baselines')
    .leftJoinAndSelect('baselines.tasks', 'task')
    .leftJoinAndSelect('baselines.project', 'project')
    .leftJoinAndSelect('task.subtasks', 'subtask')
    .leftJoinAndSelect('task.resources', 'resource')
    .leftJoinAndSelect('task.milestone', 'milestone')
    .orderBy('baselines.createdAt', 'DESC')
    .andWhere('task.plannedStart >= :startDate', { startDate: startDate })
    .andWhere('task.plannedFinish <= :endDate', { endDate: endDate })

    .getMany();
  // return baselineData;
  const projectBaseline = [];

  baselineData.forEach((base) => {
    if (!projectBaseline.some((p) => p.id === base.projectId)) {
      let baselineProj = base.project
      projectBaseline.push({ ...baselineProj, "baselines": [] });
    }
    let projIndx = projectBaseline.findIndex((bp) => bp.id === base.projectId)
    projectBaseline[projIndx].baselines.push(base)

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

  return projectBaseline;
};

const projectSchedule = async (projectId) => {
  const status = true;
  const baselineData = await baselineRepository
    .createQueryBuilder('baselines')
    .leftJoinAndSelect('baselines.tasks', 'task')
    .leftJoinAndSelect('task.subtasks', 'subtask')
    .leftJoinAndSelect('task.milestone', 'milestone')
    .addSelect('baselines.*')
    .addSelect('task.*')
    .addSelect('subtask.*')
    .andWhere('baselines.project.id = :projectId', { projectId: projectId })
    .orderBy('baselines.createdAt', 'DESC')
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

const activeProjectSchedule = async (projectId) => {
  const status = true;
  const baselineData = await baselineRepository
    .createQueryBuilder('baselines')
    .leftJoinAndSelect('baselines.tasks', 'task')
    .leftJoinAndSelect('task.subtasks', 'subtask')
    .leftJoinAndSelect('task.milestone', 'milestone')
    .addSelect('baselines.*')
    .addSelect('task.*')
    .addSelect('subtask.*')
    .andWhere('baselines.project.id = :projectId', { projectId: projectId })
    .andWhere('baselines.status = true')
    .orderBy('baselines.createdAt', 'DESC')
    .getMany();



  baselineData.forEach((base) => {
    console.log(base.tasks, "bababababhgdgd")

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


function groupDataByProjectBaselineMilestone(data) {
  const grouped = {};

  data.forEach((baseline) => {
    const projectId = baseline.project.id;
    const baselineId = baseline.id;
    const milestoneId = baseline.tasks[0].milestone.id;

    if (!grouped[projectId]) {
      grouped[projectId] = {
        projectData: {
          // Include project data here
          id: baseline.project.id,
          name: baseline.project.name,
          // Add other project properties as needed
        },
        baselines: {},
      };
    }

    if (!grouped[projectId].baselines[baselineId]) {
      grouped[projectId].baselines[baselineId] = {
        baselineData: {
          // Include baseline data here
          id: baseline.id,
          name: baseline.name,
          // Add other baseline properties as needed
        },
        milestones: {},
      };
    }

    if (!grouped[projectId].baselines[baselineId].milestones[milestoneId]) {
      grouped[projectId].baselines[baselineId].milestones[milestoneId] = {
        milestoneData: {
          // Include milestone data here
          id: baseline.tasks[0].milestone.id,
          name: baseline.tasks[0].milestone.name,
          // Add other milestone properties as needed
        },
        dataRaw: [], // Initialize the dataRaw array
      };
    }

    // Concatenate the task objects into the dataRaw array
    grouped[projectId].baselines[baselineId].milestones[milestoneId].dataRaw = grouped[projectId].baselines[
      baselineId
    ].milestones[milestoneId].dataRaw.concat(baseline.tasks);
  });

  return Object.values(grouped);
}

/**
 * Get post by id
 * @param {ObjectId} id
 * @returns {Promise<Baseline>}
 */
const getBaseline = async (baselineId) => {
  const baselineData = await baselineRepository
    .createQueryBuilder('baselines')
    .leftJoinAndSelect('baselines.approvalStage', "approvalStage")
    .leftJoinAndSelect('baselines.baselineComment', "baselineComment")
    .leftJoinAndSelect('approvalStage.role', "role")
    .leftJoinAndSelect('baselines.project', 'project')
    .leftJoinAndSelect('baselines.tasks', 'task')
    .leftJoinAndSelect('task.subtasks', 'subtask')
    .leftJoinAndSelect('task.milestone', 'milestone')
    .addSelect('baselines.*')
    .addSelect('task.*')
    .addSelect('subtask.*')
    //.addOrderBy('baselines.tasks.task.createdAt', 'ASC')
    .andWhere('baselines.id = :baselineId', { baselineId: baselineId })
    .getMany();

  const allMilestones = await milestoneService.getByProject(baselineData[0].projectId)



  baselineData.forEach((base) => {
    const milestones = allMilestones.map((e) => { return { ...e, "tasks": [] } });
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
    delete base.projectId
    delete base.project
  });

  return baselineData;
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
    await baselineRepository.update({ id: baselineId }, { name: baselineBody.name });
  }

  if (tasksBody) {
    for (const taskBody of tasksBody) {
      const requestedTask = taskBody;
      if (requestedTask.id) {
        const subTasks = taskBody.subtasks || [];
        console.log(subTasks, "tasksBody")


        await taskRepository.update(
          { id: requestedTask.id },
          {
            name: requestedTask.name,
            status: requestedTask.status,
            sleepingReason: requestedTask.sleepingReason,
            plannedStart: requestedTask.plannedStart,
            plannedFinish: requestedTask.plannedFinish,
            actualStart: requestedTask.actualStart,
            actualFinish: requestedTask.actualFinish,
            completion: requestedTask.completion,
            subTasks: requestedTask.subTasks,
            predecessor: requestedTask.predecessor,
            predecessorType: requestedTask.predecessorType

          }
        );

        const subTasksToUpdate = [];
        const subTasksToCreate = [];

        for (const subTask of subTasks) {
          if (subTask.id) {
            subTasksToUpdate.push({
              id: subTask.id,
              taskId: requestedTask.id,
              name: subTask.name,
              plannedStart: subTask.plannedStart,
              plannedFinish: subTask.plannedFinish,
              actualStart: subTask.actualStart,
              actualFinish: subTask.actualFinish,
              completion: subTask.completion,
              status: subTask.status,
              sleepingReason: subTask.sleepingReason,
              predecessor: subTask.predecessor,
              predecessorType: subTask.predecessorType
            });
          } else {
            subTasksToCreate.push({
              taskId: requestedTask.id,
              name: subTask.name,
              plannedStart: subTask.plannedStart,
              plannedFinish: subTask.plannedFinish,
              actualStart: subTask.actualStart,
              actualFinish: subTask.actualFinish,
              completion: subTask.completion,
              status: subTask.status,
              sleepingReason: subTask.sleepingReason,
              predecessor: subTask.predecessor,
              predecessorType: subTask.predecessorType

            });
          }
        }

        if (subTasksToUpdate.length > 0) {
          await Promise.all(subTasksToUpdate.map((subTask) => subTaskRepository.update(subTask.id, subTask)));
        }

        if (subTasksToCreate.length > 0) {
          await subTaskRepository.save(subTasksToCreate);
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
          milestoneId: requestedTask.milestoneId,
          predecessor: requestedTask.predecessor,
          predecessorType: requestedTask.predecessorType
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
            predecessor: eachSubTask.predecessor,
            predecessorType: eachSubTask.predecessorType
          }));
          await subTaskRepository.save(subTaskInstances);
        }
      }
    }
  }

  // After updating or creating tasks, fetch the updated baseline with tasks and subtasks
  const updatedBaseline = await getBaseline(baselineId)

  return updatedBaseline;
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
    where: {
      id: savedComment.userId,
    },
  });

  savedComment.user = sender;
  return savedComment;
};

const getComments = async (baselineId) => {
  return await baselineCommentRepository.find({
    where: { baselineId: baselineId },
    relations: ['user'],
    order: { createdAt: 'ASC' },
  });
};

module.exports = {
  createBaseline,
  getBaselines,
  getBaseline,
  getByMilestone,
  updateBaseline,
  deleteBaseline,
  addComment,
  getComments,
  masterSchedule,
  projectSchedule,
  activeProjectSchedule,
  masterScheduleByDateFilter, scheduleDashboard
};
