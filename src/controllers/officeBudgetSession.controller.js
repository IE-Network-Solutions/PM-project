const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { officeBudgetSessionService } = require('../services');

const getAllBudgetSessions = catchAsync(async (req, res) => {
    const budgetSessons = await officeBudgetSessionService.getAllSessionBudget();
    res.status(httpStatus.CREATED).send(budgetSessons);
})

const getBudgetSession = catchAsync(async (req, res) => {p
    const budgetSession = await officeBudgetSessionService.getSessionBudget(req.params.id);
    res.status(httpStatus.CREATED).send(budgetSession);

})
const getActiveBudgetSession = catchAsync(async (req, res) => {
    const data = []
    const budgetSession = await officeBudgetSessionService.activeBudgetSession();
    data.push(budgetSession);
    res.status(httpStatus.CREATED).send(data);

})

const createBudgetSession = catchAsync(async (req, res) => {
    const data = req.body;
    data.isActive = true;
    const budgetSesson = await officeBudgetSessionService.createBudgetSession(data);
    res.status(httpStatus.CREATED).send(budgetSesson);
})

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