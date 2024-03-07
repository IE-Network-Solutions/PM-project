const httpStatus = require('http-status');
const { BudgetCategory, projectBudget } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');

const projectBudgetRepository = dataSource.getRepository(projectBudget).extend({
  findAll,
  sortBy,
});

/**
 * @module projectBudget
 */
/**
 * Creates a project budget by saving the given project budget data.
 *
 * @function
 * @param {Object} projectBudgetData - Data representing the project budget.
 * @returns {Promise<Object>} - A promise that resolves to the saved project budget.
 */
const createProjectBudget = async (projectBudgetData) => {
  const projectBudget = projectBudgetRepository.create(projectBudgetData);
  return await projectBudgetRepository.save(projectBudget);
};
/**
 * Retrieves all project budgets from the repository.
 *
 * @function
 * @returns {Promise<Object[]>} - A promise that resolves to an array of project budgets.
 */
const getAllProjectBudgets = async () => {
  //   const { limit, page, sortBy } = options;

  return await projectBudgetRepository.find();
};
/**
 * Retrieves project budgets grouped by budget type, category, and currency.
 *
 * @function
 * @param {number} projectId - The ID of the project to retrieve budgets for.
 * @returns {Promise<Object>} - An object with nested structures representing project budgets:
 *   - {Object} budgetType - Budget type (e.g., "Operating", "Capital").
 *     - {Object} budgetCategory - Budget category (e.g., "Personnel", "Equipment").
 *       - {Object} currency - Currency type (e.g., "USD", "EUR").
 *         - {Array<Object>} projectBudgets - Array of project budget entries.
 *           Each entry contains details about the budget for a specific project.
 */
const getAllProjectBudgetsByCategory = async (projectId) => {
  //   const projectBudgets = await projectBudgetRepository.find();
  const projectBudgets = await projectBudgetRepository
    .createQueryBuilder('projectBudget')
    .innerJoinAndSelect('projectBudget.budgetCategory', 'budgetCategory')
    .innerJoinAndSelect('projectBudget.currency', 'currency')
    .innerJoinAndSelect('budgetCategory.budgetCategoryType', 'budgetType')
    .innerJoinAndSelect('projectBudget.project', 'project')
    .where('project.id = :projectId', { projectId: projectId })
    .orderBy('budgetType.id')
    .addOrderBy('budgetCategory.id')
    .addOrderBy('currency.id')
    .getMany();

  const regroupedData = {};

  projectBudgets.forEach((projectBudget) => {
    const { budgetCategory, currency } = projectBudget;

    // Extract budget type from the nested structure
    const budgetType = budgetCategory.budgetCategoryType;

    if (!regroupedData[budgetType.budgetCategoryTypeName]) {
      regroupedData[budgetType.budgetCategoryTypeName] = {};
    }

    if (!regroupedData[budgetType.budgetCategoryTypeName][budgetCategory.budgetCategoryName]) {
      regroupedData[budgetType.budgetCategoryTypeName][budgetCategory.budgetCategoryName] = {};
    }

    if (!regroupedData[budgetType.budgetCategoryTypeName][budgetCategory.budgetCategoryName][currency.name]) {
      regroupedData[budgetType.budgetCategoryTypeName][budgetCategory.budgetCategoryName][currency.name] = [];
    }

    regroupedData[budgetType.budgetCategoryTypeName][budgetCategory.budgetCategoryName][currency.name].push(projectBudget);
  });

  return regroupedData;
  //   return projectBudgets;
};
/**
 * Retrieves a project budget based on the specified ID.
 *
 * @function
 * @param {number} id - The unique identifier of the project budget.
 * @returns {Promise<Object>} - A promise that resolves to the project budget object.
 */
const getProjectBudget = async (id) => {
  return await projectBudgetRepository.findOneBy({ id: id });
};
/**
 * Updates a project budget based on the specified ID.
 *
 * @function
 * @param {number} projectBudgetID - The unique identifier of the project budget to update.
 * @param {Object} data - Updated data for the project budget.
 * @throws {ApiError} - Throws an error if the project budget with the given ID is not found.
 * @returns {Promise<Object>} - A promise that resolves to the updated project budget object.
 */
const updateProjectBudget = async (projectBudgetID, data) => {
  const projectBudget = await getProjectBudget(projectBudgetID);
  if (!projectBudget) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project Budget not found');
  }
  // updateBody.amount += projectBudget.amount;

  await projectBudgetRepository.update({ id: projectBudgetID }, updateBody);
  return getProjectBudget(projectBudgetID);
};
/**
 * Updates or creates project budgets based on the provided data.
 *
 * @function
 * @param {string} projectBudgets - A JSON string containing an array of project budget objects.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of updated or newly created project budgets.
 */
const updateOrCreateProjectBudget = async (projectBudgets) => {
  for (const projectBudget of JSON.parse(projectBudgets)) {
    const projectBudgetData = await getProjectBudget(projectBudget.id);

    const data = {};
    data.amount = await projectBudget.amount;
    data.projectId = await projectBudget.project_id;
    data.currencyId = await projectBudget.currency_id;
    data.budgetCategoryId = await projectBudget.budget_category_id;

    if (!projectBudgetData) {
      projectBudgetRepository.create(data);
    } else {
      projectBudgetRepository.update({ id: projectBudget.id }, data);
    }
  }

  return await getAllProjectBudgets();
};

module.exports = {
  createProjectBudget,
  getAllProjectBudgets,
  getProjectBudget,
  updateProjectBudget,
  updateOrCreateProjectBudget,
  getAllProjectBudgetsByCategory,
};
