const catchAsync = require("../utils/catchAsync");
const { Color } = require('../services');
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

/**
 * @module color
 */
/**
 * Creates a new color.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the created color.
 * @throws {ApiError} - Throws an error if the color cannot be created.
 */
const createColor = catchAsync(async (req, res, next) => {
    const color = await Color.createColor(req.body);
    res.status(httpStatus.CREATED).send(color);
})
/**
 * Retrieves all colors.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the list of colors.
 * @throws {ApiError} - Throws an error if no colors are found.
 */
const getColors = catchAsync(async (req, res, next) => {
    const color = await Color.getColors();
    if (!color) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Color NOT FOUND');
    }
    res.send(color);
})
/**
 * Retrieves a specific color by ID.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with the requested color.
 * @throws {ApiError} - Throws an error if the color is not found.
 */
const getColor = catchAsync(async (req, res, next) => {
    const color = await Color.getColor(req.params.id);
    if (!color) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Color NOT FOUND');
    }
    res.send(color);
})
/**
 * Deletes a color by ID.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with a success status after deletion.
 * @throws {ApiError} - Throws an error if the color is not found.
 */
const deleteColor = catchAsync(async (req, res) => {
    const color = await Criteria.getCriteria(req.params.id);
    if (!color) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Color NOT FOUND');
    }
    await Color.deleteColor(req.params.id);
    res.status(httpStatus.OK).send("Successfully Deleted");
})
/**
 * Updates a color by ID.
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Resolves with a success status after update.
 * @throws {ApiError} - Throws an error if the color is not found.
 */
const updateColor = catchAsync(async (req, res) => {
    const color = await Criteria.getCriteria(req.params.id);
    if (!color) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Color NOT FOUND');
    }
    await Color.updateColor(req.params.id);
    res.status(httpStatus.OK).send("Successfully Updated");
})

module.exports = {
    createColor,
    getColors,
    getColor,
    deleteColor,
    updateColor
}
