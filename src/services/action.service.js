/* eslint-disable prettier/prettier */
const httpStatus = require('http-status');
const { Action, AfterActionAnalysis } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');

const actionRepository = dataSource.getRepository(Action).extend({ findAll, sortBy });
// .extend({ sortBy });
//

/**
 * Create a risk
 * @param {Object} actionBody
 * @returns {Promise<Action>}
 */
const createAction = async (actionBody = []) => {
    const { afterActionAnalysisId, actions } = actionBody;

    console.log(actionBody)

    const actionsToSave = actions.map((action) => {
        return actionRepository.create({
            afterActionAnalysisId: afterActionAnalysisId,
            responsiblePersonId: action.responsiblePersonId,
            authorizedPersonId: action.authorizedPersonId,
            action: action.action
        });
    });

    let finalActions = []
    await actionRepository.save(actionsToSave);
    for (const obj of actionsToSave) {
        finalActions.push(await getActionById(obj.id))
    }
    return finalActions
}
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
        relations: ['responsiblePerson', 'authorizedPerson'],
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
    return await actionRepository.findOne(
        {
            where: { id: id },
            relations: ['responsiblePerson', 'authorizedPerson']
        });
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
        throw new ApiError(httpStatus.NOT_FOUND, 'Action Id not found');
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
        throw new ApiError(httpStatus.NOT_FOUND, 'Action Id not found');
    }
    return await actionRepository.delete({ id: actionId });
};

module.exports = {
    createAction,
    queryActions,
    getActionById,
    updateActionById,
    deleteActionById,
};
