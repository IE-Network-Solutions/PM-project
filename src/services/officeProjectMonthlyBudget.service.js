const httpStatus = require('http-status');
const { Budget, BudgetGroup, Task, monthlyBudget, ApprovalStage, ApprovalModule, OfficeMonthlyBudget } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const services = require('./index');

const officeMontlyBudgetRepository = dataSource.getRepository(OfficeMonthlyBudget).extend({
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
const createMontlyBudget = async (montlyBudgetBody) => {
    const montlBudget = officeMontlyBudgetRepository.create(montlyBudgetBody);
    return await officeMontlyBudgetRepository.save(montlBudget);


};

const getMonthlyBudgetByMonthGroup = async (month) => {
    const monthlyBudget = await officeMontlyBudgetRepository.find({ where: { from: month.from, to: month.to } });
    return monthlyBudget;
}

const updateMonthlyBudget = async (id, updatedData) => {
    const Budget = await officeMontlyBudgetRepository.findOne({ where: { id: id } })
    if (!Budget) {
        throw new ApiError(httpStatus.NOT_FOUND, ' budget Doesnt exist');

    }
    const monthlyBudget = await officeMontlyBudgetRepository.update({ id: id }, updatedData);
    return await officeMontlyBudgetRepository.findOne({ where: { id: id }, relations: ['currency', 'project', 'budgetCategory'] });
}
const DeleteMonthlyBudget = async (id) => {
    const budget = await officeMontlyBudgetRepository.findOne({ where: { id: id } })
    if (!budget) {

        throw new ApiError(httpStatus.NOT_FOUND, ' budget Doesnt exist');
    }
    const deletedbudget = officeMontlyBudgetRepository.update({ id: id }, {
        isDeleted: true
    });;

    return budget

}
const getMonthlyBudgetByProject = async (month, projectId) => {
    const monthlyBudget = await officeMontlyBudgetRepository.find({ where: { projectId: projectId, from: month.from, to: month.to, isDeleted: false }, relations: ['currency', 'project', 'budgetCategory'] });
    return monthlyBudget;
}


module.exports = {
    createMontlyBudget,
    //getMonthlyBudgets,
    getMonthlyBudgetByMonthGroup,
    updateMonthlyBudget,
    getMonthlyBudgetByProject,
    DeleteMonthlyBudget
}