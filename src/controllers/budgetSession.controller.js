const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { budgetSessionService } = require('../services');

const getAllBudgetSessions = catchAsync(async (req, res) => {
    const budgetSessons = await budgetSessionService.getAllSessionBudget();
    res.status(httpStatus.CREATED).send(budgetSessons);
})

const getBudgetSession = catchAsync(async (req, res) => {
    const budgetSession = await budgetSessionService.getSessionBudget(req.params.id);
    res.status(httpStatus.CREATED).send(budgetSession);

})
const getActiveBudgetSession = catchAsync(async (req, res) => {
    const data = []
    const budgetSession = await budgetSessionService.activeBudgetSession();
    data.push(budgetSession);
    res.status(httpStatus.CREATED).send(data);

})

const createBudgetSession = catchAsync(async (req,res) => {
    const data = req.body;
    data.isActive = true;
    const budgetSesson = await budgetSessionService.createBudgetSession(data);
    res.status(httpStatus.CREATED).send(budgetSesson);
})

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