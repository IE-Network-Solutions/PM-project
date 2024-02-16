const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { budgetCategoryService, budgetCategoryTypeService } = require('../services');
const { budgetCategoryType } = require('../models');

const createBudgetCategory = catchAsync(async (req, res) => {
  try {
    const data = req.body;
    const budgetcategoryType = await budgetCategoryTypeService.getBudgetCategoryType(data.budgetCategoryTypeId);
    data.budgetCategoryType = budgetcategoryType;
    data.budgetCategorySlug = data.budgetCategoryName.toLowerCase().replace(/\s/g, '_');
    delete data.budgetCategoryTypeId;
    const budgetCategory = await budgetCategoryService.createBudgetCategory(req.body);
    res.status(httpStatus.CREATED).send(budgetCategory);
  } catch (error) {
    throw error;
  }
});

const getAllBudgetCategories = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const budgetCategories = await budgetCategoryService.getAllBudgetCategories(filter, options);
  res.status(httpStatus.OK).send(budgetCategories);
});

const getBudgetCategory = catchAsync(async (req, res) => {
  const budgetCategory = await budgetCategoryService.getBudgetCategory(req.params.budgetCategoryId);
  if (!budgetCategory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Budget Category not found');
  }
  res.status(httpStatus.OK).send(budgetCategory);
});

const updateBudgetCategory = catchAsync(async (req, res) => {
  const data = req.body;
  data.budgetCategorySlug = data.budgetCategoryName.toLowerCase().replace(/\s/g, '_');
  if (data.budgetCategoryTypeId) {
    const budgetcategoryType = await budgetCategoryTypeService.getBudgetCategoryType(data.budgetCategoryTypeId);
    data.budgetCategoryType = budgetcategoryType;
  }
  delete data.budgetCategoryTypeId;
  const updatedBudgetCategory = await budgetCategoryService.updateBudgetCategory(req.params.budgetCategoryId, req.body);
  res.send(updatedBudgetCategory);
});

const deleteBudgetCategory = catchAsync(async (req, res) => {
  await budgetCategoryService.deleteBudgetCategoryId(req.params.budgetCategoryId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createBudgetCategory,
  getAllBudgetCategories,
  getBudgetCategory,
  updateBudgetCategory,
  deleteBudgetCategory,
};
