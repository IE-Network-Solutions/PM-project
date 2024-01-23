const httpStatus = require('http-status');
const { Budget, BudgetGroup, Task, monthlyBudget, ApprovalStage, ApprovalModule, OfficeQuarterlyBudget } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const { currencyService, budgetCategoryService } = require("./index")
const officeBudgetSessionService = require("./officeBudegtSession.service")

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
 * Query for budget
 * @param {Object} filter - Filter options
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

// const getMonthlyBudgets = async () => {
//     return await montlyBudgetRepository.find({
//         relations: ['approvalStage'],
//     });
// };

/**
 * Create a montly budget
 * @param {Object} budgetBody
 * @returns {Promise<Project>}
 */
const createQuarterlyBudget = async (montlyBudgetBody) => {
    const montlBudget = officeQuarterlyBudgetRepository.create(montlyBudgetBody);
    return await officeQuarterlyBudgetRepository.save(montlBudget);


};

const getQuarterlyBudgetByMonthGroup = async (month) => {
    const monthlyBudget = await officeQuarterlyBudgetRepository.find({ where: { from: month.from, to: month.to, isDeleted: false }, relations: ['approvalStage', 'approvalStage.role', 'officeQuarterlyBudgetComment'] });
    return monthlyBudget;
}

const updateQuarterlyBudget = async (id, updatedData) => {
    const Budget = await officeQuarterlyBudgetRepository.findOne({ where: { id: id, isDeleted: false } })
    if (!Budget) {
        throw new ApiError(httpStatus.NOT_FOUND, ' budget Doesnt exist');

    }
    const monthlyBudget = await officeQuarterlyBudgetRepository.update({ id: id }, updatedData);
    return await officeQuarterlyBudgetRepository.findOne({ where: { id: id }, isDeleted: false });
}
const DeleteQuarterlyBudget = async (id) => {
    const budget = await officeQuarterlyBudgetRepository.findOne({ where: { id: id, isDeleted: false } })
    if (!budget) {

        throw new ApiError(httpStatus.NOT_FOUND, ' budget Doesnt exist');
    }
    const deletedbudget = officeQuarterlyBudgetRepository.update({ id: id }, {
        isDeleted: true
    });;

    return budget

}
const getQuarterlyBudgetByProject = async (month, projectId) => {
    let budgetData = []
    const monthlyBudget = await officeQuarterlyBudgetRepository.find({ where: { from: month.from, to: month.to, isDeleted: false }, relations: ['approvalStage', 'approvalStage.role', 'officeQuarterlyBudgetComment'] });
    if (monthlyBudget.length !== 0) {
        const budgetDatas = monthlyBudget.forEach((item) => {
            if (item.budgetsData[0].projectId === projectId) {
                budgetData.push(item);



            }
        })
        if (budgetDatas) {
            const budgetWithCategories = await Promise.all(budgetData[0].budgetsData.map(async (element) => {
                const category = await budgetCategoryService.getBudgetCategory(element.budgetCategoryId)
                const currency = await currencyService.getCurrencyById(element.currencyId)
                element.budgetCategory = category
                element.currency = currency

                return element
            }))
            budgetData[0].budgetsData = budgetWithCategories
            return budgetData;
        }
    }
    return budgetData;
}
const RequestApprovalQuarterlyBudget = async (id) => {
    const Budget = await officeQuarterlyBudgetRepository.findOne({ where: { id: id, isDeleted: false } })
    if (!Budget) {
        throw new ApiError(httpStatus.NOT_FOUND, ' budget Doesnt exist');

    }
    const approvalModule = await approvalModuleRepository.findOne({ where: { moduleName: "OfficeProjectQuarterlyBudget" } })
    const approvalSatge = await approvalStageRepository.findOne({ where: { approvalModuleId: approvalModule.id, level: 1 } })

    const monthlyBudget = await officeQuarterlyBudgetRepository.update({ id: id }, {
        approvalStageId: approvalSatge.id

    });
    return await officeQuarterlyBudgetRepository.findOne({ where: { id: id, isDeleted: false }, relations: ['approvalStage', 'approvalStage.role'] });
}


const getAllQuarterlyBudgetByProject = async (projectId) => {
    const activeBudget = []
    const inActiveBudget = []
    const activeBudgetSessions = await officeBudgetSessionService.activeBudgetSession();
    const monthlyBudget = await officeQuarterlyBudgetRepository.find({
        where: { from: activeBudgetSessions.startDate, to: activeBudgetSessions.endDate, isDeleted: false }, relations: ['approvalStage', 'approvalStage.role', 'officeQuarterlyBudgetComment']
    });

    if (monthlyBudget.length !== 0) {
        const budgetDatas = monthlyBudget.forEach((item) => {
            if (item.budgetsData[0].projectId === projectId) {
                activeBudget.push(item)
            }

        })
        if (budgetDatas) {
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
    createQuarterlyBudget,
    //getMonthlyBudgets,
    getQuarterlyBudgetByMonthGroup,
    updateQuarterlyBudget,
    getQuarterlyBudgetByProject,
    DeleteQuarterlyBudget,
    RequestApprovalQuarterlyBudget,
    getAllQuarterlyBudgetByProject
}