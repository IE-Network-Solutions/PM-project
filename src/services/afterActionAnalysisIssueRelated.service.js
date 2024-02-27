const httpStatus = require('http-status');
const { AfterActionAnalysisIssueRelated, AfterActionAnalysis, RelatedIssue } = require('../models');
const services = require('../services');

const { AfterActionAnalysisService, relatedIssueService } = require('../services');

const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');


const afterActionAnalysisIssueRelatedRepository = dataSource.getRepository(AfterActionAnalysisIssueRelated)
    .extend({ findAll, sortBy });
/**
 * @module afterActionAnalysisIssueRelated
*/
/**
 * Creates and returns an array of after action analysis issue related instances for a given AAA instance and an array of issue related IDs
 * @function
 * @param {number} afterActionAnalysisId - The ID of the AAA instance
 * @param {Array<number>} issueRelatedId - The array of issue related IDs
 * @returns {Promise<Array<Object>>} - The array of created after action analysis issue related instances
 */
const createAfterActionAnalysisIssueRelated = async (afterActionAnalysisId, issueRelatedId) => {
    console.log("HERE 1")

    const afterActionAnalysis = await services.AfterActionAnalysisService.getAAAById(afterActionAnalysisId);
    if (!afterActionAnalysis) {
        throw new ApiError(httpStatus.NOT_FOUND, 'After Action Analysis ID is not found');
    }


    const issueRelated = await services.relatedIssueService.getRelatedIssueById(issueRelatedId)
    if (!issueRelated) {
        return new ApiError(httpStatus.NOT_FOUND, 'Issue Related ID is not found');
    }

    const issueRelateds = services.relatedIssueService.getRelatedIssuesByIds(issueRelatedId);
    if (!issueRelated) {
        return new ApiError(httpStatus.NOT_FOUND, 'Issue Related ID is not found');
    }
    console.log("HERE 2")

    const AAAAction = afterActionAnalysisIssueRelatedRepository.create(issueRelateds.map(async (issue) => {
        return {
            afterActionAnalysisId: afterActionAnalysisId,
            relatedIssueId: issue
        };
    }))
    console.log("HERE 3")


    return await afterActionAnalysisIssueRelatedRepository.save(AAAAction);
};
/**
 * Queries and returns the after action analysis issue related instances that match the filter and options
 * @function
 * @param {Object} filter - The filter object for the query
 * @param {Object} options - The options object for the query
 * @param {number} options.limit - The maximum number of results to return
 * @param {number} options.page - The page number of the results
 * @param {string} [options.sortBy] - The optional sorting option for the results
 * @returns {Promise<Array<Object>>} - The array of after action analysis issue related instances
 */
const queryActionAnalysisWithIssueRelated = async (filter, options) => {
    const { limit, page, sortBy } = options;

    return await afterActionAnalysisIssueRelatedRepository.find({
        tableName: 'after_action_analysis_action_to_be_taken',
        sortOptions: sortBy && { option: sortBy },
        paginationOptions: { limit: limit, page: page },
    });
};
/**
 * Queries and returns the after action analysis issue related instances by their ID that match the filter and options
 * @function
 * @param {Object} filter - The filter object for the query
 * @param {Object} options - The options object for the query
 * @param {number} options.limit - The maximum number of results to return
 * @param {number} options.page - The page number of the results
 * @param {string} [options.sortBy] - The optional sorting option for the results
 * @returns {Promise<Array<Object>>} - The array of after action analysis issue related instances by their ID
 */
const queryActionAnalysisWithIssueRelatedById = async (filter, options) => {
    const { limit, page, sortBy } = options;

    return await afterActionAnalysisIssueRelatedRepository.find({
        tableName: 'after_action_analysis_action_to_be_taken',
        sortOptions: sortBy && { option: sortBy },
        paginationOptions: { limit: limit, page: page },
    });
};

module.exports = {
    createAfterActionAnalysisIssueRelated,
    queryActionAnalysisWithIssueRelated,
    queryActionAnalysisWithIssueRelatedById
};
