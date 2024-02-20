const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { budgetCategoryTypeService } = require('../services');
/**
 * @module budgetCategoryType
 */

/**
 * Creates a new budget category type.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the created budget category type.
 * @throws {ApiError} - Throws an error if the budget category type is not found.
 */
const createBudgetCategoryType = catchAsync(async (req, res) => {
  try {
    let data = req.body;
    data.budgetCategoryTypeSlug = data.budgetCategoryTypeName.toLowerCase().replace(/\s/g, '_');

    const budgetCategoryType = await budgetCategoryTypeService.createBudgetCategoryType(req.body);
    res.status(httpStatus.CREATED).send(budgetCategoryType);
  } catch (error) {
    throw error;
  }
});

/**
 * Retrieves all budget category types.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the list of budget category types.
 */
const getAllBudgetCategoryType = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const budgetCategoryType = await budgetCategoryTypeService.getAllBudgetCategoryTypes(filter, options);
  res.status(httpStatus.OK).send(budgetCategoryType);
});

/**
 * Retrieves a specific budget category type by ID.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the requested budget category type.
 * @throws {ApiError} - Throws an error if the budget category type is not found.
 */
const getBudgetCategoryType = catchAsync(async (req, res) => {
  const budgetCategoryType = await budgetCategoryTypeService.getBudgetCategoryType(req.params.budgetCategoryId);
  if (!budgetCategoryType) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Budget Category Type not found');
  }
  res.status(httpStatus.OK).send(budgetCategoryType);
});

/**
 * Updates a budget category type.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the updated budget category type.
 */
const updateBudgetCategoryType = catchAsync(async (req, res) => {
  let data = req.body;
  data.budgetCategoryTypeSlug = data.budgetCategoryTypeName.toLowerCase().replace(/\s/g, '_');
  const updatedBudgetCategoryType = await budgetCategoryTypeService.updateBudgetCategoryType(
    req.params.budgetCategoryTypeId,
    data
  );
  res.send(updatedBudgetCategoryType);
});

/**
 * Deletes a budget category type by ID.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with a success status.
 */
const deleteBudgetCategoryType = catchAsync(async (req, res) => {
  await budgetCategoryTypeService.deleteBudgetCategoryTypeId(req.params.budgetCategoryTypeId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createBudgetCategoryType,
  getAllBudgetCategoryType,
  getBudgetCategoryType,
  updateBudgetCategoryType,
  deleteBudgetCategoryType,
};
