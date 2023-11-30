const httpStatus = require('http-status');
const { Budget, BudgetGroup, Task, monthlyBudget, ApprovalStage, ApprovalModule, monthlyBudgetComment } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const services = require('./index');

const montlyBudgetCommentRepository = dataSource.getRepository(monthlyBudgetComment).extend({
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

const getMonthlyBudgetComments = async () => {  
    return await montlyBudgetCommentRepository.find();
};

const createMonthlyBudgetComment = async (comment,userId = null) => {
    return await monthlyBudgetComment.create({ comment: comment, userId: userId });
}

module.exports = {
    getMonthlyBudgetComments,
    createMonthlyBudgetComment
}