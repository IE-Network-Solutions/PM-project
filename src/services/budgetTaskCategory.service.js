const httpStatus = require('http-status');
const { BudgetTaskCategory } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const publishToRabbit = require('../utils/producer');

const budgetTaskCategoryRepository = dataSource.getRepository(BudgetTaskCategory).extend({
  findAll,
  sortBy,
});
/**
 * @module budgetTaskCategory
 */
/**
 * Creates a budget task category.
 * @function
 * @param {object} budgetTaskCategoryData - The data for the budget task category.
 * @returns {Promise<object>} - A promise that resolves with the saved budget task category.
 */
const createBudgetTaskCategory = async (budgetTaskCategoryData) => {
  const budgetTaskCategory = budgetTaskCategoryRepository.create(budgetTaskCategoryData);
  publishToRabbit('budget.category',budgetTaskCategory)
  return await budgetTaskCategoryRepository.save(budgetTaskCategory);
};
/**
 * Retrieves all budget task categories.
 * @function
 * @param {object} filter - The filter criteria for querying budget task categories.
 * @param {object} options - Additional options for pagination and sorting.
 * @param {number} options.limit - The maximum number of results to return.
 * @param {number} options.page - The page number for pagination.
 * @param {string} options.sortBy - The field to sort the results by.
 * @returns {Promise<object[]>} - A promise that resolves with an array of budget task categories.
 */
const getAllBudgetTaskCategories = async (filter, options) => {
  const { limit, page, sortBy } = options;

  return await budgetTaskCategoryRepository.findAll({
    tableName: 'budget_task_category',
    sortOptions: sortBy && { option: sortBy },
    paginationOptions: { limit: limit, page: page },
  });
};
/**
 * Retrieves a budget task category by its ID.
 * @function
 * @param {number} id - The unique identifier of the budget task category.
 * @returns {Promise<object|null>} - A promise that resolves with the budget task category object or null if not found.
 */
const getBudgetTaskCategory = async (id) => {
  return await budgetTaskCategoryRepository.findOneBy({ id: id });
};
/**
 * Updates a budget task category.
 * @function
 * @param {number} budgetTaskCategoryId - The unique identifier of the budget task category to update.
 * @param {object} updateBody - The data to update the budget task category with.
 * @returns {Promise<object|null>} - A promise that resolves with the updated budget task category object or null if not found.
 * @throws {ApiError} - Throws an error if the budget task category is not found.
 */
const updateBudgetTaskCategory = async (budgetTaskCategoryId, updateBody) => {
  const budgetCategory = await getBudgetTaskCategory(budgetTaskCategoryId);
  if (!budgetCategory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Budget Task Category not found');
  }
  await budgetTaskCategoryRepository.update({ id: budgetTaskCategoryId }, updateBody);
  return getBudgetTaskCategory(budgetTaskCategoryId);
};
/**
 * Deletes a budget task category by its ID.
 * @function
 * @param {number} budgetTaskCategoryId - The unique identifier of the budget task category to delete.
 * @returns {Promise<object|null>} - A promise that resolves with the result of the deletion (usually null).
 * @throws {ApiError} - Throws an error if the budget task category is not found.
 */
const deleteBudgetTaskCategory = async (budgetTaskCategoryId) => {
  const budgetTaskCategory = await getBudgetTaskCategory(budgetTaskCategoryId);
  if (!budgetTaskCategory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Budget Category not found');
  }
  return await budgetTaskCategoryRepository.delete({ id: budgetTaskCategoryId });
};

module.exports = {
  createBudgetTaskCategory,
  getAllBudgetTaskCategories,
  getBudgetTaskCategory,
  updateBudgetTaskCategory,
  deleteBudgetTaskCategory,
};
