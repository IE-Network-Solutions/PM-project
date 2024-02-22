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
 * @module approvalStage
 */
/**
 * Creates approval stages.
 * @function
 * @async
 * @param {ApprovalStage[]} ApprovalStages - An array of approval stage data.
 * @returns {Promise<ApprovalStage[]>} - An array of created approval stage objects.
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
 * Generates approval stages for seeding.
 * @function
 * @returns {ApprovalStage[]} - An array of approval stage objects.
 */
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
 * Retrieves approval stages along with associated roles.
 * @function
 * @async
 * @returns {Promise<ApprovalStage[]>} - An array of approval stage objects, each including related role information.
 */
const getApprovalStages = async () => {
  return await ApprovalStageRepository.find({ relations: ['role'] });
};

/**
 * Retrieves an approval stage by its ID.
 * @function
 * @async
 * @param {number} id - The unique identifier of the approval stage.
 * @returns {Promise<ApprovalStage | null>} - The approval stage object, or null if not found.
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
