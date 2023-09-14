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
} = require('../services');

async function calculate(budget) {
  const task = await taskService.getTask(budget.taskId);
  const budgetCategory = await budgetCategoryService.getBudgetCategory(budget.budgetCategoryId);
  const taskCategory = await budgetTaskCategoryService.getBudgetTaskCategory(budget.taskCategoryId);
  return { task, budgetCategory, taskCategory };
}

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
      const { task, budgetCategory, taskCategory } = await calculate(budget);

      const singleBudgetData = {
        amount: budget.amount,
        description: budget.description,
        task: task,
        project: project,
        budgetCategory: budgetCategory,
        taskCategory: taskCategory,
      };

      console.log('MANNN', [singleBudgetData]);

      budgetData.push(singleBudgetData);
    }

    return budgetData;
  }

  let budgetData = await returnBudgetData(data);

  data.budgetData = budgetData;
  const budget = await budgetService.createBudget(data);
  res.status(httpStatus.CREATED).send(budget);
});

const getBudgets = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await budgetService.getBudgets(filter, options);
  res.send(result);
});

const getBudget = catchAsync(async (req, res) => {
  const budget = await budgetService.getBudget(req.params.taskId);
  if (!budget) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Budget not found');
  }
  res.send(budget);
});

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

const deleteBudget = catchAsync(async (req, res) => {
  await budgetService.deleteBudget(req.params.budgetId);
  res.status(httpStatus.NO_CONTENT).send();
});
const getBudgetsOfProject = catchAsync(async (req, res) => {
  console.log(req.params.projectId);
  const data = await budgetService.getBudgetsOfProject(req.params.projectId);
  res.send(data);
});
const getBudgetsOfProjects = catchAsync(async (req, res) => {
  const data = await budgetService.getBudgetsOfProjects();
  res.send(data);
});

const getMonthlyBudgetsOfProjects = catchAsync(async (req, res) => {
  const data = await budgetService.getMonthlyBudgetsOfProjects();
  res.send(data);
});

const getBudgetGroupByCategory= catchAsync(async (req,res)=>{
  const data = await budgetService.getBudgetGroupByCategory()
  res.send(data)
})

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
  console.log(singleBudgetData, 'pppppppppppp');
  const budget = await budgetService.addBudget(singleBudgetData);
  res.status(httpStatus.CREATED).send(budget);
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
  getMonthlyBudgetsOfProjects
};
