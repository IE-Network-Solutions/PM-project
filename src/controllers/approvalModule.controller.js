const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { approvalModuleService } = require('../services');

const approvalModule = catchAsync(async (req, res) => {
  const approvalModule = await approvalModuleService.createApprovalModule();
  res.status(httpStatus.CREATED).json(approvalModule);
});

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
