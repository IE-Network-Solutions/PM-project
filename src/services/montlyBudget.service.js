const httpStatus = require('http-status');
const { Budget, BudgetGroup, Task, monthlyBudget, ApprovalStage, ApprovalModule, OfficeQuarterlyBudget} = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const services = require('./index');
const projectService = require('./project.service')


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

  const project = await projectService.getProject(monthlyBudgetBody.budgetsData[0].projectId);

  const approvalStage = await approvalStageRepository
    .createQueryBuilder('approval_stage')
    .leftJoin('approval_stage.approvalModule', 'approvalModule')
    .where('approvalModule.moduleName = :moduleName', { moduleName })
    .andWhere('approval_stage.level = :level', { level })
    .getOne();

  monthlyBudgetBody.approvalStage = approvalStage;



  const existingMonthlyBudget = await officeQuarterlyBudgetRepository.findOne({
    where: { from: fromDate, to: toDate, isDeleted: false },
    relations: ['approvalStage', 'approvalStage.role', 'officeQuarterlyBudgetComment']
  });

  if (project.isOffice) {
    monthlyBudgetBody.isOffice = true;
    if (existingMonthlyBudget && existingMonthlyBudget.budgetsData && Array.isArray(existingMonthlyBudget.budgetsData)) {
      for (const existingBudget of existingMonthlyBudget.budgetsData) {
        for (const newBudget of monthlyBudgetBody.budgetsData) {
          if (
            existingBudget && newBudget &&  // Check if both existingBudget and newBudget are defined
            existingBudget.currencyId === newBudget.currencyId &&
            existingBudget.budgetCategoryId === newBudget.budgetCategoryId
          ) {
            // Check if remaining_amount is less than budgetAmount
            if (existingBudget.remaining_amount < newBudget.budgetAmount) {
              return "Insufficient remaining amount. Cannot create monthly budget.";
            }
  
            // Update remaining_amount by subtracting budgetAmount
            existingBudget.remaining_amount -= newBudget.budgetAmount;
          }
        }
      }
      // Save the updated existingMonthlyBudget
      await officeQuarterlyBudgetRepository.save(existingMonthlyBudget);
    } else {
      console.error("existingMonthlyBudget or existingMonthlyBudget.budgetsData is undefined or not an array");
    }
  }

  // Create a new monthly budget with the original monthlyBudgetBody
  const newMonthlyBudget = montlyBudgetRepository.create(monthlyBudgetBody);
  await montlyBudgetRepository.save(newMonthlyBudget);

  return newMonthlyBudget;
};




const getMonthlyBudgetByMonthGroup = async (month) => {
  const monthlyBudget = await montlyBudgetRepository.findOne({ where: { from: month.from, to: month.to }, relations: ['approvalStage', 'approvalStage.role', 'monthlyBudgetcomments'] });
  return monthlyBudget;
}

const updateMonthlyBudget = async (id, updatedData) => {
  const monthlyBudget = await montlyBudgetRepository.update({ id: id }, updatedData);
  return await montlyBudgetRepository.findOne({ where: { id: id } });
}


module.exports = {
  createMontlyBudget,
  getMonthlyBudgets,
  getMonthlyBudgetByMonthGroup,
  updateMonthlyBudget
}