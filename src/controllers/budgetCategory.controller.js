const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { budgetCategoryService, budgetCategoryTypeService } = require('../services');
const { budgetCategoryType } = require('../models');
/**
 * @module budgetCategory
 */
/**
 * Creates a new budget category.
 * @function
 * @param {Object} req - The request object containing the budget category data.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves once the budget category is created.
 */

const createBudgetCategory = catchAsync(async (req, res) => {
  try {
    const data = req.body;
    const budgetcategoryType = await budgetCategoryTypeService.getBudgetCategoryType(data.budgetCategoryTypeId);
    data.budgetCategoryType = budgetcategoryType;
    data.budgetCategorySlug = data.budgetCategoryName.toLowerCase().replace(/\s/g, '_');
    delete data.budgetCategoryTypeId;
    console.log(data);
    const budgetCategory = await budgetCategoryService.createBudgetCategory(req.body);
    res.status(httpStatus.CREATED).send(budgetCategory);
  } catch (error) {
    throw error;
  }
});
/**
 * Retrieves all budget categories based on the provided filter and options.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with all budget categories.
 */

const getAllBudgetCategories = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const budgetCategories = await budgetCategoryService.getAllBudgetCategories(filter, options);
  res.status(httpStatus.OK).send(budgetCategories);
});
/**
 * Retrieves a budget category by its ID.
 * @function
 * @param {Object} req - The request object containing the budget category ID.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the budget category data.
 */

const getBudgetCategory = catchAsync(async (req, res) => {
  const budgetCategory = await budgetCategoryService.getBudgetCategory(req.params.budgetCategoryId);
  if (!budgetCategory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Budget Category not found');
  }
  res.status(httpStatus.OK).send(budgetCategory);
});
/**
 * Updates a budget category by its ID.
 * @function
 * @param {Object} req - The request object containing the budget category ID and updated data.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the updated budget category data.
 */

const updateBudgetCategory = catchAsync(async (req, res) => {
  const data = req.body;
  data.budgetCategorySlug = data.budgetCategoryName.toLowerCase().replace(/\s/g, '_');
  if (data.budgetCategoryTypeId) {
    const budgetcategoryType = await budgetCategoryTypeService.getBudgetCategoryType(data.budgetCategoryTypeId);
    data.budgetCategoryType = budgetcategoryType;
  }
  delete data.budgetCategoryTypeId;
  console.log(data);
  const updatedBudgetCategory = await budgetCategoryService.updateBudgetCategory(req.params.budgetCategoryId, req.body);
  res.send(updatedBudgetCategory);
});
/**
 * Deletes a budget category by its ID.
 * @function
 * @param {Object} req - The request object containing the budget category ID.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves once the budget category is deleted.
 */

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
