const httpStatus = require('http-status');
const { AfterActionAnalysisAction, AfterActionAnalysis, Action } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');

const afterActionAnalysisIssueRelatedRepository = dataSource.getRepository(AfterActionAnalysisAction).extend({ findAll, sortBy });
const afterActionAnalysisRepository = dataSource.getRepository(AfterActionAnalysis).extend({ findAll, sortBy });
const actionRepository = dataSource.getRepository(Action).extend({ findAll, sortBy });
// .extend({ sortBy });
//

/**
 * Create a risk
 * @param {Object} userBody
 * @returns {Promise<AfterActionAnalysisAction>}
 */
const createAfterActionAnalysisIssueRelated = async (afterActionAnalysisId, issueRelatedId) => {

    const afterActionAnalysis = await afterActionAnalysisRepository.findOne({ where: { id: afterActionAnalysisId } });
    if (!afterActionAnalysis) {
        throw new ApiError(httpStatus.NOT_FOUND, 'After Action Analysis ID is not found');
    }
    const issueRelated = await actionRepository.findByIds({ where: { id: issueRelatedId } })
    if (!issueRelated) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Issue Related ID is not found');
    }

    const AAAAction = issueRelated.map((issueRelated) => {
        const assignedRelatedIssues = afterActionAnalysisIssueRelatedRepository.create({ afterActionAnalysis: afterActionAnalysis, issueRelated });
        return assignedRelatedIssues;
    });
    return afterActionAnalysisIssueRelatedRepository.save(AAAAction);
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
