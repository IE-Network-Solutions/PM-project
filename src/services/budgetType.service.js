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
 * Create a budget type
 * @param {Object} budgetType
 * @returns {Promise<Project>}
 */
const createBudgetType = async (budgetTypeData) => {
  const budgetType = budgetTypeRepository.create(budgetTypeData);
  return await budgetTypeRepository.save(budgetType);
};

/**
 * Query for budgetTypes
 * @param {Object} filter - Filter options
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
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
 * Get budget type by id
 * @param {ObjectId} id
 * @returns {Promise<Project>}
 */
const getBudgetType = async (id) => {
  return await budgetTypeRepository.findOneBy({ id: id });
};

/**
 * Update budget type by id
 * @param {ObjectId} taskId
 * @param {Object} updateBody
 * @returns {Promise<Project>}
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
 * Delete budget type by id
 * @param {ObjectId} budgetTypeId
 * @returns {Promise<User>}
 */
const deleteBudgetTypeId = async (budgetTypeId) => {
  const budgetType = await getBudgetType(budgetTypeId);
  if (!budgetType) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Budget Type not found');
  }
  return await budgetTypeRepository.delete({ id: budgetTypeId });
};

module.exports = {
  createBudgetType,
  getAllBudgetTypes,
  getBudgetType,
  updateBudgetType,
  deleteBudgetTypeId,
};
