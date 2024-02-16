const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { approvalService } = require('../services');
/**
 * @module approval
 */

/**
 * Sends a module for approval.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the created approval result.
 */
const sendForApproval = catchAsync(async (req, res) => {
  const approval = await approvalService.sendForApproval(req.body.approvalModule, req.body.moduleId);
  res.status(httpStatus.CREATED).json(approval);
});

/**
 * Retrieves the current approver for a module.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the current approver information.
 */
const getCurrentApprover = catchAsync(async (req, res) => {
  const currentApprover = await approvalService.getCurrentApprover(req.query.approvalModule, req.query.moduleId);
  res.send(currentApprover);
});

/**
 * Approves a module.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the updated data after approval.
 */
const approve = catchAsync(async (req, res) => {
  const updatedData = await approvalService.approve(req.body.moduleName, req.body.moduleId);
  res.send(updatedData);
});

/**
 * Rejects(do not approve) a module.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the updated data after rejection.
 */
const reject = catchAsync(async (req, res) => {
  const budgetComment = req.body.comment;
  const updatedData = await approvalService.reject(req.body.moduleName, req.body.moduleId, budgetComment, req.body.userId);
  res.send(updatedData);
});

module.exports = {
  sendForApproval,
  getCurrentApprover,
  approve,
  reject,
};
