const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { relatedIssueService } = require('../services');
/**
 * @module relatedIssues
 */
/**
 * Creates a new related issue.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the created related issue.
 */
const createRelatedIssue = catchAsync(async (req, res) => {
    const relatedIssue = await relatedIssueService.createRelatedIssue(req.body);
    res.status(httpStatus.CREATED).send(relatedIssue);
});
/**
 * Retrieves related issues based on the provided filter and options.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the retrieved related issues.
 */
const getRelatedIssues = catchAsync(async (req, res) => {
    const filter = pick(req.query, []);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await relatedIssueService.queryRelatedIssues(filter, options);
    res.send(result);
});
/**
 * Retrieves a related issue by its ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the related issue corresponding to the provided ID.
 * @throws {ApiError} If the related issue with the provided ID is not found.
 */
const getRelatedIssueById = catchAsync(async (req, res) => {
    const relatedIssue = await relatedIssueService.getRelatedIssueById(req.params.relatedIssueId);
    if (!relatedIssue) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Related Issue not found');
    }
    res.send(relatedIssue);
});
/**
 * Updates a related issue by its ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the updated related issue.
 */
const updateRelatedIssueById = catchAsync(async (req, res) => {
    const relatedIssue = await relatedIssueService.updateRelatedIssueById(req.params.relatedIssueId, req.body);
    res.send(relatedIssue);
});
/**
 * Deletes a related issue by its ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves after deleting the related issue.
 */
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
