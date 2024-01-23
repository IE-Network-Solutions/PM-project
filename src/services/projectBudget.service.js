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
 * create a project budget
 * @param {Object} budgetCategoryy
 * @returns {Promise<Project>}
 */
const createProjectBudget = async (projectBudgetData) => {
  const projectBudget = projectBudgetRepository.create(projectBudgetData);
  return await projectBudgetRepository.save(projectBudget);
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
const getAllProjectBudgets = async () => {
  //   const { limit, page, sortBy } = options;

  return await projectBudgetRepository.find();
};

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
 * Get catagory budget by id
 * @param {ObjectId} id
 * @returns {Promise<Project>}
 */
const getProjectBudget = async (id) => {
  return await projectBudgetRepository.findOneBy({ id: id });
};

/**
 * Update category budget by id
 * @param {ObjectId} taskId
 * @param {Object} updateBody
 * @returns {Promise<Project>}
 */
const updateProjectBudget = async (projectBudgetID, data) => {
  const projectBudget = await getProjectBudget(projectBudgetID);
  if (!projectBudget) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project Budget not found');
  }
  // updateBody.amount += projectBudget.amount;
  // console.log()
  await projectBudgetRepository.update({ id: projectBudgetID }, updateBody);
  return getProjectBudget(projectBudgetID);
};
const updateOrCreateProjectBudget = async (projectBudgets) => {
  for (const projectBudget of JSON.parse(projectBudgets)) {
    const projectBudgetData = await getProjectBudget(projectBudget.id);
    console.log(projectBudget);
    const data = {};
    data.amount = await projectBudget.amount;
    data.projectId = await projectBudget.project_id;
    data.currencyId = await projectBudget.currency_id;
    data.budgetCategoryId = await projectBudget.budget_category_id;
    // console.log(data);
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
