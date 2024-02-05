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
