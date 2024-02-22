const catchAsync = require("../utils/catchAsync");
const { Solution } = require('../services');
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
/**
 * @module solutions
 */
/**
 * Creates a solution record.
 *
 * @param {Object} req.body - The request body containing solution data.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the solution record is created.
 * @throws {Error} - If there's an issue with creating the solution record.
 */
const createSolution = catchAsync(async (req, res, next) => {
    const solution = await Solution.createSolution(req.body);
    res.status(httpStatus.CREATED).send(solution);
})

/**
 * Retrieves all solution records.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the solution records are retrieved.
 * @throws {Error} - If there's an issue fetching the solution records.
 */
const getSolutions = catchAsync(async (req, res, next) => {
    const solution = await Solution.getSolutions();
    if (!solution) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Solution NOT FOUND');
    }
    res.send(solution);
})

/**
 * Retrieves a specific solution record by its ID.
 * @function
 * @param {Object} req.params.id - The ID of the solution record.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the solution record is retrieved.
 * @throws {Error} - If the solution record is not found.
 */
const getSolution = catchAsync(async (req, res, next) => {
    const solution = await Solution.getSolution(req.params.id);
    if (!solution) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Solution NOT FOUND');
    }
    res.send(solution);
})

/**
 * Deletes a specific solution record by its ID.
 * @function
 * @param {Object} req.params.id - The ID of the solution record.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the solution record is deleted.
 * @throws {Error} - If there's an issue with deleting the solution record.
 */
const deleteSolution = catchAsync(async (req, res) => {
    const solution = await Solution.getSolution(req.params.id);
    console.log("solution id", solution)
    if (!solution) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Solution NOT FOUND');
    }
    await Solution.deleteSolution(req.params.id);
    res.status(httpStatus.OK).send("Successfully Deleted");
})

/**
 * Updates a specific solution record by its ID.
 * @function
 * @param {Object} req.params.id - The ID of the solution record.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the solution record is updated.
 * @throws {Error} - If there's an issue with updating the solution record.
 */
const updateSolution = catchAsync(async (req, res) => {
    const solution = await Solution.getSolution(req.params.id);
    if (!solution) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Solution NOT FOUND');
    }
    await Solution.deleteSolution(req.params.id);
    res.status(httpStatus.OK).send("Successfully Deleted");
})

module.exports = {
    createSolution,
    getSolutions,
    getSolution,
    deleteSolution,
    updateSolution
}
