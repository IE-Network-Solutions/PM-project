const httpStatus = require('http-status');
const { Baseline, Task, Subtask, Milestone, baselineComment, User, TaskUser, SummaryTask, BaselineHistory } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const { all } = require('../routes/v1');
const { milestoneService } = require('.');
const summaryTaskService = require("./summaryTask.service")

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
const summaryTaskRepository = dataSource.getRepository(SummaryTask).extend({
  findAll,
  sortBy,
});
const baselineHistoryRepository = dataSource.getRepository(BaselineHistory).extend({
  findAll,
  sortBy,
});

/**
 * Create a user
 * @param {Object} BaselineBody
 * @returns {Promise<Project>}
 */

const createBaseline = async (baselineBody, milestones) => {
  delete baselineBody.milestones;
  let savedBaseline
  if (baselineBody) {
    const lastActiveBaseline = await baselineRepository.findOne({
      where: {
        projectId: baselineBody.projectId,
        status: true,
      },
    });

    if (lastActiveBaseline) {
      const basline = await getBaseline(lastActiveBaseline.id)
      console.log(basline, "nnn")
      await baselineRepository.update(lastActiveBaseline.id, { status: false });
      console.log(basline.projectId, "basline.projectId")
      const gg = await baselineHistoryRepository.create({
        baselineData: basline,
        projectId: basline.projectId
      })
      await baselineHistoryRepository.save(gg)
    }
    const baseline = baselineRepository.create({
      name: baselineBody.name,
      status: true,
      projectId: baselineBody.projectId,
    });

    savedBaseline = await baselineRepository.save(baseline);

    if (milestones) {
      const savedMilestones = await Promise.all(milestones.map(async (milestone) => {
        if (milestone.summaryTask) {
          const savedSummaryTasks = await Promise.all(milestone.summaryTask.map(async (eachTask) => {
            console.log(savedBaseline.id)
            return summaryTaskService.updateSummaryTasks(eachTask, savedBaseline.id, milestone.id);
          }));


          milestone.summaryTask = savedSummaryTasks;
        }

        return milestone;
      }));

      savedBaseline.milestones = savedMilestones;
    }


  }

  return await getBaseline(savedBaseline.id)


}

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


//   const status = true;
//   const baselineData = await baselineRepository
//     .createQueryBuilder('baselines')
//     .leftJoinAndSelect('baselines.tasks', 'task')
//     .leftJoinAndSelect('task.subtasks', 'subtask')
//     .leftJoinAndSelect('task.milestone', 'milestone')
//     .addSelect('baselines.*')
//     .addSelect('task.*')
//     .addSelect('subtask.*')
//     .andWhere('baselines.project.id = :projectId', { projectId: projectId })
//     .orderBy('baselines.createdAt', 'DESC')
//     .getMany();
//   baselineData.forEach((base) => {
//     const milestones = [];
//     base.tasks.forEach((task) => {
//       if (!milestones.some((m) => m.id === task.milestoneId)) {
//         let taskMilestone = task.milestone
//         milestones.push({ ...taskMilestone, "tasks": [] });
//       }
//       let mileInd = milestones.findIndex((m) => m.id === task.milestoneId)
//       milestones[mileInd].tasks.push(task)
//     });
//     delete base.tasks
//     base.milestones = milestones
//   });

//   return baselineData;
// };

