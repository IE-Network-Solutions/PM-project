const httpStatus = require('http-status');
const { BudgetType } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');

const budgetTypeRepository = dataSource.getRepository(BudgetType).extend({
  findAll,
  sortBy,
});
/**
 * @module budgetType
 */
/**
 * Creates a budget type.
 * @function
 * @param {object} budgetTypeData - The data for the budget type.
 * @returns {Promise<object>} - A promise that resolves with the saved budget type.
 */
const createBudgetType = async (budgetTypeData) => {
  const budgetType = budgetTypeRepository.create(budgetTypeData);
  return await budgetTypeRepository.save(budgetType);
};

/**
 * Retrieves all budget types.
 * @function
 * @param {object} filter - The filter criteria for querying budget types.
 * @param {object} options - Additional options for pagination and sorting.
 * @param {number} options.limit - The maximum number of results to return.
 * @param {number} options.page - The page number for pagination.
 * @param {string} options.sortBy - The field to sort the results by.
 * @returns {Promise<object[]>} - A promise that resolves with an array of budget types.
 */
const getAllBudgetTypes = async (filter, options) => {
  const { limit, page, sortBy } = options;

  return await budgetTypeRepository.findAll({
    tableName: 'budget_type',
    sortOptions: sortBy && { option: sortBy },
    paginationOptions: { limit: limit, page: page },
  });
};
/**
 * Retrieves a budget type by its ID.
 * @function
 * @param {number} id - The unique identifier of the budget type.
 * @returns {Promise<object|null>} - A promise that resolves with the budget type object or null if not found.
 */
const getBudgetType = async (id) => {
  return await budgetTypeRepository.findOneBy({ id: id });
};
/**
 * Updates a budget type.
 * @function
 * @param {number} budgetTypeId - The unique identifier of the budget type to update.
 * @param {object} updateBody - The data to update the budget type with.
 * @returns {Promise<object|null>} - A promise that resolves with the updated budget type object or null if not found.
 * @throws {ApiError} - Throws an error if the budget type is not found.
 */
const updateBudgetType = async (budgetTypeId, updateBody) => {
  const budgetType = getBudgetType(budgetTypeId);
  if (!budgetType) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Budget type not found');
  }
  await budgetTypeRepository.update({ id: budgetTypeId }, updateBody);
  return getBudgetType(budgetTypeId);
};
/**
 * Deletes a budget type by its ID.
 * @function
 * @param {number} budgetTypeId - The unique identifier of the budget type to delete.
 * @returns {Promise<object|null>} - A promise that resolves with the result of the deletion (usually null).
 * @throws {ApiError} - Throws an error if the budget type is not found.
 */
const deleteBudgetTypeId = async (budgetTypeId) => {
  const budgetType = await getBudgetType(budgetTypeId);
  if (!budgetType) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Budget Type not found');
  }
  return await budgetTypeRepository.delete({ id: budgetTypeId });
};

/**
 * Retrieves all office-related budget types.
 * @function
 * @returns {Promise<object[]>} - A promise that resolves with an array of office budget types.
 */
const getAllOfficeBudgetTypes = async () => {
  let isOffice = true
  return await budgetTypeRepository.find({ where: { isOffice: isOffice } })
};

module.exports = {
  createBudgetType,
  getAllBudgetTypes,
  getBudgetType,
  updateBudgetType,
  deleteBudgetTypeId,
  getAllOfficeBudgetTypes
};
