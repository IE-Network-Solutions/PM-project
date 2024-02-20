const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { approvalLevelService } = require('../services');
/**
 * @module approvalLevel
 */
/**
 * Creates a new approval level.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves once the approval level is created.
 */

const approvalLevel = catchAsync(async (req, res) => {
  const approvalModule = await approvalLevelService.createApprovalLevel();
  res.status(httpStatus.CREATED).json(approvalModule);
});
/**
 * Retrieves all approval levels.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with all approval levels.
 */

const getApprovalLevels = catchAsync(async (req, res) => {
  const approvalModules = await approvalLevelService.getApprovalLevels();
  res.send(approvalModules);
});

module.exports = {
  approvalLevel,
  getApprovalLevels,
};
