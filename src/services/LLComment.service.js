const httpStatus = require('http-status');
const { LLComments } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');

const LLCommentsRepository = dataSource.getRepository(LLComments).extend({ findAll, sortBy });
// .extend({ sortBy });
//
/**
 * @module LLComment
 */
/**
 * Creates an entry for LL comments
 * @function
 * @param {Object} LLCommentBody - The lesson learned comment data.
 * @property {string} LLCommentBody.id - The ID of the lesson learned comment.
 * @property {string} LLCommentBody.lessonLearnedId - The ID of the associated lesson learned.
 * @property {Date} LLCommentBody.date - The date of the comment.
 * @throws {Error} Throws an error if there's an issue creating or saving the comment.
 * @returns {Promise<Object>} - A promise that resolves to the saved lesson learned comment.
 */
const createLLComment = async (LLCommentBody) => {
    LLCommentBody.lessonLearnedId = LLCommentBody.id;
    LLCommentBody.date = new Date();
    delete LLCommentBody.id
    const result = LLCommentsRepository.create(LLCommentBody);
    return await LLCommentsRepository.save(result);
};
/**
 * This function retrieves the LL comments based on the filter confition
 * @function
 * @param {Object} filter - The filter criteria.
 * @param {Object} options - Additional options.
 * @property {number} options.limit - The maximum number of results to return.
 * @property {number} options.page - The page number for pagination.
 * @property {string} options.sortBy - The field to sort the results by.
 * @throws {Error} Throws an error if there's an issue retrieving the comments.
 * @returns {Promise<Array>} - A promise that resolves to an array of lesson learned comments.
 */
const queryLLComments = async (filter, options) => {
    const { limit, page, sortBy } = options;

    return await LLCommentsRepository.find(
        {
            relations: ['lessonLearned', 'user'],
            tableName: 'llComments',
            sortOptions: sortBy && { option: sortBy },
            paginationOptions: { limit: limit, page: page },
        });

};
/**
 * This function retrieves a lesson learned comment by its unique ID and returns an array of comments associated with the specified ID.
 * @function
 * @param {string} id - The ID of the lesson learned comment.
 * @throws {Error} Throws an error if there's an issue retrieving the comment.
 * @returns {Promise<Array>} - A promise that resolves to an array of lesson learned comments.
 */
const getLLCommentById = async (id) => {
    return await LLCommentsRepository.find(
        {
            where: { id: id },
            relations: ['lessonLearned', 'user']
        });
};
/**
 * Retrieves lesson learned comments associated with a specific lesson learned ID.
 *
 * @function
 * @param {string} id - The ID of the lesson learned.
 * @throws {Error} Throws an error if there's an issue retrieving the comments.
 * @returns {Promise<Array>} - A promise that resolves to an array of lesson learned comments.
 */
const getLLCommentByLLId = async (id) => {
    return await LLCommentsRepository.find(
        {
            where: { lessonLearnedId: id },
            relations: ['lessonLearned', 'user']
        });
};
/**
 * Updates a lesson learned comment by its unique ID.
 *
 * @function
 * @param {string} LLCommentId - The ID of the lesson learned comment.
 * @param {Object} updateBody - The update data for the lesson learned comment.
 * @property {Date} updateBody.date - The updated date for the comment.
 * @throws {Error} Throws an error if the lesson learned comment is not found.
 * @returns {Promise<Object>} - A promise that resolves to the updated lesson learned comment.
 */
const updateLLCommentById = async (LLCommentId, updateBody) => {
    const result = await getLLCommentById(LLCommentId);
    updateBody.date = new Date();
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'LL comment id is not found');
    }
    await LLCommentsRepository.update({ id: LLCommentId }, updateBody);
    return await getLLCommentById(LLCommentId);
};
/**
 * Delets the LL comment using the ID
 * @function
 * @param {string} LLCommentId - The ID of the lesson learned comment.
 * @throws {Error} Throws an error if the lesson learned comment is not found.
 * @returns {Promise<Object>} - A promise that resolves when the lesson learned comment is successfully deleted.
 */
const deleteLLCommentById = async (LLCommentId) => {
    const result = await getLLCommentById(LLCommentId);
    console.log(result)
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'LL comment id is not found');
    }
    return await LLCommentsRepository.delete({ id: LLCommentId });
};

module.exports = {
    createLLComment,
    queryLLComments,
    getLLCommentById,
    updateLLCommentById,
    deleteLLCommentById,
    getLLCommentByLLId
};
