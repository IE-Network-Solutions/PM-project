const httpStatus = require('http-status');
const { Issue } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const { Between } = require('typeorm');

const issueRepository = dataSource.getRepository(Issue).extend({ findAll, sortBy });
// .extend({ sortBy });
//

/**
 * Create a risk
 * @param {Object} userBody
 * @returns {Promise<Issue>}
 */
const createIssue = async (issueBody) => {
    const issue = issueRepository.create(issueBody);
    return await issueRepository.save(issue);
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

const queryIssues = async (filter, options) => {
    const { limit, page, sortBy } = options;

    return await issueRepository.find({
        relations: ['project'],
        tableName: 'issue',
        sortOptions: sortBy && { option: sortBy },
        paginationOptions: { limit: limit, page: page },
    });

};

/**
 * Get risk by id
 * @param {ObjectId} id
 * @returns {Promise<Issue>}
 */
const getIssueById = async (id) => {
    return await issueRepository.findOne({ where: { id: id }, relations: ['project'] });
};

const getIssueByProjectId = async (id) => {
    return await issueRepository.find(
        {
            where: {
                projectId: id
            },
            relations: ['project']
        });
};

const getIssuesByDate = async (startDate, endDate) => {
    return await issueRepository.find({
        where: {
            createdAt: Between(startDate, endDate),
        },
        relations: ['project']
    });
};

const getAllIssuesByProjectIdAndByDate = async (id, status, startDate, endDate) => {
    return await issueRepository.find(
        {
            where: {
                projectId: id,
                createdAt: Between(
                    new Date(startDate).toISOString(),
                    new Date(endDate).toISOString()
                ),
            },
            relations: ['project']
        });
};

/**
 * Update user by id
 * @param {ObjectId} issueId
 * @param {Object} updateBody
 * @returns {Promise<Issue>}
 */
const updateIssueById = async (issueId, updateBody) => {
    const issue = await getIssueById(issueId);
    if (!issue) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Issue not found');
    }
    await issueRepository.update({ id: issueId }, updateBody);
    return await getIssueById(issueId);
};

/**
 * Delete user by id
 * @param {ObjectId} issueId
 * @returns {Promise<Issue>}
 */
const deleteIssueById = async (issueId) => {
    const issue = await getIssueById();
    if (!issue) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Issue not found');
    }
    return await issueRepository.delete({ id: issueId });
};

module.exports = {
    createIssue,
    queryIssues,
    getIssueById,
    updateIssueById,
    deleteIssueById,
    getAllIssuesByProjectIdAndByDate,
    getIssueByProjectId,
    getIssuesByDate
};
