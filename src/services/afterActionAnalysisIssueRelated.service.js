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
 * Create a risk
 * @param {Object} userBody
 * @returns {Promise<AfterActionAnalysisIssueRelated>}
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
            afterActionAnalysis: afterActionAnalysisId,
            relatedIssueId: issue
        };
    }))


    return await afterActionAnalysisIssueRelatedRepository.save(AAAAction);
};

/**
 * Query for users
 * @param {Object} filter - Filter options
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

const queryActionAnalysisWithIssueRelated = async (filter, options) => {
    const { limit, page, sortBy } = options;

    return await afterActionAnalysisIssueRelatedRepository.find({
        tableName: 'after_action_analysis_action_to_be_taken',
        sortOptions: sortBy && { option: sortBy },
        paginationOptions: { limit: limit, page: page },
    });
};

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
