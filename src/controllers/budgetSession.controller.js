const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { budgetSessionService } = require('../services');
/**
 * @module budgetSession
 */

/**
 * Retrieves all budget sessions.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the list of budget sessions.
 */
const getAllBudgetSessions = catchAsync(async (req, res) => {
    const budgetSessons = await budgetSessionService.getAllSessionBudget();
    res.status(httpStatus.CREATED).send(budgetSessons);
})

/**
 * Retrieves a specific budget session by ID.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the requested budget session.
 * @throws {ApiError} - Throws an error if the session is not found.
 */
const getBudgetSession = catchAsync(async (req, res) => {
    const budgetSession = await budgetSessionService.getSessionBudget(req.params.id);
    res.status(httpStatus.CREATED).send(budgetSession);

})

/**
 * Retrieves the active budget session.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the active budget session.
 */
const getActiveBudgetSession = catchAsync(async (req, res) => {
    const data = []
    const budgetSession = await budgetSessionService.activeBudgetSession();
    data.push(budgetSession);
    res.status(httpStatus.CREATED).send(data);

})

/**
 * Creates a new budget session.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the created budget session.
 * @throws {ApiError} - Throws an error if the session cannot be created.
 */
const createBudgetSession = catchAsync(async (req,res) => {
    const data = req.body;
    data.isActive = true;
    const budgetSesson = await budgetSessionService.createBudgetSession(data);
    res.status(httpStatus.CREATED).send(budgetSesson);
})

/**
 * Updates a budget session.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the updated budget session.
 */
const updateBudgetSession = catchAsync(async (req, res) => {
    const data = req.body;
    // data.isActive = true;
    const budgetSesson = await budgetSessionService.updateSessionBudget(req.params.id,data);
    res.status(httpStatus.CREATED).send(budgetSesson);
})

module.exports = {
    createBudgetSession,
    getAllBudgetSessions,
    getBudgetSession,
    updateBudgetSession,
    getActiveBudgetSession
}
