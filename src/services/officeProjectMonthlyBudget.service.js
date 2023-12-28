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
    moduleName = "OfficeProjectBudget"
    level = 1
    const approvalStage = await approvalStageRepository
        .createQueryBuilder('approval_stage')
        .leftJoin('approval_stage.approvalModule', 'approvalModule')
        .where('approvalModule.moduleName = :moduleName', { moduleName })
        .andWhere('approval_stage.level = :level', { level })
        .getOne();

    montlyBudgetBody.approvalStage = approvalStage;

    const montlBudget = officeMontlyBudgetRepository.create(montlyBudgetBody);
    await officeMontlyBudgetRepository.save(montlBudget);

    return montlBudget;
};

const getMonthlyBudgetByMonthGroup = async (month) => {
    const monthlyBudget = await officeMontlyBudgetRepository.findOne({ where: { from: month.from, to: month.to }, relations: ['approvalStage', 'approvalStage.role', 'officeMonthlyBudgetcomments'] });
    return monthlyBudget;
}

const updateMonthlyBudget = async (id, updatedData) => {
    const monthlyBudget = await officeMontlyBudgetRepository.update({ id: id }, updatedData);
    return await officeMontlyBudgetRepository.findOne({ where: { id: id } });
}


module.exports = {
    createMontlyBudget,
    //getMonthlyBudgets,
    getMonthlyBudgetByMonthGroup,
    updateMonthlyBudget
}