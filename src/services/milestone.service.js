const httpStatus = require('http-status');
const { Milestone, Task, Subtask, Baseline, SummaryTask } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const summaryTaskService = require("./summaryTask.service")

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
const summaryTaskRepository = dataSource.getRepository(SummaryTask).extend({
  findAll,
  sortBy,
});

/**
 * Create a user
 * @param {Object} milestoneBody
 * @returns {Promise<Project>}
 * 
 */
// const milestoneBodyhh = {
//   // label: "Project",
//   properties: [
//     {
//       name: "mile1 testttt",
//       weight: 20,
//       projectId: "03160bfd-fe9b-4844-967a-8c80e560dae5",
//       baselineId: "113da988-3c86-46d9-81fd-73c3b7c34fbe",

//       properties: [
//         {
//           name: "summary task 1",
//           // id: "2667cb96-7c14-4527-a28f-9e1222c5f9d7",
//           properties: [
//             {
//               name: "summary summary task 1",
//               //  id: "f3e58b10-edbe-46bc-bf0b-42794f885b4c",
//               properties: [
//                 {
//                   name: "summary summary summary task 1",
//                   // id: "40dd20ec-3cb4-49f9-9932-04a44ec5b554",
//                   properties: []
//                 }
//               ]
//             }
//           ]
//         },
//         {
//           name: "summary task 2",
//           // id: "5f796595-705c-43c8-85c2-0f13b4c23ba3",
//           properties: []
//         }
//       ]
//     },
//     {
//       name: "mile2 testttt",
//       weight: 20,
//       projectId: "03160bfd-fe9b-4844-967a-8c80e560dae5",
//       baselineId: "7b9a8061-ef3d-4e19-bf9b-2d662abe5aed",
//       properties: []
//     }
//   ],
//   // id: ""
// }



const createMilestone = async (milestoneBody) => {
  const milestones = await Promise.all(milestoneBody?.properties.map(async (element) => {
    const milestone = milestoneRepository.create({
      name: element.label,
      weight: element.weight,
      projectId: milestoneBody.projectId,
      baselineId: element.baselineId
    });
    const savedMilestone = await milestoneRepository.save(milestone);
    const summaryTasks = await summaryTaskService.createSummaryTasks(element.properties, element.baselineId, savedMilestone.id, element.baselineId || null);
    return {
      ...savedMilestone,
      summaryTask: summaryTasks
    };
  }));

  return milestones;
};

// const createSummaryTasks = async (taskBody, baselineId, mileId, parentId) => {
//   const allTasks = [];
//   if (taskBody?.length !== 0) {
//     await Promise.all(taskBody.map(async (element) => {
//       const task = summaryTaskRepository.create({
//         name: element.label,
//         baselineId: baselineId,
//         milestoneId: mileId,
//         parentId: parentId
//       });
//       const savedTask = await summaryTaskRepository.save(task);
//       const nestedTasks = await createSummaryTasks(element.properties, baselineId, mileId, savedTask.id);
//       allTasks.push({
//         ...savedTask,
//         summaryTask: nestedTasks
//       });
//     }));
//   }
//   return allTasks;
// };


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
    sortOptions: sortBy && { option: sortBy },
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



const flatToHierarchy = (flat) => {
  let roots = [];
  let all = {};

  flat.forEach(function (item) {
    all[item.id] = item;
  });

  Object.keys(all).forEach(function (id, index, array) {
    let item = all[id];
    if (item.parentId === null) {
      roots.push(item);
    } else if (item.parentId in all) {
      let parent = all[item.parentId];
      if (!('summaryTask' in parent)) {
        parent.summaryTask = [];
      }
      parent.summaryTask.push(item);
    }
  });

  // Mark the last children for each parent
  Object.values(all).forEach(function (item) {
    if (!('summaryTask' in item) || item.summaryTask.length === 0) {
      // If it's a leaf node, mark it as the last child
      item.lastChild = true;
    } else {
      // If it has children, check if it's referenced by another object
      let referenced = Object.values(all).some(function (otherItem) {
        return otherItem.parentId === item.id;
      });
      item.lastChild = !referenced;
    }
  });
  return roots;
};


const getByProject = async (projectId) => {
  const milestone = await milestoneRepository.find({
    where: { projectId: projectId },

    relations: ['summaryTask', 'summaryTask.tasks'],
    order: { createdAt: 'DESC' }
  });

  for (const item of milestone) {

    let finalSub = flatToHierarchy(item.summaryTask)
    delete item.summaryTask


    item["summaryTask"] = finalSub

  }

  return milestone



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

const updateHasCheckList = async (milestoneId) => {
  return await milestoneRepository.update({ id: milestoneId }, { hasCheckList: true })
}
const updateIsEvaluted = async (milestoneId) => {
  return await milestoneRepository.update({ id: milestoneId }, { isEvaluted: true })
}
const updateIsSendToDOO = async (milestoneId) => {
  return await milestoneRepository.update({ id: milestoneId }, { isSendToDOO: true })
}

module.exports = {
  createMilestone,
  getMilestones,
  getMilestone,
  getByProject,
  updateMilestone,
  deleteMilestone,
  updateHasCheckList,
  updateIsEvaluted,
  updateIsSendToDOO,
  flatToHierarchy
};
