const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { budgetTaskCategoryService, budgetTypeService } = require('../services');

const createBudgetTaskCategory = catchAsync(async (req, res) => {
  const data = req.body;

  const budgetType = await budgetTypeService.getBudgetType(data.budgetTypeId);
  if (!budgetType) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Budget Type not found');
  }
  data.budgetType = budgetType;
  console.log(data);
  const budgetTaskCategory = await budgetTaskCategoryService.createBudgetTaskCategory(data);
  res.status(httpStatus.CREATED).send(budgetTaskCategory);
});

const getAllBudgetTaskCategories = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const budgetTaskCategories = await budgetTaskCategoryService.getAllBudgetTaskCategories(filter, options);
  res.status(httpStatus.OK).send(budgetTaskCategories);
});

const getBudgetTaskCategory = catchAsync(async (req, res) => {
  const budgetTaskCategory = await budgetTaskCategoryService.getBudgetTaskCategory(req.params.budgetTaskCategoryId);
  if (!budgetTaskCategory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Budget TAsk Category not found');
  }
  res.status(httpStatus.OK).send(budgetTaskCategory);
});

const updateBudgetTaskCategory = catchAsync(async (req, res) => {
  const updatedBudgetTaskCategory = await budgetTaskCategoryService.updateBudgetTaskCategory(
    req.params.budgetTaskCategoryId,
    req.body
  );
  res.send(updatedBudgetTaskCategory);
});

const deleteBudgetTaskCategory = catchAsync(async (req, res) => {
  await budgetTaskCategoryService.deleteBudgetTaskCategory(req.params.budgetTaskCategoryId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createBudgetTaskCategory,
  getAllBudgetTaskCategories,
  getBudgetTaskCategory,
  updateBudgetTaskCategory,
  deleteBudgetTaskCategory,
};
