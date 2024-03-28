const httpStatus = require('http-status');
const { Budget, BudgetGroup, Task, monthlyBudget, ApprovalStage, ApprovalModule, OfficeQuarterlyBudget, Currency } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const services = require('./index');
const projectService = require('./project.service')
const { v4: uuidv4 } = require('uuid');
const { currencyService, budgetCategoryService, budgetSessionService } = require("./index");
const { reject } = require('./approval.service');


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
const budgetGroupRepository = dataSource.getRepository(BudgetGroup).extend({
  findAll,
  sortBy,
});
const budgetRepository = dataSource.getRepository(Budget).extend({
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
  // const level = 1;
  const fromDate = new Date(monthlyBudgetBody.from);
  const toDate = new Date(monthlyBudgetBody.to);
  const projectId = monthlyBudgetBody.budgetsData[0].projectId
  const project = await projectService.getProject(projectId);

  // const approvalStage = await approvalStageRepository
  //   .createQueryBuilder('approval_stage')
  //   .leftJoin('approval_stage.approvalModule', 'approvalModule')
  //   .where('approvalModule.moduleName = :moduleName', { moduleName })
  //   .andWhere('approval_stage.level = :level', { level })
  //   .getOne();

  // monthlyBudgetBody.approvalStage = approvalStage;
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
  if (project.isOffice && existingMonthlyBudget && existingMonthlyBudget.projectId === projectId) {
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
          else{
             
            throw new ApiError(httpStatus.NOT_FOUND, 'Quarterly Budget For This Currency And Category Does Not Exist');
          }
        }
      }
      // Save the updated existingMonthlyBudget
      await officeQuarterlyBudgetRepository.save(existingMonthlyBudget);
      monthlyBudgetBody.budgetsData.map((item) =>
        item.id = uuidv4())
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
  if(!budgetToBeUpdated){
    throw new ApiError(httpStatus.NOT_FOUND, 'Montly budget Does Not Exist');
  }
  const filteredBudget = budgetToBeUpdated.budgetsData.filter(item => item.id === updatedData.id)
  const amountToBeSubtracted = updatedData.budgetAmount - filteredBudget[0].budgetAmount
  const fromDate = new Date(updatedData.from);
  const toDate = new Date(updatedData.to);
  const projectId = updatedData.projectId
  let remmaing = 0
  if (budgetToBeUpdated) {
    const existingQuarterlyBudget = await officeQuarterlyBudgetRepository
      .createQueryBuilder('office_quarterly_budgets')
      .leftJoinAndSelect('office_quarterly_budgets.approvalStage', 'approvalStage')
      .leftJoinAndSelect('approvalStage.role', 'role')
      .leftJoinAndSelect('office_quarterly_budgets.officeQuarterlyBudgetComment', 'officeQuarterlyBudgetComment')
      .where('office_quarterly_budgets.from <= :fromDate', { fromDate: fromDate })
      .andWhere('office_quarterly_budgets.to >= :toDate', { toDate: toDate })
      .andWhere('office_quarterly_budgets.projectId = :projectId', { projectId: projectId })
      .andWhere('office_quarterly_budgets.isDeleted = :isDeleted', { isDeleted: false })

      .getOne();

    if (existingQuarterlyBudget) {

      for (const existingBudget of existingQuarterlyBudget.budgetsData) {
        // for (const newBudget of updatedData.budgetsData) {
        if (
          existingBudget && updatedData &&  // Check if both existingBudget and newBudget are defined
          existingBudget.currencyId === updatedData.currencyId &&
          existingBudget.budgetCategoryId === updatedData.budgetCategoryId
        ) {
          // Check if remaining_amount is less than budgetAmount
          if (existingBudget.remaining_amount < updatedData.budgetAmount) {
            throw new ApiError(httpStatus.FORBIDDEN, 'Insufficient remaining amount. Cannot create monthly budget');
          }
          // Update remaining_amount by subtracting budgetAmount
          existingBudget.remaining_amount -= amountToBeSubtracted;
        }
        else {
    
            throw new ApiError(httpStatus.NOT_FOUND, ' Quarterly Budget For This Currency And Category Does Not Exist');
     
        }
      }

      budgetToBeUpdated.budgetsData = budgetToBeUpdated.budgetsData.filter(item => item.id !== updatedData.id);

      await officeQuarterlyBudgetRepository.update({ id: existingQuarterlyBudget.id }, { budgetsData: existingQuarterlyBudget.budgetsData });
    }

    budgetToBeUpdated.budgetsData = budgetToBeUpdated.budgetsData.filter(item => item.id !== updatedData.id);
    budgetToBeUpdated.budgetsData.push(updatedData)
    const monthlyBudget = await montlyBudgetRepository.update({ id: id }, { budgetsData: budgetToBeUpdated.budgetsData });
    return await getMontlyOficeBudgetById(id)
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
    where: { from: activeBudgetSessions.startDate, to: activeBudgetSessions.endDate, isOffice: true }, relations: ['approvalStage', 'approvalStage.role', 'monthlyBudgetcomments', 'monthlyBudgetcomments.user', 'monthlyBudgetcomments.user.role']
  });
  if (monthlyBudget.length !== 0) {
    const budgetDatas = monthlyBudget.forEach((item) => {
      if (item.budgetsData[0]?.projectId === projectId) {
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

const RequestApprovalOfficeMonthlyBudget = async (budgetId) => {
  const monthlyBudget = await montlyBudgetRepository.findOne({ where: { id: budgetId }, relations: ['approvalStage', 'approvalStage.role'] })
  if (!monthlyBudget) {
    throw new ApiError(httpStatus.NOT_FOUND, 'monthlyBudget not found');
  }
  else if (monthlyBudget.approvalStage !== null) {
    const updatedMonthlyBudget = await montlyBudgetRepository.update({ id: budgetId }, {
      rejected: false

    });
    return await getMontlyOficeBudgetById(budgetId);

  }
  else {

    const approvalModule = await approvalModuleRepository.findOne({ where: { moduleName: "MonthlyBudget" } })

    const approvalSatge = await approvalStageRepository.findOne({ where: { approvalModuleId: approvalModule.id, level: 1 } })
    const monthlyBudgetUpdated = await montlyBudgetRepository.update({ id: budgetId }, {
      approvalStageId: approvalSatge.id

    });
    return await getMontlyOficeBudgetById(budgetId);

  }

}

const getMontlyOficeBudgetById = async (id) => {
  const monthlyBudget = await montlyBudgetRepository.findOne({
    where: { id: id }, relations: ['approvalStage', 'approvalStage.role', 'monthlyBudgetcomments', 'monthlyBudgetcomments.user', 'monthlyBudgetcomments.user.role']
  });

  if (monthlyBudget) {
    const budgetWithCategories = await Promise.all(monthlyBudget?.budgetsData.map(async (element) => {
      const category = await budgetCategoryService.getBudgetCategory(element.budgetCategoryId)
      const currency = await currencyService.getCurrencyById(element.currencyId)
      element.budgetCategory = category
      element.currency = currency
      return element
    }))
    monthlyBudget.budgetsData = budgetWithCategories
    return monthlyBudget;
  }


  return monthlyBudget;


}

const deleteOfficeMontlyBudget = async (id, budgetId) => {
  const montlyBudget = await montlyBudgetRepository.findOne({ where: { id: id } })
  if (!montlyBudget) {
    throw new ApiError(httpStatus.NOT_FOUND, ' Budget Does Not Exist');
  }
  const budgetTobeDeleted = montlyBudget.budgetsData.filter(item => item.id === budgetId)
  montlyBudget.budgetsData = montlyBudget.budgetsData.filter(item => item.id !== budgetId)
  const calculatedRemainingAmount = await calculateRemainingAmount(montlyBudget, budgetTobeDeleted[0])
  if (calculatedRemainingAmount) {
    if (montlyBudget.budgetsData.length !== 0) {
      await montlyBudgetRepository.update({ id: id }, {
        budgetsData: montlyBudget.budgetsData,
      });
    }
    else {
      await montlyBudgetRepository.delete({ id: id })

    }
    return await getMontlyOficeBudgetById(id);
  }
  else{
    throw new ApiError(httpStatus.NOT_FOUND, ' Quarterly Budget Does Not Exist');
  }
 

}
const calculateRemainingAmount = async (monthlyBudgetBody, montlBudgetUpdate) => {
  const fromDate = new Date(monthlyBudgetBody.from);
  const toDate = new Date(monthlyBudgetBody.to);
  const projectId = montlBudgetUpdate.projectId
  const existingQuarterlyBudget = await officeQuarterlyBudgetRepository
    .createQueryBuilder('office_quarterly_budgets')
    .leftJoinAndSelect('office_quarterly_budgets.approvalStage', 'approvalStage')
    .leftJoinAndSelect('approvalStage.role', 'role')
    .leftJoinAndSelect('office_quarterly_budgets.officeQuarterlyBudgetComment', 'officeQuarterlyBudgetComment')
    .where('office_quarterly_budgets.from <= :fromDate', { fromDate: fromDate })
    .andWhere('office_quarterly_budgets.to >= :toDate', { toDate: toDate })
    .andWhere('office_quarterly_budgets.projectId = :projectId', { projectId: projectId })
    .andWhere('office_quarterly_budgets.isDeleted = :isDeleted', { isDeleted: false })

    .getOne();
  if (existingQuarterlyBudget) {

    for (const existingBudget of existingQuarterlyBudget.budgetsData) {
      // for (const newBudget of updatedData.budgetsData) {
      if (
        existingBudget && montlBudgetUpdate &&  // Check if both existingBudget and newBudget are defined
        existingBudget.currencyId === montlBudgetUpdate.currencyId &&
        existingBudget.budgetCategoryId === montlBudgetUpdate.budgetCategoryId
      ) {
        existingBudget.remaining_amount = parseInt(existingBudget.remaining_amount) + parseInt(montlBudgetUpdate.budgetAmount);
      }
    }
    await officeQuarterlyBudgetRepository.update({ id: existingQuarterlyBudget.id }, { budgetsData: existingQuarterlyBudget.budgetsData });
    return existingQuarterlyBudget
  }``

}
const getBudgetsummary = async () => {

  //console.log(montlyOfficeBudget,"montlyOfficeBudget")
  let finalArray=[]
  let MontlyBudgetData=[]
  let totalAmountSum={}
  let data={}
  const activeSession = await budgetSessionService.activeBudgetSession()
  const montlyOfficeBudget= await montlyBudgetRepository.find({where:{isOffice:true,from: activeSession.startDate,to:activeSession.endDate },relations:['approvalStage','approvalStage.role']})
 const budgets= await getMonthlyBudgetLevelTwoApproved()
    const sums = {};
  budgets.map((budget) => {
    (budget.from = activeSession.startDate), (budget.to = activeSession.endDate);
    const currencyId = budget.currency_id;
        const amount = budget.sum;

        // If the currency ID already exists in the sums object, add the amount to it
        const { currency_id, currency_name, sum } = budget;

        // If the currency ID already exists in the sums object, add the amount to it
        if (sums[currency_id]) {
            sums[currency_id].amount += sum;
        } else {
            // If not, initialize the sum for that currency ID
            sums[currency_id] = { name: currency_name, amount: sum };
        }
        
        return sums;
    });
   
    totalAmountSum.projectName="allOpration"
    totalAmountSum.isOffice=false
    totalAmountSum.currency=  Object.values(sums)
    if(budgets.includes((item=>item.approved===false))){ 
      totalAmountSum.approved=false
    }
    else{
      totalAmountSum.approved=true
    }
    totalAmountSum.approvalSatge={}
    totalAmountSum.approvalSatge.role={}
    totalAmountSum.approvalSatge.id=  budgets[0].approvalStage_id
    totalAmountSum.approvalSatge.level=budgets[0].approvalStage_level
    totalAmountSum.approvalSatge.roleId=budgets[0].approvalStage_roleId
    totalAmountSum.approvalSatge.role.id=  budgets[0].role_id
    totalAmountSum.approvalSatge.role.roleName=budgets[0].role_roleName
   
    
totalAmountSum.montlyData=budgets
  finalArray.push(totalAmountSum)
  for (const item of montlyOfficeBudget) {
    item.currency = [];
    const projectId = item.budgetsData[0].projectId;

    // Fetch project name
    const project = await projectService.getProject(projectId);
    item.projectName = project.name;
    item.projectId=project.id

    // Iterate through budgetsData of each item
    for (const budget of item.budgetsData) {
        const { currencyId, budgetAmount } = budget;
        // If currencyId is not present, skip
        if (!currencyId) continue;

        // Fetch currency details
        const currency = await currencyService.getCurrencyById(currencyId);

        // Check if aggregatedBudgets already has this currency
        const existingCurrency = item.currency.find(c => c.name === currency.name);
        if (existingCurrency) {
            // If exists, add the budget amount to the existing total
            existingCurrency.amount += parseFloat(budgetAmount);
        } else {
            // If not, create a new entry for this currency
            item.currency.push({
                name: currency.name,
                amount: parseFloat(budgetAmount)
            });
        }
    }
}

  for (const item of montlyOfficeBudget) {
    delete item.budgetsData
    finalArray.push(item)
  }

  return finalArray;
 
};
const getMonthlyBudgetLevelTwoApproved= async( )=>{

  const activeSession = await budgetSessionService.activeBudgetSession()

const module="ProjectBudget"
const approvalLevel= await approvalModuleRepository.findOne({where:{moduleName:module}})

const level = approvalLevel.max_level ;

const approvalStage = await approvalStageRepository
    .createQueryBuilder('approval_stage')
    .leftJoin('approval_stage.approvalModule', 'approvalModule')
    .leftJoin('approval_stage.role', 'role')
    .where('approvalModule.moduleName = :moduleName', { moduleName: module })
    .andWhere('approval_stage.level = :level', { level })
    .getOne();
    const budgets = await budgetRepository
    .createQueryBuilder('budget')
    .leftJoinAndSelect('budget.taskCategory', 'taskCategory')
    .leftJoinAndSelect('budget.group', 'group')
    .leftJoinAndSelect('group.project', 'project')
    .leftJoinAndSelect('budget.currency', 'currency') // Add this line to join the currency relation
    .leftJoinAndSelect('group.approvalStage' ,'approvalStage')
    .leftJoinAndSelect('approvalStage.role' ,'role')
    .where('group.from = :from', { from: activeSession.startDate })
    .andWhere('group.to = :to', { to: activeSession.endDate })
    .andWhere('group.approvalStageId = :approvalStageId', {approvalStageId: approvalStage.id })
    .select('SUM(budget.amount)', 'sum')
    .addSelect('currency.id', 'currency_id') // Select the currency ID
    .addSelect('currency.name', 'currency_name') // Select the currency name
    .addSelect('taskCategory', 'taskCategory')
    .addSelect('group.from', 'group_from')
    .addSelect('group.to', 'group_to')
   .addSelect('group.approved', 'approved')
    .addSelect('project.id', 'project_id')
    .addSelect('project.name', 'project_name')
    .addSelect('project.isOffice', 'isOffice')
   .addSelect('approvalStage' ,'approvalStage')
   .addSelect('role' ,'role')
    .groupBy('currency.id') // Group by the currency ID
    .addGroupBy('taskCategory.id')
    .addGroupBy('project.id')
    .addGroupBy('group.to')
    .addGroupBy('group.from')
    .addGroupBy('group.approved')
    .addGroupBy('approvalStage.id')
    .addGroupBy('role.id')
    
    .getRawMany();

    return budgets
}

const approveOpprationProjects= async (budgetData)=>{
  let approvedMonthlyBudget={}
  const activeSession = await budgetSessionService.activeBudgetSession()
 const moduleName = "ProjectBudget"
 for(const item of budgetData){
 
  const budget =  await  budgetRepository.find({where:{projectId: item.project_id},relations:['group']})
  const filterdBudget=budget.filter((element)=> element.group.from===item.from&&element.group.to===item.to)
  if(filterdBudget.length!==0){
  for(const oneFilterdBudget of filterdBudget){
  const moduleId= oneFilterdBudget.group.id

  const approvedata= await services.approvalService.approve(moduleName,moduleId)
if(approvedata.approved===true){
  oneFilterdBudget.approved=true
}
else{
  oneFilterdBudget.approved=true
}
 

  }

 }
 if(filterdBudget.includes((item)=>item.approved===false)){
  item.approved=false
 }
 else{
  item.approved=true
 }

 
 }
//  if(item.approved===true){
//   const saveTomonthlyBudget = await montlyBudgetRepository.create({
//     budgetsData:budgetData,
//     approved:true,
//     rejected:false,
  
//    approvalStageId:"",
//    from:"",
//    to:""
  
//   });
//  }
if(budgetData.includes((item)=>item.approved===false)){
  throw new ApiError(httpStatus.NOT_FOUND, 'Montly Budget Not Approved Yet'); 
}
else{
  const moduleData= await approvalModuleRepository.findOne({where:{moduleName:moduleName}})
  const approvalStage= await approvalStageRepository.findOne({where:{approvalModuleId:moduleData.id,level:moduleData.max_level}})
  const saveTomonthlyBudget = await montlyBudgetRepository.create({
    budgetsData:budgetData,
    approved:true,
   rejected:false,
  
   approvalStageId:approvalStage.id,
   from:activeSession.startDate,
   to:activeSession.endDate
  
  });
  approvedMonthlyBudget= await montlyBudgetRepository.save(saveTomonthlyBudget)
}

return approvedMonthlyBudget
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
  updateOfficeMonthlyBudget,
  RequestApprovalOfficeMonthlyBudget,
  getMontlyOficeBudgetById,
  deleteOfficeMontlyBudget,
  getBudgetsummary,
  getMonthlyBudgetLevelTwoApproved,
  approveOpprationProjects
}
