const httpStatus = require('http-status');
const { BudgetCategory, budgetCategoryType } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');

const budgetCategoryTypeRepository = dataSource.getRepository(budgetCategoryType).extend({
  findAll,
  sortBy,
});

/**
 * @module budgetCategoryType
 */
/**
 * Creates a budget category type.
 * @function
 * @param {object} budgetCategoryTypeData - The data for the budget category type.
 * @returns {Promise<object>} - A promise that resolves with the saved budget category type.
 */
const createBudgetCategoryType = async (budgetCategoryTypeData) => {
  const budgetCategoryType = budgetCategoryTypeRepository.create(budgetCategoryTypeData);
  return await budgetCategoryTypeRepository.save(budgetCategoryType);
};
/**
 * Retrieves all budget categories.
 * @function
 * @param {object} filter - The filter criteria for querying budget categories.
 * @param {object} options - Additional options for pagination and sorting.
 * @param {number} options.limit - The maximum number of results to return.
 * @param {number} options.page - The page number for pagination.
 * @param {string} options.sortBy - The field to sort the results by.
 * @returns {Promise<object[]>} - A promise that resolves with an array of budget categories.
 */
const getAllBudgetCategoryTypes = async (filter, options) => {
  const { limit, page, sortBy } = options;

  return await budgetCategoryTypeRepository.findAll({
    tableName: 'budget_category_type',
    sortOptions: sortBy && { option: sortBy },
    paginationOptions: { limit: limit, page: page },
  });
};
/**
 * Retrieves a budget category type by its ID.
 * @function
 * @param {number} id - The unique identifier of the budget category type.
 * @returns {Promise<object|null>} - A promise that resolves with the budget category type object or null if not found.
 */
const getBudgetCategoryType = async (id) => {
  return await budgetCategoryTypeRepository.findOneBy({ id: id });
};
/**
 * Updates a budget category type.
 * @function
 * @param {number} budgetCategoryTypeId - The unique identifier of the budget category type to update.
 * @param {object} updateBody - The data to update the budget category type with.
 * @returns {Promise<object|null>} - A promise that resolves with the updated budget category type object or null if not found.
 * @throws {ApiError} - Throws an error if the budget category type is not found.
 */
const updateBudgetCategoryType = async (budgetCategoryTypeId, updateBody) => {
  const budgetCategoryType = await getBudgetCategoryType(budgetCategoryTypeId);
  if (!budgetCategoryType) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Budget Category Type not found');
  }
  await budgetCategoryTypeRepository.update({ id: budgetCategoryTypeId }, updateBody);
  return getBudgetCategoryType(budgetCategoryTypeId);
};
/**
 * Deletes a budget category type by its ID.
 * @function
 * @param {number} budgetCategoryTypeId - The unique identifier of the budget category type to delete.
 * @returns {Promise<object|null>} - A promise that resolves with the result of the deletion (usually null).
 * @throws {ApiError} - Throws an error if the budget category type is not found.
 */
const deleteBudgetCategoryTypeId = async (budgetCategoryTypeId) => {
  const budgetCategoryType = await getBudgetCategoryType(budgetCategoryTypeId);
  if (!budgetCategoryType) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Budget Category type not found');
  }
  return await budgetCategoryTypeRepository.delete({ id: budgetCategoryTypeId });
};

module.exports = {
  createBudgetCategoryType,
  getAllBudgetCategoryTypes,
  getBudgetCategoryType,
  updateBudgetCategoryType,
  deleteBudgetCategoryTypeId,
};
