const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { projectBudgetService } = require('../services');

/**
 * @module projectBudget
 */
/**
 * Retrieves project budgets by category.
 * @function
 * @param {string} req.params.projectId - The ID of the project.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of project budget data.
 * @throws {Error} - If there's an issue fetching the budgets.
 */
const getProjectBudgets = catchAsync(async (req, res) => {
  const projectBudget = await projectBudgetService.getAllProjectBudgetsByCategory(req.params.projectId);
  res.status(200).json(projectBudget);
});

module.exports = {
  getProjectBudgets,
};
