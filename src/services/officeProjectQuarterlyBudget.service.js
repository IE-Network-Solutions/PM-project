const httpStatus = require('http-status');
const { Budget, BudgetGroup, Task, monthlyBudget, ApprovalStage, ApprovalModule, OfficeQuarterlyBudget } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const { currencyService, budgetCategoryService } = require("./index")
const officeBudgetSessionService = require("./officeBudegtSession.service")
const { v4: uuidv4 } = require('uuid');

const officeQuarterlyBudgetRepository = dataSource.getRepository(OfficeQuarterlyBudget).extend({
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
 * @module OfficeProjectQuarterlyBudget
 */
/**
 * Creates a new quarterly budget.
 *
 * @function
 * @param {Object} montlyBudgetBody - The data for the new quarterly budget.
 * @returns {Promise<Object>} The newly created quarterly budget object.
 */
const createQuarterlyBudget = async (montlyBudgetBody) => {
    montlyBudgetBody.budgetsData.map((item)=>
    item.id=uuidv4())
    const montlBudget = officeQuarterlyBudgetRepository.create(montlyBudgetBody);

  const savedBudget=   await officeQuarterlyBudgetRepository.save(montlBudget);
  return await getAllQuarterlyBudgetById(savedBudget.id)


};
/**
 * Retrieves quarterly budgets based on the specified date range.
 *
 * @function
 * @param {Object} month - An object representing the date range.
 * @param {string} month.from - Start date of the budget.
 * @param {string} month.to - End date of the budget.
 * @returns {Promise<Array>} An array of quarterly budgets with associated approval stages and comments.
 */
const getQuarterlyBudgetByMonthGroup = async (month) => {
    const monthlyBudget = await officeQuarterlyBudgetRepository.find({ where: { from: month.from, to: month.to, isDeleted: false }, relations: ['approvalStage', 'approvalStage.role', 'officeQuarterlyBudgetComment'] });
    return monthlyBudget;
}
/**
 * Updates an existing quarterly budget.
 *
 * @function
 * @param {string} id - The ID of the quarterly budget to be updated.
 * @param {Object} updatedData - The updated data for the quarterly budget.
 * @returns {Promise<Object>} The updated quarterly budget object.
 */
const updateQuarterlyBudget = async (id, updatedData) => {
    const Budget = await officeQuarterlyBudgetRepository.findOne({ where: { id: id, isDeleted: false } })
    if (!Budget) {
        throw new ApiError(httpStatus.NOT_FOUND, ' budget Doesnt exist');
    }
  const filterdBudget =Budget.budgetsData.filter(item=>item.id==updatedData.id);
  Budget.budgetsData= Budget.budgetsData.filter(item=>item.id!==updatedData.id);
   const budgetDataTobeUpdated=filterdBudget[0]
   delete filterdBudget[0];
  const amount = budgetDataTobeUpdated.budgetAmount-updatedData.budgetAmount
  budgetDataTobeUpdated.remaining_amount = budgetDataTobeUpdated.remaining_amount - amount
  budgetDataTobeUpdated.budgetAmount =updatedData.budgetAmount
  budgetDataTobeUpdated.currencyId=updatedData.currencyId
  budgetDataTobeUpdated.budgetCategoryId=updatedData.budgetCategoryId
   Budget.budgetsData.push(budgetDataTobeUpdated)
 const monthlyBudget = await officeQuarterlyBudgetRepository.update({ id: id }, 
    {budgetsData:Budget.budgetsData});
 const oneBudget=await getAllQuarterlyBudgetById(id);
 const budgetData=oneBudget.budgetsData.filter(item=>item.id===updatedData.id)
return  budgetData[0]
}

/**
 * Deletes a quarterly budget by marking it as deleted.
 * @async
 * @function
 * @param {number} id - The unique identifier of the budget to delete.
 * @throws {ApiError} Throws an error if the budget does not exist.
 * @returns {Promise<Object>} The deleted budget object.
 */
const DeleteQuarterlyBudget = async (id,budgetId) => {
    const budget = await officeQuarterlyBudgetRepository.findOne({ where: { id: id, isDeleted: false } })
    if (!budget) {

        throw new ApiError(httpStatus.NOT_FOUND, ' budget Doesnt exist');
    }
    budget.budgetsData= budget.budgetsData.filter(item=>item.id!==budgetId)
    if( budget.budgetsData.length!==0){
    const deletedbudget = await officeQuarterlyBudgetRepository.update({ id: id }, {
        budgetsData:  budget.budgetsData,
    });
    }
    else{
        const deletedbudget = await officeQuarterlyBudgetRepository.update({ id: id }, {
          isDeleted:true
        });

    }
    return await getAllQuarterlyBudgetById(id);
}
/**
 * Retrieves quarterly budget data for a specific project.
 * @async
 * @function
 * @param {Object} month - An object representing the time range (from and to) for the budget.
 * @param {string} month.from - The start date of the quarter.
 * @param {string} month.to - The end date of the quarter.
 * @param {number} projectId - The unique identifier of the project.
 * @throws {ApiError} Throws an error if no budget data is found.
 * @returns {Promise<Array>} An array of budget data objects.
 */
const getQuarterlyBudgetByProject = async (month, projectId) => {
    let budgetData = []
    const monthlyBudget = await officeQuarterlyBudgetRepository.findOne({ where: { from: month.from, to: month.to, isDeleted: false, projectId: projectId }, relations: ['approvalStage', 'approvalStage.role', 'officeQuarterlyBudgetComment','officeQuarterlyBudgetComment.user','officeQuarterlyBudgetComment.user.role'] });
    if (monthlyBudget) {
        const budgetWithCategories = await Promise.all(monthlyBudget?.budgetsData.map(async (element) => {
            const category = await budgetCategoryService.getBudgetCategory(element.budgetCategoryId)
            const currency = await currencyService.getCurrencyById(element.currencyId)
            element.budgetCategory = category
            element.currency = currency

            return element
        }))
        monthlyBudget.budgetsData = budgetWithCategories
        budgetData.push(monthlyBudget)
        return monthlyBudget;
    }
    return budgetData;
}
/**
 * Requests approval for a quarterly budget by advancing it to the next approval stage.
 * @async
 * @function
 * @param {number} id - The unique identifier of the budget to request approval for.
 * @throws {ApiError} Throws an error if the budget does not exist.
 * @returns {Promise<Object>} The updated budget object with approval information.
 */
const RequestApprovalQuarterlyBudget = async (id) => {
    const Budget = await officeQuarterlyBudgetRepository.findOne({ where: { id: id, isDeleted: false } })
    if (!Budget) {
        throw new ApiError(httpStatus.NOT_FOUND, ' budget Doesnt exist');

    }
    else if(Budget.approvalStageId!==null){
        const quarterlyBudget = await officeQuarterlyBudgetRepository.update({ id: id }, {
            rejected: false
    
        });

   return await getAllQuarterlyBudgetById(id)
    }
    else{
      
        const approvalModule = await approvalModuleRepository.findOne({ where: { moduleName: "OfficeProjectQuarterlyBudget" } })
        const approvalSatge = await approvalStageRepository.findOne({ where: { approvalModuleId: approvalModule.id, level: 1 } })
    
        const quarterlyBudget = await officeQuarterlyBudgetRepository.update({ id: id }, {
            approvalStageId: approvalSatge.id
    
        });
        return await getAllQuarterlyBudgetById(id)
    }
   
}
/**
 * Retrieves quarterly budget data for a specific project.
 * @async
 * @function
 * @param {number} projectId - The unique identifier of the project.
 * @throws {ApiError} Throws an error if no budget data is found.
 * @returns {Promise<Array>} An array of budget data objects.
 */
const getAllQuarterlyBudgetByProject = async (projectId) => {
    const activeBudget = []
    const inActiveBudget = []
    const activeBudgetSessions = await officeBudgetSessionService.activeBudgetSession();
    const monthlyBudget = await officeQuarterlyBudgetRepository.findOne({
        where: { from: activeBudgetSessions.startDate, to: activeBudgetSessions.endDate, isDeleted: false, projectId: projectId }, relations: ['approvalStage', 'approvalStage.role', 'officeQuarterlyBudgetComment','officeQuarterlyBudgetComment.user','officeQuarterlyBudgetComment.user.role']
    });

    if (monthlyBudget) {
        const budgetWithCategories = await Promise.all(monthlyBudget.budgetsData.map(async (element) => {
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
const getAllQuarterlyBudgetById = async (budgetId) => {
    const monthlyBudget = await officeQuarterlyBudgetRepository.findOne({
        where: { id:budgetId }, relations: ['approvalStage', 'approvalStage.role', 'officeQuarterlyBudgetComment','officeQuarterlyBudgetComment.user','officeQuarterlyBudgetComment.user.role']
    });

    if (monthlyBudget) {
        const budgetWithCategories = await Promise.all(monthlyBudget.budgetsData.map(async (element) => {
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

module.exports = {
    createQuarterlyBudget,
    getQuarterlyBudgetByMonthGroup,
    updateQuarterlyBudget,
    getQuarterlyBudgetByProject,
    DeleteQuarterlyBudget,
    RequestApprovalQuarterlyBudget,
    getAllQuarterlyBudgetByProject,
    getAllQuarterlyBudgetById
}
