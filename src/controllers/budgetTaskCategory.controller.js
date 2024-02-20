const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { budgetTaskCategoryService, budgetTypeService } = require('../services');
/**
 * @module budgetTaskCategory
 */
/**
 * Creates a new budget task category.
 * @function
 * @param {Object} req - The request object containing the budget task category data.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves once the budget task category is created.
 */

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
/**
 * Retrieves all budget task categories based on the provided filter and options.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with all budget task categories.
 */
const getAllBudgetTaskCategories = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const budgetTaskCategories = await budgetTaskCategoryService.getAllBudgetTaskCategories(filter, options);
  res.status(httpStatus.OK).send(budgetTaskCategories);
});
/**
 * Retrieves a budget task category by its ID.
 * @function
 * @param {Object} req - The request object containing the budget task category ID.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the budget task category data.
 */

const getBudgetTaskCategory = catchAsync(async (req, res) => {
  const budgetTaskCategory = await budgetTaskCategoryService.getBudgetTaskCategory(req.params.budgetTaskCategoryId);
  if (!budgetTaskCategory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Budget TAsk Category not found');
  }
  res.status(httpStatus.OK).send(budgetTaskCategory);
});
/**
 * Updates a budget task category by its ID.
 * @function
 * @param {Object} req - The request object containing the budget task category ID and updated data.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the updated budget task category data.
 */

const updateBudgetTaskCategory = catchAsync(async (req, res) => {
  const updatedBudgetTaskCategory = await budgetTaskCategoryService.updateBudgetTaskCategory(
    req.params.budgetTaskCategoryId,
    req.body
  );
  res.send(updatedBudgetTaskCategory);
});
/**
 * Deletes a budget task category by its ID.
 * @function
 * @param {Object} req - The request object containing the budget task category ID.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves once the budget task category is deleted.
 */

const deleteBudgetTaskCategory = catchAsync(async (req, res) => {
  console.log(req.params.budgetTaskCategoryId);
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
