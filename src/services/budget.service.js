const httpStatus = require('http-status');
const { Budget, BudgetGroup, Task } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const services = require('./index');

const budgetRepository = dataSource.getRepository(Budget).extend({
  findAll,
  sortBy,
});
const taskRepository = dataSource.getRepository(Task).extend({
  findAll,
  sortBy,
});

const budgetGroupRepository = dataSource.getRepository(BudgetGroup).extend({
  findAll,
  sortBy,
});

/**
 * Create a budget
 * @param {Object} budgetBody
 * @returns {Promise<Project>}
 */
const createBudget = async (budgetBody) => {
  budgetData = budgetBody.budgetData;
  const budgetGroup = budgetGroupRepository.create({
    from: budgetBody.from,
    to: budgetBody.to,
    project: budgetBody.project,
  });
  await budgetGroupRepository.save(budgetGroup);

  const budgets = budgetData.map((budget) => {
    budget.group = budgetGroup;
    const budgetData = budgetRepository.create(budget);
    return budgetData;
  });
  await budgetRepository.save(budgets);
  return budgets;
};

/**
 * Query for budget
 * @param {Object} filter - Filter options
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

const getBudgets = async (filter, options) => {
  const { limit, page, sortBy } = options;

  return await budgetRepository.find({
    relations: ['group', 'task', 'budgetCategory', 'taskCategory', 'project'],
  });
};

/**
 * Query for budget for the project
 * @param {Object} filter - Filter options
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

const getBudgetsOfProject = async (projectId) => {
  // const { limit, page, sortBy } = options;

  const budgets = await budgetRepository
    .createQueryBuilder('budget')
    .leftJoin('budget.project', 'project')
    .leftJoin('budget.task', 'task')
    .leftJoin('budget.group', 'group')
    .leftJoin('budget.budgetCategory', 'budgetCategory')
    .leftJoin('budget.taskCategory', 'taskCategory')
    .select(['budget', 'task', 'project', 'group', 'budgetCategory', 'taskCategory'])
    .where('project.id = :projectId', { projectId })
    .getMany();

  const groupedData = {};
  budgets.forEach((entry) => {
    const groupId = entry.group.id;
    if (!groupedData[groupId]) {
      groupedData[groupId] = [];
    }
    groupedData[groupId].push(entry);
  });

  const groupedResult = Object.values(groupedData);

  // console.log(groupedResult);
  return groupedData;
};

/**
 * Query for budget for the project by task level
 * @param {Object} filter - Filter options
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

const getTasksOfProject = async (projectId) => {
  // const { limit, page, sortBy } = options;

  const budgets = await taskRepository
    .createQueryBuilder('tasks')
    .leftJoin('tasks.budgets', 'budget')
    .leftJoin('budget.project', 'project')
    .leftJoin('budget.group', 'group')
    .leftJoin('budget.budgetCategory', 'budgetCategory')
    .leftJoin('budget.taskCategory', 'taskCategory')
    .select(['budget', 'tasks', 'project', 'group', 'budgetCategory', 'taskCategory'])
    .getMany();

  // const groupedData = {};
  // budgets.forEach((entry) => {
  //   const groupId = entry.group.id;
  //   if (!groupedData[groupId]) {
  //     groupedData[groupId] = [];
  //   }
  //   groupedData[groupId].push(entry);
  // });

  // const groupedResult = Object.values(groupedData);

  // console.log(groupedResult);
  return budgets;
};

/**
 * Get budget by id
 * @param {ObjectId} id
 * @returns {Promise<Project>}
 */
const getBudget = async (id) => {
  return await budgetRepository.findOneBy({ id: id });
};

/**
 * Update budget by id
 * @param {ObjectId} budgetId
 * @param {Object} updateBody
 * @returns {Promise<Project>}
 */
const updateBudget = async (budgetId, updateBody) => {
  const budget = await budgetRepository.update({ id: budgetId }, updateBody);
  return await getBudget(budgetId);
};

/**
 * Delete budget by id
 * @param {ObjectId} budgetId
 * @returns {Promise<Budget>}
 */
const deleteBudget = async (budgetId) => {
  const budget = await getBudget(budgetId);
  if (!budget) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Budget not found');
  }
  return await budgetRepository.delete({ id: budgetId });
};

module.exports = {
  createBudget,
  getBudgets,
  getBudget,
  updateBudget,
  deleteBudget,
  getBudgetsOfProject,
  getTasksOfProject,
};