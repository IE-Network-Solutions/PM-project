const httpStatus = require('http-status');
const { Budget, BudgetGroup, Task, monthlyBudget, ApprovalStage, ApprovalModule, OfficeQuarterlyBudget } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const services = require('./index');
const projectService = require('./project.service')
const { currencyService, budgetCategoryService, budgetSessionService } = require("./index")


const montlyBudgetRepository = dataSource.getRepository(monthlyBudget).extend({
  findAll,
  sortBy,
});
const approvalStageRepository = dataSource.getRepository(ApprovalStage).extend({
  findAll,
  sortBy,
});
const approvalModuleRepository = dataSource.getRepository(ApprovalModule).extend({
  findAll,
  sortBy,
});

const officeQuarterlyBudgetRepository = dataSource.getRepository(OfficeQuarterlyBudget).extend({
  findAll,
  sortBy,
});
/**
 * Query for budget
 * @param {Object} filter - Filter options
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

const getMonthlyBudgets = async () => {
  return await montlyBudgetRepository.find({
    relations: ['approvalStage'],
  });
};

/**
 * Create a montly budget
 * @param {Object} budgetBody
 * @returns {Promise<Project>}
 */
const createMontlyBudget = async (monthlyBudgetBody) => {
  const moduleName = "MonthlyBudget";
  const level = 1;
  const fromDate = monthlyBudgetBody.from;
  const toDate = monthlyBudgetBody.to;
  const approvalStage = await approvalStageRepository
    .createQueryBuilder('approval_stage')
    .leftJoin('approval_stage.approvalModule', 'approvalModule')
    .where('approvalModule.moduleName = :moduleName', { moduleName })
    .andWhere('approval_stage.level = :level', { level })
    .getOne();

  monthlyBudgetBody.approvalStage = approvalStage;
  // Create a new monthly budget with the original monthlyBudgetBody
  const newMonthlyBudget = montlyBudgetRepository.create(monthlyBudgetBody);
  await montlyBudgetRepository.save(newMonthlyBudget);

  return newMonthlyBudget;
};
const createMontlyOfficeBudget = async (monthlyBudgetBody) => {
  const moduleName = "MonthlyBudget";
  const level = 1;
  const fromDate = new Date(monthlyBudgetBody.from);
  const toDate = new Date(monthlyBudgetBody.to);
  const projectId = monthlyBudgetBody.budgetsData[0].projectId
  const project = await projectService.getProject(projectId);

  const approvalStage = await approvalStageRepository
    .createQueryBuilder('approval_stage')
    .leftJoin('approval_stage.approvalModule', 'approvalModule')
    .where('approvalModule.moduleName = :moduleName', { moduleName })
    .andWhere('approval_stage.level = :level', { level })
    .getOne();

  monthlyBudgetBody.approvalStage = approvalStage;
  const existingMonthlyBudget = await officeQuarterlyBudgetRepository
    .createQueryBuilder('office_quarterly_budgets')
    .leftJoinAndSelect('office_quarterly_budgets.approvalStage', 'approvalStage')
    .leftJoinAndSelect('approvalStage.role', 'role')
    .leftJoinAndSelect('office_quarterly_budgets.officeQuarterlyBudgetComment', 'officeQuarterlyBudgetComment')
    .where('office_quarterly_budgets.project = :projectId', { projectId: projectId })
    .andWhere('office_quarterly_budgets.from <= :fromDate', { fromDate: fromDate })
    .andWhere('office_quarterly_budgets.to >= :toDate', { toDate: toDate })
    .andWhere('office_quarterly_budgets.isDeleted = :isDeleted', { isDeleted: false })
    .getOne();
  if (project.isOffice && existingMonthlyBudget.projectId === projectId) {
    monthlyBudgetBody.isOffice = true;
    if (existingMonthlyBudget && existingMonthlyBudget.budgetsData) {
      for (const existingBudget of existingMonthlyBudget.budgetsData) {
        for (const newBudget of monthlyBudgetBody.budgetsData) {
          if (
            existingBudget && newBudget &&  // Check if both existingBudget and newBudget are defined
            existingBudget.currencyId === newBudget.currencyId &&
            existingBudget.budgetCategoryId === newBudget.budgetCategoryId
          ) {
            // Check if remaining_amount is less than budgetAmount
            if (existingBudget.remaining_amount < newBudget.budgetAmount) {
              throw new ApiError(httpStatus.FORBIDDEN, 'Insufficient remaining amount. Cannot create monthly budget');

            }
            // Update remaining_amount by subtracting budgetAmount
            existingBudget.remaining_amount -= newBudget.budgetAmount;
          }
        }
      }
      // Save the updated existingMonthlyBudget
      await officeQuarterlyBudgetRepository.save(existingMonthlyBudget);
      const newMonthlyBudget = montlyBudgetRepository.create(monthlyBudgetBody);
      await montlyBudgetRepository.save(newMonthlyBudget);
      return newMonthlyBudget;
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, 'quarterly budget is not found');
    }

  }
  else {
    throw new ApiError(httpStatus.NOT_FOUND, 'quarterly budget For this project is not found');
  }

};


