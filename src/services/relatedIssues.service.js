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
 * @module relatedIssues
 */
/**
 * Creates a related issue entry by saving the given data.
 *
 * @function
 * @param {Object} RelatedIssueBody - Data representing the related issue.
 *   - {string} // Specify properties and their descriptions here
 *   - {number} // Specify properties and their descriptions here
 *   - ... // Continue specifying properties and their descriptions
 * @returns {Promise<Object>} - A promise that resolves to the saved related issue.
 */
const createRelatedIssue = async (RelatedIssueBody) => {
    const relatedIssue = relatedIssueRepository.create(RelatedIssueBody);
    return await relatedIssueRepository.save(relatedIssue);
};
/**
 * Retrieves related issues based on the provided filter and options.
 *
 * @function
 * @param {Object} filter - An object containing filter criteria for related issue retrieval.
 * @param {Object} options - Additional options for querying related issues.
 *   - {number} limit - Maximum number of results to retrieve.
 *   - {number} page - Page number for pagination.
 *   - {string} sortBy - Field to sort the results by (e.g., 'createdAt', 'updatedAt').
 * @returns {Promise<Object[]>} - A promise that resolves to an array of related issues.
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
 * Retrieves a related issue based on the specified ID.
 *
 * @function
 * @param {number} id - The unique identifier of the related issue.
 * @returns {Promise<Object>} - A promise that resolves to the related issue object.
 */
const getRelatedIssueById = async (id) => {
    return await relatedIssueRepository.findOneBy({ id: id });
};
/**
 * Updates a related issue based on the specified ID.
 *
 * @function
 * @param {number} relatedIssueId - The unique identifier of the related issue to update.
 * @param {Object} updateBody - Updated data for the related issue.
 *   - {string} // Specify properties and their descriptions here
 *   - {number} // Specify properties and their descriptions here
 *   - ... // Continue specifying properties and their descriptions
 * @throws {ApiError} - Throws an error if the related issue with the given ID is not found.
 * @returns {Promise<Object>} - A promise that resolves to the updated related issue object.
 */
const updateRelatedIssueById = async (relatedIssueId = [], updateBody) => {
    const relatedIssue = await getRelatedIssueById(relatedIssueId);
    if (!relatedIssue) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Related Issue not found');
    }
    await relatedIssueRepository.update({ id: relatedIssueId }, updateBody);
    return await getRelatedIssueById(relatedIssueId);
};
/**
 * Deletes a related issue based on the specified ID.
 *
 * @function
 * @param {number} relatedIssueId - The unique identifier of the related issue to delete.
 * @throws {ApiError} - Throws an error if the related issue with the given ID is not found.
 * @returns {Promise<Object>} - A promise that resolves to an object indicating the success of the deletion.
 *   - {boolean} success - Indicates whether the deletion was successful.
 *   - {string} message - A message describing the result of the deletion.
 */
const deleteRelatedIssueById = async (relatedIssueId) => {
    const relatedIssue = await getRelatedIssueById(relatedIssueId);
    if (!relatedIssue) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Related Issue not found');
    }
    return await relatedIssueRepository.delete({ id: relatedIssueId });
};
/**
 * Retrieves related issues based on the provided issue IDs.
 *
 * @function
 * @param {number[]} issueId - An array of unique identifiers for related issues.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of related issues.
 */
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
