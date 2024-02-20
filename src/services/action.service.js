/* eslint-disable prettier/prettier */
const httpStatus = require('http-status');
const { Action, AfterActionAnalysis } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');

const actionRepository = dataSource.getRepository(Action).extend({ findAll, sortBy });
/**
 * @module action
*/
/**
 * Creates and returns an array of action instances for a given AAA instance
 * @function
 * @param {Object} [actionBody] - The optional body of the action instances
 * @param {number} actionBody.afterActionAnalysisId - The ID of the AAA instance
 * @param {Array<Object>} actionBody.actions - The array of action objects
 * @param {number} actionBody.actions.responsiblePersonId - The ID of the responsible person
 * @param {number} actionBody.actions.authorizedPersonId - The ID of the authorized person
 * @param {string} actionBody.actions.action - The action description
 * @returns {Promise<Array<Object>>} - The array of created action instances with their related entities
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
 * Queries and returns the action instances that match the filter and options
 * @function
 * @param {Object} filter - The filter object for the query
 * @param {Object} options - The options object for the query
 * @param {number} options.limit - The maximum number of results to return
 * @param {number} options.page - The page number of the results
 * @param {string} [options.sortBy] - The optional sorting option for the results
 * @returns {Promise<Array<Object>>} - The array of action instances with their related entities
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
 * Gets and returns an action instance by its ID
 * @function
 * @param {number} id - The ID of the action instance
 * @returns {Promise<Object>} - The action instance with its related entities
 */
const getActionById = async (id) => {
    return await actionRepository.findOne(
        {
            where: { id: id },
            relations: ['responsiblePerson', 'authorizedPerson']
        });
};

/**
 * Updates and returns an action instance by its ID and the update body
 * @function
 * @param {number} actionId - The ID of the action instance to update
 * @param {Object} updateBody - The update body for the action instance
 * @returns {Promise<Object>} - The updated action instance with its related entities
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
 * Deletes an action instance by its ID
 * @function
 * @param {number} actionId - The ID of the action instance to delete
 * @returns {Promise<Object>} - The deleted action instance
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