const getMonthlyBudgetByMonthGroup = async (month) => {
  const monthlyBudget = await montlyBudgetRepository.findOne({ where: { from: month.from, to: month.to, isOffice: false }, relations: ['approvalStage', 'approvalStage.role', 'monthlyBudgetcomments'] });
  return monthlyBudget;
}


const getMonthlyBudgetByMonthGroupOfficeProject = async (month, ProjectId) => {
  const monthlyBudget = await montlyBudgetRepository.find({ where: { from: month.from, to: month.to, isOffice: true }, relations: ['approvalStage', 'approvalStage.role', 'monthlyBudgetcomments'] });
  let returnedBudget = {}

  for (const budget of monthlyBudget) {
    if (budget.budgetsData[0].projectId === ProjectId) {
      returnedBudget = budget
    }
  };
  return returnedBudget
}
const getMonthlyBudgetByProjectGroup = async (month) => {
  // const month = month.month
  const year = month.year
  let budget = [];
  const monthlyBudget = await montlyBudgetRepository
    .createQueryBuilder("monthlyBudget")
    .leftJoinAndSelect("monthlyBudget.approvalStage", "approvalStage")
    .leftJoinAndSelect("approvalStage.role", "role")
    .leftJoinAndSelect("monthlyBudget.monthlyBudgetcomments", "monthlyBudgetcomments")
    .getMany();

  const groupedData = {};
  const projectBudget = monthlyBudget.filter((item) => item.isOffice === false)
  for (const entry of projectBudget) {
    for (const budget of entry.budgetsData) {
      if (!groupedData[budget.projectId]) {
        groupedData[budget.projectId] = [];
      }
      const project = await projectService.getProject(budget.projectId)
      budget.project = project;
      groupedData[budget.projectId].push(budget);
    };
  };
  return groupedData;

}
const getMonthlyBudgetByProjectGroupoffice = async (month) => {
  // const month = month.month
  const year = month.year
  let budget = [];
  const monthlyBudget = await montlyBudgetRepository
    .createQueryBuilder("monthlyBudget")
    .leftJoinAndSelect("monthlyBudget.approvalStage", "approvalStage")
    .leftJoinAndSelect("approvalStage.role", "role")
    .leftJoinAndSelect("monthlyBudget.monthlyBudgetcomments", "monthlyBudgetcomments")
    .getMany();

  const groupedData = {};
  const officeBudget = monthlyBudget.filter((item) => item.isOffice === true);
  const projectIds = officeBudget.flatMap((entry) =>
    entry.budgetsData.map((budget) => budget.projectId)
  );

  for (const entry of officeBudget) {
    for (const budget of entry.budgetsData) {

      if (!groupedData[budget.projectId]) {
        groupedData[budget.projectId] = [];
      }
      const project = await projectService.getProject(budget.projectId)

      const category = await budgetCategoryService.getBudgetCategory(budget.budgetCategoryId)
      const currency = await currencyService.getCurrencyById(budget.currencyId)
      budget.budget_Category = category.budgetCategoryName;
      budget.currency_name = currency.name;
      budget.project = project;
      groupedData[budget.projectId].push(budget);
    };
  };

  return groupedData;

}

