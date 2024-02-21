const httpStatus = require('http-status');
const { Milestone, Task, Subtask, Baseline, SummaryTask } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const summaryTaskService = require('./summaryTask.service');

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
 * @module milestone
 */
/**
 * Creates and saves milestones based on provided milestone data.
 *
 * @function
 * @param {Object} milestoneBody - The milestone data.
 * @property {Array} milestoneBody.properties - An array of milestone properties.
 * @property {string} milestoneBody.projectId - The ID of the associated project.
 * @throws {Error} Throws an error if there's an issue creating or saving milestones.
 * @returns {Promise<Array>} - A promise that resolves to an array of saved milestones.
 */
const createMilestone = async (milestoneBody) => {
  const milestones = await Promise.all(
    milestoneBody?.properties.map(async (element) => {
      const milestone = milestoneRepository.create({
        name: element.label,
        weight: element.weight,
        projectId: milestoneBody.projectId,
        baselineId: element.baselineId,
      });
      const savedMilestone = await milestoneRepository.save(milestone);
      const summaryTasks = await summaryTaskService.createSummaryTasks(
        element.properties,
        element.baselineId,
        savedMilestone.id,
        element.baselineId || null
      );
      return {
        ...savedMilestone,
        summaryTask: summaryTasks,
      };
    })
  );

  return milestones;
};
/**
 * Retrieves milestones based on provided filter criteria and options.
 *
 * @function
 * @param {Object} filter - The filter criteria.
 * @param {Object} options - Additional options.
 * @property {number} options.limit - The maximum number of results to return.
 * @property {number} options.page - The page number for pagination.
 * @property {string} options.sortBy - The field to sort the results by.
 * @throws {Error} Throws an error if there's an issue retrieving milestones.
 * @returns {Promise<Array>} - A promise that resolves to an array of milestones.
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
 * Retrieves a milestone by its unique ID.
 *
 * @function
 * @param {string} milestoenId - The ID of the milestone.
 * @throws {Error} Throws an error if there's an issue retrieving the milestone.
 * @returns {Promise<Object>} - A promise that resolves to the retrieved milestone.
 */
const getMilestone = async (milestoenId) => {
  return await milestoneRepository.findOneBy({ id: milestoenId });
};
/**
 * Converts a flat list of items into a hierarchical structure.
 * @function
 * @param {Array} flat - An array of flat objects.
 * @returns {Array} - An array of root-level items forming the hierarchy.
 */
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
/**
 * Retrieves milestones associated with a specific project ID.
 *
 * @function
 * @param {string} projectId - The ID of the project.
 * @throws {Error} Throws an error if there's an issue retrieving milestones.
 * @returns {Promise<Array>} - A promise that resolves to an array of milestones.
 */
const getByProject = async (projectId) => {
  const milestone = await milestoneRepository.find({
    where: { projectId: projectId },

    relations: ['summaryTask', 'summaryTask.tasks'],
    order: { createdAt: 'DESC' },
  });

  for (const item of milestone) {
    let finalSub = flatToHierarchy(item.summaryTask);
    delete item.summaryTask;

    item['summaryTask'] = finalSub;
  }

  return milestone;
};
/**
 * Updates a milestone by its unique ID.
 *
 * @function
 * @param {string} milestoneId - The ID of the milestone.
 * @param {Object} updateBody - The update data for the milestone.
 * @property {Array} updateBody.summaryTask - An array of summary tasks associated with the milestone.
 * @throws {ApiError} Throws an error if the milestone is not found.
 * @returns {Promise<Object>} - A promise that resolves to the updated milestone along with updated summary tasks.
 */
const updateMilestone = async (milestoneId, updateBody) => {
  const milestone = await getMilestone(milestoneId);
  if (!milestone) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Milestone not found');
  }
  let summaryTasks = updateBody['summaryTask'];
  delete updateBody.summaryTask;

  const savedMilestone = await milestoneRepository.save({ ...milestone, ...updateBody });

  let updatedSummaryTask = await summaryTaskService.updateSingleSummaryTask(summaryTasks);
  return { ...savedMilestone, summaryTask: updatedSummaryTask };
};
/**
 * Deletes a milestone by its unique ID.
 *
 * @function
 * @param {string} milestoneId - The ID of the milestone.
 * @throws {ApiError} Throws an error if the milestone is not found.
 * @returns {Promise<Object>} - A promise that resolves when the milestone is successfully deleted.
 */
const deleteMilestone = async (milestoneId) => {
  const milestone = await getMilestone(milestoneId);
  if (!milestone) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Milestone not found');
  }
  return await milestoneRepository.delete({ id: milestoneId });

};
/**
 *This function allows you to update the hasCheckList property of a milestone based on its unique ID.
 * @function
 * @param {string} milestoneId - The ID of the milestone.
 * @throws {Error} Throws an error if the milestone is not found.
 * @returns {Promise<Object>} - A promise that resolves when the `hasCheckList` property of the milestone is successfully updated.
 */
const updateHasCheckList = async (milestoneId) => {
  return await milestoneRepository.update({ id: milestoneId }, { hasCheckList: true });
};
/**
 * This function allows you to update the isEvaluated property of a milestone based on its unique ID.
 * @function
 * @param {string} milestoneId - The ID of the milestone.
 * @throws {Error} Throws an error if the milestone is not found.
 * @returns {Promise<Object>} - A promise that resolves when the `isEvaluted` property of the milestone is successfully updated.
 */
const updateIsEvaluted = async (milestoneId) => {
  return await milestoneRepository.update({ id: milestoneId }, { isEvaluted: true });
};
/**
 * This function allows you to update the isSendToDOO property of a milestone based on its unique ID.
 * @function
 * @param {string} milestoneId - The ID of the milestone.
 * @throws {Error} Throws an error if the milestone is not found.
 * @returns {Promise<Object>} - A promise that resolves when the `isSendToDOO` property of the milestone is successfully updated.
 */
const updateIsSendToDOO = async (milestoneId) => {
  return await milestoneRepository.update({ id: milestoneId }, { isSendToDOO: true });
};

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
  flatToHierarchy,
};
