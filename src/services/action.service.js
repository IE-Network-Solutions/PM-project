const httpStatus = require('http-status');
const { Action } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');

const actionRepository = dataSource.getRepository(Action).extend({ findAll, sortBy });
// .extend({ sortBy });
//

/**
 * Create a risk
 * @param {Object} userBody
 * @returns {Promise<Action>}
 */
const createAction = async (actionBody = []) => {
    const action = actionRepository.create(actionBody);
    return await actionRepository.save(action);
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

const queryActions = async (filter, options) => {
    const { limit, page, sortBy } = options;

    return await actionRepository.find({
        relations: ['afterActionAnalysis'],
        tableName: 'actions',
        sortOptions: sortBy && { option: sortBy },
        paginationOptions: { limit: limit, page: page },
    });
};

/**
 * Get risk by id
 * @param {ObjectId} id
 * @returns {Promise<Action>}
 */
const getActionById = async (id) => {
    return await actionRepository.findOneBy({ id: id });
};

/**
 * Update user by id
 * @param {ObjectId} postId
 * @param {Object} updateBody
 * @returns {Promise<Action>}
 */
const updateActionById = async (actionId, updateBody) => {
    const action = await getActionById(actionId);
    if (!action) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Action not found');
    }
    await actionRepository.update({ id: actionId }, updateBody);
    return await getActionById(actionId);
};

/**
 * Delete user by id
 * @param {ObjectId} actionId
 * @returns {Promise<Action>}
 */
const deleteActionById = async (actionId) => {
    const action = await getActionById(actionId);
    if (!action) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Action not found');
    }
    return await actionRepository.delete({ id: actionId });
};

const getActionsId = async (actionId) => {
    try {
        return await actionRepository.findByIds({ actionId })
    } catch (error) {
        throw error;
    }
}
module.exports = {
    createAction,
    queryActions,
    getActionById,
    updateActionById,
    deleteActionById,
    getActionsId
};
