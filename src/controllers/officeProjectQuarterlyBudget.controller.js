const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { OfficeQuarterlyBudgetService, officeBudgetSessionService } = require('../services');
/**
 * @module OfficeProjecQuarterlyBudget
 */

/**
 * Creates a new quarterly budget.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the created quarterly budget.
 * @throws {ApiError} - Throws an error if the session doesn't exist or if the budget already exists.
 */
const createQuarterlyBudget = catchAsync(async (req, res) => {

    let date = {}
    date.from = req.body.from
    date.to = req.body.to
    const inputData = req.body;

    // Add remaining_amount to each budgetData
    inputData.budgetsData.forEach(budgetData => {
        budgetData.remaining_amount = budgetData.budgetAmount;
    });

    const projectId = req.body.budgetsData[0].projectId
    const checkSession = await officeBudgetSessionService.getSessionBudgetByDate(date)
    if (!checkSession) {
        throw new ApiError(httpStatus.NOT_FOUND, 'session Doesnt exist');

    }
    const monthlyBudgetData = await OfficeQuarterlyBudgetService.getQuarterlyBudgetByProject(date, projectId);
    if (monthlyBudgetData.length !== 0) {
        throw new ApiError(httpStatus.NOT_FOUND, ' budget already exist');
    }

    const monthlyBudget = await OfficeQuarterlyBudgetService.createQuarterlyBudget(inputData);
    res.status(httpStatus.CREATED).json(monthlyBudget);
});

/**
 * Updates an existing quarterly budget.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the updated quarterly budget.
 */
const updateQuarterlyBudget = catchAsync(async (req, res) => {
    const monthlyBudget = await OfficeQuarterlyBudgetService.updateQuarterlyBudget(req.params.id, req.body);
    res.status(httpStatus.CREATED).json(monthlyBudget);
});

/**
 * Deletes a quarterly budget by ID.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with a success status after deletion.
 */
const DeleteQuarterlyBudget = catchAsync(async (req, res) => {
    const monthlyBudget = await OfficeQuarterlyBudgetService.DeleteQuarterlyBudget(req.params.id);
    res.status(httpStatus.CREATED).send(monthlyBudget);
});

/**
 * Retrieves quarterly budget data for a specific month range and project.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the quarterly budget data for the specified project and month range.
 * @throws {ApiError} - Throws an error if the session doesn't exist.
 */
const getQuarterlyBudgetByMonth = catchAsync(async (req, res) => {
    let month = {};
    month.from = req.params.from;
    month.to = req.params.to;
    let projectId = req.params.projectId

    const checkSession = await officeBudgetSessionService.getSessionBudgetByDate(month)

    if (!checkSession) {
        throw new ApiError(httpStatus.NOT_FOUND, 'session Doesnt exist');

    }
    const monthlyBudgetData = await OfficeQuarterlyBudgetService.getQuarterlyBudgetByProject(month, req.params.projectId);
    if (!monthlyBudgetData) {
        throw new ApiError(httpStatus.NOT_FOUND, 'no monthly budget exist');
    }

    res.status(200).json(monthlyBudgetData);
});

/**
 * Requests approval for the quarterly budget.
 * @function
 * @param {string} req.params.id - The ID of the budget to request approval for.
 * @returns {Promise<Object>} - A promise that resolves to the monthly budget data.
 * @throws {Error} - If there's an issue with the approval request.
 */
const RequestApprovalQuarterlyBudget = catchAsync(async (req, res) => {
    const monthlyBudget = await OfficeQuarterlyBudgetService.RequestApprovalQuarterlyBudget(req.params.id);
    res.status(httpStatus.CREATED).json(monthlyBudget);
});

/**
 * Retrieves all quarterly budgets associated with a specific project.
 * @function
 * @param {string} req.params.id - The ID of the project.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of quarterly budget data.
 * @throws {Error} - If there's an issue fetching the budgets.
 */
const getAllQuarterlyBudgetByProject = catchAsync(async (req, res) => {
    const monthlyBudget = await OfficeQuarterlyBudgetService.getAllQuarterlyBudgetByProject(req.params.id);
    res.status(httpStatus.CREATED).json(monthlyBudget);
});

module.exports = {
    createQuarterlyBudget,
    updateQuarterlyBudget,
    getQuarterlyBudgetByMonth,
    DeleteQuarterlyBudget,
    RequestApprovalQuarterlyBudget,
    getAllQuarterlyBudgetByProject
};
