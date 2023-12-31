const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { issueService } = require('../services');

const createIssue = catchAsync(async (req, res) => {
    try {
        console.log("message", req.body)
        const issue = await issueService.createIssue(req.body);
        res.status(httpStatus.CREATED).send(issue);
    } catch (e) {
        return new ApiError(httpStatus.NOT_FOUND, e);
    }
});

const getIssues = catchAsync(async (req, res) => {
    const filter = pick(req.query, []);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await issueService.queryIssues(filter, options);
    res.send(result);
});

const getIssue = catchAsync(async (req, res) => {
    const issue = await issueService.getIssueById(req.params.issueId);
    if (!issue) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Issue not found');
    }
    res.send(issue);
});

const getIssueByProjectId = catchAsync(async (req, res) => {
    const result = await issueService.getIssueByProjectId(req.params.projectId);
    console.log("result", result)
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Project id not found');
    }
    res.send(result);
});

const getIssuesByDate = catchAsync(async (req, res) => {

    const { startDate, endDate } = req.query
    console.log("start date :", startDate, "endDate", endDate)
    const dates = await issueService.getIssuesByDate(startDate, endDate);
    if (!dates) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Issue Not Found');
    }
    res.send(dates);
});

const getAllIssuesByProjectIdAndByDate = catchAsync(async (req, res) => {
    const { startDate, endDate } = req.query
    const projectId = req.params.projectId;

    const result = await issueService.getAllIssuesByProjectIdAndByDate(projectId, "Transfered", startDate, endDate);
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Project id not found');
    }
    res.send(result);
});

const updateIssueById = catchAsync(async (req, res) => {
    const issue = await issueService.updateIssueById(req.params.issueId, req.body);
    res.send(issue);
});

const deleteIssueById = catchAsync(async (req, res) => {
    await issueService.deleteIssueById(req.params.issueId);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createIssue,
    getIssues,
    getIssue,
    updateIssueById,
    deleteIssueById,
    getAllIssuesByProjectIdAndByDate,
    getIssueByProjectId,
    getIssuesByDate
};
