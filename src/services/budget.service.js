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
 * @module budget
 */
/**
 * Creates a budget and associates it with a project.
 * @function
 * @async
 * @param {Object} budgetBody - The budget data including details like date range, project, and budget items.
 * @returns {Promise<Object[]>} - An array of created budget objects.
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
    deductFromProjectBudget(budgetData.budgetCategory.id, budgetData.currency.id, budgetData.project.id, budgetData.amount);
    return budgetData;
  });
  await budgetRepository.save(budgets);
  return budgets;
};
/**
 * Deducts an amount from the project budget based on the specified category, currency, and project.
 * @function
 * @async
 * @param {string} categoryId - The unique identifier of the budget category.
 * @param {string} currencyId - The unique identifier of the currency.
 * @param {string} projectId - The unique identifier of the project.
 * @param {number} amount - The amount to deduct from the budget.
 * @returns {Promise<Object>} - The updated project budget object.
 */
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


  // if (!projectBudget) {
  //   $projectBudget =
  // }
  if (projectBudget) {
    projectBudget.usedAmount += amount;

    await projectBudgetRepository.save(projectBudget);
  }
  return projectBudget;
};
/**
 * Retrieves budget data along with associated details.
 * @function
 * @async
 * @param {Object} filter - The filter criteria for budget retrieval.
 * @param {Object} options - Additional options for pagination and sorting.
 * @returns {Promise<Object[]>} - An array of budget objects with related details.
 */
const getBudgets = async (filter, options) => {
  const { limit, page, sortBy } = options;

  return await budgetRepository.find({
    relations: ['currency', 'group', 'task', 'budgetCategory', 'taskCategory', 'project'],
  });
};
/**
 * Retrieves budgets of a project.
 * @function
 * @async
 * @param {number} projectId - The ID of the project.
 * @returns {Promise<Object>} - An object containing grouped budget data.
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
 * Retrieves budgets grouped by category within a specified date range.
 * @function
 * @async
 * @param {string} from - The start date of the range.
 * @param {string} to - The end date of the range.
 * @returns {Promise<Array>} - An array of budget data grouped by category.
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
    .addSelect('project.isOffice', 'isOffice')
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
/**
 * Retrieves budgets of projects.
 * @function
 * @async
 * @returns {Promise<Object>} - An object containing grouped budget data for multiple projects.
 */
const getBudgetsOfProjects = async () => {
  const approval = false;
  const isOffice = false

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
    .andWhere('project.isOffice=:isOffice', { isOffice })
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
/**
 * Retrieves budgets grouped by category within a specified date range for office projects.
 * @function
 * @async
 * @param {Object} month - An object containing 'from' and 'to' properties representing the date range.
 * @param {string} month.from - The start date of the range.
 * @param {string} month.to - The end date of the range.
 * @returns {Promise<Object>} - An object containing grouped budget data for office projects.
 */
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
/**
 * Retrieves budgets grouped by category within a specified date range for office projects.
 * @function
 * @async
 * @param {Object} month - An object containing 'from' and 'to' properties representing the date range.
 * @param {string} month.from - The start date of the range.
 * @param {string} month.to - The end date of the range.
 * @returns {Promise<Object>} - An object containing grouped budget data for office projects.
 */
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
/**
 * Retrieves budgets grouped by category within a specified date range for office projects.
 * @function
 * @async
 * @param {Object} month - An object containing 'from' and 'to' properties representing the date range.
 * @param {string} month.from - The start date of the range.
 * @param {string} month.to - The end date of the range.
 * @returns {Promise<Object>} - An object containing grouped budget data for office projects.
 */
const getCurrentMonthBudgetOfProjects = async (projectId) => {
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
 * Retrieves budgets grouped by category within a specified date range for office projects.
 * @function
 * @async
 * @param {Object} month - An object containing 'from' and 'to' properties representing the date range.
 * @param {string} month.from - The start date of the range.
 * @param {string} month.to - The end date of the range.
 * @returns {Promise<Object>} - An object containing grouped budget data for office projects.
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
 * Retrieves budgets grouped by category within a specified date range for office projects.
 * @function
 * @async
 * @returns {Promise<Object>} - An object containing grouped budget data for office projects.
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
 * Retrieves budgets grouped by category within a specified date range.
 * @function
 * @async
 * @param {string} startDate - The start date of the range.
 * @param {string} endDate - The end date of the range.
 * @returns {Promise<Object>} - An object containing grouped budget data.
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
 * Retrieves tasks associated with a specific project.
 * @function
 * @async
 * @param {number} projectId - The ID of the project.
 * @returns {Promise<Object>} - An object containing grouped task data.
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
  return groupedData;
};
/**
 * Retrieves a budget object based on the provided ID.
 * @function
 * @async
 * @param {string} id - The unique identifier for the budget.
 * @returns {Promise<object>} - The budget object retrieved from the repository.
 */
const getBudget = async (id) => {
  return await budgetRepository.findOneBy({ id: id });
};
/**
 * Updates a budget based on the provided budget ID and update data.
 * @function
 * @async
 * @param {string} budgetId - The unique identifier for the budget.
 * @param {object} updateBody - The data to update the budget with.
 * @returns {Promise<object>} - The updated budget object.
 */
const updateBudget = async (budgetId, updateBody) => {
  const budget = await budgetRepository.update({ id: budgetId }, updateBody);
  return await getBudget(budgetId);
};
/**
 * Adds a new budget to the repository.
 *
 * @async
 * @param {object} budget - The budget object to be added.
 * @returns {Promise<object>} - The saved budget object.
 */
const addBudget = async (budget) => {
  const budgetData = budgetRepository.create(budget);

  return await budgetRepository.save(budgetData);
};
/**
 * Deletes a budget based on the provided budget ID.
 *
 * @async
 * @param {string} budgetId - The unique identifier for the budget.
 * @throws {ApiError} - Throws an error if the budget is not found.
 */
const deleteBudget = async (budgetId) => {
  const budget = await getBudget(budgetId);
  if (!budget) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Budget not found');
  }
  return await budgetRepository.delete({ id: budgetId });
};
/**
 * Retrieves a budget group based on the provided group ID.
 * @function
 * @async
 * @param {string} groupId - The unique identifier for the budget group.
 * @returns {Promise<object>} - The budget group object retrieved from the repository.
 */
const getBudgetGroup = async (groupId) => {
  return await budgetGroupRepository.findOne({ where: { id: groupId }, relations: ['project'] });
};
/**
 * Retrieves budget groups based on the provided project ID.
 * @function
 * @async
 * @param {string} id - The unique identifier for the project.
 * @returns {Promise<object[]>} - An array of budget group objects associated with the project.
 */
const getBudgetGroups = async (id) => {
  return await budgetGroupRepository.find({ where: { projectId: id } });
};
/**
 * Retrieves budget groups based on the provided project ID.
 * @function
 * @async
 * @param {string} id - The unique identifier for the project.
 * @returns {Promise<object[]>} - An array of budget group objects associated with the project.
 */
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
