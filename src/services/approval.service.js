const httpStatus = require('http-status');
const { ApprovalLevel, ApprovalModule, ApprovalStage } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const services = require('./index');

const approvalStageRepository = dataSource.getRepository(ApprovalStage).extend({
  findAll,
  sortBy,
});
const approvalModuleRepository = dataSource.getRepository(ApprovalModule).extend({
  findAll,
  sortBy,
});
const approvalGroupRepository = dataSource.getRepository(ApprovalStage).extend({
  findAll,
  sortBy,
});

/**
 * send for approval
 * @param {Object} approval
 * @returns {Promise<>}
 */
const sendForApproval = async (approvalModuleName, moduleId) => {
  const approvalModule = await approvalModuleRepository.findOneBy({ moduleName: approvalModuleName });
  let updatedModule = null;
  if (!approvalModule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'approval module does not exist');
  }

  const approvalStage = await approvalStageRepository.findOneBy({ approvalModule: approvalModule, level: 1 });
  if (!approvalStage) {
    throw new ApiError(httpStatus.NOT_FOUND, 'approval Stage does not exist');
  }

  if (approvalModuleName == 'ProjectBudget') {
    const module = await approvalGroupRepository.findOneBy({ id: moduleId });
    if (!module) {
      throw new ApiError(httpStatus.NOT_FOUND, 'approval module(group) does not exist');
    }
    updatedModule = await approvalGroupRepository.update({ id: moduleId }, { approvalStage: approvalStage });
  }
  let currentApprover = getCurrentApprover(approvalModuleName, moduleId);
  return currentApprover;
};

/**
 * Query for approval level
 * @param {Object} filter - Filter options
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

const getCurrentApprover = async (moduleName, moduleId) => {
  const approvalModule = await approvalModuleRepository.findOneBy({ moduleName: approvalModuleName });
  let currentApprover = {};
  if (!approvalModule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'approval module does not exist');
  }
  if (moduleName == 'ProjectBudget') {
    const module = await approvalGroupRepository.findOneBy({ id: moduleId });
    if (!module) {
      throw new ApiError(httpStatus.NOT_FOUND, 'approval module(group) does not exist');
    }
    currentApprover = module.project.projectMembers;
  }
  return currentApprover;
};

/**
 * Get budget by id
 * @param {ObjectId} id
 * @returns {Promise<Project>}
 */
const getApprovalModule = async (id) => {
  return await approvalModuleRepository.findOneBy({ id: id });
};

module.exports = {
  sendForApproval,
};
