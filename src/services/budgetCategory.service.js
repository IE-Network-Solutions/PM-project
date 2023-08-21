const httpStatus = require('http-status');
const { BudgetCategory } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');

const budgetCategoryRepository = dataSource.getRepository(BudgetCategory).extend({
  findAll,
  sortBy,
});

/**
 * Create a budget category
 * @param {Object} budgetCategoryy
 * @returns {Promise<Project>}
 */
const createBudgetCategory = async (budgetCategoryData) => {
  const budgetCategory = budgetCategoryRepository.create(budgetCategoryData);
  return await budgetCategoryRepository.save(budgetCategory);
};

/**
 * Query for budgetCategories
 * @param {Object} filter - Filter options
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
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
 * Get catagory budget by id
 * @param {ObjectId} id
 * @returns {Promise<Project>}
 */
const getBudgetCategory = async (id) => {
  return await budgetCategoryRepository.findOneBy({ id: id });
};

/**
 * Update category budget by id
 * @param {ObjectId} taskId
 * @param {Object} updateBody
 * @returns {Promise<Project>}
 */
const updateBudgetCategory = async (budgetCategoryId, updateBody) => {
  const budgetCategory = getBudgetCategory(budgetCategoryId);
  if (!budgetCategory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Budget Category not found');
  }
  await budgetCategoryRepository.update({ id: budgetCategoryId }, updateBody);
  return getBudgetCategory(budgetCategoryId);
};

/**
 * Delete budget category by id
 * @param {ObjectId} budgetCategoryId
 * @returns {Promise<User>}
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
