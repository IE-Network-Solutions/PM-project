const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { approvalService } = require('../services');

const sendForApproval = catchAsync(async (req, res) => {
  const approval = await approvalService.sendForApproval(req.body.approvalModule, req.body.moduleId);
  res.status(httpStatus.CREATED).json(approval);
});
const getCurrentApprover = catchAsync(async (req, res) => {
  const currentApprover = await approvalService.getCurrentApprover(req.query.approvalModule, req.query.moduleId);
  res.send(currentApprover);
});

const approve = catchAsync(async (req, res) => {
  console.log("selammmmm", req.body);
  const updatedData = await approvalService.approve(req.body.moduleName, req.body.moduleId);
  res.send(updatedData);
});
const reject = catchAsync(async (req, res) => {
  const budgetComment = req.body.comment;
  console.log(budgetComment,"budget coment")
  const updatedData = await approvalService.reject(req.body.moduleName, req.body.moduleId, budgetComment,req.body.userId);
  res.send(updatedData);
});

module.exports = {
  sendForApproval,
  getCurrentApprover,
  approve,
  reject,
};
