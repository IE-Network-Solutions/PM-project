const httpStatus = require('http-status');
const { BudgetTaskCategory } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');

const budgetTaskCategoryRepository = dataSource.getRepository(BudgetTaskCategory).extend({
  findAll,
  sortBy,
});

/**
 * Create a budget task category
 * @param {Object} budgetTaskCategoryy
 * @returns {Promise<Project>}
 */
const createBudgetTaskCategory = async (budgetTaskCategoryData) => {
  console.log(budgetTaskCategoryData);
  const budgetTaskCategory = budgetTaskCategoryRepository.create(budgetTaskCategoryData);
  return await budgetTaskCategoryRepository.save(budgetTaskCategory);
};

/**
 * Query for budgetTaskCategories
 * @param {Object} filter - Filter options
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
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
 * Get budget task catagory  by id
 * @param {ObjectId} id
 * @returns {Promise<Project>}
 */
const getBudgetTaskCategory = async (id) => {
  return await budgetTaskCategoryRepository.findOneBy({ id: id });
};

/**
 * Update category task budget by id
 * @param {ObjectId} budgetTaskCategoryId
 * @param {Object} updateBody
 * @returns {Promise<Project>}
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
 * Delete budget category by id
 * @param {ObjectId} budgetCategoryId
 * @returns {Promise<User>}
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
