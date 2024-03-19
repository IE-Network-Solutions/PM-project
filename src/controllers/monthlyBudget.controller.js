const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { monthlyBudgetService } = require('../services');
const { budgetSessionService } = require('../services');
/**
 * @module monthlyBudget
 */

/**
 * Retrieves monthly budget data.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the list of monthly budgets.
 */
const getMonthlyBudget = catchAsync(async (req, res) => {
  const monthlyBudget = await monthlyBudgetService.getMonthlyBudgets();
  res.status(200).json(monthlyBudget);
});

/**
 * Creates a new monthly budget.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the created monthly budget.
 * @throws {ApiError} - Throws an error if the monthly budget already exists.
 */
const createMonthlyBudget = catchAsync(async (req, res) => {
  let month = {};
  month.from = req.body.from;
  month.to = req.body.to;

  const monthlyBudgetData = await monthlyBudgetService.getMonthlyBudgetByMonthGroup(month);

  if (monthlyBudgetData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'monthly budget already exist');
  }

  const monthlyBudget = await monthlyBudgetService.createMontlyBudget(req.body);
  res.status(httpStatus.CREATED).json(monthlyBudget);
});

/**
 * Updates an existing monthly budget.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the updated monthly budget.
 */
const updateMonthlyBudget = catchAsync(async (req, res) => {
  const monthlyBudget = await monthlyBudgetService.updateMonthlyBudget(req.params.id, req.body);
  res.status(httpStatus.CREATED).json(monthlyBudget);
});


const createOfficeMonthlyBudget = catchAsync(async (req, res) => {
  let month={}
  month.from=req.body.from
  month.to=req.body.to
  const projectId=req.body.budgetsData[0].projectId
  const monthlyBudgetExists=  await monthlyBudgetService.getMonthlyBudgetByMonthGroupOfficeProject(month,projectId)
  if(Object.keys(monthlyBudgetExists).length !== 0){
    throw new ApiError(httpStatus.NOT_FOUND, 'Monthly Budget Already exists');
  }
  const monthlyBudget = await monthlyBudgetService.createMontlyOfficeBudget(req.body);
  res.status(httpStatus.CREATED).json(monthlyBudget);
});
/**
 * Updates an existing monthly budget for office.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the updated monthly budget.
 */
const updateOfficeMonthlyBudget = catchAsync(async (req, res) => {
  const monthlyBudget = await monthlyBudgetService.updateOfficeMonthlyBudget(req.params.id, req.body);
  res.status(httpStatus.CREATED).json(monthlyBudget);
});

/**
 * Retrieves monthly budget data for a specific month range.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the monthly budget data for the specified month range.
 * @throws {ApiError} - Throws an error if no monthly budget exists for the given range.
 */
const getMonthlyBudgetByMonth = catchAsync(async (req, res) => {
  let month = {};
  month.from = req.params.from;

  month.to = req.params.to;

  const monthlyBudgetData = await monthlyBudgetService.getMonthlyBudgetByMonthGroup(month);

  if (!monthlyBudgetData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'no monthly budget exist');
  }

  res.status(200).json(monthlyBudgetData);
});

/**
 * Retrieves monthly budget data grouped by project and month.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the monthly budget data grouped by project and month.
 * @throws {ApiError} - Throws an error if no monthly budget exists.
 */
const getMonthlyBudgetByMonthGroupedByProject = catchAsync(async (req, res) => {
  let date = {};
  date.month = req.body.month;

  date.year = req.body.year;

  const monthlyBudgetData = await monthlyBudgetService.getMonthlyBudgetByProjectGroup(date);

  if (!monthlyBudgetData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'no monthly budget exist');
  }

  res.status(200).json(monthlyBudgetData);
});

/**
 * Retrieves monthly budget data grouped by project, office, and month.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the monthly budget data grouped by project, office, and month.
 * @throws {ApiError} - Throws an error if no monthly budget exists.
 */
const getMonthlyBudgetByMonthGroupedByProjectOfficeProject = catchAsync(async (req, res) => {
  let date = {};
  date.month = req.body.month;

  date.year = req.body.year;

  const monthlyBudgetData = await monthlyBudgetService.getMonthlyBudgetByProjectGroupoffice(date);

  if (!monthlyBudgetData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'no monthly budget exist');
  }

  res.status(200).json(monthlyBudgetData);
});

/**
 * Retrieves monthly budget data for a specific project.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the monthly budget data for the specified project.
 */
const getMonthlyBudgetByProject = catchAsync(async (req, res) => {
  const monthlyBudget = await monthlyBudgetService.getBudgetByProject(req.params.projectId);
  res.status(httpStatus.CREATED).json(monthlyBudget);

});


const RequestApprovalOfficeMonthlyBudget=catchAsync(async(req,res)=>{
const monthlyBudget= await  monthlyBudgetService.RequestApprovalOfficeMonthlyBudget(req.params.id)
res.status(httpStatus.CREATED).json(monthlyBudget);


})
module.exports = {
  createMonthlyBudget,
  getMonthlyBudget,
  updateMonthlyBudget,
  getMonthlyBudgetByMonth,
  getMonthlyBudgetByMonthGroupedByProject,
  getMonthlyBudgetByMonthGroupedByProjectOfficeProject,
  getMonthlyBudgetByProject,
  createOfficeMonthlyBudget,
  updateOfficeMonthlyBudget,
  RequestApprovalOfficeMonthlyBudget
};
