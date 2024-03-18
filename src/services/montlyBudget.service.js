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
 * @module monthlyBudget
 */
/**
 * Retrieves monthly budgets from the repository.
 *
 * @function
 * @returns {Promise<Array>} An array of monthly budgets with associated approval stages.
 */
const getMonthlyBudgets = async () => {
  return await montlyBudgetRepository.find({
    relations: ['approvalStage'],
  });
};
/**
 * Creates a new monthly budget.
 *
 * @function
 * @param {Object} monthlyBudgetBody - The monthly budget data.
 * @param {string} monthlyBudgetBody.from - Start date of the budget.
 * @param {string} monthlyBudgetBody.to - End date of the budget.
 * @param {Array} monthlyBudgetBody.budgetsData - Array of budget data.
 * @param {string} monthlyBudgetBody.budgetsData.projectId - ID of the associated project.
 * @param {number} monthlyBudgetBody.budgetsData.currencyId - ID of the currency.
 * @param {number} monthlyBudgetBody.budgetsData.budgetCategoryId - ID of the budget category.
 * @param {number} monthlyBudgetBody.budgetsData.budgetAmount - Amount allocated for the budget.
 * @param {string|null} monthlyBudgetBody.budgetsData.userId - Optional user ID associated with the budget.
 * @returns {Promise<Object|string>} A newly created monthly budget object or an error message.
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
/**
 * Creates an office monthly budget.
 *
 * @function
 * @param {Object} monthlyBudgetBody - The request body containing budget details.
 * @param {string} monthlyBudgetBody.from - Start date of the budget.
 * @param {string} monthlyBudgetBody.to - End date of the budget.
 * @param {Array} monthlyBudgetBody.budgetsData - Array of budget data.
 * @param {string} monthlyBudgetBody.budgetsData.projectId - ID of the project.
 * @returns {Promise<void>} - Resolves when the monthly budget is created.
 */
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
  if (project.isOffice &&existingMonthlyBudget && existingMonthlyBudget.projectId === projectId) {
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
  // Create a new monthly budget with the original monthlyBudgetBody
  // const newMonthlyBudget = montlyBudgetRepository.create(monthlyBudgetBody);
  // await montlyBudgetRepository.save(newMonthlyBudget);

  // return newMonthlyBudget;

};
/**
 * Retrieves monthly budgets based on the specified date range.
 *
 * @function
 * @param {Object} month - An object representing the date range.
 * @param {string} month.from - Start date of the budget.
 * @param {string} month.to - End date of the budget.
 * @returns {Promise<Array>} An array of monthly budgets with associated approval stages and comments.
 */
const getMonthlyBudgetByMonthGroup = async (month) => {
  const monthlyBudget = await montlyBudgetRepository.findOne({ where: { from: month.from, to: month.to, isOffice: false }, relations: ['approvalStage', 'approvalStage.role', 'monthlyBudgetcomments'] });
  return monthlyBudget;
}
/**
 * Retrieves an office monthly budget based on the specified month and project ID.
 * @function
 * @param {Object} month - Object containing the start and end dates of the month.
 * @param {string} month.from - Start date of the month.
 * @param {string} month.to - End date of the month.
 * @param {string} ProjectId - ID of the project to filter by.
 * @returns {Promise<Object>} - Resolves with the retrieved monthly budget (if found).
 */
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

/**
 * Retrieves monthly budgets grouped by project.
 *
 * @function
 * @param {Object} month - An object representing the date range.
 * @param {string} month.year - The year for which budgets are retrieved.
 * @returns {Promise<Object>} An object containing monthly budgets grouped by project.
 */
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
/**
 * Retrieves monthly budgets grouped by project for the specified year.
 *
 * @function
 * @param {Object} month - An object representing the date range.
 * @param {string} month.year - The year for which budgets are retrieved.
 * @returns {Promise<Object>} An object containing monthly budgets grouped by project.
 */
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
/**
 * Updates an existing monthly budget.
 *
 * @function
 * @param {string} id - The ID of the monthly budget to be updated.
 * @param {Object} updatedData - The updated data for the monthly budget.
 * @returns {Promise<Object>} The updated monthly budget object.
 */
const updateMonthlyBudget = async (id, updatedData) => {
  const monthlyBudget = await montlyBudgetRepository.update({ id: id }, updatedData);
  return await montlyBudgetRepository.findOne({ where: { id: id } });
}
/**
 * Updates an existing office monthly budget.
 * 
 * @function
 * @param {string} id - ID of the budget to be updated.
 * @param {Object} updatedData - Updated budget data.
 * @param {Array} updatedData.budgetsData - Array of updated budget data.
 * @param {string} updatedData.budgetsData.currencyId - ID of the currency.
 * @param {string} updatedData.budgetsData.budgetCategoryId - ID of the budget category.
 * @param {number} updatedData.budgetsData.budgetAmount - Updated budget amount.
 * @returns {Promise<void>} - Resolves when the budget is successfully updated.
 * @throws {ApiError} - Throws an error if the remaining amount is insufficient.
 */
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

/**
 * Retrieves monthly budgets for a specific project.
 *
 * @function
 * @param {string} projectId - The ID of the project.
 * @returns {Promise<Array>} An array of monthly budgets associated with the project.
 */
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
