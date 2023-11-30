const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { monthlyBudgetService } = require('../services');


const getMonthlyBudget = catchAsync(async (req, res) => {
    const monthlyBudget = await monthlyBudgetService.getMonthlyBudgets();
    res.status(200).json(monthlyBudget)
})

const createMonthlyBudget = catchAsync(async (req, res) => {
    let month = {}
    month.from = req.body.from
    month.to = req.body.to
    console.log(month,"kkkkkkkk")
    const monthlyBudgetData = await monthlyBudgetService.getMonthlyBudgetByMonthGroup(month);
    console.log(monthlyBudgetData,"jjjjjjjj")
    if (monthlyBudgetData) {
        throw new ApiError(httpStatus.NOT_FOUND, 'monthly budget already exist');
    }
    const monthlyBudget = await monthlyBudgetService.createMontlyBudget(req.body);
    res.status(httpStatus.CREATED).json(monthlyBudget);
});

const updateMonthlyBudget = catchAsync(async (req, res) => {
    const monthlyBudget = await monthlyBudgetService.updateMonthlyBudget(req.params.id, req.body);
    res.status(httpStatus.CREATED).json(monthlyBudget);
})

const getMonthlyBudgetByMonth = catchAsync(async (req, res) => {
    let month = {}
    month.from = req.body.from
    month.to = req.body.to
    const monthlyBudgetData = await monthlyBudgetService.getMonthlyBudgetByMonthGroup(month);
    if (!monthlyBudgetData) {
        throw new ApiError(httpStatus.NOT_FOUND, 'no monthly budget exist');
    }

    res.status(200).json(monthlyBudgetData);
})

module.exports = {
    createMonthlyBudget,
    getMonthlyBudget,
    updateMonthlyBudget,
    getMonthlyBudgetByMonth
}