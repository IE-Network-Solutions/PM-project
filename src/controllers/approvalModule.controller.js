const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { approvalModuleService } = require('../services');
/**
 * @module approvalModule
 */
/**
 * Creates a new approval module.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves once the approval module is created.
 */

const approvalModule = catchAsync(async (req, res) => {
  const approvalModule = await approvalModuleService.createApprovalModule();
  res.status(httpStatus.CREATED).json(approvalModule);
});
/**
 * Retrieves all approval modules.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with all approval modules.
 */

const getApprovalModules = catchAsync(async (req, res) => {
  const approvalModules = await approvalModuleService.getApprovalModules();
  res.send(approvalModules);
});

// const getBaseline = catchAsync(async (req, res) => {
//   const baseline = await baselineService.getBaseline(req.params.baselineId);
//   if (!baseline) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Baseline not found');
//   }
//   res.send(baseline);
// });

// const getByMilestone = catchAsync(async (req, res) => {
//   const milestoneBaseline = await baselineService.getByMilestone(req.params.milestoneId);
//   res.send(milestoneBaseline);
// });

// const updateBaseline = catchAsync(async (req, res) => {
//   const baseline = await baselineService.updateBaseline(req.params.baselineId, req.body);
//   res.send(baseline);
// });
// const deleteBaseline = catchAsync(async (req, res) => {
//   await baselineService.deleteBaseline(req.params.baselineId);
//   res.status(httpStatus.NO_CONTENT).send();
// });

module.exports = {
  approvalModule,
  getApprovalModules,
};
