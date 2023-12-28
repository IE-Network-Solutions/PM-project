const httpStatus = require('http-status');
const { Budget, BudgetGroup, Task, projectBudget } = require('../models');
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

const projectBudgetRepository = dataSource.getRepository(projectBudget).extend({
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
    console.log('mmmmmmmmmmm', budgetData);
    deductFromProjectBudget(budgetData.budgetCategory.id, budgetData.currency.id, budgetData.project.id, budgetData.amount);
    return budgetData;
  });
  await budgetRepository.save(budgets);
  return budgets;
};

const deductFromProjectBudget = async (categoryId, currencyId, projectId, amount) => {
  const projectBudget = await projectBudgetRepository
    .createQueryBuilder('projectBudget')
    .innerJoinAndSelect('projectBudget.budgetCategory', 'budgetCategory')
    .innerJoinAndSelect('projectBudget.currency', 'currency')
    .innerJoinAndSelect('budgetCategory.budgetCategoryType', 'budgetType')
    .innerJoinAndSelect('projectBudget.project', 'project')
    .where('project.id = :projectId', { projectId: projectId })
    .andWhere('currency.id = :currencyId', { currencyId: currencyId })
    .andWhere('budgetCategory.id = :categoryId', { categoryId: categoryId })
    .orderBy('budgetType.id')
    .addOrderBy('budgetCategory.id')
    .addOrderBy('currency.id')
    .getOne();

  console.log(projectBudget);
  projectBudget.usedAmount += amount;

  await projectBudgetRepository.save(projectBudget);

  return projectBudget;
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
    relations: ['currency', 'group', 'task', 'budgetCategory', 'taskCategory', 'project'],
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
  const approval = false;

  const budgets = await budgetRepository
    .createQueryBuilder('budget')
    .leftJoin('budget.project', 'project')
    .leftJoin('budget.task', 'task')
    .leftJoin('budget.group', 'group')
    .leftJoin('budget.currency', 'currency')
    .leftJoin('group.comments', 'comments')
    .leftJoin('group.approvalStage', 'approvalStage')
    .leftJoin('approvalStage.role', 'role')
    .leftJoin('budget.budgetCategory', 'budgetCategory')
    .leftJoin('budget.taskCategory', 'taskCategory')
    .select([
      'budget',
      'currency',
      'task',
      'project',
      'group',
      'budgetCategory',
      'taskCategory',
      'approvalStage',
      'role',
      'comments',
    ])
    .where('group.approved = :approval', { approval })
    .andWhere('project.id = :projectId', { projectId })
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
 * Query for budget for the project
 * @param {Object} filter - Filter options
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

const getBudgetGroupByCategory = async (from, to) => {
  const budgets = await budgetRepository
    .createQueryBuilder('budget')
    .leftJoinAndSelect('budget.taskCategory', 'taskCategory')
    .leftJoinAndSelect('budget.group', 'group')
    .leftJoinAndSelect('group.project', 'project')
    .leftJoinAndSelect('budget.currency', 'currency') // Add this line to join the currency relation
    .where('group.from = :from', { from: from })
    .andWhere('group.to = :to', { to: to })
    .select('SUM(budget.amount)', 'sum')
    .addSelect('currency.id', 'currency_id') // Select the currency ID
    .addSelect('currency.name', 'currency_name') // Select the currency name
    .addSelect('taskCategory', 'taskCategory')
    .addSelect('group.from', 'group_from')
    .addSelect('group.to', 'group_to')
    .addSelect('project.id', 'project_id')
    .addSelect('project.name', 'project_name')
    .groupBy('currency.id') // Group by the currency ID
    .addGroupBy('taskCategory.id')
    .addGroupBy('project.id')
    .addGroupBy('group.to')
    .addGroupBy('group.from')
    .getRawMany();

  budgets.map((budget) => {
    (budget.from = from), (budget.to = to);
  });
  return budgets;
};

const getBudgetsOfProjects = async () => {
  const approval = false;

  const budgets = await budgetRepository
    .createQueryBuilder('budget')
    .leftJoin('budget.project', 'project')
    .leftJoin('budget.task', 'task')
    .leftJoin('budget.group', 'group')
    .leftJoin('group.comments', 'comments')
    .leftJoin('group.approvalStage', 'approvalStage')
    .leftJoin('approvalStage.role', 'role')
    .leftJoin('budget.budgetCategory', 'budgetCategory')
    .leftJoin('budget.taskCategory', 'taskCategory')
    .leftJoin('budget.currency', 'currency')
    .select(['budget', 'task', 'project', 'group', 'budgetCategory', 'taskCategory', 'approvalStage', 'role', 'comments'])
    .where('group.approved = :approval', { approval })
    .andWhere('group.approvalStage IS NOT NULL')
    .getMany();

  const groupedData = {};

  budgets.forEach((entry) => {
    const projectId = entry.project.id;
    const groupId = entry.group.id;

    if (!groupedData[projectId]) {
      groupedData[projectId] = {
        project: {
          id: entry.project.id,
          name: entry.project.name, // Include project name
        },
        groups: {},
      };
    }

    if (!groupedData[projectId].groups[groupId]) {
      groupedData[projectId].groups[groupId] = [];
    }

    groupedData[projectId].groups[groupId].push(entry);
  });

  return groupedData;
};
const getBudgetsOfficeOfProjects = async (month) => {
  let from = month.from;
  let to = month.to;

  const isOffice = true;

  const budgets = await budgetRepository
    .createQueryBuilder('budget')
    .leftJoin('budget.project', 'project')
    .leftJoin('budget.task', 'task')
    .leftJoin('task.milestone', 'milestone')
    .leftJoin('budget.group', 'group')
    .leftJoin('group.comments', 'comments')
    .leftJoin('group.approvalStage', 'approvalStage')
    .leftJoin('approvalStage.role', 'role')
    .leftJoin('budget.budgetCategory', 'budgetCategory')
    .leftJoin('budget.taskCategory', 'taskCategory')
    .leftJoin('budget.currency', 'currency')
    .select([
      'budget',
      'task',
      'project',
      'group',
      'milestone',
      'currency',
      'budgetCategory',
      'taskCategory',
      'approvalStage',
      'role',
      'comments',
    ])
    .where('group.from = :from', { from: from })
    .where('group.to = :to', { to: to })
    .where('project.isOffice = :isOffice', { isOffice: isOffice })

    .andWhere('group.approvalStage IS NOT NULL')
    .getMany();

  const groupedData = {};

  budgets.forEach((entry) => {
    const projectId = entry.project.id;
    const groupId = entry.group.id;

    if (!groupedData[projectId]) {
      groupedData[projectId] = {
        project: {
          id: entry.project.id,
          name: entry.project.name, // Include project name
        },
        groups: {},
      };
    }

    if (!groupedData[projectId].groups[groupId]) {
      groupedData[projectId].groups[groupId] = [];
    }

    groupedData[projectId].groups[groupId].push(entry);
  });

  return groupedData;
};
const getMonthlyBudgetsOfProjects = async () => {
  return 'abrilo';
};

// get only current month budgets and there sum
const getCurrentMonthBudgetOfProjectss = async () => {
  const approval = false;

  const budgets = await budgetRepository
    .createQueryBuilder('budget')
    .leftJoin('budget.project', 'project')
    .leftJoin('budget.task', 'task')
    .leftJoin('budget.group', 'group')
    .leftJoin('group.comments', 'comments')
    .leftJoin('group.approvalStage', 'approvalStage')
    .leftJoin('approvalStage.role', 'role')
    .leftJoin('budget.budgetCategory', 'budgetCategory')
    .leftJoin('budget.taskCategory', 'taskCategory')
    .leftJoin('budget.currency', 'currency')
    .select([
      'budget',
      'task',
      'project',
      'group',
      'budgetCategory',
      'taskCategory',
      'approvalStage',
      'role',
      'comments',
      'currency',
    ])
    .getMany();

  const groupedData = {};

  budgets.forEach((entry) => {
    const projectId = entry.project.id;
    const groupId = entry.group.id;
    const currencyId = entry.currency.id;

    if (!groupedData[projectId]) {
      groupedData[projectId] = {
        project: {
          id: entry.project.id,
          name: entry.project.name,
        },
        groups: null, // Initialize group as null
        currencyGroups: {}, // Initialize currencyGroups
      };
    }

    // Check if the current entry's group is the latest one
    if (!groupedData[projectId].group || entry.group.createdAt > groupedData[projectId].group.createdAt) {
      groupedData[projectId].group = {
        id: entry.group.id,
        from: entry.group.from,
        to: entry.group.to,
        // Add other relevant group properties here
      };
    }

    if (!groupedData[projectId].currencyGroups[currencyId]) {
      groupedData[projectId].currencyGroups[currencyId] = [];
    }

    groupedData[projectId].currencyGroups[currencyId].push(entry);
  });

  // Calculate the total sum of amount for each currency group and store it in sumAmount
  for (const projectId in groupedData) {
    for (const currencyId in groupedData[projectId].currencyGroups) {
      const currencyGroup = groupedData[projectId].currencyGroups[currencyId];
      const sumAmount = currencyGroup.reduce((total, entry) => total + entry.amount, 0);
      groupedData[projectId].currencyGroups[currencyId] = {
        sumAmount,
        currency: currencyGroup[0].currency, // Only store the currency object
      };
    }
  }

  // console;

  return groupedData;
};

const getCurrentMonthBudgetOfProjects = async (projectId) => {
  const approval = false;
  console.log(projectId, 'uuuuuuuuuuuuuuu');
  const budgets = await budgetRepository
    .createQueryBuilder('budget')
    .leftJoin('budget.project', 'project')
    .leftJoin('budget.task', 'task')
    .leftJoin('budget.group', 'group')
    .leftJoin('group.comments', 'comments')
    .leftJoin('group.approvalStage', 'approvalStage')
    .leftJoin('approvalStage.role', 'role')
    .leftJoin('budget.budgetCategory', 'budgetCategory')
    .leftJoin('budget.taskCategory', 'taskCategory')
    .leftJoin('budget.currency', 'currency')
    .select([
      'budget',
      'task',
      'project',
      'group',
      'budgetCategory',
      'taskCategory',
      'approvalStage',
      'role',
      'comments',
      'currency',
    ])
    .where('budget.project.id = :projectId', { projectId: projectId })
    .getMany();
  const groupedData = {};

  budgets.forEach((entry) => {
    const projectId = entry.project.id;
    const groupId = entry.group.id;
    const currencyId = entry.currency.id;

    if (!groupedData[projectId]) {
      groupedData[projectId] = {
        project: {
          id: entry.project.id,
          name: entry.project.name,
        },
        groups: {},
        currencyGroups: {},
      };
    }

    if (!groupedData[projectId].groups[groupId]) {
      groupedData[projectId].groups[groupId] = [];
    }

    groupedData[projectId].groups[groupId].push(entry);

    if (!groupedData[projectId].currencyGroups[currencyId]) {
      groupedData[projectId].currencyGroups[currencyId] = [];
    }

    groupedData[projectId].currencyGroups[currencyId].push(entry);
  });

  // Calculate the total sum of amount for each currency group and store it in sumAmount
  for (const projectId in groupedData) {
    for (const currencyId in groupedData[projectId].currencyGroups) {
      const currencyGroup = groupedData[projectId].currencyGroups[currencyId];
      const sumAmount = currencyGroup.reduce((total, entry) => total + entry.amount, 0);
      groupedData[projectId].currencyGroups[currencyId] = {
        sumAmount,
        currency: currencyGroup[0].currency, // Only store the currency object
      };
    }
  }

  // console;

  return groupedData;
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

const getAllBudgetsOfProjects = async () => {
  const approval = false;

  const budgets = await budgetRepository
    .createQueryBuilder('budget')
    .leftJoin('budget.project', 'project')
    .leftJoin('budget.task', 'task')
    .leftJoin('budget.group', 'group')
    .leftJoin('group.comments', 'comments')
    .leftJoin('group.approvalStage', 'approvalStage')
    .leftJoin('approvalStage.role', 'role')
    .leftJoin('budget.budgetCategory', 'budgetCategory')
    .leftJoin('budget.taskCategory', 'taskCategory')
    .leftJoin('budget.currency', 'currency')
    .select([
      'budget',
      'task',
      'project',
      'group',
      'budgetCategory',
      'taskCategory',
      'approvalStage',
      'role',
      'comments',
      'currency',
    ])
    .andWhere('group.approvalStage IS NOT NULL')
    .getMany();

  const groupedData = {};

  budgets.forEach((entry) => {
    const projectId = entry.project.id;
    const groupId = entry.group.id;
    const currencyId = entry.currency.id;

    if (!groupedData[projectId]) {
      groupedData[projectId] = {
        project: {
          id: entry.project.id,
          name: entry.project.name,
        },
        groups: {},
      };
    }

    if (!groupedData[projectId].groups[groupId]) {
      groupedData[projectId].groups[groupId] = {};
    }

    if (!groupedData[projectId].groups[groupId][currencyId]) {
      groupedData[projectId].groups[groupId][currencyId] = {
        group: entry.group,
        currency: entry.currency,
        sumAmount: 0,
      };
    }

    groupedData[projectId].groups[groupId][currencyId].sumAmount += entry.amount;
    // groupedData[projectId].groups[groupId][currencyId].entries.push(entry);
  });

  return groupedData;
};

/**
 * master budget
 */

const masterBudget = async () => {
  const approval = true;

  const budgets = await budgetRepository
    .createQueryBuilder('budget')
    .leftJoin('budget.project', 'project')
    .leftJoin('budget.task', 'task')
    .leftJoin('budget.group', 'group')
    .leftJoin('group.comments', 'comments')
    .leftJoin('group.approvalStage', 'approvalStage')
    .leftJoin('approvalStage.role', 'role')
    .leftJoin('budget.budgetCategory', 'budgetCategory')
    .leftJoin('budget.taskCategory', 'taskCategory')
    .leftJoin('budget.currency', 'currency')
    .select([
      'budget',
      'task',
      'project',
      'group',
      'budgetCategory',
      'taskCategory',
      'approvalStage',
      'role',
      'comments',
      'currency',
    ])
    .andWhere('group.approved = :approval', { approval })
    .getMany();

  const groupedData = {};

  budgets.forEach((entry) => {
    const projectId = entry.project.id;
    const groupId = entry.group.id;
    const currencyId = entry.currency.id;

    if (!groupedData[projectId]) {
      groupedData[projectId] = {
        project: {
          id: entry.project.id,
          name: entry.project.name,
        },
        groups: {},
      };
    }

    if (!groupedData[projectId].groups[groupId]) {
      groupedData[projectId].groups[groupId] = {};
    }

    if (!groupedData[projectId].groups[groupId][currencyId]) {
      groupedData[projectId].groups[groupId][currencyId] = [];
    }

    groupedData[projectId].groups[groupId][currencyId].push(entry);
  });

  return groupedData;
};

/**
 * filter budget by date
 */
const filterBudget = async (startDate, endDate) => {
  const approval = true;

  const budgets = await budgetRepository
    .createQueryBuilder('budget')
    .leftJoin('budget.project', 'project')
    .leftJoin('budget.task', 'task')
    .leftJoin('budget.group', 'group')
    .leftJoin('group.comments', 'comments')
    .leftJoin('group.approvalStage', 'approvalStage')
    .leftJoin('approvalStage.role', 'role')
    .leftJoin('budget.budgetCategory', 'budgetCategory')
    .leftJoin('budget.taskCategory', 'taskCategory')
    .leftJoin('budget.currency', 'currency')
    .select([
      'budget',
      'task',
      'project',
      'group',
      'budgetCategory',
      'taskCategory',
      'approvalStage',
      'role',
      'comments',
      'currency',
    ])
    // .andWhere('group.approvalStage IS NOT NULL')
    .andWhere('group.approved = :approval', { approval })
    .andWhere('(group.from BETWEEN :startDate AND :endDate OR group.to BETWEEN :startDate AND :endDate)', {
      startDate,
      endDate,
    })
    .getMany();

  const groupedData = {};

  budgets.forEach((entry) => {
    const projectId = entry.project.id;
    const groupId = entry.group.id;
    const currencyId = entry.currency.id;

    if (!groupedData[projectId]) {
      groupedData[projectId] = {
        project: {
          id: entry.project.id,
          name: entry.project.name,
        },
        groups: {},
      };
    }

    if (!groupedData[projectId].groups[groupId]) {
      groupedData[projectId].groups[groupId] = {};
    }

    if (!groupedData[projectId].groups[groupId][currencyId]) {
      groupedData[projectId].groups[groupId][currencyId] = [];
    }

    groupedData[projectId].groups[groupId][currencyId].push(entry);
  });

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
    .where()
    .andWhere('project.id = :projectId', { projectId })
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

  console.log(groupedResult);
  return groupedData;
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
 * Update budget by id
 * @param {ObjectId} budgetId
 * @param {Object} updateBody
 * @returns {Promise<Project>}
 */
const addBudget = async (budget) => {
  const budgetData = budgetRepository.create(budget);

  return await budgetRepository.save(budgetData);
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

const getBudgetGroup = async (groupId) => {
  return await budgetGroupRepository.findOne({ where: { id: groupId }, relations: ['project'] });
};

const getBudgetGroups = async (id) => {
  return await budgetGroupRepository.find({ where: { projectId: id } });
};

const getBudgetsByGroup = async (groupId) => {
  const budgets = await budgetRepository
    .createQueryBuilder('budget')
    .leftJoinAndSelect('budget.taskCategory', 'taskCategory')
    .leftJoinAndSelect('budget.group', 'group')
    .leftJoinAndSelect('group.project', 'project')
    .leftJoinAndSelect('budget.currency', 'currency') // Add this line to join the currency relation
    .select('SUM(budget.amount)', 'sum')
    .addSelect('currency.id', 'currency_id') // Select the currency ID
    .addSelect('currency.name', 'currency_name') // Select the currency name
    .addSelect('taskCategory', 'taskCategory')
    .addSelect('group.from', 'group_to')
    .addSelect('group.to', 'group_from')
    .addSelect('project.id', 'project_id')
    .addSelect('project.name', 'project_name')
    .where('budget.group.id = :groupId', { groupId: groupId })
    .groupBy('currency.id') // Group by the currency ID
    .getRawMany();

  return budgets;
};

module.exports = {
  createBudget,
  getBudgets,
  getBudget,
  updateBudget,
  deleteBudget,
  getBudgetsOfProject,
  getTasksOfProject,
  getBudgetsOfProjects,
  addBudget,
  getBudgetGroup,
  getBudgetGroupByCategory,
  getAllBudgetsOfProjects,
  getCurrentMonthBudgetOfProjects,
  getMonthlyBudgetsOfProjects,
  getBudgetGroups,
  getBudgetsByGroup,
  masterBudget,
  filterBudget,
  getBudgetsOfficeOfProjects,
};