const projectSchedule = async (projectId) => {
  const baseline = await baselineHistoryRepository.find({ where: { projectId: projectId } })
  const milestone = await milestoneRepository.find({
    where: { projectId: projectId },
    relations: ['summaryTask', 'summaryTask.tasks', 'summaryTask.baseline', "summaryTask.tasks.baseline"],
    order: { createdAt: 'DESC' }
  });
  if (milestone) {

    let milestones = milestone
    for (const item of milestones) {

      let finalSub = milestoneService.flatToHierarchy(item.summaryTask)
      delete item.summaryTask
      item["summaryTask"] = finalSub

    }

    const groupedByBaseline = milestone.reduce((base, milestone) => {
      const lastSummaryTask = findLastSummaryTask(milestone.summaryTask);
      if (lastSummaryTask) {
        let newLastSummaryTask = lastSummaryTask.tasks
        newLastSummaryTask.forEach(task => {
          const baselineId = task.baseline.id;
          if (!base[baselineId]) {
            base[baselineId] = {
              id: baselineId,
              name: task.baseline.name,
              createdAt: task.baseline.createdAt,
              updatedAt: task.baseline.updatedAt,
              createdBy: task.baseline.createdBy,
              updatedBy: task.baseline.updatedBy,
              status: task.baseline.status,
              projectId: task.baseline.projectId,
              approved: task.baseline.approved,
              rejected: task.baseline.rejected,
              milestones: []
            };
          }

          if (!base[baselineId].milestones.some(m => m.id === milestone.id)) {
            base[baselineId].milestones.push(milestone);
          }
        });
      }
      return base;
    }, {});

    // const newGroupedByBaseline = Object.values(groupedByBaseline).map(baselineGroup => {
    //   return {
    //     ...baselineGroup,
    //     milestones: baselineGroup?.milestones.map(milestone => {
    //       const lastSummaryTask = findLastSummaryTask(milestone.summaryTask);
    //       return {
    //         ...milestone,
    //         summaryTask: milestone.summaryTask.map(summaryTask => {
    //           return {
    //             ...summaryTask,
    //             tasks: summaryTask.tasks.filter(task => task.baselineId === baselineGroup.id)
    //           };
    //         })
    //       };
    //     })
    //   };
    // });


    const allBaselines = baseline.map((item) => {
      const filterBaseline = Object.values(groupedByBaseline).filter((base) => base.id === item.id)
      if (filterBaseline.length === 0) {
        Object.values(groupedByBaseline).push(item)
      }
      return Object.values(groupedByBaseline)
    })
    console.log(allBaselines, "bbb")

    const activeBaselines = Object.values(groupedByBaseline).filter((activeBaseline) => activeBaseline.status)
    return {
      activeBaselineaseline: activeBaselines[0],
      allBaselines: Object.values(groupedByBaseline),
    }

  }
  throw new ApiError(httpStatus.NOT_FOUND, 'there are no milestones on this project');

};


