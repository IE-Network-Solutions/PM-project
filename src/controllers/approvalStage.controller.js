const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { roleService, approvalModuleService, approvalStageService } = require('../services');
/**
 * @module approvalStage
 */
/**
 * Creates new approval stages based on the provided data.
 * @function
 * @param {Object} req - The request object containing the data for creating approval stages.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves once the approval stages are created.
 */

const createApprovalStage = catchAsync(async (req, res) => {
  const data = req.body;

  async function returnApprovalStageData(data) {
    const approvalStageData = [];

    for (const stage of data) {
      const role = await roleService.getRole(stage.roleId);
      if (!role) {
        throw new ApiError(httpStatus.NOT_FOUND, 'role not found');
      }
      const approvalModule = await approvalModuleService.getApprovalModule(stage.moduleId);
      if (!approvalModule) {
        throw new ApiError(httpStatus.NOT_FOUND, 'role not found');
      }

      const singleApprovalStageData = {
        level: stage.level,
        role: role,
        approvalModule: approvalModule,
        project_role: stage.project_role ? stage.project_role : false
      };

      approvalStageData.push(singleApprovalStageData);
    }
    return approvalStageData;
  }
  const approvalstagedata = await returnApprovalStageData(data);
  const approvalStage = await approvalStageService.createApprovalStage(approvalstagedata);

  res.status(httpStatus.CREATED).send(approvalStage);
});
/**
 * Retrieves all approval stages.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with all approval stages.
 */

const getApprovalStages = catchAsync(async (req, res) => {
  const result = await approvalStageService.getApprovalStages();
  res.send(result);
});

// const getBudget = catchAsync(async (req, res) => {
//   const budget = await budgetService.getBudget(req.params.taskId);
//   if (!budget) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Budget not found');
//   }
//   res.send(budget);
// });

// const updateBudget = catchAsync(async (req, res) => {
//   const data = req.body;
//   const budget = await budgetService.getBudget(req.params.budgetId);
//   if (!budget) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Budget not found');
//   }
//   if (data.budgetCategory) {
//     const budgetCategory = await budgetCategoryService.getBudgetCategory(data.budgetCategory);
//     if (!budgetCategory) {
//       throw new ApiError(httpStatus.NOT_FOUND, 'Budget Category Not found not found');
//     }
//     data.budgetCategory = budgetCategory;
//   }
//   if (data.taskCategory) {
//     const taskCategory = await budgetTaskCategoryService.getBudgetTaskCategory(data.taskCategory);
//     if (!taskCategory) {
//       throw new ApiError(httpStatus.NOT_FOUND, 'Budget Task Category Not found not found');
//     }
//     data.taskCategory = taskCategory;
//   }
//   const updatedBudget = await budgetService.updateBudget(req.params.budgetId, data);
//   res.send(updatedBudget);
// });

// const deleteBudget = catchAsync(async (req, res) => {
//   await budgetService.deleteBudget(req.params.budgetId);
//   res.status(httpStatus.NO_CONTENT).send();
// });

module.exports = {
  createApprovalStage,
  getApprovalStages,
};
