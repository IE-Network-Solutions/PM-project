const httpStatus = require('http-status');
const { Budget, BudgetGroup, Task, monthlyBudget, ApprovalStage, ApprovalModule } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const services = require('./index');

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
    approvalStage = await approvalStageRepository
        .createQueryBuilder('approval_stage')
        .leftJoin('approval_stage.approvalModule','approvalModule')
        .where('approvalModule.moduleName = :moduleName', { moduleName })
        .andWhere('approval_stage.level = :level', { level })
        .getOne();
    
    montlyBudgetBody.approvalStage = approvalStage;
    const montlBudget = montlyBudgetRepository.create(montlyBudgetBody);
    await montlyBudgetRepository.save(montlBudget);

    return montlBudget;
};

const getMonthlyBudgetByMonthGroup = async (month) => {
    const monthlyBudget = await montlyBudgetRepository.findOne({ where: { from: month.from, to: month.to },relations: ['approvalStage','approvalStage.role','monthlyBudgetcomments'] });
    return monthlyBudget;
}

const updateMonthlyBudget = async (id,updatedData) => {
    const monthlyBudget = await montlyBudgetRepository.update({ id: id }, updatedData );
    return await montlyBudgetRepository.findOne({where: {id: id}});
}


module.exports = {
    createMontlyBudget,
    getMonthlyBudgets,
    getMonthlyBudgetByMonthGroup,
    updateMonthlyBudget
}