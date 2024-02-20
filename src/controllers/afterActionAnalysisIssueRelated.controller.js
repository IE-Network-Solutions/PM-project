const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { afterActionAnalysisIssueRelatedService } = require('../services');
/**
 * @module afterActionAnalysisIssueRelated
 */

/**
 * Creates a related issue entry for an after-action analysis.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the created result.
 */
const createAfterActionAnalysisIssueRelated = catchAsync(async (req, res) => {
    const afterActionAnalysisId = req.params.afterActionAnalysisId;
    const relatedIssuedId = req.body.relatedIssuedId;
    console.log("actions", relatedIssuedId, "after action analysis", afterActionAnalysisId)

    const result = await afterActionAnalysisIssueRelatedService.createAfterActionAnalysisIssueRelated(afterActionAnalysisId, relatedIssuedId);
    console.log("kkk", result)
    res.status(httpStatus.CREATED).send(result);
});

/**
 * Retrieves after-action analysis entries with related issues.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the query result.
 */
const getafterActionAnalysisWithIssueRelated = catchAsync(async (req, res) => {
    const filter = pick(req.query, []);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await afterActionAnalysisIssueRelatedService.queryActionAnalysisWithIssueRelated(filter, options);
    res.send(result);
});

/**
 * Retrieves after-action analysis entries with related issues by ID.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the query result.
 */
const getafterActionAnalysisWithIssueRelatedById = catchAsync(async (req, res) => {
    const filter = pick(req.query, []);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await afterActionAnalysisIssueRelatedService.queryActionAnalysisWithIssueRelatedById(filter, options);
    res.send(result);
});
module.exports = {
    createAfterActionAnalysisIssueRelated,
    getafterActionAnalysisWithIssueRelated,
    getafterActionAnalysisWithIssueRelatedById
};
