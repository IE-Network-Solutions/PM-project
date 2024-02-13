const httpStatus = require('http-status');
const { Budget, BudgetGroup, Task, monthlyBudget, ApprovalStage, ApprovalModule } = require('../models');
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
const createMontlyBudget = async (montlyBudgetBody) => {
  moduleName = "MonthlyBudget"
  level = 1

  const project = await projectService.getProject(montlyBudgetBody.budgetsData[0].projectId)

  approvalStage = await approvalStageRepository
    .createQueryBuilder('approval_stage')
    .leftJoin('approval_stage.approvalModule', 'approvalModule')
    .where('approvalModule.moduleName = :moduleName', { moduleName })
    .andWhere('approval_stage.level = :level', { level })
    .getOne();

  montlyBudgetBody.approvalStage = approvalStage;
  if (project.isOffice) {

    montlyBudgetBody.isOffice = true;
  }
  const montlBudget = montlyBudgetRepository.create(montlyBudgetBody);
  await montlyBudgetRepository.save(montlBudget);

  return montlBudget;
};

const getMonthlyBudgetByMonthGroup = async (month) => {
  const monthlyBudget = await montlyBudgetRepository.find({ where: { from: month.from, to: month.to }, relations: ['approvalStage', 'approvalStage.role', 'monthlyBudgetcomments'] });
  console.log(monthlyBudget, "monthlyBudgetmonthlyBudget")
  // for (const budget of monthlyBudget.budgetsData) {

  //   const project = await projectService.getProject(budget?.projectId)
  //   const category = await budgetCategoryService.getBudgetCategory(budget?.budgetCategoryId)
  //   const currency = await currencyService.getCurrencyById(budget.currencyId)
  //   budget.budgetCategory = category;
  //   budget.currency = currency;

  // };
  return monthlyBudget;
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
  getBudgetByProject
}
