const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { LLCommentService, lessonLearnedService } = require('../services');
/**
 * @module LLComment
 */
/**
 * Creates a comment for a lesson learned.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the created comment for the lesson learned.
 * @throws {ApiError} If the lesson learned ID provided in the request body is not found.
 */
const createLLComment = catchAsync(async (req, res) => {
    const LLId = await lessonLearnedService.getLLById(req.body.id)
    console.log(LLId)
    if (!LLId) {
        throw new ApiError(httpStatus.NOT_FOUND, 'LL Id Contraint failed');
    }
    const result = await LLCommentService.createLLComment(req.body);
    console.log(result)
    res.status(httpStatus.CREATED).send(result);
});
/**
 * Retrieves all comments for lesson learneds based on the provided filter and options.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with all retrieved comments for lesson learneds.
 */
const getLLComments = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['title']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await LLCommentService.queryLLComments(filter, options);
    res.send(result);
});
/**
 * Retrieves a comment for a lesson learned by its ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the comment corresponding to the provided ID.
 * @throws {ApiError} If the comment with the provided ID is not found.
 */

const getLLCommentById = catchAsync(async (req, res) => {
    const result = await LLCommentService.getLLCommentById(req.params.commentId);
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'LL Comment is not found');
    }
    res.send(result);
});
/**
 * Retrieves all comments for a lesson learned by its ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with all comments for the lesson learned corresponding to the provided ID.
 * @throws {ApiError} If the lesson learned with the provided ID is not found.
 */

const getIndividualLLByLLId = catchAsync(async (req, res) => {
    const result = await LLCommentService.getLLCommentByLLId(req.params.LLId);
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Lesson learned not found');
    }
    res.send(result);
});

/**
 * Updates a comment for a lesson learned by its ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the updated comment for the lesson learned.
 */
const updateLLCommentById = catchAsync(async (req, res) => {
    const result = await LLCommentService.updateLLCommentById(req.params.commentId, req.body);
    res.send(result);
});
/**
 * Deletes a comment for a lesson learned by its ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves after deleting the comment for the lesson learned.
 */
const deleteLLCommentById = catchAsync(async (req, res) => {
    await LLCommentService.deleteLLCommentById(req.params.commentId);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createLLComment,
    getLLComments,
    getLLCommentById,
    updateLLCommentById,
    deleteLLCommentById,
    getIndividualLLByLLId
};
