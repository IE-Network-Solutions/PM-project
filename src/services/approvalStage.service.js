const httpStatus = require('http-status');
const { ApprovalStage } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const services = require('./index');

const ApprovalStageRepository = dataSource.getRepository(ApprovalStage).extend({
  findAll,
  sortBy,
});

/**
 * Create a approval stage
 * @param {Object}
 * @returns {Promise<Project>}
 */
const createApprovalStage = async (ApprovalStages) => {
  const approvalStages = ApprovalStages.map((approvalStage) => {
    const approvalStageData = ApprovalStageRepository.create(approvalStage);
    return approvalStageData;
  });
  await ApprovalStageRepository.save(approvalStages);
  return approvalStages;
};

/**
 * Query for budget
 * @param {Object} filter - Filter options
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

const getApprovalStages = async () => {
  return await ApprovalStageRepository.find();
};

/**
 * Get budget by id
 * @param {ObjectId} id
 * @returns {Promise<Project>}
 */
const getApprovalStage = async (id) => {
  return await budgetRepository.findOneBy({ id: id });
};

// /**
//  * Update budget by id
//  * @param {ObjectId} budgetId
//  * @param {Object} updateBody
//  * @returns {Promise<Project>}
//  */
// const updateBudget = async (budgetId, updateBody) => {
//   const budget = await budgetRepository.update({ id: budgetId }, updateBody);
//   return await getBudget(budgetId);
// };

// /**
//  * Delete budget by id
//  * @param {ObjectId} budgetId
//  * @returns {Promise<Budget>}
//  */
// const deleteBudget = async (budgetId) => {
//   const budget = await getBudget(budgetId);
//   if (!budget) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Budget not found');
//   }
//   return await budgetRepository.delete({ id: budgetId });
// };

module.exports = {
  createApprovalStage,
  getApprovalStages,
  getApprovalStage,
};
