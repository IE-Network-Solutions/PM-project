const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { resourceHistory} = require('../services');
/**
 * @module resourceHistory
 */
/**
 * Creates a resource history record.
 * @function
 * @param {Object} req.body - The request body containing resource history data.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the resource history record is created.
 * @throws {Error} - If there's an issue with creating the resource history record.
 */
const createResourceHistory = catchAsync(async (req, res) => {
const resource = await resourceHistory.createResourceHistory(req.body);
res.status(httpStatus.CREATED).send(resource);
});

/**
 * Retrieves resource history records associated with a specific project.
 * @function
 * @param {Object} req.params.projectId - The ID of the project.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the resource history records are retrieved.
 * @throws {Error} - If there's an issue fetching the resource history records.
 */
const getResourceHistoryByProjectId = catchAsync(async (req, res) => {
    const history = await resourceHistory.getResourceHistoryByProjectId(req.params.projectId);
    if (history.length==0) {
        throw new ApiError(httpStatus.NOT_FOUND, 'History not found');
    }
    res.send(history);
});

/**
 * Retrieves resource history records associated with a specific task.
 * @function
 * @param {Object} req.params.taskId - The ID of the task.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the resource history records are retrieved.
 * @throws {Error} - If there's an issue fetching the resource history records.
 */
const getResourceHistoryByTaskId = catchAsync(async (req, res) => {
    const history = await resourceHistory.getResourceHistoryByTaskId(req.params.taskId);
    if (history.length==0) {
        throw new ApiError(httpStatus.NOT_FOUND, 'History not found');
    }
    res.send(history);
});
/**
 * Retrieves resource history records associated with a specific user.
 * @function
 * @param {Object} req.params.userId - The ID of the user.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the resource history records are retrieved.
 * @throws {Error} - If there's an issue fetching the resource history records.
 */
const getResourceHistoryByUserId = catchAsync(async (req, res) => {
    const history = await resourceHistory.getResourceHistoryByUserId(req.params.userId);

    if (history.length==0) {
        throw new ApiError(httpStatus.NOT_FOUND, 'History not found');
    }
    res.send(history);
});
/**
 * Retrieves all resource history records based on filter and pagination options.
 * @function
 * @param {Object} req.query - The query parameters for filtering and pagination.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the resource history records are retrieved.
 * @throws {Error} - If there's an issue fetching the resource history records.
 */
const getAllResourceHistory = catchAsync(async (req, res) => {
    const filter = pick(req.query, []);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await resourceHistory.getAllResourceHistory(filter, options);
    res.send(result);
});

module.exports = {
    createResourceHistory,
    getResourceHistoryByProjectId,
    getResourceHistoryByTaskId,
    getResourceHistoryByUserId,
    getAllResourceHistory
  };
