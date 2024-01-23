const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { projectBudgetService } = require('../services');

const getProjectBudgets = catchAsync(async (req, res) => {
  console.log(req.params.projectId);
  const projectBudget = await projectBudgetService.getAllProjectBudgetsByCategory(req.params.projectId);
  res.status(200).json(projectBudget);
});

module.exports = {
  getProjectBudgets,
};
