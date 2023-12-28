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
 * Create a budget category type
 * @param {Object} budgetCategoryy
 * @returns {Promise<Project>}
 */
const createBudgetCategoryType = async (budgetCategoryTypeData) => {
  const budgetCategoryType = budgetCategoryTypeRepository.create(budgetCategoryTypeData);
  return await budgetCategoryTypeRepository.save(budgetCategoryType);
};

/**
 * Query for budgetCategorieTypes
 * @param {Object} filter - Filter options
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
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
 * Get catagory budget by id
 * @param {ObjectId} id
 * @returns {Promise<Project>}
 */
const getBudgetCategoryType = async (id) => {
  return await budgetCategoryTypeRepository.findOneBy({ id: id });
};

/**
 * Update category budget by id
 * @param {ObjectId} taskId
 * @param {Object} updateBody
 * @returns {Promise<Project>}
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
 * Delete budget category by id
 * @param {ObjectId} budgetCategoryId
 * @returns {Promise<User>}
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
