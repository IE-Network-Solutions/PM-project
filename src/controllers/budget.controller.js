const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const {
  budgetService,
  taskService,
  budgetCategoryService,
  budgetTaskCategoryService,
  projectService,
  currencyService,
  budgetSessionService,
} = require('../services');
/**
 * @module budget
 */
/**
 * Calculates task, budget category, task category, and currency for a given budget.
 * @function
 * @param {Object} budget - The budget data.
 * @returns {Promise<Object>} A Promise that resolves with the calculated data.
 */

async function calculate(budget) {
  const task = await taskService.getTask(budget.taskId);
  const budgetCategory = await budgetCategoryService.getBudgetCategory(budget.budgetCategoryId);
  const taskCategory = await budgetTaskCategoryService.getBudgetTaskCategory(budget.taskCategoryId);
  const currency = await currencyService.getCurrencyById(budget.currencyId);

  return { task, budgetCategory, taskCategory, currency };
}
/**
 * Creates a new budget.
 * @function
 * @param {Object} req - The request object containing the budget data.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves once the budget is created.
 */

const createBudget = catchAsync(async (req, res) => {
  const data = req.body;
  async function returnBudgetData(data) {
    const budgetData = [];

    const project = await projectService.getProject(data.projectId);
    if (!project) {
      throw new ApiError(httpStatus.NOT_FOUND, `project with id: ${data.projectId} not found`);
    }
    data.project = project;

    const budgetArray = data.budgets;

    for (const budget of budgetArray) {
      const { task, budgetCategory, taskCategory, currency } = await calculate(budget);

      const singleBudgetData = {
        amount: budget.amount,
        description: budget.description,
        task: task,
        project: project,
        budgetCategory: budgetCategory,
        taskCategory: taskCategory,
        currency: currency,
      };

      budgetData.push(singleBudgetData);
    }

    return budgetData;
  }

  let budgetData = await returnBudgetData(data);

  data.budgetData = budgetData;
  const budget = await budgetService.createBudget(data);
  res.status(httpStatus.CREATED).send(budget);
});
/**
 * Retrieves all budgets based on the provided filter and options.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with all budgets.
 */

const getBudgets = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await budgetService.getBudgets(filter, options);
  res.send(result);
});
/**
 * Retrieves a budget by its ID.
 * @function
 * @param {Object} req - The request object containing the budget ID.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the budget data.
 */

const getBudget = catchAsync(async (req, res) => {
  const budget = await budgetService.getBudget(req.params.taskId);
  if (!budget) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Budget not found');
  }
  res.send(budget);
});
/**
 * Updates a budget by its ID.
 * @function
 * @param {Object} req - The request object containing the budget ID and updated data.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the updated budget data.
 */

const updateBudget = catchAsync(async (req, res) => {
  const data = req.body;
  const budget = await budgetService.getBudget(req.params.budgetId);
  if (!budget) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Budget not found');
  }
  if (data.budgetCategory) {
    const budgetCategory = await budgetCategoryService.getBudgetCategory(data.budgetCategory);
    if (!budgetCategory) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Budget Category Not found not found');
    }
    data.budgetCategory = budgetCategory;
  }
  if (data.currencyId) {
    const currency = await currencyService.getCurrencyById(data.currencyId);
    if (!currency) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Budget Currency Not found not found');
    }
    data.currency = currency;
  }
  if (data.taskCategory) {
    const taskCategory = await budgetTaskCategoryService.getBudgetTaskCategory(data.taskCategory);
    if (!taskCategory) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Budget Task Category Not found not found');
    }
    data.taskCategory = taskCategory;
  }
  const updatedBudget = await budgetService.updateBudget(req.params.budgetId, data);
  res.send(updatedBudget);
});
/**
 * Deletes a budget by its ID.
 * @function
 * @param {Object} req - The request object containing the budget ID.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves once the budget is deleted.
 */

const deleteBudget = catchAsync(async (req, res) => {
  await budgetService.deleteBudget(req.params.budgetId);
  res.status(httpStatus.NO_CONTENT).send();
});
/**
 * Retrieves budgets associated with a project.
 * @function
 * @param {Object} req - The request object containing the project ID.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the budgets associated with the project.
 */

const getBudgetsOfProject = catchAsync(async (req, res) => {
  const data = await budgetService.getBudgetsOfProject(req.params.projectId);
  res.send(data);
});
/**
 * Retrieves budgets associated with multiple projects.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the budgets associated with multiple projects.
 */

const getBudgetsOfProjects = catchAsync(async (req, res) => {
  const data = await budgetService.getBudgetsOfProjects();
  res.send(data);
});
/**
 * Retrieves monthly budgets of office projects based on a specified date range.
 * @function
 * @param {Object} req - The request object containing the date range.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the monthly budgets of office projects.
 */

