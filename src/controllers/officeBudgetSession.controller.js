const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { officeBudgetSessionService } = require('../services');
/**
 * @module officeBudgetSession
 */

/**
 * Retrieves all budget sessions.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the list of budget sessions.
 */
const getAllBudgetSessions = catchAsync(async (req, res) => {
    const budgetSessons = await officeBudgetSessionService.getAllSessionBudget();
    res.status(httpStatus.CREATED).send(budgetSessons);
})

/**
 * Retrieves a specific budget session by ID.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the requested budget session.
 */
const getBudgetSession = catchAsync(async (req, res) => {p
    const budgetSession = await officeBudgetSessionService.getSessionBudget(req.params.id);
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
    const budgetSession = await officeBudgetSessionService.activeBudgetSession();
    data.push(budgetSession);
    res.status(httpStatus.CREATED).send(data);

})

/**
 * Creates a new budget session.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the created budget session.
 */
const createBudgetSession = catchAsync(async (req, res) => {
    const data = req.body;
    data.isActive = true;
    const budgetSesson = await officeBudgetSessionService.createBudgetSession(data);
    res.status(httpStatus.CREATED).send(budgetSesson);
})

/**
 * Updates an existing budget session.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the updated budget session.
 */
const updateBudgetSession = catchAsync(async (req, res) => {
    const data = req.body;
    // data.isActive = true;
    const budgetSesson = await officeBudgetSessionService.updateSessionBudget(req.params.id, data);
    res.status(httpStatus.CREATED).send(budgetSesson);
})

module.exports = {
    createBudgetSession,
    getAllBudgetSessions,
    getBudgetSession,
    updateBudgetSession,
    getActiveBudgetSession
}
