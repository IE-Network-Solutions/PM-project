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


const approvalStageSeeder = async () => {
  const approvalStages = [
    {
      "moduleName": "ProjectBudget",
      "approvalStage": [
          {
              "level": 1,
              "roleId": "4eafb2fd-e9e4-40d0-8c87-a2a2b9c48c5f",
              "project_role": 0
          },
      ]
    },
    {
      "moduleName": "MonthlyBudget",
      "approvalStage": [
          {
              "level": 1,
              "roleId": "0e324e94-6f2c-415c-9a46-a359a96fea7f",
              "project_role": 0
          },
          {
              "level": 2,
              "roleId": "66d7bce9-c323-4fdc-906e-77f9c4b2edd0",
              "project_role": 0
          }
      ]
    },
    {
      "moduleName": "ProjectSchedule",
      "approvalStage": [
          {
              "level": 1,
              "roleId": "5dbeddaf-3490-4151-9e80-303c70f18a10",
              "project_role": 1
          },
          {
              "level": 2,
              "roleId": "4eafb2fd-e9e4-40d0-8c87-a2a2b9c48c5f",
              "project_role": 0
          },
          {
              "level": 2,
              "roleId": "962fbf27-01c7-4b77-80f7-aa2f39936c8d",
              "project_role": 0
          }
      ]
    }
  ]

  return approvalStages;
}

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
  return await ApprovalStageRepository.find({ relations: ['role'] });
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
  approvalStageSeeder
};
