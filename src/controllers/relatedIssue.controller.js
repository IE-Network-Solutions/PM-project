const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { relatedIssueService } = require('../services');

const createRelatedIssue = catchAsync(async (req, res) => {
    const relatedIssue = await relatedIssueService.createRelatedIssue(req.body);
    res.status(httpStatus.CREATED).send(relatedIssue);
});

const getRelatedIssues = catchAsync(async (req, res) => {
    const filter = pick(req.query, []);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await relatedIssueService.queryRelatedIssues(filter, options);
    res.send(result);
});

const getRelatedIssueById = catchAsync(async (req, res) => {
    const relatedIssue = await relatedIssueService.getRelatedIssueById(req.params.relatedIssueId);
    if (!relatedIssue) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Related Issue not found');
    }
    res.send(relatedIssue);
});

const updateRelatedIssueById = catchAsync(async (req, res) => {
    const relatedIssue = await relatedIssueService.updateRelatedIssueById(req.params.relatedIssueId, req.body);
    res.send(relatedIssue);
});

const deleteRelatedIssueById = catchAsync(async (req, res) => {
    await relatedIssueService.deleteRelatedIssueById(req.params.relatedIssueId);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createRelatedIssue,
    getRelatedIssues,
    getRelatedIssueById,
    updateRelatedIssueById,
    deleteRelatedIssueById
};
