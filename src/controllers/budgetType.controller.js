const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { budgetTypeService } = require('../services');
/**
 * @module budgetType
 */
/**
 * Creates a new budget type.
 * @function
 * @param {Object} req - The request object containing the budget type data.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves once the budget type is created.
 */

const createBudgetType = catchAsync(async (req, res) => {
  const budgetType = await budgetTypeService.createBudgetType(req.body);
  res.status(httpStatus.CREATED).send(budgetType);
});
/**
 * Retrieves all budget types based on the provided filter and options.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with all budget types.
 */

const getAllBudgetTypes = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const budgetTypes = await budgetTypeService.getAllBudgetTypes(filter, options);
  res.status(httpStatus.OK).send(budgetTypes);
});
/**
 * Retrieves all office budget types.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with all office budget types.
 */

const getAllOfficeBudgetTypes = catchAsync(async (req, res) => {
  // const filter = pick(req.query, ['status']);
  // const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const budgetTypes = await budgetTypeService.getAllOfficeBudgetTypes();
  res.status(httpStatus.OK).send(budgetTypes);
});
/**
 * Retrieves a budget type by its ID.
 * @function
 * @param {Object} req - The request object containing the budget type ID.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the budget type data.
 */

const getBudgetType = catchAsync(async (req, res) => {
  const budgetType = await budgetTypeService.getBudgetType(req.params.budgetTypeId);
  if (!budgetType) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Budget Type not found');
  }
  res.status(httpStatus.OK).send(budgetType);
});
/**
 * Updates a budget type by its ID.
 * @function
 * @param {Object} req - The request object containing the budget type ID and updated data.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the updated budget type data.
 */

const updateBudgetType = catchAsync(async (req, res) => {
  const updatedBudgetType = await budgetTypeService.updateBudgetType(req.params.budgetTypeId, req.body);
  res.send(updatedBudgetType);
});
/**
 * Deletes a budget type by its ID.
 * @function
 * @param {Object} req - The request object containing the budget type ID.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves once the budget type is deleted.
 */

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
