const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { actionService } = require('../services');
/**
 * @module action
 */
/**
 * Creates a new action.
 * @function
 * @param {Object} req - The request object containing the body with action data.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves once the action is created.
 */

const createAction = catchAsync(async (req, res) => {
    const action = await actionService.createAction(req.body);
    res.status(httpStatus.CREATED).send(action);
});
/**
 * Retrieves a list of actions based on the provided filter and options.
 * @function
 * @param {Object} req - The request object containing the query parameters for filtering and pagination.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the queried actions.
 */

const getActions = catchAsync(async (req, res) => {
    const filter = pick(req.query, []);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await actionService.queryActions(filter, options);
    res.send(result);
});
/**
 * Retrieves an action by its ID.
 * @function
 * @param {Object} req - The request object containing the action ID in the parameters.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the retrieved action.
 */

const getActionsById = catchAsync(async (req, res) => {
    const action = await actionService.getActionById(req.params.actionId);
    if (!action) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Action not found');
    }
    res.send(action);
});
/**
 * Updates an action by its ID.
 * @function
 * @param {Object} req - The request object containing the action ID in the parameters and the updated action data in the body.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the updated action.
 */

const updateActionById = catchAsync(async (req, res) => {
    const action = await actionService.updateActionById(req.params.actionId, req.body);
    res.send(action);
});
/**
 * Deletes an action by its ID.
 * @function
 * @param {Object} req - The request object containing the action ID in the parameters.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves once the action is deleted.
 */

const deleteActionById = catchAsync(async (req, res) => {
    await actionService.deleteActionById(req.params.actionId);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createAction,
    getActions,
    getActionsById,
    updateActionById,
    deleteActionById
};
