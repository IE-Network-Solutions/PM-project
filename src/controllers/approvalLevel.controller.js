const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { approvalLevelService } = require('../services');

const approvalLevel = catchAsync(async (req, res) => {
  const approvalModule = await approvalLevelService.createApprovalLevel();
  res.status(httpStatus.CREATED).json(approvalModule);
});

const getApprovalLevels = catchAsync(async (req, res) => {
  const approvalModules = await approvalLevelService.getApprovalLevels();
  res.send(approvalModules);
});

module.exports = {
  approvalLevel,
  getApprovalLevels,
};
