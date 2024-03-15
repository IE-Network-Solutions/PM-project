const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { issueService } = require('../services');
/**
 * @module issue
*/
/**
 * Creates an issue.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the created issue.
 * @throws {ApiError} If an error occurs during issue creation.
 */
const createIssue = catchAsync(async (req, res) => {
    try {
        console.log("message", req.body)
        const issue = await issueService.createIssue(req.body);
        res.status(httpStatus.CREATED).send(issue);
    } catch (e) {
        return new ApiError(httpStatus.NOT_FOUND, e);
    }
});
/**
 * Retrieves all issues based on the provided filter and options.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with all retrieved issues.
 */
const getIssues = catchAsync(async (req, res) => {
    const filter = pick(req.query, []);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await issueService.queryIssues(filter, options);
    res.send(result);
});
/**
 * Retrieves an issue by its ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the issue corresponding to the provided ID.
 * @throws {ApiError} If the issue with the provided ID is not found.
 */
const getIssue = catchAsync(async (req, res) => {
    const issue = await issueService.getIssueById(req.params.issueId);
    if (!issue) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Issue not found');
    }
    res.send(issue);
});
/**
 * Retrieves all issues associated with a specific project ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with all issues associated with the specified project ID.
 * @throws {ApiError} If no issues are found for the provided project ID.
 */
const getIssueByProjectId = catchAsync(async (req, res) => {
    const result = await issueService.getIssueByProjectId(req.params.projectId);
    console.log("result", result)
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Project id not found');
    }
    res.send(result);
});
/**
 * Retrieves all issues within a specified date range.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with all issues within the specified date range.
 * @throws {ApiError} If no issues are found within the provided date range.
 */
const getIssuesByDate = catchAsync(async (req, res) => {

    const { startDate, endDate } = req.query
    console.log("start date :", startDate, "endDate", endDate)
    const dates = await issueService.getIssuesByDate(startDate, endDate);
    if (!dates) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Issue Not Found');
    }
    res.send(dates);
});
/**
 * Retrieves all issues associated with a specific project ID and within a specified date range.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with all issues meeting the specified criteria.
 * @throws {ApiError} If no issues are found for the provided project ID within the specified date range.
 */
const getAllIssuesByProjectIdAndByDate = catchAsync(async (req, res) => {
    const { startDate, endDate } = req.query
    const projectId = req.params.projectId;

    const result = await issueService.getAllIssuesByProjectIdAndByDate(projectId, "Transfered", startDate, endDate);
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Project id not found');
    }
    res.send(result);
});
/**
 * Updates an issue by its ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the updated issue.
 */
const updateIssueById = catchAsync(async (req, res) => {
    const issue = await issueService.updateIssueById(req.params.issueId, req.body);
    res.send(issue);
});
/**
 * Deletes an issue by its ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves after deleting the issue.
 */
const deleteIssueById = catchAsync(async (req, res) => {
    await issueService.deleteIssueById(req.params.issueId);
    res.status(httpStatus.NO_CONTENT).send();
});
const getAllOpenIssuesByProject = catchAsync(async (req, res) => {
    const result = await issueService.getAllOpenIssuesByProject();
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'issues  not found');
    }
    res.send(result);
});

module.exports = {
    createIssue,
    getIssues,
    getIssue,
    updateIssueById,
    deleteIssueById,
    getAllIssuesByProjectIdAndByDate,
    getIssueByProjectId,
    getIssuesByDate,
    getAllOpenIssuesByProject
};
