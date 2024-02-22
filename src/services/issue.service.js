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
 * @module issue
 */
/**
 * Creates an issue record.
 * @async
 * @function
 * @param {Object} issueBody - The data for the issue.
 * @returns {Promise<Object>} - A promise resolving to the saved issue record.
 */
const createIssue = async (issueBody) => {
    const issue = issueRepository.create(issueBody);
    return await issueRepository.save(issue);
};
/**
 * Retrieves issue data, including project relations.
 * @async
 * @function
 * @param {Object} filter - The filter criteria for querying issues.
 * @param {Object} options - Additional options for pagination and sorting.
 * @param {number} options.limit - The maximum number of records to retrieve.
 * @param {number} options.page - The page number for pagination.
 * @param {string} options.sortBy - The field to sort the results by.
 * @returns {Promise<Object[]>} - A promise resolving to an array of issue records.
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
 * Retrieves an issue record by its ID.
 * @async
 * @function
 * @param {number} id - The ID of the issue.
 * @returns {Promise<Object>} - A promise resolving to the retrieved issue record.
 */
const getIssueById = async (id) => {
    return await issueRepository.findOne({ where: { id: id }, relations: ['project'] });
};
/**
 * Retrieves issue data related to a specific project.
 * @async
 * @function
 * @param {number} id - The ID of the project.
 * @returns {Promise<Object[]>} - A promise resolving to an array of issue records associated with the project.
 */
const getIssueByProjectId = async (id) => {
    return await issueRepository.find(
        {
            where: {
                projectId: id
            },
            relations: ['project']
        });
};
/**
 * Retrieves issue data within a specified date range, including project relations.
 * @async
 * @function
 * @param {Date} startDate - The start date of the range.
 * @param {Date} endDate - The end date of the range.
 * @returns {Promise<Object[]>} - A promise resolving to an array of issue records within the specified date range.
 */
const getIssuesByDate = async (startDate, endDate) => {
    return await issueRepository.find({
        where: {
            createdAt: Between(startDate, endDate),
        },
        relations: ['project']
    });
};
/**
 * Retrieves issue data within a specified date range, including project relations.
 * @async
 * @function
 * @param {number} id - The ID of the project.
 * @param {string} status - The status of the issues (e.g., "open", "closed").
 * @param {Date} startDate - The start date of the range.
 * @param {Date} endDate - The end date of the range.
 * @returns {Promise<Object[]>} - A promise resolving to an array of issue records within the specified date range.
 */
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
 * Updates an issue record by its ID.
 * @async
 * @function
 * @param {number} issueId - The ID of the issue.
 * @param {Object} updateBody - The data to update the issue.
 * @throws {ApiError} - Throws an error if the issue is not found.
 * @returns {Promise<Object>} - A promise resolving to the updated issue record.
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
 * Deletes an issue record by its ID.
 * @async
 * @function
 * @param {number} issueId - The ID of the issue.
 * @throws {ApiError} - Throws an error if the issue is not found.
 * @returns {Promise<void>} - A promise resolving after successful deletion.
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
