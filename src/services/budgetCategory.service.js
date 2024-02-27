const httpStatus = require('http-status');
const { BudgetCategory, budgetCategoryType } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');

const budgetCategoryRepository = dataSource.getRepository(BudgetCategory).extend({
  findAll,
  sortBy,
});
const budgetCategoryTypeRepository = dataSource.getRepository(budgetCategoryType).extend({
  findAll,
  sortBy,
});
/**
 * @module budgetCategory
 */
/**
 * Creates a budget category.
 * @function
 * @param {object} budgetCategoryData - The data for the budget category.
 * @returns {Promise<object>} - A promise that resolves with the saved budget category.
 */
const createBudgetCategory = async (budgetCategoryData) => {
  const budgetCategory = budgetCategoryRepository.create(budgetCategoryData);
  return await budgetCategoryRepository.save(budgetCategory);
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
const getAllBudgetCategories = async (filter, options) => {
  const { limit, page, sortBy } = options;

  return await budgetCategoryRepository.findAll({
    tableName: 'budget_category',
    sortOptions: sortBy && { option: sortBy },
    paginationOptions: { limit: limit, page: page },
  });
};
/**
 * Retrieves a budget category by its ID.
 * @function
 * @param {number} id - The unique identifier of the budget category.
 * @returns {Promise<object|null>} - A promise that resolves with the budget category object or null if not found.
 */
const getBudgetCategory = async (id) => {
  return await budgetCategoryRepository.findOneBy({ id: id });
};
/**
 * Updates a budget category.
 * @function
 * @param {number} budgetCategoryId - The unique identifier of the budget category to update.
 * @param {object} updateBody - The data to update the budget category with.
 * @returns {Promise<object|null>} - A promise that resolves with the updated budget category object or null if not found.
 * @throws {ApiError} - Throws an error if the budget category is not found.
 */
const updateBudgetCategory = async (budgetCategoryId, updateBody) => {
  const budgetCategory = await getBudgetCategory(budgetCategoryId);
  if (!budgetCategory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Budget Category not found');
  }
  await budgetCategoryRepository.update({ id: budgetCategoryId }, updateBody);
  return getBudgetCategory(budgetCategoryId);
};
/**
 * Deletes a budget category by its ID.
 * @function
 * @param {number} budgetCategoryId - The unique identifier of the budget category to delete.
 * @returns {Promise<object|null>} - A promise that resolves with the result of the deletion (usually null).
 * @throws {ApiError} - Throws an error if the budget category is not found.
 */
const deleteBudgetCategoryId = async (budgetCategoryId) => {
  const budgetCategory = await getBudgetCategory(budgetCategoryId);
  if (!budgetCategory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Budget Category not found');
  }
  return await budgetCategoryRepository.delete({ id: budgetCategoryId });
};

module.exports = {
  createBudgetCategory,
  getAllBudgetCategories,
  getBudgetCategory,
  updateBudgetCategory,
  deleteBudgetCategoryId,
};