const updateMonthlyBudget = async (id, updatedData) => {
  const monthlyBudget = await montlyBudgetRepository.update({ id: id }, updatedData);
  return await montlyBudgetRepository.findOne({ where: { id: id } });
}
const updateOfficeMonthlyBudget = async (id, updatedData) => {
  const budgetToBeUpdated = await montlyBudgetRepository.findOne({ where: { id: id } })
  let remmaing = 0
  if (budgetToBeUpdated) {
    for (const existingBudget of budgetToBeUpdated.budgetsData) {
      for (const newBudget of updatedData.budgetsData) {
        if (
          existingBudget && newBudget &&
          existingBudget.currencyId === newBudget.currencyId &&
          existingBudget.budgetCategoryId === newBudget.budgetCategoryId
        ) {
          remmaing = existingBudget.budgetAmount - newBudget.budgetAmount

        }

      }
    }
    const existingQuarterlyBudget = await officeQuarterlyBudgetRepository
      .createQueryBuilder('office_quarterly_budgets')
      .leftJoinAndSelect('office_quarterly_budgets.approvalStage', 'approvalStage')
      .leftJoinAndSelect('approvalStage.role', 'role')
      .leftJoinAndSelect('office_quarterly_budgets.officeQuarterlyBudgetComment', 'officeQuarterlyBudgetComment')
      .where('office_quarterly_budgets.from <= :fromDate', { fromDate: fromDate })
      .andWhere('office_quarterly_budgets.to >= :toDate', { toDate: toDate })
      .andWhere('office_quarterly_budgets.projectId >= :projectId', { projectId: project.id })
      .andWhere('office_quarterly_budgets.isDeleted = :isDeleted', { isDeleted: false })

      .getOne();
    if (existingQuarterlyBudget) {

      for (const existingBudget of existingQuarterlyBudget.budgetsData) {
        for (const newBudget of updatedData.budgetsData) {
          if (
            existingBudget && newBudget &&  // Check if both existingBudget and newBudget are defined
            existingBudget.currencyId === newBudget.currencyId &&
            existingBudget.budgetCategoryId === newBudget.budgetCategoryId
          ) {
            // Check if remaining_amount is less than budgetAmount
            if (existingBudget.remaining_amount < newBudget.budgetAmount) {
              throw new ApiError(httpStatus.FORBIDDEN, 'Insufficient remaining amount. Cannot create monthly budget');

            }
            // Update remaining_amount by subtracting budgetAmount
            existingBudget.remaining_amount -= remmaing;
          }
        }
      }
    }

    const monthlyBudget = await montlyBudgetRepository.update({ id: id }, updatedData);
    return await montlyBudgetRepository.findOne({ where: { id: id } });
  }
}


const getBudgetByProject = async (projectId) => {
  const activeBudget = []
  const inActiveBudget = []
  const activeBudgetSessions = await budgetSessionService.activeBudgetSession();

  const monthlyBudget = await montlyBudgetRepository.find({
    where: { from: activeBudgetSessions.startDate, to: activeBudgetSessions.endDate, isOffice: true }, relations: ['approvalStage', 'approvalStage.role', 'monthlyBudgetcomments']
  });

  if (monthlyBudget.length !== 0) {
    const budgetDatas = monthlyBudget.forEach((item) => {
      if (item.budgetsData[0].projectId === projectId) {
        activeBudget.push(item)
      }

    })

    if (activeBudget.length !== 0) {
      const budgetWithCategories = await Promise.all(activeBudget[0]?.budgetsData.map(async (element) => {
        const category = await budgetCategoryService.getBudgetCategory(element.budgetCategoryId)
        const currency = await currencyService.getCurrencyById(element.currencyId)
        element.budgetCategory = category
        element.currency = currency
        return element
      }))
      activeBudget[0].budgetsData = budgetWithCategories
      return activeBudget;
    }
  }

  return activeBudget;


}


module.exports = {
  createMontlyBudget,
  getMonthlyBudgets,
  getMonthlyBudgetByMonthGroup,
  updateMonthlyBudget,
  getMonthlyBudgetByProjectGroup,
  getMonthlyBudgetByProjectGroupoffice,
  getBudgetByProject,
  createMontlyOfficeBudget,
  getMonthlyBudgetByMonthGroupOfficeProject,
  updateOfficeMonthlyBudget
}
