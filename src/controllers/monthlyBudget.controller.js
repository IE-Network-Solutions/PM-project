const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { monthlyBudgetService } = require('../services');
const { budgetSessionService } = require('../services');

const getMonthlyBudget = catchAsync(async (req, res) => {
  const monthlyBudget = await monthlyBudgetService.getMonthlyBudgets();
  res.status(200).json(monthlyBudget);
});

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
const createOfficeMonthlyBudget = catchAsync(async (req, res) => {
  let month = {};
  month.from = req.body.from;
  month.to = req.body.to;
  const projectId = req.body.budgetsData[0].projectId

  const monthlyBudgetData = await monthlyBudgetService.getMonthlyBudgetByMonthGroupOfficeProject(month, projectId);

  if (Object.values(monthlyBudgetData).length !== 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'monthly budget already exist');
  }

  const monthlyBudget = await monthlyBudgetService.createMontlyOfficeBudget(req.body);
  res.status(httpStatus.CREATED).json(monthlyBudget);
});

const updateMonthlyBudget = catchAsync(async (req, res) => {
  const monthlyBudget = await monthlyBudgetService.updateMonthlyBudget(req.params.id, req.body);
  res.status(httpStatus.CREATED).json(monthlyBudget);
});

const updateOfficeMonthlyBudget = catchAsync(async (req, res) => {
  const monthlyBudget = await monthlyBudgetService.updateOfficeMonthlyBudget(req.params.id, req.body);
  res.status(httpStatus.CREATED).json(monthlyBudget);
});

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


const getMonthlyBudgetByProject = catchAsync(async (req, res) => {
  const monthlyBudget = await monthlyBudgetService.getBudgetByProject(req.params.projectId);
  res.status(httpStatus.CREATED).json(monthlyBudget);

});
module.exports = {
  createMonthlyBudget,
  getMonthlyBudget,
  updateMonthlyBudget,
  getMonthlyBudgetByMonth,
  getMonthlyBudgetByMonthGroupedByProject,
  getMonthlyBudgetByMonthGroupedByProjectOfficeProject,
  getMonthlyBudgetByProject,
  createOfficeMonthlyBudget,
  updateOfficeMonthlyBudget
};
