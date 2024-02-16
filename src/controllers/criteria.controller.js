const catchAsync = require("../utils/catchAsync");
const { Criteria } = require('../services');
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
/**
 * @module criteria
 */

/**
 * Creates a new criteria.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the created criteria.
 * @throws {ApiError} - Throws an error if the criteria cannot be created.
 */
const createCriteria = catchAsync(async (req, res, next) => {
    const criteria = await Criteria.createCriteria(req.body);
    res.status(httpStatus.CREATED).send(criteria);
})

/**
 * Retrieves all criteria.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the list of criteria.
 * @throws {ApiError} - Throws an error if no criteria are found.
 */
const getCriterias = catchAsync(async (req, res, next) => {
    const criteria = await Criteria.getCriterias();
    if (!criteria) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Criteria NOT FOUND');
    }
    res.send(criteria);
})

/**
 * Retrieves a specific criteria by ID.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the requested criteria.
 * @throws {ApiError} - Throws an error if the criteria is not found.
 */
const getCriteria = catchAsync(async (req, res, next) => {
    const criteria = await Criteria.getCriteria(req.params.id);
    if (!criteria) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Criteria NOT FOUND');
    }
    res.send(criteria);
})

/**
 * Deletes a criteria by ID.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with a success status after deletion.
 * @throws {ApiError} - Throws an error if the criteria is not found.
 */
const deleteCriteria = catchAsync(async (req, res) => {
    const criteria = await Criteria.getCriteria(req.params.id);
    if (!criteria) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Criteria NOT FOUND');
    }
    await Criteria.deleteCriteria(req.params.id);
    res.status(httpStatus.OK).send("Successfully Deleted");
})

/**
 * Updates a criteria by ID.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with a success status after update.
 * @throws {ApiError} - Throws an error if the criteria is not found.
 */
const updateCriteria = catchAsync(async (req, res) => {
    const criteria = await Criteria.getCriteria(req.params.id);
    if (!criteria) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Criteria NOT FOUND');
    }
    await Criteria.updateCriteria(req.params.id);
    res.status(httpStatus.OK).send("Successfully Updated");
})

module.exports = {
    createCriteria,
    getCriterias,
    getCriteria,
    deleteCriteria,
    updateCriteria
}
