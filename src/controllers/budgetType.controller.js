const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { budgetTypeService } = require('../services');

const createBudgetType = catchAsync(async (req, res) => {
  const budgetType = await budgetTypeService.createBudgetType(req.body);
  res.status(httpStatus.CREATED).send(budgetType);
});

const getAllBudgetTypes = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const budgetTypes = await budgetTypeService.getAllBudgetTypes(filter, options);
  res.status(httpStatus.OK).send(budgetTypes);
});
const getAllOfficeBudgetTypes = catchAsync(async (req, res) => {
  // const filter = pick(req.query, ['status']);
  // const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const budgetTypes = await budgetTypeService.getAllOfficeBudgetTypes();
  res.status(httpStatus.OK).send(budgetTypes);
});

const getBudgetType = catchAsync(async (req, res) => {
  const budgetType = await budgetTypeService.getBudgetType(req.params.budgetTypeId);
  if (!budgetType) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Budget Type not found');
  }
  res.status(httpStatus.OK).send(budgetType);
});

const updateBudgetType = catchAsync(async (req, res) => {
  const updatedBudgetType = await budgetTypeService.updateBudgetType(req.params.budgetTypeId, req.body);
  res.send(updatedBudgetType);
});

const deleteBudgetType = catchAsync(async (req, res) => {
  await budgetTypeService.deleteBudgetTypeId(req.params.budgetTypeId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createBudgetType,
  getAllBudgetTypes,
  getBudgetType,
  updateBudgetType,
  deleteBudgetType,
  getAllOfficeBudgetTypes
};
