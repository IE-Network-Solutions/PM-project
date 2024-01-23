const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { OfficeQuarterlyBudgetService, officeBudgetSessionService } = require('../services');
const createQuarterlyBudget = catchAsync(async (req, res) => {

    let date = {}
    date.from = req.body.from
    date.to = req.body.to
    const projectId = req.body.budgetsData[0].projectId
    const checkSession = await officeBudgetSessionService.getSessionBudgetByDate(date)
    if (!checkSession) {
        throw new ApiError(httpStatus.NOT_FOUND, 'session Doesnt exist');

    }
    const monthlyBudgetData = await OfficeQuarterlyBudgetService.getQuarterlyBudgetByProject(date, projectId);
    if (monthlyBudgetData.length !== 0) {
        throw new ApiError(httpStatus.NOT_FOUND, ' budget already exist');
    }

    const monthlyBudget = await OfficeQuarterlyBudgetService.createQuarterlyBudget(req.body);
    res.status(httpStatus.CREATED).json(monthlyBudget);
});

const updateQuarterlyBudget = catchAsync(async (req, res) => {
    const monthlyBudget = await OfficeQuarterlyBudgetService.updateQuarterlyBudget(req.params.id, req.body);
    res.status(httpStatus.CREATED).json(monthlyBudget);
});

const DeleteQuarterlyBudget = catchAsync(async (req, res) => {
    const monthlyBudget = await OfficeQuarterlyBudgetService.DeleteQuarterlyBudget(req.params.id);
    res.status(httpStatus.CREATED).send(monthlyBudget);
});
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


const RequestApprovalQuarterlyBudget = catchAsync(async (req, res) => {
    const monthlyBudget = await OfficeQuarterlyBudgetService.RequestApprovalQuarterlyBudget(req.params.id);
    res.status(httpStatus.CREATED).json(monthlyBudget);
});

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
