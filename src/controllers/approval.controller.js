const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { approvalService } = require('../services');

const sendForApproval = catchAsync(async (req, res) => {
  const approval = await approvalService.sendForApproval(req.body.approvalModule, req.body.moduleId);
  res.status(httpStatus.CREATED).json(approval);
});

// const getApprovalLevels = catchAsync(async (req, res) => {
//   const approvalModules = await approvalLevelService.getApprovalLevels();
//   res.send(approvalModules);
// });

module.exports = {
  sendForApproval,
  //   getApprovalLevels,
};
