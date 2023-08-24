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
 * Create a risk
 * @param {Object} userBody
 * @returns {Promise<LLComments>}
 */
const createLLComment = async (LLCommentBody) => {
    const result = LLCommentsRepository.create(LLCommentBody);
    return await LLCommentsRepository.save(result);
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

const queryLLComments = async (filter, options) => {
    const { limit, page, sortBy } = options;

    return await LLCommentsRepository.find(
        {
            relations: ['lessonLearned'],
            tableName: 'llComments',
            sortOptions: sortBy && { option: sortBy },
            paginationOptions: { limit: limit, page: page },
        });

};

/**
 * Get risk by id
 * @param {ObjectId} id
 * @returns {Promise<LLComments>}
 */
const getLLCommentById = async (id) => {
    return await LLCommentsRepository.find(
        {
            where: { id: id },
            relations: ['lessonLearned']
        });
};

const getLLCommentByLLId = async (id) => {
    return await LLCommentsRepository.find(
        {
            where: { lessonLearnedId: id },
            relations: ['lessonLearned']
        });
};

/**
 * Update user by id
 * @param {ObjectId} commentId
 * @param {Object} updateBody
 * @returns {Promise<LLComments>}
 */
const updateLLCommentById = async (LLCommentId, updateBody) => {
    const result = await getLLCommentById(LLCommentId);
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'LL comment id is not found');
    }
    await LLCommentsRepository.update({ id: LLCommentId }, updateBody);
    return await getLLCommentById(LLCommentId);
};

/**
 * Delete user by id
 * @param {ObjectId} commentId
 * @returns {Promise<LLComments>}
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
