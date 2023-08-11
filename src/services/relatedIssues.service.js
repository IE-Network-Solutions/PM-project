const httpStatus = require('http-status');
const { RelatedIssue } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');

const relatedIssueRepository = dataSource.getRepository(RelatedIssue).extend({ findAll, sortBy });
// .extend({ sortBy });
//

/**
 * Create a risk
 * @param {Object} userBody
 * @returns {Promise<RelatedIssue>}
 */
const createRelatedIssue = async (RelatedIssueBody) => {
    const relatedIssue = relatedIssueRepository.create(RelatedIssueBody);
    return await relatedIssueRepository.save(relatedIssue);
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

const queryRelatedIssues = async (filter, options) => {
    const { limit, page, sortBy } = options;

    return await relatedIssueRepository.findAll({
        tableName: 'relatedissues',
        sortOptions: sortBy && { option: sortBy },
        paginationOptions: { limit: limit, page: page },
    });

};

/**
 * Get risk by id
 * @param {ObjectId} id
 * @returns {Promise<RelatedIssue>}
 */
const getRelatedIssueById = async (id) => {
    return await relatedIssueRepository.findOneBy({ id: id });
};

/**
 * Update user by id
 * @param {ObjectId} postId
 * @param {Object} updateBody
 * @returns {Promise<RelatedIssue>}
 */
const updateRelatedIssueById = async (relatedIssueId, updateBody) => {
    const relatedIssue = await getRelatedIssueById(relatedIssueId);
    if (!relatedIssue) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Related Issue not found');
    }
    await relatedIssueRepository.update({ id: relatedIssueId }, updateBody);
    return await getRelatedIssueById(relatedIssueId);
};

/**
 * Delete user by id
 * @param {ObjectId} riskId
 * @returns {Promise<RelatedIssue>}
 */
const deleteRelatedIssueById = async (relatedIssueId) => {
    const relatedIssue = await getRelatedIssueById(relatedIssueId);
    if (!relatedIssue) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Related Issue not found');
    }
    return await relatedIssueRepository.delete({ id: relatedIssueId });
};

const getRelatedIssuesByIds = async (issueId) => {
    return await relatedIssueRepository.findByIds({ id: issueId })
}

module.exports = {
    createRelatedIssue,
    queryRelatedIssues,
    getRelatedIssueById,
    updateRelatedIssueById,
    deleteRelatedIssueById,
    getRelatedIssuesByIds
};
