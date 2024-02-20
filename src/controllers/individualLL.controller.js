const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { individualLLService, lessonLearnedService } = require('../services');
/**
 * @module individualLL
 */
/**
 * Creates an individual lesson learned.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the created individual lesson learned.
 * @throws {ApiError} If the lesson learned ID provided in the request body is not found.
 */
const createIndividualLL = catchAsync(async (req, res) => {

    const checkLLId = await lessonLearnedService.getLLById(req.body.lessonLearnedId);
    console.log("request id", req.body.lessonLearnedId, "request ll body", checkLLId)
    if (!checkLLId) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Lesson learned Id Not Found');
    }
    const result = await individualLLService.createIndividualLL(req.body);
    res.status(httpStatus.CREATED).send(result);
});

/**
 * Retrieves all individual lesson learneds based on the provided filter and options.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with all individual lesson learneds.
 */
const getIndividualLLs = catchAsync(async (req, res) => {
    const filter = pick(req.query, []);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await individualLLService.queryIndividualLLs(filter, options);
    res.send(result);
});
/**
 * Retrieves an individual lesson learned by its ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the individual lesson learned corresponding to the provided ID.
 * @throws {ApiError} If the individual lesson learned with the provided ID is not found.
 */
const getIndividualLLById = catchAsync(async (req, res) => {
    const result = await individualLLService.getIndividualLLById(req.params.individualLLId);
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Individual Lesson learned not found');
    }
    res.send(result);
});
/**
 * Updates an individual lesson learned by its ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the updated individual lesson learned.
 */
const updateIndividualLLById = catchAsync(async (req, res) => {
    const result = await individualLLService.updateIndividualLLById(req.params.individualLLId, req.body);
    res.send(result);
});
/**
 * Deletes an individual lesson learned by its ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves after deleting the individual lesson learned.
 */
const deleteIndividualLLById = catchAsync(async (req, res) => {
    await individualLLService.deleteIndividualLLById(req.params.individualLLId);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createIndividualLL,
    getIndividualLLs,
    getIndividualLLById,
    updateIndividualLLById,
    deleteIndividualLLById
};