const getBudgetsOfOfficeProjects = catchAsync(async (req, res) => {

  let month = {

  };
  month.from = req.body.from;
  month.to = req.body.to;

  const monthlyBudgetData = await budgetService.getBudgetsOfficeOfProjects(month);

  if (!monthlyBudgetData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'no Office monthly budget exist');
  }

  res.status(200).json(monthlyBudgetData);





});
/**
 * Retrieves all budgets associated with projects.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with all budgets associated with projects.
 */

const getAllBudgetsOfProjects = catchAsync(async (req, res) => {
  const data = await budgetService.getAllBudgetsOfProjects();
  res.send(data);
});
/**
 * Retrieves budgets grouped by category for the latest budget session.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with budgets grouped by category.
 */

const getBudgetGroupByCategory = catchAsync(async (req, res) => {
  const letestBudgetSession = await budgetSessionService.activeBudgetSession();

  const data = await budgetService.getBudgetGroupByCategory(letestBudgetSession?.startDate, letestBudgetSession?.endDate);
  res.send(data);
});
/**
 * Retrieves the current month's budget for a specific project.
 * @function
 * @param {Object} req - The request object containing the project ID.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the current month's budget for the project.
 */

const getMonthlyBudget = catchAsync(async (req, res) => {
  const projectId = req.params.projectId;
  console.log(projectId, 'kkkkkkkk');
  const data = await budgetService.getCurrentMonthBudgetOfProjects(projectId);
  res.send(data);
});
/**
 * Retrieves monthly budgets of all projects.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the monthly budgets of all projects.
 */

const getMonthlyBudgetsOfProjects = catchAsync(async (req, res) => {
  const data = await budgetService.getMonthlyBudgetsOfProjects();
  res.send(data);
});
/**
 * Retrieves budget groups.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with budget groups.
 */

const budgetGroups = catchAsync(async (req, res) => {
  const data = await budgetService.budgetGroups();
  res.send(data);
});

/**
 * Retrieves budgets by task category.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with budgets grouped by task category.
 */

const getBudgetsByGroup = catchAsync(async (req, res) => {
  const data = await budgetService.getByTaskCategory();
  res.send(data);
});
/**
 * Adds a new budget.
 * @function
 * @param {Object} req - The request object containing the budget data.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves once the budget is added.
 */

const addBudget = catchAsync(async (req, res) => {
  data = req.body;

  const task = await taskService.getTask(data.taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, `task with id: ${data.taskId} not found`);
  }
  const group = await budgetService.getBudgetGroup(data.groupId);
  if (!group) {
    throw new ApiError(httpStatus.NOT_FOUND, `group with id: ${data.groupId} not found`);
  }
  const project = await group.project;
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, `no project in the group please update the group`);
  }
  const budgetCategory = await budgetCategoryService.getBudgetCategory(data.budgetCategoryId);
  if (!budgetCategory) {
    throw new ApiError(httpStatus.NOT_FOUND, `budgetCategory with id: ${data.budgetCategoryId} not found`);
  }
  const taskCategory = await budgetTaskCategoryService.getBudgetTaskCategory(data.taskCategoryId);
  if (!taskCategory) {
    throw new ApiError(httpStatus.NOT_FOUND, `taskCategory with id: ${data.taskCategoryId} not found`);
  }
  const singleBudgetData = {
    amount: data.amount,
    description: data.description,
    task: task,
    project: project,
    budgetCategory: budgetCategory,
    taskCategory: taskCategory,
    group: group,
  };
  const budget = await budgetService.addBudget(singleBudgetData);
  res.status(httpStatus.CREATED).send(budget);
});
/**
 * Retrieves the master budget.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the master budget.
 */

const masterBudget = catchAsync(async (req, res) => {
  const data = await budgetService.masterBudget();
  res.send(data);
});
/**
 * Retrieves budgets filtered by start and end dates.
 * @function
 * @param {Object} req - The request object containing the start and end dates.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with budgets filtered by dates.
 */

const filterBudget = catchAsync(async (req, res) => {
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  const data = await budgetService.filterBudget(startDate, endDate);

  res.send(data);
});

module.exports = {
  createBudget,
  getBudgets,
  getBudget,
  updateBudget,
  deleteBudget,
  getBudgetsOfProject,
  getBudgetsOfProjects,
  addBudget,
  getBudgetGroupByCategory,
  getAllBudgetsOfProjects,
  getMonthlyBudget,
  getMonthlyBudgetsOfProjects,
  budgetGroups,
  getBudgetsByGroup,
  masterBudget,
  filterBudget,
  getBudgetsOfOfficeProjects
};