const projectSchedules = async (projectId) => {
  const baseline = await baselineRepository.find({ where: { projectId: projectId } })
  const milestone = await milestoneRepository.find({
    where: { projectId: projectId },
    relations: ['summaryTask', 'summaryTask.tasks', 'summaryTask.baseline', "summaryTask.tasks.baseline"],
    order: { createdAt: 'DESC' }
  });
  if (milestone) {

    let milestones = milestone
    for (const item of milestones) {

      let finalSub = milestoneService.flatToHierarchy(item.summaryTask)
      delete item.summaryTask


      item["summaryTask"] = finalSub

    }

    const groupedByBaseline = milestone.reduce((acc, milestone) => {
      const lastSummaryTask = findLastSummaryTask(milestone.summaryTask);
      if (lastSummaryTask) {
        let newLastSummaryTask = lastSummaryTask.tasks
        newLastSummaryTask.forEach(task => {
          const baselineId = task.baseline.id;
          if (!acc[baselineId]) {
            acc[baselineId] = {
              id: baselineId,
              name: task.baseline.name,
              createdAt: task.baseline.createdAt,
              updatedAt: task.baseline.updatedAt,
              createdBy: task.baseline.createdBy,
              updatedBy: task.baseline.updatedBy,
              status: task.baseline.status,
              projectId: task.baseline.projectId,
              approved: task.baseline.approved,
              rejected: task.baseline.rejected,
              milestones: []
            };
          }
          //  lastSummaryTask.tasks = newLastSummaryTask.filter(task => task.baselineId !== baselineId);


          if (!acc[baselineId].milestones.some(m => m.id === milestone.id)) {
            console.log(milestone, "milestonenjnuytrrr")
            acc[baselineId].milestones.push(milestone);
          }
        });
      }
      return acc;
    }, {});



    // const allBaselines = {};
    // milestone.forEach((item) => {


    //   const lastSummaryTask = findLastSummaryTask(item.summaryTask);
    //   if (lastSummaryTask) {
    //     for (const task of lastSummaryTask.tasks) {

    //      const baselineId = task.baseline.id;
    //       if (!allBaselines[baselineId]) {
    //         allBaselines[baselineId] = {
    //           id: baselineId,
    //           name: task.baseline.name,
    //           createdAt: task.baseline.createdAt,
    //           updatedAt: task.baseline.updatedAt,
    //           createdBy: task.baseline.createdBy,
    //           updatedBy: task.baseline.updatedBy,
    //           status: task.baseline.status,
    //           projectId: task.baseline.projectId,
    //           approved: task.baseline.approved,
    //           rejected: task.baseline.rejected,
    //           milestones: []
    //         };
    //         delete lastSummaryTask.tasks
    //         lastSummaryTask.tasks = []
    //         lastSummaryTask.tasks.push(task)

    //         allBaselines[baselineId].milestones.push(item);


    //       }
    //     }
    //   }



    // });
    // const activeBaseline = Object.values(allBaselines).filter((activeBaseline) => activeBaseline.status)

    // const gg = Object.values(groupedByBaseline).map((nn) => {
    //   const newbaseline = baseline.map((item) => {

    //     if (item.id !== nn.id) {
    //       console.log(item, "dfghtyuy")
    //       Object.values(groupedByBaseline).push(item);
    //     }
    //   })


    // })



    // const ggh = baseline.map((item) => {
    //   if (!groupedByBaseline[item.id]) {
    //     groupedByBaseline[item.id] = {
    //       id: item.baselineId,
    //       name: item.name,
    //       createdAt: item.createdAt,
    //       updatedAt: item.updatedAt,
    //       createdBy: item.createdBy,
    //       updatedBy: item.updatedBy,
    //       status: item.status,
    //       projectId: item.projectId,
    //       approved: item.approved,
    //       rejected: item.rejected,
    //       // milestones: []
    //     };
    //   }
    //   return groupedByBaseline
    // })


    //console.log(ggh, "hdeuueueue")




    // const bnhi = await Promise.all(Object.values(groupedByBaseline).map(async (item) => {
    //   item.milestones = await Promise.all(item.milestones.map(async (element) => {
    //     console.log(element, "cnpppnbvrtt");
    //     const lastSummaryTask = findLastSummaryTask(element.summaryTask);
    //     console.log(lastSummaryTask, "cnpppl,,");
    //     lastSummaryTask.tasks = await filterTasks(lastSummaryTask.tasks, item.id);
    //     console.log(lastSummaryTask.tasks, "surround");
    //     element.summaryTask = lastSummaryTask
    //     return element;
    //   }));
    //   return item;
    // }));

    // return bnhi;







    // const vv = baseline.map((item) => {
    //   return Object.values(groupedByBaseline).push(item)

    // })

    //const all = Object.values(groupedByBaseline).push(baseline)
    //return await filterTasksWithSameBaseline(Object.values(groupedByBaseline));

    //console.log(filteredBaselines, "bbbxbxbgsdrdrdr")
    const activeBaselines = Object.values(groupedByBaseline).filter((activeBaseline) => activeBaseline.status)
    return {
      activeBaselineaseline: activeBaselines[0],
      allBaselines: Object.values(groupedByBaseline),
      // milestone
      // groupedByBaseline

    }
    // return groupedByBaseline
  }
  throw new ApiError(httpStatus.NOT_FOUND, 'there are no milestones on this project');

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
  // const baselineData = await baselineRepository
  //   .createQueryBuilder('baselines')
  //   .leftJoinAndSelect('baselines.approvalStage', "approvalStage")
  //   .leftJoinAndSelect('baselines.baselineComment', "baselineComment")
  //   .leftJoinAndSelect('approvalStage.role', "role")
  //   .leftJoinAndSelect('baselines.project', 'project')
  //   .leftJoinAndSelect('baselines.tasks', 'task')
  //   .leftJoinAndSelect('task.subtasks', 'subtask')
  //   .leftJoinAndSelect('task.milestone', 'milestone')
  //   .addSelect('baselines.*')
  //   .addSelect('task.*')
  //   .addSelect('subtask.*')
  //   //.addOrderBy('baselines.tasks.task.createdAt', 'ASC')
  //   .andWhere('baselines.id = :baselineId', { baselineId: baselineId })
  //   .getMany();

  // const allMilestones = await milestoneService.getByProject(baselineData[0].projectId)



  // baselineData.forEach((base) => {
  //   const milestones = allMilestones.map((e) => { return { ...e, "tasks": [] } });
  //   base.tasks.forEach((task) => {
  //     if (!milestones.some((m) => m.id === task.milestoneId)) {
  //       let taskMilestone = task.milestone
  //       milestones.push({ ...taskMilestone, "tasks": [] });
  //     }
  //     let mileInd = milestones.findIndex((m) => m.id === task.milestoneId)
  //     milestones[mileInd].tasks.push(task)
  //   });
  //   delete base.tasks
  //   base.milestones = milestones
  //   delete base.projectId
  //   delete base.project
  // });

  // return baselineData;







  const baselineData = await baselineRepository.findOne({ where: { id: baselineId } })

  const milestone = await milestoneRepository.find({
    where: { projectId: baselineData.projectId },
    relations: ['summaryTask', 'summaryTask.tasks', 'summaryTask.baseline'],
    order: { createdAt: 'DESC' }
  });

  let milestones = milestone
  for (const item of milestones) {

    let finalSub = milestoneService.flatToHierarchy(item.summaryTask)
    delete item.summaryTask


    item["summaryTask"] = finalSub

  }
  const groupedData = {};
  milestone.forEach(item => {
    //const baselineId = baselineId;
    if (!groupedData[baselineId]) {
      groupedData[baselineId] = {
        id: baselineId,
        name: baselineData.name,
        createdAt: baselineData.createdAt,
        updatedAt: baselineData.updatedAt,
        createdBy: baselineData.createdBy,
        updatedBy: baselineData.updatedBy,
        status: baselineData.status,
        projectId: baselineData.projectId,
        approved: baselineData.approved,
        rejected: baselineData.rejected,
        milestones: []
      };
    }

    groupedData[baselineId].milestones.push(item);
  });
  return Object.values(groupedData);



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
const updateBaseline = async (baselineId, baselineBody, milestones) => {
  if (baselineBody) {
    await baselineRepository.update({ id: baselineId }, { name: baselineBody.name });
  }

  if (milestones) {

    const savedMilestones = await Promise.all(milestones.map(async (milestone) => {
      if (milestone.summaryTask) {
        const savedSummaryTasks = await Promise.all(milestone.summaryTask.map(async (eachTask) => {
          return summaryTaskService.updateSummaryTasks(eachTask, baselineId, milestone.id);
        }));


        milestone.summaryTask = savedSummaryTasks;
      }

      return milestone;
    }));

    milestones = savedMilestones;
  }


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
function findLastSummaryTask(summaryTasks) {
  if (!summaryTasks || summaryTasks.length === 0) {
    return null;
  }
  for (const summaryTask of summaryTasks) {
    if (summaryTask.lastChild) {
      return summaryTask;
    } else if (summaryTask.summaryTask) {
      const lastSummaryTask = findLastSummaryTask(summaryTask.summaryTask);
      if (lastSummaryTask) {
        return lastSummaryTask;
      }
    }
  }
  return null;
}

const filterTasksWithSameBaseline = async (baselines) => {
  // Define a recursive function to traverse the nested structure


  // Use Promise.all to wait for all the baselines to be processed
  await Promise.all(baselines.map(async (baseline) => {
    // Use Promise.all to wait for all the milestones in the baseline to be processed
    await Promise.all(baseline.milestones.map(async (milestone) => {
      const lastSummaryTask = await findLastSummaryTask(milestone.summaryTask);
      lastSummaryTask.tasks = await filterTasks(lastSummaryTask.tasks, baseline.id);
      console.log(lastSummaryTask.tasks, "  lastSummaryTask.tasks")
      milestone.summaryTask = lastSummaryTask;
    }));
  }));

  // Return the modified baselines
  return baselines;
};

const filterTasks = (tasks, baselineId) => {
  const filteredTasks = tasks?.filter(task => task.baselineId === baselineId);
  // Filter out tasks with the same baselineId
  // return tasks.filter(async (task) => {
  //   // const lastBaseline = await findLastBaseline(task.baselineId);
  //   // console.log(lastBaseline, "ghjkl")
  //   return await task.baselineId === baselineId;
  // });
  console.log(filteredTasks, "nvncncneeeoopp")
  return filteredTasks
}


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
  masterScheduleByDateFilter, scheduleDashboard,
  // projectALLSchedule,

};
