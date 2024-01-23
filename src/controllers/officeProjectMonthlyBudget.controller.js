const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { OfficeMonthlyBudgetService, officeBudgetSessionService } = require('../services');

// const getMonthlyBudget = catchAsync(async (req, res) => {
//     const monthlyBudget = await OfficeMonthlyBudgetService.getMonthlyBudgets();
//     res.status(200).json(monthlyBudget);
// });

const createMonthlyBudget = catchAsync(async (req, res) => {
    let date = {}
    date.from = req.body[0].from
    date.to = req.body[0].to
    const checkSession = await officeBudgetSessionService.getSessionBudgetByDate(date)
    if (!checkSession) {
        throw new ApiError(httpStatus.NOT_FOUND, 'session Doesnt exist');

    }
    const monthlyBudgetData = await OfficeMonthlyBudgetService.getMonthlyBudgetByProject(date, req.body[0].projectId);
    console.log(monthlyBudgetData, "monthlyBudgetData")

    if (monthlyBudgetData.length !== 0) {
        throw new ApiError(httpStatus.NOT_FOUND, ' budget already exist');
    }

    const monthlyBudget = await OfficeMonthlyBudgetService.createMontlyBudget(req.body);
    res.status(httpStatus.CREATED).json(monthlyBudget);
});

const updateMonthlyBudget = catchAsync(async (req, res) => {
    const monthlyBudget = await OfficeMonthlyBudgetService.updateMonthlyBudget(req.params.id, req.body);
    res.status(httpStatus.CREATED).json(monthlyBudget);
});

const DeleteMonthlyBudget = catchAsync(async (req, res) => {
    const monthlyBudget = await OfficeMonthlyBudgetService.DeleteMonthlyBudget(req.params.id);
    res.status(httpStatus.CREATED).send(monthlyBudget);
});
const getMonthlyBudgetByMonth = catchAsync(async (req, res) => {
    console.log(req.params, "pararar")
    let month = {};
    month.from = req.params.from;
    month.to = req.params.to;
    let projectId = req.params.projectId
    const checkSession = await officeBudgetSessionService.getSessionBudgetByDate(month)
    console
    if (!checkSession) {
        throw new ApiError(httpStatus.NOT_FOUND, 'session Doesnt exist');

    }
    const monthlyBudgetData = await OfficeMonthlyBudgetService.getMonthlyBudgetByProject(month, req.params.projectId);
    if (!monthlyBudgetData) {
        throw new ApiError(httpStatus.NOT_FOUND, 'no monthly budget exist');
    }

    res.status(200).json(monthlyBudgetData);
});

module.exports = {
    createMonthlyBudget,
    // getMonthlyBudget,
    updateMonthlyBudget,
    getMonthlyBudgetByMonth,
    DeleteMonthlyBudget
};
