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
 * @module monthlBbudgetComment
*/
/**
 * Retrieves monthly budget comments from the repository.
 *
 * @function
 * @returns {Promise<Array>} An array of monthly budget comments.
 */
const getMonthlyBudgetComments = async () => {
    return await montlyBudgetCommentRepository.find();
};
/**
 * Creates a new monthly budget comment.
 *
 * @function
 * @param {string} comment - The comment to be added.
 * @param {string|null} userId - Optional user ID associated with the comment.
 * @returns {Promise<Object>} A newly created monthly budget comment object.
 */
const createMonthlyBudgetComment = async (comment,userId = null) => {
    return await monthlyBudgetComment.create({ comment: comment, userId: userId });
}

module.exports = {
    getMonthlyBudgetComments,
    createMonthlyBudgetComment
}
